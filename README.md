# KyodoAI

**The only AI Agent creators need to handle every collaboration and deal autonomously, just like a personal assistant.**

*Built for AgentHack 2025 by WeMakeDevs*

## Watch Kyodo AI in Action
[![Kyodo AI Demo Video](https://github.com/user-attachments/assets/6e4a10ad-ca59-42c5-bebb-29aaa06819c5)](https://youtu.be/DScdA5LHNHM)

## Project Overview

KyodoAI revolutionizes how content creators manage collaboration opportunities by implementing an intelligent AI-powered system that autonomously handles the entire collaboration lifecycle. From discovering partnership emails to negotiating deals, KyodoAI acts as a sophisticated personal assistant that understands your brand, preferences, and business goals.

### The Creator Economy Challenge

Content creators face overwhelming email volumes containing collaboration opportunities mixed with regular correspondence. Manual processing is:
- **Time-consuming**: Hours spent filtering through hundreds of emails daily
- **Inconsistent**: Human oversight leads to missed opportunities
- **Inefficient**: Repetitive tasks that don't require creative input
- **Scalability Issues**: Growth means exponentially more emails to manage

### Our Solution: AI Agents + Creators-In-Loop

KyodoAI introduces a groundbreaking **Creators-In-Loop** architecture powered by **Portia AI SDK**, where intelligent agents handle routine tasks while keeping creators in the driver's seat for strategic decisions.

## Portia AI SDK: The Intelligence Engine

At the heart of KyodoAI lies the **Portia AI SDK**, enabling sophisticated agentic workflows that transform collaboration management from reactive to proactive.

### Why Portia AI SDK Makes Us Win

**Portia AI SDK** provides the advanced agentic capabilities that set KyodoAI apart:

1. **Multi-Agent Orchestration**: Complex workflows with specialized agents for different collaboration phases
2. **Context-Aware Processing**: Maintains conversation context across long collaboration cycles
3. **Autonomous Decision Making**: Handles complex scenarios without constant human intervention
4. **Scalable Intelligence**: Grows with creator needs while maintaining personalization

### Portia AI Implementation in KyodoAI

#### Email Discovery Workflow
```python
# Portia AI SDK powers intelligent email scanning
portia_helper = PortiaHelper()
result = portia_helper.run_search_colab_emails(
    end_user=user,
    context=creator_profile
)
```

- **Intelligent Filtering**: AI agents scan Gmail for collaboration opportunities
- **Content Understanding**: Deep analysis of email intent and proposal details
- **Relevance Scoring**: Matches opportunities against creator preferences and niche
- **Structured Extraction**: Converts unstructured emails into actionable data

#### Autonomous Collaboration Processing
```python
# Multi-step agentic workflow for deal management
result = portia_helper.run_start_colab_process(
    end_user=user,
    context=collaboration_context
)
```

- **Deal Analysis**: AI evaluates partnership value and brand alignment
- **Communication Management**: Automated responses and negotiation support
- **Progress Tracking**: Real-time monitoring of collaboration milestones
- **Decision Support**: Intelligent recommendations with risk assessment

## Creators-In-Loop Architecture

Our unique approach ensures creators maintain creative control while benefiting from AI automation:

### What AI Handles Autonomously
- Email scanning and categorization
- Initial opportunity assessment
- Routine communication and follow-ups
- Progress tracking and deadline management
- Data extraction and organization

### What Creators Control
- Final approval on collaboration decisions
- Brand alignment and creative direction
- Contract terms and pricing negotiations
- Content strategy and deliverable planning
- Relationship management with preferred brands

### The Perfect Balance
- **AI Efficiency**: Handles 80% of routine collaboration tasks
- **Human Creativity**: Creator focus on strategic and creative decisions
- **Continuous Learning**: System adapts to creator preferences over time
- **Scalable Growth**: Handles increasing collaboration volume seamlessly

## Technical Architecture

### Backend Infrastructure
```
backend/
├── main.py                    # FastAPI application with Portia AI integration
├── helpers/
│   ├── portia_helper.py      # Portia AI SDK orchestration and workflows
│   ├── supabase_helper.py    # Database operations and queries
│   └── schemas.py            # Pydantic models and data validation
├── middleware/
│   └── auth_middleware.py    # JWT authentication and security
└── db/
    ├── create_emails_table.sql
    ├── create_messages_table.sql
    └── create_actions_table.sql
```

### Frontend Application
```
frontend_new/                     # Main frontend directory (NOT frontend_dev)
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx        # Collaboration overview and AI activation
│   │   ├── ChatRooms.tsx        # Real-time AI interaction interface
│   │   ├── auth/               # Authentication components
│   │   └── Navigation.tsx      # Application navigation
│   ├── pages/
│   │   ├── DashboardPage.tsx   # Main dashboard with email management
│   │   ├── ChatRoomsPage.tsx   # AI conversation interface
│   │   └── Auth.tsx            # Authentication flows
│   └── lib/
│       └── supabaseClient.ts   # Database client configuration
```

### Database Schema (Supabase)
- **emails**: Collaboration opportunities with AI analysis and scoring
- **messages**: Creator-AI communication logs and conversation history
- **actions**: AI-generated recommendations and automated task tracking
- **profiles**: Creator preferences, niche settings, and business parameters

## Core Features

### 1. Intelligent Email Discovery
- **Gmail Integration**: Secure OAuth2 connection to creator's inbox
- **Smart Classification**: AI categorizes emails by collaboration type
- **Relevance Scoring**: Matches opportunities against creator profile
- **Real-time Processing**: Continuous monitoring for new opportunities

### 2. AI-Powered Collaboration Management
- **Autonomous Analysis**: Deep evaluation of partnership proposals
- **Intelligent Communication**: Context-aware response generation
- **Progress Monitoring**: Real-time tracking of collaboration stages
- **Risk Assessment**: Automated evaluation of partnership viability

### 3. Interactive Creator Dashboard
- **Visual Pipeline**: Collaboration opportunities organized by stage
- **One-Click AI Activation**: Easy engagement of AI agents for specific deals
- **Performance Analytics**: Track collaboration success and ROI
- **Preference Management**: Customize AI behavior and decision criteria

### 4. Real-time AI Chat Interface
- **Conversational AI**: Natural language interaction with AI agents
- **Action Timeline**: Visual representation of AI decision processes
- **Live Updates**: Real-time polling for new messages and actions
- **Context Preservation**: Maintains conversation history across sessions

## API Endpoints

### Authentication & User Management
- **POST /auth/login**: User authentication with JWT tokens
- **POST /auth/register**: New user registration with profile creation

### Email & Collaboration Discovery
- **POST /search-emails**: Trigger Portia AI email scanning workflow
  - Scans Gmail inbox for collaboration opportunities
  - Returns categorized emails with AI analysis and scoring

### AI Agent Interaction
- **POST /start-process**: Initiate autonomous collaboration processing
  - Begins multi-step agentic workflow for selected opportunity
  - Returns real-time updates on AI agent actions

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.11+ with pip/uv
- Supabase account with project setup
- Portia AI SDK access and API key
- Gmail API credentials for email integration

### Backend Setup
```bash
cd backend

# Install dependencies
pip install -r requirements.txt
# or with uv (recommended)
uv sync

# Environment configuration
cp .env.example .env
# Configure required variables:
# - PORTIA_API_KEY=your_portia_api_key
# - SUPABASE_URL=your_supabase_url
# - SUPABASE_ANON_KEY=your_supabase_anon_key
# - GMAIL_CLIENT_ID=your_gmail_oauth_client_id
# - GMAIL_CLIENT_SECRET=your_gmail_oauth_secret

# Start development server
uvicorn main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend_new

# Install dependencies
npm install

# Environment configuration
cp .env.example .env
# Configure Supabase connection:
# - VITE_SUPABASE_URL=your_supabase_url
# - VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Start development server
npm run dev
```

### Database Setup
```sql
-- Execute SQL scripts in order:
-- 1. Create profiles table (via Supabase Auth)
-- 2. Run db/create_emails_table.sql
-- 3. Run db/create_messages_table.sql
-- 4. Run db/create_actions_table.sql
```

### Portia AI Configuration
1. Sign up at [Portia Labs](https://www.portialabs.ai/)
2. Obtain API key from dashboard
3. Review [Portia AI Documentation](https://docs.portialabs.ai) for advanced configurations
4. Configure workflow templates in `backend/helpers/portia_helper.py`

## Technology Stack

### AI & Intelligence
- **Portia AI SDK**: Advanced agentic workflows and multi-agent orchestration
- **Natural Language Processing**: Email content analysis and understanding
- **Machine Learning**: Preference learning and recommendation optimization

### Backend Services
- **FastAPI**: High-performance Python web framework
- **Pydantic**: Data validation and serialization
- **Supabase**: PostgreSQL database with real-time capabilities
- **JWT Authentication**: Secure user session management

### Frontend Application
- **React 18**: Modern component-based UI framework
- **TypeScript**: Type-safe development and better IDE support
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first styling framework
- **Material-UI**: React component library for enhanced UX

### External Integrations
- **Gmail API**: Email access and processing
- **Supabase Auth**: User authentication and management
- **Real-time WebSockets**: Live updates and notifications

## Advanced Features

### AI Agent Specialization
- **Discovery Agent**: Specialized in finding and categorizing opportunities
- **Analysis Agent**: Evaluates partnership value and brand alignment
- **Communication Agent**: Handles negotiation and correspondence
- **Tracking Agent**: Monitors progress and deadline management

### Personalization Engine
- **Learning Algorithms**: Adapts to creator decision patterns
- **Preference Optimization**: Refines opportunity matching over time
- **Custom Workflows**: Tailored AI behavior based on creator niche
- **Brand Relationship Memory**: Maintains history with previous partners

### Security & Privacy
- **OAuth2 Security**: Secure Gmail access without password storage
- **JWT Token Management**: Stateless authentication with refresh tokens
- **Data Encryption**: All sensitive data encrypted at rest and in transit
- **GDPR Compliance**: Privacy-first approach to data handling

## Deployment

### Production Backend
```bash
cd backend

# Docker deployment
docker build -t kyodoai-backend .
docker run -p 8000:8000 kyodoai-backend

# Or traditional deployment
pip install -r requirements.txt
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --host 0.0.0.0 --port 8000
```

### Production Frontend
```bash
cd frontend_new

# Build for production
npm run build

# Deploy to Vercel (recommended)
# 1. Connect your GitHub repo to Vercel
# 2. Set Root Directory to: frontend_new
# 3. Build Command: npm run build
# 4. Output Directory: dist
# 5. Install Command: npm install

# Deploy to Netlify
# 1. Connect your GitHub repo to Netlify
# 2. Set Base directory to: frontend_new
# 3. Build command: npm run build
# 4. Publish directory: frontend_new/dist

# Deploy to Cloudflare Pages
# 1. Connect your GitHub repo to Cloudflare Pages
# 2. Set Build output directory to: frontend_new/dist
# 3. Set Root directory to: frontend_new
# 4. Build command: npm run build

# Manual deployment
npm run build
# Upload dist/ folder to your hosting provider
```

### Environment Variables for Production

#### Backend (.env)
```bash
PORTIA_API_KEY=your_production_portia_key
SUPABASE_URL=your_production_supabase_url
SUPABASE_ANON_KEY=your_production_supabase_key
GMAIL_CLIENT_ID=your_gmail_oauth_client_id
GMAIL_CLIENT_SECRET=your_gmail_oauth_secret
ENVIRONMENT=production
```

#### Frontend (.env)
```bash
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_key
VITE_API_BASE_URL=https://your-backend-url.com
```

### Deployment Troubleshooting

#### Common Issues

**1. Build Error: "Could not read package.json" or "Cannot find cwd"**
- Ensure your build system is pointing to the `frontend_new` directory (NOT frontend_dev)
- For Vercel: Set "Root Directory" to `frontend_new`
- For Netlify: Set "Base directory" to `frontend_new`
- For Cloudflare Pages: Set "Build output directory" to `frontend_new/dist`
- Verify the correct directory name in your deployment configuration

**2. Environment Variables Not Loading**
- Verify environment variables are set in your hosting platform
- Frontend variables must be prefixed with `VITE_`
- Backend variables should match your `.env.example` file

**3. CORS Issues in Production**
- Update CORS origins in `backend/main.py` to include your frontend domain
- Ensure API base URL is correctly configured in frontend

**4. Database Connection Issues**
- Verify Supabase URL and keys are correct
- Ensure Row Level Security (RLS) is properly configured
- Check that all required tables exist in production database

## Contributing

This project was developed for AgentHack 2025. We welcome contributions from the community:

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add comprehensive tests
5. Submit a pull request

## Future Roadmap

### Phase 1: Enhanced Intelligence
- Advanced AI negotiation capabilities
- Multi-language support for global creators
- Integration with YouTube, Instagram, TikTok APIs
- Automated contract generation and review

### Phase 2: Creator Network
- AI-matched collaborations between creators
- Peer recommendation system
- Collaborative project management
- Revenue sharing automation

### Phase 3: Enterprise Features
- Agency management for multiple creators
- Advanced analytics and reporting
- White-label solutions for creator agencies
- API marketplace for third-party integrations

## Support & Documentation

- **Portia AI Documentation**: [docs.portialabs.ai](https://docs.portialabs.ai)
- **Project Issues**: Submit via GitHub Issues
- **Feature Requests**: Community discussion board
- **Security Issues**: security@kyodoai.dev

## License

MIT License - Open source for AgentHack 2025

## Acknowledgments

Special thanks to:
- **WeMakeDevs** for organizing AgentHack 2025
- **Portia Labs** for providing cutting-edge agentic AI capabilities
- **Supabase** for excellent backend-as-a-service platform
- **Creator Community** for inspiring this solution

---

**Built with Portia AI SDK - Transforming creator collaboration through intelligent automation and human-AI partnership.**
