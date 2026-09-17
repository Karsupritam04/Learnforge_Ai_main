# LearnForge AI — AI-Powered Course Generator

Turn any topic into a structured, multi-module course: type a prompt like *"Intro to React
Hooks"*, get a full syllabus with modules, lessons, objectives, code samples, embedded videos,
and quizzes.

Stack: **Java 17 + Spring Boot 3 + MongoDB** (backend) and **React 18 + Vite + Tailwind**
(frontend), matching the hackathon brief's Java/React variant.

```
project-root/
├── server/   # Spring Boot API → deploy to Render (or any Java host)
└── client/   # React app → deploy to Vercel
```

## What's implemented

| Area | Status |
|---|---|
| Prompt → course outline → persisted course/module/lesson tree  |
| AI generation layer, pluggable (`ai.provider`) |  rule-based (zero-config) + OpenAI |
| Lazy lesson content generation (content generated on first open) |
| MongoDB persistence (Course / Module / Lesson schemas)  |
| React syllabus + lesson viewer, block-based lesson renderer  |
| MCQ blocks (interactive, with explanations)  |
| Code blocks, video blocks  |
| YouTube Data API integration for video blocks | (needs `YOUTUBE_API_KEY`) |
| PDF export of a lesson (html2canvas + jsPDF)  |
| Auth0 login/logout, JWT-protected routes | (needs Auth0 app credentials) |
| Hinglish translation + TTS narration (Gemini) | endpoint wired (needs `GEMINI_API_KEY`) |


The app runs **completely out of the box with no API keys**: the default AI provider is a
deterministic rule-based generator, Auth0 is optional (backend runs in an open dev-mode
security config until you set `AUTH0_ISSUER`), and YouTube/Gemini features degrade gracefully
(a friendly "unavailable" state) when their keys aren't set.

---

## 1. Run the backend

Requirements: JDK 17+, Maven, a MongoDB instance (local `mongod` or a free MongoDB Atlas
cluster).

```bash
cd server
# Point at your Mongo instance (defaults to mongodb://localhost:27017/text_to_learn)
export MONGO_URI="mongodb://localhost:27017/text_to_learn"

mvn spring-boot:run
```

> This repo doesn't ship the Maven wrapper (`mvnw`) — generate one locally with
> `mvn -N wrapper:wrapper` if you'd rather not rely on a system-installed Maven, especially
> before deploying to Render.

The API starts on `http://localhost:5000`. Sanity check:

```bash
curl http://localhost:5000/api/health
curl -X POST http://localhost:5000/api/generate-course \
  -H "Content-Type: application/json" \
  -d '{"topic":"Intro to React Hooks"}'
```

### Backend environment variables

| Variable | Required? | Purpose |
|---|---|---|
| `PORT` | no (default 5000) | server port |
| `MONGO_URI` | yes | MongoDB connection string |
| `AI_PROVIDER` | no (default `rule-based`) | `rule-based` or `openai` |
| `OPENAI_API_KEY` | only if `AI_PROVIDER=openai` | OpenAI API key |
| `OPENAI_MODEL` | no (default `gpt-4o-mini`) | chat model to use |
| `AUTH0_ISSUER` | no | e.g. `https://your-tenant.auth0.com/` — leave unset to run open |
| `AUTH0_AUDIENCE` | no | your Auth0 API identifier |
| `YOUTUBE_API_KEY` | no | enables real video results in lesson video blocks |
| `GEMINI_API_KEY` | no | enables `/api/narrate` (Hinglish translation + TTS) |
| `CORS_ORIGINS` | no (default `http://localhost:5173`) | comma-separated allowed origins |

## 2. Run the frontend

Requirements: Node 18+.

```bash
cd client
cp .env.example .env   # then edit as needed
npm install
npm run dev
```

Opens on `http://localhost:5173`.

### Frontend environment variables (`client/.env`)

| Variable | Required? | Purpose |
|---|---|---|
| `VITE_API_URL` | yes | backend base URL, e.g. `http://localhost:5000` |
| `VITE_AUTH0_DOMAIN` | no | enables Auth0 login when set together with client id |
| `VITE_AUTH0_CLIENT_ID` | no | " |
| `VITE_AUTH0_AUDIENCE` | no | should match the backend's `AUTH0_AUDIENCE` |

---

## Project structure

```
server/
  src/main/java/com/texttolearn/
    model/         Course, CourseModule, Lesson, ContentBlock (Mongo documents)
    repository/    Spring Data Mongo repositories
    service/       AiCourseGeneratorService (interface)
                     ├── RuleBasedCourseGeneratorService (default, no key needed)
                     └── OpenAiCourseGeneratorService (ai.provider=openai)
                   CourseGenerationService (orchestrates generation + persistence)
                   YouTubeService, HinglishNarrationService
    controller/    REST endpoints (course, lesson, generate, youtube, narrate, health)
    config/        CORS, Security (Auth0-aware), Mongo auditing
    exception/     Centralized error handling
    dto/           Request/response shapes

client/
  src/
    components/    Sidebar, PromptForm, LessonRenderer, LessonPDFExporter,
                    LoadingSpinner, ErrorMessage
    components/blocks/  HeadingBlock, ParagraphBlock, CodeBlock, VideoBlock, MCQBlock
    pages/         Home, MyCourses, Course, Lesson, Login, Signup
    hooks/         useAuth (thin Auth0 wrapper, no-ops when unconfigured)
    utils/api.js   axios client + typed API calls
```

## How generation works (Milestone 8)

1. `POST /api/generate-course { topic }` calls `AiCourseGeneratorService.generateCourseOutline`,
   which returns `{ title, description, tags, modules: [{ title, lessonTitles[] }] }`. This is
   persisted immediately as a `Course` + `CourseModule`s + empty `Lesson` stubs, so the syllabus
   renders instantly.
2. When a lesson is opened (`GET /api/lessons/{id}`), if it hasn't been enriched yet the backend
   calls `AiCourseGeneratorService.generateLessonContent(course, module, lesson)`, which returns
   objectives + a content block array (`heading`, `paragraph`, `code`, `video`, `mcq`), persists
   it, and flips `isEnriched = true`. This keeps AI token usage proportional to what a learner
   actually opens instead of generating every lesson in a course up front.

Swap generators by setting `AI_PROVIDER=openai` (or add another implementation of
`AiCourseGeneratorService`, e.g. for Hugging Face — the interface is the extension point).

## Extending further

- **Hugging Face provider**: add a new `@Service` implementing `AiCourseGeneratorService`,
  guarded by `@ConditionalOnProperty(name = "ai.provider", havingValue = "huggingface")`,
  mirroring `OpenAiCourseGeneratorService`.
- **CI/CD**: add `.github/workflows/backend.yml` (build + `mvn -B verify`, then deploy to
  Render via their deploy hook) and `.github/workflows/frontend.yml` (`npm ci && npm run build`,
  then let Vercel's GitHub integration handle deploy-on-push).
- **PDF export of a whole course/module**: `LessonPDFExporter` captures one lesson's DOM;
  extend it to loop over a module's lessons and append pages to the same `jsPDF` instance.

## Deployment

Follow Milestone 12 in the original roadmap: backend → Render (root dir `server`, build
`mvn clean package -DskipTests`, start `java -jar target/text-to-learn-backend.jar`),
frontend → Vercel (root dir `client`, framework preset "Vite"). Set the environment variables
from the tables above in each platform's dashboard.
