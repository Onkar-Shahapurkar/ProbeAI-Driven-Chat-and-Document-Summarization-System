# 🌌 ProbeAI

### AI-Powered Workspace for Conversations, Documents & Video Intelligence

ProbeAI is a full-stack AI workspace that combines **AI conversations,
document intelligence, Retrieval-Augmented Generation (RAG), video
transcription, video summarization, authentication, and analytics** in
one unified application.

------------------------------------------------------------------------

## ✨ Features

- 🔐 JWT-based user authentication
- 💬 Persistent AI conversations
- 📄 Document upload and text extraction
- 🧠 Retrieval-Augmented Generation (RAG)
- 🔎 Context-grounded document question answering
- 📚 Retrieved source chunks with relevance scores
- 🎥 Video upload and format validation
- 🎙️ Whisper-based video transcription
- 📝 AI-generated video summaries
- 📊 Activity analytics
- 🌌 Cosmic / nebula-inspired UI
- ✨ Animated canvas star background
- 📱 Responsive frontend
- 🔗 React frontend + FastAPI backend + PostgreSQL

------------------------------------------------------------------------

## 🏗️ Architecture

``` text
                    ┌───────────────────────┐
                    │      React / Vite     │
                    │       Frontend        │
                    └───────────┬───────────┘
                                │
                           REST / Axios
                                │
                                ▼
                    ┌───────────────────────┐
                    │       FastAPI         │
                    │        Backend        │
                    └───────┬───────┬───────┘
                            │       │
                  ┌─────────┘       └──────────┐
                  ▼                            ▼
          ┌───────────────┐            ┌────────────────┐
          │  PostgreSQL   │            │  AI Services   │
          │  SQLAlchemy   │            │ LLM / Whisper  │
          └───────────────┘            └────────────────┘
```

### Main application flow

``` text
Authentication
      ↓
Dashboard
      ├── Chat → Conversations → Messages → AI
      ├── Documents → Extraction → Retrieval → RAG → Sources
      ├── Video → Transcription → Summary
      └── Analytics → User activity
```

------------------------------------------------------------------------

## 🛠️ Technology Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Lucide React
- CSS
- HTML Canvas
- Responsive UI

### Backend

- Python
- FastAPI
- Uvicorn
- SQLAlchemy
- PostgreSQL
- python-dotenv
- HTTPX
- JWT authentication
- Multipart file uploads

### AI

- OpenRouter API
- Configurable OpenRouter model
- LLM response generation
- Retrieval-Augmented Generation
- Whisper-based transcription
- AI transcript summarization

### Database

- PostgreSQL
- SQLAlchemy ORM
- UUID primary keys
- Foreign keys
- User-scoped records

------------------------------------------------------------------------

## 📂 Project Structure

``` text
ProbeAI/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   └── database.py
│   │   ├── dependencies/
│   │   │   └── auth.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── conversation.py
│   │   │   ├── message.py
│   │   │   ├── document.py
│   │   │   └── video.py
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── chat.py
│   │   │   ├── documents.py
│   │   │   ├── video.py
│   │   │   └── analytics.py
│   │   ├── services/
│   │   │   ├── ai_service.py
│   │   │   ├── retrieval_service.py
│   │   │   ├── video_service.py
│   │   │   └── video_summary_service.py
│   │   └── main.py
│   ├── uploads/
│   │   └── videos/
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppLayout.jsx
│   │   │   ├── ChatSidebar.jsx
│   │   │   └── NebulaBackground.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Documents.jsx
│   │   │   ├── Video.jsx
│   │   │   └── Analytics.jsx
│   │   └── services/
│   │       ├── api.js
│   │       └── auth.js
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

> Keep this section synchronized with the actual repository if your
> folder structure changes.

------------------------------------------------------------------------

# 🔐 Authentication

ProbeAI uses JWT-based authentication.

Protected backend resources use the application’s current-user
dependency to associate requests with the authenticated user.

The application supports:

- Registration
- Login
- JWT access tokens
- Authenticated API requests
- User-specific conversations
- User-specific documents
- Logout

------------------------------------------------------------------------

# 💬 AI Chat

The chat subsystem is organized around conversations and messages.

``` text
User
 ↓
Chat interface
 ↓
FastAPI chat route
 ↓
AI service
 ↓
LLM
 ↓
AI response
 ↓
Conversation / message persistence
```

The chat functionality is exposed through the backend chat router under:

``` text
/api/chat
```

The exact individual chat endpoints should be kept synchronized with
`backend/app/routes/chat.py`.

------------------------------------------------------------------------

# 📄 Document Intelligence

Documents are stored with user ownership and metadata.

The `Document` model currently contains:

``` text
id
user_id
original_filename
stored_filename
file_type
file_size
extracted_text
created_at
```

Documents are connected to users through:

``` text
documents.user_id → users.id
```

The document system handles:

1.  Upload
2.  File processing
3.  Text extraction
4.  Storage
5.  Retrieval
6.  Question answering

------------------------------------------------------------------------

# 🧠 Retrieval-Augmented Generation (RAG)

ProbeAI uses a retrieval-first document QA pipeline.

``` text
User Question
      ↓
retrieve_from_document(...)
      ↓
Top 3 Retrieved Chunks
      ↓
Positive-score Filtering
      ↓
Context Construction
      ↓
LLM
      ↓
Answer + Sources
```

The retrieval service is called with:

``` python
results = retrieve_from_document(
    query=question,
    document_text=document_text,
    top_k=3,
)
```

Only chunks with a positive retrieval score are treated as relevant
context.

The context is then supplied to the AI service.

### Grounding behavior

The AI is instructed to:

- Use only the supplied document context.
- Say the information is unavailable in the document when the context
  does not contain an answer.
- Never invent unsupported information.

The document response also includes retrieved source chunks and their
relevance scores.

This makes the RAG workflow more transparent and helps users understand
where an answer came from.

------------------------------------------------------------------------

# 🎥 Video Intelligence

The video subsystem supports:

``` text
.mp4
.mov
.avi
.mkv
.webm
```

The main video endpoint is:

``` http
POST /api/video/summarize
```

The processing pipeline is:

``` text
Video Upload
      ↓
Extension Validation
      ↓
UUID Filename
      ↓
uploads/videos/
      ↓
Video Transcription
      ↓
Transcript
      ↓
AI Summarization
      ↓
Summary + Transcript
```

A successful response contains:

``` json
{
  "filename": "example.mp4",
  "transcript": "...",
  "summary": "..."
}
```

If video processing fails, the backend removes the stored processing
file before returning an HTTP 500 error.

------------------------------------------------------------------------

# 📊 Analytics

Analytics are user-specific.

The analytics endpoint is:

``` http
GET /api/analytics
```

It currently calculates:

- Conversations
- Documents
- Messages

Example:

``` json
{
  "conversations": 4,
  "documents": 3,
  "messages": 18
}
```

The frontend displays these values through the Analytics page and
refresh action.

The dashboard also uses dynamic activity counts for the user’s
workspace.

------------------------------------------------------------------------

# 🖥️ Frontend Pages

## Dashboard

The dashboard contains:

- Welcome section
- ProbeAI branding
- Activity statistics
- Quick actions
- Chat shortcut
- Document shortcut
- Video shortcut
- Analytics shortcut
- Cosmic visual background

## Chat

Provides the primary AI conversation experience, including the message
composer and conversation workflow.

## Documents

Provides document upload and document question-answering functionality.

## Video

Provides:

- Video file selection
- Supported-format guidance
- Processing state
- Generated summary
- Transcript
- Error state

## Analytics

Provides:

- Conversation count
- Document count
- Message count
- Refresh control
- Loading state

------------------------------------------------------------------------

# 🌌 Cosmic UI & Nebula Background

ProbeAI has a dark, cosmic product identity built around:

- Deep-space visuals
- Hyper-realistic cosmic imagery
- Stars
- Nebula-inspired lighting
- Purple / indigo accents
- Glass-like panels
- Soft borders
- Controlled glow effects
- Minimal futuristic styling

The animated background is implemented in:

``` text
frontend/src/components/NebulaBackground.jsx
```

It uses an HTML canvas and `requestAnimationFrame`.

The component:

- Adjusts to device pixel ratio
- Resizes with the viewport
- Creates a bounded number of particles
- Gives particles randomized size and opacity
- Slowly animates them
- Wraps particles around the viewport
- Cleans up the animation on unmount

The background is positioned behind the application and does not
intercept pointer events.

------------------------------------------------------------------------

# 🧩 Application Layout

`AppLayout.jsx` provides the shared application shell.

``` text
┌───────────────┬────────────────────────────────┐
│               │            Topbar              │
│    Sidebar    ├────────────────────────────────┤
│               │                                │
│  Dashboard    │                                │
│  Chat         │          Workspace             │
│  Documents    │          <Outlet />            │
│  Video        │                                │
│  Analytics    │                                │
│               │                                │
│  Logout       │                                │
└───────────────┴────────────────────────────────┘
```

Navigation uses React Router’s `NavLink`, allowing the active page to
receive an active navigation state.

------------------------------------------------------------------------

# 🗄️ Database Configuration

Database setup is centralized in:

``` text
backend/app/core/database.py
```

The application uses:

``` python
engine = create_engine(DATABASE_URL)
```

and SQLAlchemy:

``` python
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)
```

Models inherit from:

``` python
Base = declarative_base()
```

The FastAPI application initializes the model metadata during startup
using:

``` python
Base.metadata.create_all(bind=engine)
```

------------------------------------------------------------------------

# 🔌 API Overview

| Method          | Endpoint               | Purpose                           |
|-----------------|------------------------|-----------------------------------|
| GET             | `/`                    | API status                        |
| GET             | `/health`              | Health/database status            |
| Auth routes     | `/api/auth/...`        | Registration/login/authentication |
| Chat routes     | `/api/chat/...`        | AI conversations                  |
| Document routes | `/api/documents/...`   | Document processing and Q&A       |
| POST            | `/api/video/summarize` | Video transcription and summary   |
| GET             | `/api/analytics`       | User activity analytics           |

> The individual authentication, chat, and document endpoints should be
> referenced directly from their current route files because those
> routes may evolve during development.

------------------------------------------------------------------------

# 🔑 Environment Variables

Create:

``` text
backend/.env
```

The current backend configuration uses:

``` env
DATABASE_URL=your_postgresql_connection_string

JWT_SECRET_KEY=your_secret_key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60

OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openrouter/free
```

### Important

**Never commit real credentials to GitHub.**

Keep `.env` in `.gitignore`.

Use placeholder values in documentation and examples.

------------------------------------------------------------------------

# 🚀 Installation

## Prerequisites

Install:

- Python 3.x
- Node.js
- npm
- PostgreSQL
- Git

You also need the required AI API credentials.

------------------------------------------------------------------------

## 1. Clone

``` bash
git clone <your-repository-url>
cd ProbeAI
```

------------------------------------------------------------------------

## 2. Configure the database

Create a PostgreSQL database.

Add its connection string to:

``` text
backend/.env
```

Example:

``` env
DATABASE_URL=postgresql://username:password@localhost:5432/probeai
```

------------------------------------------------------------------------

## 3. Install backend dependencies

``` bash
cd backend
python -m venv venv
```

### Windows

``` bash
venv\Scriptsctivate
```

### macOS / Linux

``` bash
source venv/bin/activate
```

Install dependencies:

``` bash
pip install -r requirements.txt
```

------------------------------------------------------------------------

## 4. Start the backend

``` bash
uvicorn app.main:app --reload
```

Backend:

``` text
http://127.0.0.1:8000
```

Health check:

``` text
http://127.0.0.1:8000/health
```

------------------------------------------------------------------------

## 5. Install frontend dependencies

Open another terminal:

``` bash
cd frontend
npm install
```

------------------------------------------------------------------------

## 6. Start the frontend

``` bash
npm run dev
```

Frontend:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

# 🔄 Complete User Journey

``` text
Register
   ↓
Login
   ↓
Dashboard
   ├───────────────┐
   ↓               ↓
Chat            Documents
   ↓               ↓
AI Response      RAG
   │               ↓
   │            Sources
   │
   └───────┐
           ↓
         Video
           ↓
    Transcription
           ↓
       Summary
           ↓
       Analytics
           ↓
         Logout
```

------------------------------------------------------------------------

# 🧪 Testing Checklist

## Authentication

- [ ] Register
- [ ] Login
- [ ] Invalid credentials handled
- [ ] Protected pages require authentication
- [ ] Logout works

## Chat

- [ ] Start conversation
- [ ] Send message
- [ ] Receive AI response
- [ ] Conversation persists
- [ ] User data remains isolated

## Documents

- [ ] Upload document
- [ ] Extract text
- [ ] Ask question
- [ ] Retrieve relevant chunks
- [ ] Generate grounded answer
- [ ] Display sources

## Video

- [ ] Upload supported video
- [ ] Reject unsupported extension
- [ ] Transcribe video
- [ ] Generate summary
- [ ] Display transcript
- [ ] Display summary
- [ ] Handle processing errors

## Analytics

- [ ] Conversation count
- [ ] Document count
- [ ] Message/query count
- [ ] Refresh works

## UI

- [ ] Sidebar navigation
- [ ] Active navigation state
- [ ] Dashboard
- [ ] Cosmic background
- [ ] Chat composer
- [ ] Loading states
- [ ] Error states
- [ ] Responsive layout

------------------------------------------------------------------------

# 🐛 Troubleshooting

## Frontend cannot connect to backend

Verify the backend is running:

``` text
http://127.0.0.1:8000
```

Then verify the frontend API configuration.

## Database connection fails

Check:

- PostgreSQL is running.
- `DATABASE_URL` is correct.
- The database exists.
- Credentials are correct.
- The PostgreSQL driver is installed.

## AI requests fail

Check:

``` env
OPENROUTER_API_KEY=...
OPENROUTER_MODEL=openrouter/free
```

Also verify the configured model/API is available.

## Video processing fails

Check:

- Supported file extension
- Required transcription dependencies
- File readability
- AI/transcription configuration
- Backend write permissions

## Nebula background import error

`NebulaBackground.jsx` is inside the same `components` directory as
`AppLayout.jsx`.

Therefore, from:

``` text
frontend/src/components/AppLayout.jsx
```

use:

``` javascript
import NebulaBackground from "./NebulaBackground";
```

not:

``` javascript
import NebulaBackground from "./components/NebulaBackground";
```

------------------------------------------------------------------------

# 📸 Screenshots

Recommended repository structure:

``` text
docs/
├── dashboard.png
├── chat.png
├── documents.png
├── video.png
└── analytics.png
```

Then add:

``` md
## Dashboard

![ProbeAI Dashboard](docs/dashboard.png)

## Chat

![ProbeAI Chat](docs/chat.png)

## Documents

![ProbeAI Documents](docs/documents.png)

## Video

![ProbeAI Video](docs/video.png)

## Analytics

![ProbeAI Analytics](docs/analytics.png)
```

------------------------------------------------------------------------

# 🔒 Security

Current security-oriented practices include:

- JWT authentication
- Protected backend routes
- User-specific resource access
- Environment-based secrets
- CORS configuration
- File extension validation
- UUID-based uploaded video filenames
- Cleanup after failed video processing
- Foreign-key relationships
- No real credentials in source control

For production, consider additional hardening such as:

- HTTPS
- Rate limiting
- Upload size limits
- Secret management
- Database migrations
- Structured logging
- Monitoring
- Production CORS configuration

------------------------------------------------------------------------

# 📐 Design Principles

### One Workspace

Chat, documents, video, and analytics live inside one application.

### Grounded AI

Document answers are based on retrieved document context.

### User Isolation

User-owned resources are associated with the authenticated account.

### Clear Feedback

The UI uses loading, error, empty, and result states.

### Distinctive Identity

ProbeAI uses a dark cosmic visual language rather than a generic AI
dashboard aesthetic.

------------------------------------------------------------------------

# 🗺️ Future Improvements

Potential future improvements include:

- Streaming AI responses
- Advanced conversation search
- Improved conversation management
- More document formats
- Better chunking/embedding strategies
- Vector database integration
- Enhanced source highlighting
- Persistent video history UI
- Advanced analytics charts
- Automated backend tests
- Automated frontend tests
- Alembic database migrations
- Rate limiting
- Cloud deployment
- Object storage for media
- Production monitoring

------------------------------------------------------------------------

# 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch.
3.  Implement the change.
4.  Test the affected workflow.
5.  Keep credentials out of source control.
6.  Open a pull request with a clear description.

Example:

``` bash
git checkout -b feature/your-feature
git add .
git commit -m "Add your feature"
git push origin feature/your-feature
```

------------------------------------------------------------------------

# 📄 License

Add the actual project license here.

For example:

``` text
MIT License
```

Only claim a license if the corresponding license file is included in
the repository.

------------------------------------------------------------------------

# 👨‍💻 Author

## Onkar Datta Shahapurkar

AI / Full-Stack Developer

### Areas demonstrated by ProbeAI

- Python
- FastAPI
- React
- Vite
- PostgreSQL
- SQLAlchemy
- REST APIs
- JWT authentication
- RAG
- LLM integration
- OpenRouter
- Document processing
- Video transcription
- AI summarization
- Full-stack development
- Responsive UI
- AI product design

Add your public profiles:

``` text
GitHub:   <your-github-url>
LinkedIn: <your-linkedin-url>
Portfolio: <your-portfolio-url>
```

------------------------------------------------------------------------

# 🌌 ProbeAI

> **Explore. Understand. Discover.**

ProbeAI brings conversations, documents, videos, and AI-powered insights
together in one intelligent workspace.
# 🌌 ProbeAI

### AI-Powered Workspace for Conversations, Documents & Video Intelligence

ProbeAI is a full-stack AI workspace that combines **AI conversations,
document intelligence, Retrieval-Augmented Generation (RAG), video
transcription, video summarization, authentication, and analytics** in
one unified application.

------------------------------------------------------------------------

## ✨ Features

- 🔐 JWT-based user authentication
- 💬 Persistent AI conversations
- 📄 Document upload and text extraction
- 🧠 Retrieval-Augmented Generation (RAG)
- 🔎 Context-grounded document question answering
- 📚 Retrieved source chunks with relevance scores
- 🎥 Video upload and format validation
- 🎙️ Whisper-based video transcription
- 📝 AI-generated video summaries
- 📊 Activity analytics
- 🌌 Cosmic / nebula-inspired UI
- ✨ Animated canvas star background
- 📱 Responsive frontend
- 🔗 React frontend + FastAPI backend + PostgreSQL

------------------------------------------------------------------------

## 🏗️ Architecture

``` text
                    ┌───────────────────────┐
                    │      React / Vite     │
                    │       Frontend        │
                    └───────────┬───────────┘
                                │
                           REST / Axios
                                │
                                ▼
                    ┌───────────────────────┐
                    │       FastAPI         │
                    │        Backend        │
                    └───────┬───────┬───────┘
                            │       │
                  ┌─────────┘       └──────────┐
                  ▼                            ▼
          ┌───────────────┐            ┌────────────────┐
          │  PostgreSQL   │            │  AI Services   │
          │  SQLAlchemy   │            │ LLM / Whisper  │
          └───────────────┘            └────────────────┘
```

### Main application flow

``` text
Authentication
      ↓
Dashboard
      ├── Chat → Conversations → Messages → AI
      ├── Documents → Extraction → Retrieval → RAG → Sources
      ├── Video → Transcription → Summary
      └── Analytics → User activity
```

------------------------------------------------------------------------

## 🛠️ Technology Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Lucide React
- CSS
- HTML Canvas
- Responsive UI

### Backend

- Python
- FastAPI
- Uvicorn
- SQLAlchemy
- PostgreSQL
- python-dotenv
- HTTPX
- JWT authentication
- Multipart file uploads

### AI

- OpenRouter API
- Configurable OpenRouter model
- LLM response generation
- Retrieval-Augmented Generation
- Whisper-based transcription
- AI transcript summarization

### Database

- PostgreSQL
- SQLAlchemy ORM
- UUID primary keys
- Foreign keys
- User-scoped records

------------------------------------------------------------------------

## 📂 Project Structure

``` text
ProbeAI/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   └── database.py
│   │   ├── dependencies/
│   │   │   └── auth.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── conversation.py
│   │   │   ├── message.py
│   │   │   ├── document.py
│   │   │   └── video.py
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── chat.py
│   │   │   ├── documents.py
│   │   │   ├── video.py
│   │   │   └── analytics.py
│   │   ├── services/
│   │   │   ├── ai_service.py
│   │   │   ├── retrieval_service.py
│   │   │   ├── video_service.py
│   │   │   └── video_summary_service.py
│   │   └── main.py
│   ├── uploads/
│   │   └── videos/
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppLayout.jsx
│   │   │   ├── ChatSidebar.jsx
│   │   │   └── NebulaBackground.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Documents.jsx
│   │   │   ├── Video.jsx
│   │   │   └── Analytics.jsx
│   │   └── services/
│   │       ├── api.js
│   │       └── auth.js
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

> Keep this section synchronized with the actual repository if your
> folder structure changes.

------------------------------------------------------------------------

# 🔐 Authentication

ProbeAI uses JWT-based authentication.

Protected backend resources use the application’s current-user
dependency to associate requests with the authenticated user.

The application supports:

- Registration
- Login
- JWT access tokens
- Authenticated API requests
- User-specific conversations
- User-specific documents
- Logout

------------------------------------------------------------------------

# 💬 AI Chat

The chat subsystem is organized around conversations and messages.

``` text
User
 ↓
Chat interface
 ↓
FastAPI chat route
 ↓
AI service
 ↓
LLM
 ↓
AI response
 ↓
Conversation / message persistence
```

The chat functionality is exposed through the backend chat router under:

``` text
/api/chat
```

The exact individual chat endpoints should be kept synchronized with
`backend/app/routes/chat.py`.

------------------------------------------------------------------------

# 📄 Document Intelligence

Documents are stored with user ownership and metadata.

The `Document` model currently contains:

``` text
id
user_id
original_filename
stored_filename
file_type
file_size
extracted_text
created_at
```

Documents are connected to users through:

``` text
documents.user_id → users.id
```

The document system handles:

1.  Upload
2.  File processing
3.  Text extraction
4.  Storage
5.  Retrieval
6.  Question answering

------------------------------------------------------------------------

# 🧠 Retrieval-Augmented Generation (RAG)

ProbeAI uses a retrieval-first document QA pipeline.

``` text
User Question
      ↓
retrieve_from_document(...)
      ↓
Top 3 Retrieved Chunks
      ↓
Positive-score Filtering
      ↓
Context Construction
      ↓
LLM
      ↓
Answer + Sources
```

The retrieval service is called with:

``` python
results = retrieve_from_document(
    query=question,
    document_text=document_text,
    top_k=3,
)
```

Only chunks with a positive retrieval score are treated as relevant
context.

The context is then supplied to the AI service.

### Grounding behavior

The AI is instructed to:

- Use only the supplied document context.
- Say the information is unavailable in the document when the context
  does not contain an answer.
- Never invent unsupported information.

The document response also includes retrieved source chunks and their
relevance scores.

This makes the RAG workflow more transparent and helps users understand
where an answer came from.

------------------------------------------------------------------------

# 🎥 Video Intelligence

The video subsystem supports:

``` text
.mp4
.mov
.avi
.mkv
.webm
```

The main video endpoint is:

``` http
POST /api/video/summarize
```

The processing pipeline is:

``` text
Video Upload
      ↓
Extension Validation
      ↓
UUID Filename
      ↓
uploads/videos/
      ↓
Video Transcription
      ↓
Transcript
      ↓
AI Summarization
      ↓
Summary + Transcript
```

A successful response contains:

``` json
{
  "filename": "example.mp4",
  "transcript": "...",
  "summary": "..."
}
```

If video processing fails, the backend removes the stored processing
file before returning an HTTP 500 error.

------------------------------------------------------------------------

# 📊 Analytics

Analytics are user-specific.

The analytics endpoint is:

``` http
GET /api/analytics
```

It currently calculates:

- Conversations
- Documents
- Messages

Example:

``` json
{
  "conversations": 4,
  "documents": 3,
  "messages": 18
}
```

The frontend displays these values through the Analytics page and
refresh action.

The dashboard also uses dynamic activity counts for the user’s
workspace.

------------------------------------------------------------------------

# 🖥️ Frontend Pages

## Dashboard

The dashboard contains:

- Welcome section
- ProbeAI branding
- Activity statistics
- Quick actions
- Chat shortcut
- Document shortcut
- Video shortcut
- Analytics shortcut
- Cosmic visual background

## Chat

Provides the primary AI conversation experience, including the message
composer and conversation workflow.

## Documents

Provides document upload and document question-answering functionality.

## Video

Provides:

- Video file selection
- Supported-format guidance
- Processing state
- Generated summary
- Transcript
- Error state

## Analytics

Provides:

- Conversation count
- Document count
- Message count
- Refresh control
- Loading state

------------------------------------------------------------------------

# 🌌 Cosmic UI & Nebula Background

ProbeAI has a dark, cosmic product identity built around:

- Deep-space visuals
- Hyper-realistic cosmic imagery
- Stars
- Nebula-inspired lighting
- Purple / indigo accents
- Glass-like panels
- Soft borders
- Controlled glow effects
- Minimal futuristic styling

The animated background is implemented in:

``` text
frontend/src/components/NebulaBackground.jsx
```

It uses an HTML canvas and `requestAnimationFrame`.

The component:

- Adjusts to device pixel ratio
- Resizes with the viewport
- Creates a bounded number of particles
- Gives particles randomized size and opacity
- Slowly animates them
- Wraps particles around the viewport
- Cleans up the animation on unmount

The background is positioned behind the application and does not
intercept pointer events.

------------------------------------------------------------------------

# 🧩 Application Layout

`AppLayout.jsx` provides the shared application shell.

``` text
┌───────────────┬────────────────────────────────┐
│               │            Topbar              │
│    Sidebar    ├────────────────────────────────┤
│               │                                │
│  Dashboard    │                                │
│  Chat         │          Workspace             │
│  Documents    │          <Outlet />            │
│  Video        │                                │
│  Analytics    │                                │
│               │                                │
│  Logout       │                                │
└───────────────┴────────────────────────────────┘
```

Navigation uses React Router’s `NavLink`, allowing the active page to
receive an active navigation state.

------------------------------------------------------------------------

# 🗄️ Database Configuration

Database setup is centralized in:

``` text
backend/app/core/database.py
```

The application uses:

``` python
engine = create_engine(DATABASE_URL)
```

and SQLAlchemy:

``` python
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)
```

Models inherit from:

``` python
Base = declarative_base()
```

The FastAPI application initializes the model metadata during startup
using:

``` python
Base.metadata.create_all(bind=engine)
```

------------------------------------------------------------------------

# 🔌 API Overview

| Method          | Endpoint               | Purpose                           |
|-----------------|------------------------|-----------------------------------|
| GET             | `/`                    | API status                        |
| GET             | `/health`              | Health/database status            |
| Auth routes     | `/api/auth/...`        | Registration/login/authentication |
| Chat routes     | `/api/chat/...`        | AI conversations                  |
| Document routes | `/api/documents/...`   | Document processing and Q&A       |
| POST            | `/api/video/summarize` | Video transcription and summary   |
| GET             | `/api/analytics`       | User activity analytics           |

> The individual authentication, chat, and document endpoints should be
> referenced directly from their current route files because those
> routes may evolve during development.

------------------------------------------------------------------------

# 🔑 Environment Variables

Create:

``` text
backend/.env
```

The current backend configuration uses:

``` env
DATABASE_URL=your_postgresql_connection_string

JWT_SECRET_KEY=your_secret_key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60

OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openrouter/free
```

### Important

**Never commit real credentials to GitHub.**

Keep `.env` in `.gitignore`.

Use placeholder values in documentation and examples.

------------------------------------------------------------------------

# 🚀 Installation

## Prerequisites

Install:

- Python 3.x
- Node.js
- npm
- PostgreSQL
- Git

You also need the required AI API credentials.

------------------------------------------------------------------------

## 1. Clone

``` bash
git clone <your-repository-url>
cd ProbeAI
```

------------------------------------------------------------------------

## 2. Configure the database

Create a PostgreSQL database.

Add its connection string to:

``` text
backend/.env
```

Example:

``` env
DATABASE_URL=postgresql://username:password@localhost:5432/probeai
```

------------------------------------------------------------------------

## 3. Install backend dependencies

``` bash
cd backend
python -m venv venv
```

### Windows

``` bash
venv\Scriptsctivate
```

### macOS / Linux

``` bash
source venv/bin/activate
```

Install dependencies:

``` bash
pip install -r requirements.txt
```

------------------------------------------------------------------------

## 4. Start the backend

``` bash
uvicorn app.main:app --reload
```

Backend:

``` text
http://127.0.0.1:8000
```

Health check:

``` text
http://127.0.0.1:8000/health
```

------------------------------------------------------------------------

## 5. Install frontend dependencies

Open another terminal:

``` bash
cd frontend
npm install
```

------------------------------------------------------------------------

## 6. Start the frontend

``` bash
npm run dev
```

Frontend:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

# 🔄 Complete User Journey

``` text
Register
   ↓
Login
   ↓
Dashboard
   ├───────────────┐
   ↓               ↓
Chat            Documents
   ↓               ↓
AI Response      RAG
   │               ↓
   │            Sources
   │
   └───────┐
           ↓
         Video
           ↓
    Transcription
           ↓
       Summary
           ↓
       Analytics
           ↓
         Logout
```

------------------------------------------------------------------------

# 🧪 Testing Checklist

## Authentication

- [ ] Register
- [ ] Login
- [ ] Invalid credentials handled
- [ ] Protected pages require authentication
- [ ] Logout works

## Chat

- [ ] Start conversation
- [ ] Send message
- [ ] Receive AI response
- [ ] Conversation persists
- [ ] User data remains isolated

## Documents

- [ ] Upload document
- [ ] Extract text
- [ ] Ask question
- [ ] Retrieve relevant chunks
- [ ] Generate grounded answer
- [ ] Display sources

## Video

- [ ] Upload supported video
- [ ] Reject unsupported extension
- [ ] Transcribe video
- [ ] Generate summary
- [ ] Display transcript
- [ ] Display summary
- [ ] Handle processing errors

## Analytics

- [ ] Conversation count
- [ ] Document count
- [ ] Message/query count
- [ ] Refresh works

## UI

- [ ] Sidebar navigation
- [ ] Active navigation state
- [ ] Dashboard
- [ ] Cosmic background
- [ ] Chat composer
- [ ] Loading states
- [ ] Error states
- [ ] Responsive layout

------------------------------------------------------------------------

# 🐛 Troubleshooting

## Frontend cannot connect to backend

Verify the backend is running:

``` text
http://127.0.0.1:8000
```

Then verify the frontend API configuration.

## Database connection fails

Check:

- PostgreSQL is running.
- `DATABASE_URL` is correct.
- The database exists.
- Credentials are correct.
- The PostgreSQL driver is installed.

## AI requests fail

Check:

``` env
OPENROUTER_API_KEY=...
OPENROUTER_MODEL=openrouter/free
```

Also verify the configured model/API is available.

## Video processing fails

Check:

- Supported file extension
- Required transcription dependencies
- File readability
- AI/transcription configuration
- Backend write permissions

## Nebula background import error

`NebulaBackground.jsx` is inside the same `components` directory as
`AppLayout.jsx`.

Therefore, from:

``` text
frontend/src/components/AppLayout.jsx
```

use:

``` javascript
import NebulaBackground from "./NebulaBackground";
```

not:

``` javascript
import NebulaBackground from "./components/NebulaBackground";
```

------------------------------------------------------------------------

# 📸 Screenshots

Recommended repository structure:

``` text
docs/
├── dashboard.png
├── chat.png
├── documents.png
├── video.png
└── analytics.png
```

Then add:

``` md
## Dashboard

![ProbeAI Dashboard](docs/dashboard.png)

## Chat

![ProbeAI Chat](docs/chat.png)

## Documents

![ProbeAI Documents](docs/documents.png)

## Video

![ProbeAI Video](docs/video.png)

## Analytics

![ProbeAI Analytics](docs/analytics.png)
```

The dashboard screenshot should showcase the project’s hyper-realistic
cosmic visual identity.

------------------------------------------------------------------------

# 🔒 Security

Current security-oriented practices include:

- JWT authentication
- Protected backend routes
- User-specific resource access
- Environment-based secrets
- CORS configuration
- File extension validation
- UUID-based uploaded video filenames
- Cleanup after failed video processing
- Foreign-key relationships
- No real credentials in source control

For production, consider additional hardening such as:

- HTTPS
- Rate limiting
- Upload size limits
- Secret management
- Database migrations
- Structured logging
- Monitoring
- Production CORS configuration

------------------------------------------------------------------------

# 📐 Design Principles

### One Workspace

Chat, documents, video, and analytics live inside one application.

### Grounded AI

Document answers are based on retrieved document context.

### User Isolation

User-owned resources are associated with the authenticated account.

### Clear Feedback

The UI uses loading, error, empty, and result states.

### Distinctive Identity

ProbeAI uses a dark cosmic visual language rather than a generic AI
dashboard aesthetic.

------------------------------------------------------------------------

# 🗺️ Future Improvements

Potential future improvements include:

- Streaming AI responses
- Advanced conversation search
- Improved conversation management
- More document formats
- Better chunking/embedding strategies
- Vector database integration
- Enhanced source highlighting
- Persistent video history UI
- Advanced analytics charts
- Automated backend tests
- Automated frontend tests
- Alembic database migrations
- Rate limiting
- Cloud deployment
- Object storage for media
- Production monitoring

------------------------------------------------------------------------

# 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch.
3.  Implement the change.
4.  Test the affected workflow.
5.  Keep credentials out of source control.
6.  Open a pull request with a clear description.

Example:

``` bash
git checkout -b feature/your-feature
git add .
git commit -m "Add your feature"
git push origin feature/your-feature
```

------------------------------------------------------------------------

# 📄 License

Add the actual project license here.

For example:

``` text
MIT License
```

Only claim a license if the corresponding license file is included in
the repository.

------------------------------------------------------------------------

# 👨‍💻 Author

## Onkar Datta Shahapurkar

AI / Full-Stack Developer

### Areas demonstrated by ProbeAI

- Python
- FastAPI
- React
- Vite
- PostgreSQL
- SQLAlchemy
- REST APIs
- JWT authentication
- RAG
- LLM integration
- OpenRouter
- Document processing
- Video transcription
- AI summarization
- Full-stack development
- Responsive UI
- AI product design

Add your public profiles:

``` text
GitHub:   <your-github-url>
LinkedIn: <your-linkedin-url>
Portfolio: <your-portfolio-url>
```

------------------------------------------------------------------------

# 🌌 ProbeAI

> **Explore. Understand. Discover.**

ProbeAI brings conversations, documents, videos, and AI-powered insights
together in one intelligent workspace.
