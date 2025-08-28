// Devangs Changes
import React, { useEffect } from "react";
import SparkleField from "./SparkleField";
import HeroOrb from "./HeroOrb";
import { supabase } from "../lib/supabaseClient";
import { User } from "@supabase/supabase-js";

interface DashboardProps {
  onNavigate: (page: string, email_id?: string) => void;
}

// Updated interface to match backend email structure but displayed as "Deals"
interface Deal {
  email_id: string;
  from_name: string;
  from_email: string;
  subject: string;
  snippet: string;
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
  is_ai_active?: boolean; // For frontend tracking
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [loading, setLoading] = React.useState(false);
  const [mailsFetched, setMailsFetched] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  const [deals, setDeals] = React.useState<Deal[]>([]);

  // Check for user session and load emails from localStorage or backend
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      if (data.user) {
        // First, try to load emails from localStorage
        const savedEmails = localStorage.getItem(`emails_${data.user.id}`);
        if (savedEmails) {
          try {
            const parsedEmails = JSON.parse(savedEmails);
            if (parsedEmails && parsedEmails.length > 0) {
              setDeals(parsedEmails);
              setMailsFetched(true);
              console.log("Loaded emails from localStorage");
              return; // Exit early if we have cached emails
            }
          } catch (error) {
            console.error("Error parsing saved emails:", error);
            localStorage.removeItem(`emails_${data.user.id}`);
          }
        }

        // If no cached emails, check backend
        try {
          const { data: session } = await supabase.auth.getSession();
          if (session?.session) {
            const response = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/search-emails`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session.session.access_token}`,
                  "X-Refresh-Token": session.session.refresh_token || "",
                },
              },
            );

            if (response.ok) {
              const backendData = await response.json();
              if (
                backendData.value?.emails &&
                backendData.value.emails.length > 0
              ) {
                // Transform emails to deals for display
                const transformedDeals = backendData.value.emails.map(
                  (email: any) => ({
                    ...email,
                    is_ai_active: false, // Default value for UI
                  }),
                );

                // Save to localStorage
                localStorage.setItem(
                  `emails_${data.user.id}`,
                  JSON.stringify(transformedDeals),
                );

                setDeals(transformedDeals);
                setMailsFetched(true);
                console.log(
                  "Loaded emails from backend and saved to localStorage",
                );
              }
            }
          }
        } catch (error) {
          console.log("No existing emails found or backend not available");
        }
      }
    };

    getUser();
  }, []);

  const handleScanMailBox = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get session for authentication tokens
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        console.error("No active session");
        return;
      }

      // Call backend API
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/search-emails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.session.access_token}`,
            "X-Refresh-Token": session.session.refresh_token || "",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Backend responded with ${response.status}`);
      }

      const backendData = await response.json();

      if (backendData.value?.emails) {
        // Transform backend emails to deals for display
        const transformedDeals = backendData.value.emails.map((email: any) => ({
          ...email,
          is_ai_active: false, // Default value for UI tracking
        }));

        // Save to localStorage with user-specific key
        localStorage.setItem(
          `emails_${user.id}`,
          JSON.stringify(transformedDeals),
        );
        console.log(`Saved ${transformedDeals.length} emails to localStorage`);

        setDeals(transformedDeals);
        setMailsFetched(true);
      }

      // Comment: Previous mock data structure for reference
      // const mock = {
      //   emails: [
      //     {
      //       email_id: 'eml_001',
      //       from_email: 'marketing@nike.com',
      //       from_name: 'Nike Marketing',
      //       subject: 'Exciting Collab Opportunity',
      //       snippet: "We'd love to collaborate on our upcoming campaign...",
      //       received_at: '2025-08-20T09:30:00Z',
      //       labels: ["brand", "offer"],
      //       tags: ["Nike", "Campaign"],
      //       relevance_score: 0.95,
      //       confidence: 0.9,
      //       ui_actions: ["start_colab_process"]
      //     }
      //   ]
      // };
    } catch (error) {
      console.error("Error processing emails:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle rescan of mailbox
  const handleRescan = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get session for authentication tokens
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        console.error("No active session");
        return;
      }

      // Call backend API for rescan
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/search-emails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.session.access_token}`,
            "X-Refresh-Token": session.session.refresh_token || "",
          },
          body: JSON.stringify({ rescan: true }), // Add rescan flag if backend supports it
        },
      );

      if (!response.ok) {
        throw new Error(`Backend responded with ${response.status}`);
      }

      const backendData = await response.json();

      if (backendData.value?.emails) {
        // Transform backend emails to deals for display
        const transformedDeals = backendData.value.emails.map((email: any) => ({
          ...email,
          is_ai_active:
            deals.find((d) => d.email_id === email.email_id)?.is_ai_active ||
            false, // Preserve AI status
        }));

        // Update localStorage with new emails
        localStorage.setItem(
          `emails_${user.id}`,
          JSON.stringify(transformedDeals),
        );
        console.log(
          `Updated localStorage with ${transformedDeals.length} emails after rescan`,
        );

        setDeals(transformedDeals);
      }

      // Comment: Previous mock rescan data for reference
      // const rescanMock = {
      //   emails: [
      //     {
      //       email_id: 'eml_004',
      //       from_email: 'partnerships@adidas.com',
      //       from_name: 'Adidas Partnerships',
      //       subject: 'Exclusive Brand Partnership',
      //       snippet: "We've seen your content and would like to discuss...",
      //       received_at: '2025-08-23T14:20:00Z'
      //     }
      //   ]
      // };
    } catch (error) {
      console.error("Error rescanning emails:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle AI activation for a deal (using email_id as identifier)
  const handleToggleAI = async (email_id: string) => {
    try {
      // Get current deal
      const deal = deals.find((d) => d.email_id === email_id);
      if (!deal) return;

      const newAiStatus = !deal.is_ai_active;

      // Update local state optimistically
      const updatedDeals = deals.map((deal) =>
        deal.email_id === email_id
          ? { ...deal, is_ai_active: newAiStatus }
          : deal,
      );
      setDeals(updatedDeals);

      // Update localStorage with new AI status (write-through cache)
      if (user) {
        localStorage.setItem(`emails_${user.id}`, JSON.stringify(updatedDeals));
        console.log(`Updated AI status for email ${email_id} in localStorage`);
      }

      // Update database via Supabase
      const { error } = await supabase
        .from("emails")
        .update({ is_ai_activate: newAiStatus })
        .eq("email_id", email_id)
        .eq("user_id", user?.id);

      if (error) {
        console.error("Error updating email AI status:", error);
        // Revert optimistic update if database update failed
        const revertedDeals = deals.map((deal) =>
          deal.email_id === email_id
            ? { ...deal, is_ai_active: deal.is_ai_active }
            : deal,
        );
        setDeals(revertedDeals);
        if (user) {
          localStorage.setItem(
            `emails_${user.id}`,
            JSON.stringify(revertedDeals),
          );
        }
        return;
      }

      // If AI is being activated, call start-process endpoint
      if (newAiStatus) {
        try {
          const { data: session } = await supabase.auth.getSession();
          if (session?.session) {
            const response = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/start-process`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session.session.access_token}`,
                  "X-Refresh-Token": session.session.refresh_token || "",
                },
                body: JSON.stringify({ email_id: email_id }),
              },
            );

            if (!response.ok) {
              console.error(
                "Failed to start collaboration process:",
                response.status,
              );
            } else {
              console.log(
                "Successfully started collaboration process for email:",
                email_id,
              );
            }
          }
        } catch (processError) {
          console.error("Error calling start-process:", processError);
        }
      }
    } catch (error) {
      console.error("Error toggling AI:", error);
      // Revert optimistic update if there was an error
      setDeals(
        deals.map((deal) =>
          deal.email_id === email_id
            ? { ...deal, is_ai_active: deal.is_ai_active }
            : deal,
        ),
      );
    }
  };

  // Handle clicking on a deal to open the chat
  const handleDealClick = (deal: Deal) => {
    if (deal.is_ai_active) {
      onNavigate("chatrooms", deal.email_id);
    }
  };

  return (
    <div className="relative min-h-screen px-6 pb-12 overflow-hidden">
      <SparkleField
        className="pointer-events-none absolute inset-0 z-20"
        items={[
          // Left large sparkle
          {
            top: "180px",
            left: "160px",
            size: 94,
            rotate: -8,
            delay: "0.2s",
            variant: "peach",
            opacity: 0.95,
          },
          // Right medium sparkle
          {
            top: "210px",
            right: "200px",
            size: 54,
            rotate: 10,
            delay: "0.8s",
            variant: "peach",
            opacity: 0.9,
          },
          // Small accent near orb
          {
            top: "300px",
            left: "360px",
            size: 40,
            rotate: 15,
            delay: "1.4s",
            variant: "orange",
            opacity: 0.85,
          },
        ]}
      />
      <HeroOrb
        size={1200}
        translateY="54%"
        opacityClass="opacity-80"
        blurClass="blur-[36px] md:blur-[40px]"
        zIndexClass="-z-10"
        blend="normal"
        className="
          w-[900px] h-[900px]
          sm:w-[1000px] sm:h-[1000px]
          md:w-[1200px] md:h-[1200px]
        "
      />

      {/* Header with Rescan Button */}
      {!mailsFetched && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] mt-10">
          <h1 className="text-5xl md:text-6xl font-bold font-playfair text-gray-900 mb-6 leading-tight">
            Let's Check what you got there!
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-xl mx-auto leading-relaxed text-center">
            scans through your mail box to find mails related to brand deals!!
          </p>
          <button
            onClick={handleScanMailBox}
            className="bg-black hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold flex items-center space-x-3 mx-auto transition-all duration-300 button-bounce shadow-xl hover:shadow-2xl"
            disabled={loading}
          >
            <img src="/rocket.png" alt="Scan" width={24} height={24} />
            <span>{loading ? "Scanning..." : "Scan Mail Box"}</span>
            {loading && (
              <span className="ml-3 animate-spin inline-block">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#fff"
                    strokeWidth="4"
                    opacity="0.2"
                  />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="#fff"
                    strokeWidth="4"
                  />
                </svg>
              </span>
            )}
          </button>
        </div>
      )}
      {mailsFetched && (
        <div>
          <div className="flex items-center justify-center mb-10 mt-20">
            <button
              className="bg-black text-white px-8 py-4 rounded-full text-lg font-medium flex items-center space-x-3 hover:bg-gray-800 transition-all duration-200 button-bounce"
              onClick={handleRescan}
              disabled={loading}
            >
              <img src="/rocket.png" alt="Rescan" width={20} height={20} />
              <span>{loading ? "Scanning..." : "Rescan Mails"}</span>
              {loading && (
                <span className="ml-3 animate-spin inline-block">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="#fff"
                      strokeWidth="4"
                      opacity="0.2"
                    />
                    <path
                      d="M12 2a10 10 0 0 1 10 10"
                      stroke="#fff"
                      strokeWidth="4"
                    />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Deal Cards Grid */}
      {mailsFetched && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-24 relative z-10">
          {deals.map((deal, index) => (
            <div
              key={deal.email_id}
              className={`bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start transition-all duration-300 cursor-pointer ${
                deal.is_ai_active
                  ? "border-2 border-orange-500"
                  : "border border-gray-200"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleDealClick(deal)}
            >
              <div className="text-sm text-gray-500 mb-3">
                {new Date(deal.received_at).toLocaleDateString()}
              </div>

              {/* Email Header */}
              <div className="flex items-center space-x-4 mb-4 w-full">
                <img src="/rocket.png" alt="Deal" width={32} height={32} />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 truncate">
                    {deal.subject}
                  </h3>
                  <p className="text-sm text-gray-600">{deal.from_name}</p>
                </div>
              </div>

              {/* Email Content */}
              <p className="text-gray-600 mb-3 line-clamp-3">{deal.snippet}</p>

              {/* Labels */}
              <div className="mb-3 flex flex-wrap gap-1">
                {deal.labels?.map((label, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full"
                  >
                    {label}
                  </span>
                ))}
              </div>

              {/* Tags */}
              {deal.tags && deal.tags.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1">
                  {deal.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Relevance Score */}
              <div className="mb-4 text-sm text-gray-600">
                Relevance: {Math.round((deal.relevance_score || 0) * 100)}%
              </div>

              {/* Notes */}
              {deal.notes && (
                <div className="mb-4 text-sm text-gray-600 italic">
                  {deal.notes}
                </div>
              )}

              {/* AI Toggle Button */}
              <button
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  deal.is_ai_active
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleAI(deal.email_id);
                }}
              >
                {deal.is_ai_active ? "Deactivate AI" : "Activate AI"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
