// Updated ChatRooms implementation with emails table and real database queries
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import { CircularProgress } from "@mui/material";

interface ChatRoomsProps {
  onNavigate: (page: string) => void;
}

// Updated interfaces to match database schema
interface Email {
  email_id: string;
  from_name: string;
  from_email: string;
  subject: string;
  summary: string;
  received_at: string;
  thread_link?: string;
  labels: string[];
  tags: string[];
  relevance_score: number;
  confidence: number;
  first_received: string;
  last_received: string;
  ui_actions: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_ai_activate: boolean;
}

interface Message {
  msg_id: string;
  user_id: string;
  message: string;
  chat_id?: string;
  email_id: string;
  processed: boolean;
  created_at: string;
  updated_at: string;
}

interface Action {
  action_id: string;
  msg_id: string;
  action_summary: string;
  actor: string;
  details?: any;
  created_at: string;
  updated_at: string;
  action_type: "step_output" | "final_start_colab_process";
}

interface MessageWithActions {
  message: Message;
  actions: Action[];
}

const ChatRooms: React.FC<ChatRoomsProps> = ({ onNavigate }) => {
  const { email_id } = useParams<{ email_id: string }>();
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(0);
  const [currentEmail, setCurrentEmail] = useState<Email | null>(null);
  const [messagesWithActions, setMessagesWithActions] = useState<
    MessageWithActions[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [user, setUser] = useState<any>(null);

  const chatAreaRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch user and AI-activated emails
  useEffect(() => {
    const fetchUserAndEmails = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
          console.error("No user found");
          setLoading(false);
          return;
        }

        setUser(userData.user);

        // Fetch AI-activated emails
        const { data: emailsData, error: emailsError } = await supabase
          .from("emails")
          .select("*")
          .eq("user_id", userData.user.id)
          .eq("is_ai_activate", true)
          .order("received_at", { ascending: false });

        if (emailsError) {
          console.error("Error fetching emails:", emailsError);
          setLoading(false);
          return;
        }

        if (!emailsData || emailsData.length === 0) {
          setLoading(false);
          return;
        }

        setEmails(emailsData);

        // Set selected email based on URL param or default to first
        if (email_id) {
          const emailIndex = emailsData.findIndex(
            (email) => email.email_id === email_id
          );
          if (emailIndex !== -1) {
            setSelectedEmailIndex(emailIndex);
            setCurrentEmail(emailsData[emailIndex]);
          } else {
            // Email ID not found, default to first
            setCurrentEmail(emailsData[0]);
          }
        } else {
          setCurrentEmail(emailsData[0]);
        }
      } catch (error) {
        console.error("Error in fetchUserAndEmails:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndEmails();
  }, [email_id]);

  // Fetch messages and actions for current email
  const fetchMessagesWithActions = async (emailId: string) => {
    try {
      // Fetch messages for the email
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .eq("email_id", emailId)
        .order("created_at", { ascending: true });

      if (messagesError) {
        console.error("Error fetching messages:", messagesError);
        return;
      }

      if (!messagesData || messagesData.length === 0) {
        setMessagesWithActions([]);
        return;
      }

      // Fetch actions for all messages
      const messageIds = messagesData.map((msg) => msg.msg_id);
      const { data: actionsData, error: actionsError } = await supabase
        .from("actions")
        .select("*")
        .in("msg_id", messageIds)
        .order("created_at", { ascending: true });

      if (actionsError) {
        console.error("Error fetching actions:", actionsError);
        return;
      }

      // Group actions by message ID
      const actionsByMessage: { [key: string]: Action[] } = {};
      (actionsData || []).forEach((action) => {
        if (!actionsByMessage[action.msg_id]) {
          actionsByMessage[action.msg_id] = [];
        }
        actionsByMessage[action.msg_id].push(action);
      });

      // Combine messages with their actions
      const combined: MessageWithActions[] = messagesData.map((message) => ({
        message,
        actions: actionsByMessage[message.msg_id] || [],
      }));

      if (
        messagesWithActions[0].message.email_id !== emailId ||
        (messagesWithActions.length !== combined.length &&
          messagesWithActions.every(
            (msg, index) =>
              msg.actions.length !== combined[index].actions.length
          ))
      ) {
        console.log("Messages with actions have changed:", {
          ma_len: messagesWithActions.length,
          ma: messagesWithActions,
          comb_len: combined.length,
          comb: combined,
        });

        setMessagesWithActions(combined);
      }
    } catch (error) {
      console.error("Error fetching messages with actions:", error);
    }
  };

  // Set up polling for messages and actions
  useEffect(() => {
    if (!currentEmail) return;

    // Initial fetch
    fetchMessagesWithActions(currentEmail.email_id);

    // Set up polling every 5 seconds
    pollingRef.current = setInterval(() => {
      console.log("Polling for messages and actions...");
      fetchMessagesWithActions(currentEmail.email_id);
    }, 5000);

    // Cleanup
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [currentEmail]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messagesWithActions]);

  // Handle email selection
  const handleEmailSelect = (email: Email, index: number) => {
    setSelectedEmailIndex(index);
    setCurrentEmail(email);
    // Update URL without page reload
    window.history.pushState({}, "", `/chatrooms/${email.email_id}`);
  };

  // Send new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentEmail || !user) return;

    setSending(true);
    try {
      // Insert message into database
      const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .insert([
          {
            user_id: user.id,
            message: newMessage.trim(),
            email_id: currentEmail.email_id,
            processed: false,
          },
        ])
        .select()
        .single();

      if (messageError) {
        console.error("Error sending message:", messageError);
        return;
      }

      setNewMessage("");

      // Immediately fetch updated messages
      fetchMessagesWithActions(currentEmail.email_id);
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
    } finally {
      setSending(false);
    }
  };

  // Render actions timeline for a message
  const renderActionsTimeline = (actions: Action[]) => {
    if (actions.length === 0) return null;

    return (
      <div className="mt-3 bg-gray-50 rounded-lg p-3">
        <div className="text-xs font-medium text-gray-600 mb-2">
          AI Actions Timeline
        </div>
        <Timeline sx={{ padding: 0, margin: 0 }}>
          {actions.map(
            (action, index) =>
              !action.action_summary.startsWith("```json") && (
                <TimelineItem
                  key={action.action_id}
                  sx={{ minHeight: 40, "&::before": { display: "none" } }}
                >
                  <TimelineSeparator>
                    <TimelineDot
                      color="primary"
                      sx={{
                        bgcolor: "#ff6b35",
                        width: 12,
                        height: 12,
                      }}
                    />
                    {index < actions.length - 1 && (
                      <TimelineConnector sx={{ height: 20 }} />
                    )}
                  </TimelineSeparator>
                  <TimelineContent sx={{ py: "6px", px: 2 }}>
                    <div
                      className={`text-sm ${
                        index === actions.length - 1
                          ? "font-semibold text-gray-900"
                          : "text-gray-700"
                      } whitespace-pre-line`}
                    >
                      {action.action_summary}
                    </div>
                    {action.action_type === "final_start_colab_process" &&
                      action.details && (
                        <div className="mt-2">
                          {/* Confidence Badge */}
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-800`}
                            >
                              Confidence:{" "}
                              {Math.round(
                                (action.details.confidence_score || 0) * 100
                              )}
                              %
                            </span>
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-800`}
                            >
                              Fit: {action.details.analysis?.fit}
                            </span>
                            {action.details.analysis?.risk_flags?.map(
                              (flag: string, i: number) => (
                                <span
                                  key={flag + i}
                                  className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800"
                                >
                                  {flag}
                                </span>
                              )
                            )}
                          </div>
                          {/* Email Summary */}
                          <div className="bg-white rounded shadow p-2 mb-2">
                            <div className="flex items-center justify-between mb-1">
                              <div>
                                <span className="font-semibold">From:</span>{" "}
                                {action.details.email_parsed?.sender} (
                                {action.details.email_parsed?.sender_email})
                              </div>
                              {action.details.email_parsed?.thread_link && (
                                <a
                                  href={action.details.email_parsed.thread_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline text-xs"
                                >
                                  Thread
                                </a>
                              )}
                            </div>
                            <div className="mb-1">
                              <span className="font-semibold">Subject:</span>{" "}
                              {action.details.email_parsed?.subject}
                            </div>
                            <div>
                              <span className="font-semibold">Summary:</span>{" "}
                              {action.details.email_parsed?.offer_summary}
                            </div>
                          </div>
                          {/* Analysis */}
                          <div className="bg-gray-50 rounded p-2 mb-2">
                            <div className="mb-1">
                              <span className="font-semibold">
                                Missing Info:
                              </span>{" "}
                              {action.details.analysis?.missing_info?.map(
                                (info: string, i: number) => (
                                  <span
                                    key={info + i}
                                    className="inline-block bg-gray-200 text-xs px-2 py-0.5 rounded-full ml-1"
                                  >
                                    {info}
                                  </span>
                                )
                              )}
                            </div>
                            <div className="mb-1">
                              <span className="font-semibold">
                                Relevance Notes:
                              </span>{" "}
                              {action.details.analysis?.relevance_notes}
                            </div>
                          </div>
                          {/* Clarifying Questions */}
                          {action.details.clarifying_questions?.length > 0 && (
                            <div className="bg-white rounded p-2 mb-2">
                              <div className="font-semibold mb-1 text-xs">
                                Clarifying Questions
                              </div>
                              <ul className="list-decimal list-inside text-xs text-gray-700">
                                {action.details.clarifying_questions.map(
                                  (q: string, i: number) => (
                                    <li key={i}>{q}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                          {/* Suggested Reply */}
                          {action.details.suggested_reply && (
                            <div className="bg-gray-50 rounded p-2 mb-2">
                              <div className="font-semibold text-xs mb-1">
                                Suggested Reply
                              </div>
                              <div className="mb-1 text-xs">
                                <span className="font-semibold">Subject:</span>{" "}
                                {action.details.suggested_reply.subject}
                              </div>
                              <pre className="bg-gray-100 rounded p-2 text-xs whitespace-pre-wrap">
                                {action.details.suggested_reply.body}
                              </pre>
                            </div>
                          )}
                          {/* Contract Draft */}
                          {action.details.temporary_contract_draft
                            ?.basic_clauses && (
                            <div className="bg-white rounded p-2 mb-2">
                              <div className="font-semibold text-xs mb-1">
                                Contract Draft
                              </div>
                              <pre className="bg-gray-100 rounded p-2 text-xs whitespace-pre-wrap">
                                {
                                  action.details.temporary_contract_draft
                                    .basic_clauses
                                }
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                  </TimelineContent>
                </TimelineItem>
              )
          )}
        </Timeline>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CircularProgress size={40} sx={{ color: "#ff6b35" }} />
          <div className="mt-4 text-gray-600">Loading conversations...</div>
        </div>
      </div>
    );
  }

  // Empty state if no emails
  if (emails.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Active Conversations
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have any active AI conversations. Go to your dashboard and
            activate AI for some emails to start chatting.
          </p>
          <button
            onClick={() => onNavigate("dashboard")}
            className="bg-orange-500 text-white px-6 py-2 rounded-full font-medium hover:bg-orange-600 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      {/* Left Column - Email List */}
      <div className="w-80 bg-orange-500 p-6 rounded-t-3xl flex-shrink-0">
        <div className="space-y-4 flex items-center justify-center p-5">
          <button
            className="text-2xl md:text-2xl font-bold font-playfair text-black hover:text-white focus:outline-none transition-colors duration-200"
            onClick={() => onNavigate("dashboard")}
            aria-label="Go to Home"
          >
            Kyodo AI
          </button>
        </div>
        <div className="space-y-4">
          {emails.map((email, index) => (
            <div
              key={email.email_id}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedEmailIndex === index
                  ? "bg-white text-gray-900 shadow-lg"
                  : "bg-orange-400/50 text-white hover:bg-orange-400/70"
              }`}
              onClick={() => handleEmailSelect(email, index)}
            >
              <div className="flex items-center space-x-3">
                <img src="/rocket.png" alt="Email" width={24} height={24} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{email.subject}</h3>
                  <p className="text-sm opacity-75 truncate">
                    {email.from_name}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {email.labels.slice(0, 2).map((label, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-white/20 text-xs px-2 py-1 rounded-full"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column - Chat Interface */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        {currentEmail && (
          <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentEmail.subject}
                </h1>
                <p className="text-gray-600">
                  {currentEmail.from_name} ({currentEmail.from_email})
                </p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span>
                    Relevance:{" "}
                    {Math.round((currentEmail.relevance_score || 0) * 100)}%
                  </span>
                  <span>•</span>
                  <span>
                    {new Date(currentEmail.received_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div
          ref={chatAreaRef}
          className="flex-1 p-6 bg-gray-50 overflow-y-auto space-y-4"
        >
          {messagesWithActions.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}

          {messagesWithActions.map((msgWithActions, idx) => (
            <div
              key={idx + msgWithActions.message.msg_id}
              className="space-y-3"
            >
              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-orange-500 text-white p-4 rounded-2xl max-w-xs lg:max-w-md">
                  <p>{msgWithActions.message.message}</p>
                  <div className="text-xs opacity-75 mt-2">
                    {new Date(
                      msgWithActions.message.created_at
                    ).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Actions Timeline */}
              {msgWithActions.actions.length > 0 && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl max-w-2xl shadow-lg">
                    {renderActionsTimeline(msgWithActions.actions)}
                    {/* Render next_steps as clickable badges if present in any final_start_colab_process action */}
                    {msgWithActions.actions.map((action) =>
                      action.action_type === "final_start_colab_process" &&
                      action.details?.next_steps?.length > 0 ? (
                        <div
                          key={action.action_id + "-steps"}
                          className="flex flex-wrap gap-2 mt-3"
                        >
                          {action.details.next_steps.map(
                            (step: string, i: number) => (
                              <button
                                key={i}
                                className="border border-orange-400 text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-full px-3 py-1 text-xs font-medium transition-colors"
                                style={{ marginBottom: 4 }}
                                onClick={() => setNewMessage(step)}
                              >
                                {step}
                              </button>
                            )
                          )}
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-6 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                disabled={sending}
              />
              <button
                onClick={handleSendMessage}
                disabled={sending || !newMessage.trim()}
                className="bg-orange-500 text-white px-6 py-3 rounded-full font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : (
                  "Send"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRooms;
