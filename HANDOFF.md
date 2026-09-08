# Handoff — AI Cybersecurity Incident Analysis Agent

## 1. Purpose

This document is the technical handoff for the next coding/AI engineering agent continuing development of the **AI Cybersecurity Incident Analysis Agent / CSAI Incident Analysis Assistant**.

The next agent should treat this as an existing application that already has a working end-to-end investigation flow. The objective is to understand the current architecture, preserve existing functionality and data, verify the current state, and then implement future enhancements incrementally.

**Workspace**

`D:\Workspace\csai-incident-analysis-assistant`

**Primary technologies**

- Python 3.11
- FastAPI
- Uvicorn
- LangChain
- LangGraph
- React
- Vite
- Recharts
- PostgreSQL
- Azure Cosmos DB
- Redis
- Langfuse
- Docker
- Nginx
- OpenRouter

---

## 2. Executive Summary

The application is an AI-powered cybersecurity incident analysis system designed to help security analysts investigate suspicious incidents.

The core investigation is a multi-stage agentic workflow:

```text
Incident
   |
   v
Triage
   |
   v
Log Analysis
   |
   v
Threat Intelligence
   |
   v
Risk Assessment
   |
   v
Persistence
   |
   v
Completed Investigation
```

The frontend provides:

- Dashboard
- Available Incidents
- Manual Investigation
- Completed Investigations
- Investigation Reports
- Investigation Analytics
- Risk Posture
- Platform Health
- Settings
- Light/Dark theme

The backend provides REST APIs through FastAPI and orchestrates the AI investigation workflow through LangGraph/LangChain.

Data responsibilities are intentionally separated:

```text
Cosmos DB
  incidents
      |
      v
GET /incidents
      |
      v
Available Incidents
      |
      v
Manual Investigation
      |
      v
FastAPI + LangGraph
      |
      v
PostgreSQL
  investigations
      |
      v
GET /investigations
      |
      v
Completed Investigations
```

Redis is used for cache/memory-related functionality and Langfuse provides LLM observability.

---

## 3. Critical Handoff Rules

Before changing anything:

- Inspect the existing source code first.
- Do not rewrite the architecture unnecessarily.
- Preserve existing incident data.
- Do not delete the PostgreSQL data volume.
- Do not reset the Cosmos DB emulator unless explicitly required.
- Do not delete completed investigations.
- Keep secrets out of frontend source code and Git.
- Preserve current API contracts unless there is a clear requirement to change them.
- If an API contract changes, inspect both backend consumers and frontend consumers.
- Make small changes and verify each layer.
- For frontend Docker changes, rebuild the image after source changes.
- If Docker caching may be involved, use `--no-cache`.
- After replacing the frontend container, hard-refresh the browser.
- Do not assume a frontend problem is caused by React until the API and browser console have been checked.
- Do not assume a backend problem is caused by LangGraph until the API and repository/database layers have been checked.

Preferred development sequence:

```text
Inspect
  |
Understand
  |
Change minimally
  |
Test
  |
Verify API
  |
Verify UI
  |
Verify Docker
  |
Commit
```

---

# 4. Architecture

```text
                         +----------------------+
                         |       React UI       |
                         |      Vite/Nginx      |
                         +----------+-----------+
                                    |
                                  HTTP
                                    |
                                    v
                         +----------------------+
                         |       FastAPI        |
                         |       Backend        |
                         +----------+-----------+
                                    |
                                    v
                    +------------------------------+
                    |      LangGraph Workflow      |
                    |                              |
                    |  1. Triage                   |
                    |  2. Log Analysis             |
                    |  3. Threat Intelligence      |
                    |  4. Risk Assessment          |
                    |  5. Persistence              |
                    +--------------+---------------+
                                   |
             +---------------------+---------------------+
             |                     |                     |
             v                     v                     v
      +-------------+       +-------------+       +-------------+
      | PostgreSQL  |       |  Cosmos DB  |       |    Redis    |
      |             |       |             |       |             |
      | Investig.   |       |  Incidents  |       | Cache /     |
      | Results     |       |             |       | Memory      |
      +-------------+       +-------------+       +-------------+

                         +----------------------+
                         |       Langfuse       |
                         |     Observability    |
                         +----------------------+
```

---

# 5. Data Ownership

## Cosmos DB

Cosmos DB stores the available cybersecurity incidents.

Container:

```text
incidents
```

The existing dataset contains:

```text
INC-2026-0007
INC-2026-0008
INC-2026-0009
INC-2026-0010
INC-2026-0011
INC-2026-0012
INC-2026-0013
INC-2026-0014
INC-2026-0015
INC-2026-0016
INC-2026-0017
INC-2026-0018
```

These records were already added and verified.

**Do not recreate or delete them unless the user explicitly asks for a dataset reset/change.**

## PostgreSQL

PostgreSQL stores completed investigations.

Important persisted fields include:

```text
id
incident
logs
indicators
severity
triage_result
log_analysis
threat_intelligence
risk_assessment
status
```

The repository `_to_dict()` returns detailed investigation information.

## Redis

Redis is part of the architecture for caching/memory-related functionality.

---

# 6. Investigation Workflow

## 6.1 Triage

Initial incident assessment.

Responsibilities:

- Understand the incident.
- Identify suspicious behavior.
- Determine whether additional investigation is required.
- Assign initial severity/prioritization.

## 6.2 Log Analysis

Examines security logs.

Responsibilities:

- Analyze authentication events.
- Identify suspicious IP addresses.
- Detect unusual activities.
- Identify abnormal patterns.
- Extract useful security observations.

## 6.3 Threat Intelligence

Analyzes indicators of compromise.

Possible indicators:

- IP addresses
- Domains
- Hashes
- Other security indicators

Responsibilities:

- Determine whether indicators appear malicious.
- Add threat context.
- Produce intelligence findings for risk assessment.

## 6.4 Risk Assessment

Combines previous findings.

Expected outputs:

- Risk level
- Risk score
- Overall assessment
- Recommendations

The frontend/API currently uses fields such as:

```text
risk_level
risk_score
risk_assessment
```

## 6.5 Persistence

Stores the final investigation in PostgreSQL.

The persisted investigation should retain enough information to reproduce the completed investigation report.

---

# 7. Backend

Backend root:

```text
app/
```

Main application:

```text
app/main.py
```

Backend URL:

```text
http://localhost:8000
```

Health endpoint:

```http
GET /health
```

Expected response:

```json
{
  "status": "ok",
  "service": "cybersecurity-ai-agent"
}
```

---

# 8. Current API Endpoints

## Health

```http
GET /health
```

Verifies that FastAPI is available.

## Incidents

```http
GET /incidents
```

Retrieves available incidents from Cosmos DB.

## Create Investigation

```http
POST /investigations
```

Starts an investigation.

Before changing the request body, inspect the current FastAPI schema.

## List Investigations

```http
GET /investigations
```

Retrieves completed investigations.

## Investigation Details

```http
GET /investigations/{id}
```

Retrieves a specific completed investigation.

---

# 9. Current Investigation API Model

The current list item model contains:

```python
class InvestigationListItem(BaseModel):
    id: str
    investigation_id: str | None = None
    incident: str | None = None
    logs: str = ""
    indicators: str = ""
    status: str
    risk_level: str | None = None
    risk_score: int | None = None
    risk_assessment: dict[str, Any] | None = None
    created_at: str | None = None
```

The schema requires:

```python
from typing import Any
```

The file was verified with:

```powershell
python -m py_compile .\app\schemas\api.py
```

and compilation succeeded.

---

# 10. Report Modal

The Completed Investigations report was specifically designed to expose:

1. Incident ID
2. Incident
3. Logs
4. Indicators
5. Status
6. Severity
7. Risk Score
8. Raw Output

The report should represent the investigation that was actually persisted.

The current frontend report logic uses the selected investigation and constructs a raw output object containing investigation ID, status and risk assessment.

Before modifying this behavior, inspect the current `openReport()` implementation in `frontend/frontend/src/App.jsx`.

Do not replace backend-provided detailed data with unnecessary frontend-generated approximations.

---

# 11. Frontend

Frontend root:

```text
D:\Workspace\csai-incident-analysis-assistant\frontend\frontend
```

Technology:

- React
- Vite
- JavaScript
- CSS
- Recharts

Development URL:

```text
http://localhost:5173
```

Docker/Nginx URL:

```text
http://localhost:3000
```

For production-style demonstrations, use:

```text
http://localhost:3000
```

---

# 12. Frontend Features

Current dashboard areas include:

- Dashboard
- Available Incidents
- Manual Investigation
- Completed Investigations
- Report modal
- Investigation Analytics
- Risk Posture
- Platform Health
- Settings
- Dark Mode

---

# 13. Theme Implementation

The frontend has a `darkMode` state based on local storage:

```javascript
const [darkMode, setDarkMode] =
  useState(
    localStorage.getItem("csai-theme") === "dark"
  );
```

The application shell uses:

```jsx
<div
  className={`app-shell ${
    darkMode
      ? "theme-dark"
      : "theme-light"
  }`}
>
```

The selected theme is stored using:

```text
csai-theme
```

---

# 14. Settings Routing

The current page routing contains logic equivalent to:

```jsx
{activePage === "Dashboard" ? (
  <Dashboard apiStatus={apiStatus} />
) : activePage === "Settings" ? (
  <SettingsPage
    darkMode={darkMode}
    setDarkMode={setDarkMode}
  />
) : (
  <PlaceholderPage title={activePage} />
)}
```

There may be more than one SettingsPage-related implementation in `App.jsx` because of earlier development changes.

Before refactoring, inspect the complete file and determine which implementation is active.

---

# 15. Recent Dark Theme Work

A substantial amount of work was recently performed to make the dashboard dark-theme consistent.

Areas addressed:

- Completed Investigations View button
- Manual Investigation header/top
- Manual Investigation output
- Platform Health icons
- Platform Health rows/statuses
- Completed Investigations table
- Completed Investigations bottom/pagination
- Investigation Analytics graph cards
- Recharts grid
- Recharts text
- Risk Posture pie-chart center
- Completed investigation card backgrounds

Important selector families include:

```css
.app-shell.theme-dark
```

and:

```css
.app-shell.theme-dark .completed-table button
.app-shell.theme-dark .completed-table .view-button
.app-shell.theme-dark .manual-investigation-card .manual-header
.app-shell.theme-dark .manual-investigation-card .output-panel
.app-shell.theme-dark .manual-investigation-card .manual-output
.app-shell.theme-dark .health-icon
.app-shell.theme-dark .health-row
.app-shell.theme-dark .completed-card
.app-shell.theme-dark .completed-table-wrapper
.app-shell.theme-dark .completed-table
.app-shell.theme-dark .completed-table td
.app-shell.theme-dark .daily-chart-card
.app-shell.theme-dark .risk-chart-card
.app-shell.theme-dark .recharts-cartesian-grid line
.app-shell.theme-dark .recharts-text
.app-shell.theme-dark .pie-total
```

There are dedicated CSS blocks near the end of `App.css`.

**Important:** Do not add more duplicate CSS overrides without inspecting existing specificity and order.

---

# 16. Latest Frontend Docker State

The frontend image was rebuilt successfully with:

```powershell
docker build --no-cache -f .\docker\frontend.Dockerfile -t cybersecurity-ai-agent-frontend:latest .
```

The previous frontend container was stopped and removed.

The new container was started using:

```powershell
docker run -d --name cybersecurity-ai-agent-frontend --network cybersecurity-network -p 3000:80 cybersecurity-ai-agent-frontend:latest
```

Latest known container ID:

```text
e8e8ffe6c09c438681f20f70a29f1b3b83e78bb477e4c2010451def745c9a048
```

The immediate handoff point is to visually verify the latest dark-theme changes at:

```text
http://localhost:3000
```

Use:

```text
Ctrl + Shift + R
```

for a hard refresh.

---

# 17. Frontend Dockerfile

File:

```text
docker/frontend.Dockerfile
```

Current structure:

```dockerfile
FROM node:24-alpine AS build

WORKDIR /app

COPY frontend/frontend/package*.json ./
RUN npm install

COPY frontend/frontend/ ./
RUN npm run build

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html

RUN printf 'server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

# 18. Backend Dockerfile

File:

```text
docker/backend.Dockerfile
```

Current structure:

```dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1     PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip     && pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3     CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health', timeout=3)" || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

# 19. Docker Compose Architecture

The intended Compose configuration is:

```yaml
services:
  backend:
    build:
      context: .
      dockerfile: docker/backend.Dockerfile
    container_name: cybersecurity-ai-agent-backend
    env_file:
      - .env
    environment:
      POSTGRES_HOST: postgres-db
      REDIS_HOST: redis-cache
      COSMOS_ENDPOINT: http://cosmos-emulator:8081
      DATABASE_URL: postgresql://postgres:postgres@postgres-db:5432/cybersecurity_db
    ports:
      - "8000:8000"
    networks:
      - cybersecurity-network

  frontend:
    build:
      context: .
      dockerfile: docker/frontend.Dockerfile
    container_name: cybersecurity-ai-agent-frontend
    depends_on:
      - backend
    ports:
      - "3000:80"
    networks:
      - cybersecurity-network

networks:
  cybersecurity-network:
    external: true
    name: cybersecurity-network
```

External Docker network:

```text
cybersecurity-network
```

---

# 20. Known Containers

Expected container names:

```text
cybersecurity-ai-agent-frontend
cybersecurity-ai-agent-backend
redis-cache
postgres-db
cosmos-emulator
```

Expected ports:

| Service | Port |
|---|---:|
| Frontend | 3000 |
| Backend | 8000 |
| Redis | 6379 |
| PostgreSQL | 5432 |
| Cosmos Emulator | 1234 / 8081 |

Always run `docker ps` before assuming a container is running.

---

# 21. Docker Rebuild Procedure

When frontend source changes:

```powershell
docker build --no-cache -f .\docker\frontend.Dockerfile -t cybersecurity-ai-agent-frontend:latest .
```

Replace the container:

```powershell
docker stop cybersecurity-ai-agent-frontend
docker rm cybersecurity-ai-agent-frontend
docker run -d --name cybersecurity-ai-agent-frontend --network cybersecurity-network -p 3000:80 cybersecurity-ai-agent-frontend:latest
```

Then open:

```text
http://localhost:3000
```

and hard-refresh:

```text
Ctrl + Shift + R
```

If a change is missing, verify source, build output, image, container, and browser cache before rewriting the feature.

---

# 22. `.dockerignore` Important History

The project previously had:

```text
frontend/
```

inside `.dockerignore`.

That caused the frontend Docker build context to exclude the frontend source.

The `frontend/` ignore entry was removed.

The project should continue ignoring:

```text
node_modules/
```

If a future frontend Docker build reports missing:

```text
frontend/frontend/package.json
frontend/frontend/
```

inspect `.dockerignore` first.

---

# 23. Langfuse

Langfuse provides observability for LLM operations.

It is intended to expose:

- Traces
- Token usage
- Latency
- Model calls
- Costs
- Agent execution visibility

The backend was updated to load environment variables using:

```python
from dotenv import load_dotenv

load_dotenv()
```

Environment verification previously confirmed:

```text
PUBLIC: True
SECRET: True
BASE: https://us.cloud.langfuse.com
```

Never expose the Langfuse secret key in frontend code.

---

# 24. Frontend Langfuse Configuration

Frontend file:

```text
frontend/frontend/.env
```

Current project URL:

```env
VITE_LANFUSE_PROJECT_URL=https://us.cloud.langfuse.com/project/cmtgxwfal002dad0cu3gpkah0
```

There is a historical naming inconsistency where `LANFUSE` appears instead of the standard `LANGFUSE`.

Before standardizing naming, search the complete repository for:

```text
LANFUSE
LANGFUSE
```

and update all references together.

Do not expose secret keys through `VITE_` variables.

---

# 25. Environment Variables

Backend configuration includes variables for:

```text
OPENROUTER_API_KEY

POSTGRES_HOST
POSTGRES_PORT
POSTGRES_DB
POSTGRES_USER
POSTGRES_PASSWORD

REDIS_HOST
REDIS_PORT

COSMOS_ENDPOINT
COSMOS_KEY
COSMOS_DATABASE
COSMOS_CONTAINER

LANGFUSE_PUBLIC_KEY
LANGFUSE_SECRET_KEY
LANGFUSE_BASE_URL
```

The exact currently consumed names should be confirmed by searching the repository before changing configuration.

---

# 26. Security Requirements

Never commit:

```text
.env
API keys
database passwords
OpenRouter keys
Langfuse secret keys
private tokens
credentials
```

The frontend should only receive values that are safe to expose in a browser.

For production, future work should add:

- Authentication
- Authorization
- RBAC
- HTTPS
- Secret management
- Input validation
- Rate limiting
- Audit logging
- Secure database access
- Secure external API calls

---

# 27. Database Safety

## PostgreSQL

Important named volume:

```text
postgres-data
```

This contains persistent investigation data.

Do not delete it casually.

Avoid destructive commands such as:

```powershell
docker volume rm postgres-data
```

unless the user explicitly requests a full database reset.

## Cosmos DB Emulator

The emulator contains the existing incident dataset.

Do not reset it to solve ordinary application bugs.

First investigate:

- Endpoint
- Credentials
- Database
- Container
- Query logic
- API behavior
- Container logs

---

# 28. Development Verification

Use the following checks in this order.

## Backend

```text
http://localhost:8000/health
```

Expected:

```json
{
  "status": "ok",
  "service": "cybersecurity-ai-agent"
}
```

## Incidents

```text
http://localhost:8000/incidents
```

Confirm existing incident records are returned.

## Investigations

```text
http://localhost:8000/investigations
```

Confirm completed investigations are returned.

## Frontend

```text
http://localhost:3000
```

Verify the dashboard and workflow.

---

# 29. Recommended Debugging Order

If something fails:

```text
Browser/UI
   |
   v
Frontend API call
   |
   v
FastAPI endpoint
   |
   v
Service layer
   |
   v
LangGraph/agent
   |
   v
Repository
   |
   v
Database/external API
```

For an investigation failure:

```text
POST /investigations
        |
        v
Request validation
        |
        v
Workflow initialization
        |
        v
Triage
        |
        v
Log Analysis
        |
        v
Threat Intelligence
        |
        v
Risk Assessment
        |
        v
Persistence
        |
        v
PostgreSQL
```

Do not jump directly to changing the frontend when the underlying API is failing.

---

# 30. Common Docker Commands

List running containers:

```powershell
docker ps
```

List all containers:

```powershell
docker ps -a
```

Frontend logs:

```powershell
docker logs cybersecurity-ai-agent-frontend
```

Backend logs:

```powershell
docker logs cybersecurity-ai-agent-backend
```

Network inspection:

```powershell
docker network inspect cybersecurity-network
```

Frontend image:

```powershell
docker images cybersecurity-ai-agent-frontend
```

Backend image:

```powershell
docker images cybersecurity-ai-agent-backend
```

---

# 31. Important Project Files

Inspect these first:

```text
app/main.py
app/schemas/api.py
app/
frontend/frontend/src/App.jsx
frontend/frontend/src/App.css
frontend/frontend/package.json
docker/backend.Dockerfile
docker/frontend.Dockerfile
docker-compose.yml
requirements.txt
.env
.dockerignore
```

Then inspect the actual agent/workflow/repository/service directories rather than assuming exact subdirectory names.

---

# 32. Future Enhancement Roadmap

Recommended order:

## Priority 1 — Authentication and RBAC

Add:

- Login
- Analyst role
- Admin role
- Session handling
- API authorization

## Priority 2 — Human-in-the-Loop

Add approval checkpoints before sensitive decisions or automated actions.

Example:

```text
AI Analysis
    |
    v
Risk Assessment
    |
    v
Human Review
   /   /   Approve Reject
```

## Priority 3 — MITRE ATT&CK Mapping

Map observed behavior to:

- Tactics
- Techniques
- Sub-techniques

## Priority 4 — IOC Enrichment

Potential enrichment:

- IP reputation
- Domain reputation
- Hash reputation
- DNS
- WHOIS
- Geolocation
- Threat intelligence feeds

## Priority 5 — SIEM Integration

Potential integrations:

- Microsoft Sentinel
- Splunk
- Elastic
- Wazuh

Example:

```text
SIEM Alert
    |
    v
Incident Ingestion
    |
    v
AI Investigation
    |
    v
Risk Assessment
    |
    v
Human Review
```

## Priority 6 — Automated Response

Potential actions:

- Block malicious IP
- Disable compromised account
- Isolate endpoint
- Create ticket
- Notify SOC team

These actions must have strong authorization and preferably human approval.

## Priority 7 — Agent Evaluation

Measure:

- Triage accuracy
- Risk assessment accuracy
- False positives
- False negatives
- Hallucinations
- Tool-call accuracy
- Latency
- Cost

## Priority 8 — Production Cloud Deployment

Add:

- HTTPS
- Load balancing
- Secret management
- Monitoring
- Centralized logging
- CI/CD
- Backups
- RBAC
- Network security
- Production database configuration

---

# 33. Testing Roadmap

## Backend unit tests

Test:

```text
repositories
services
agents
schemas
risk calculations
```

## API tests

Test:

```text
GET /health
GET /incidents
POST /investigations
GET /investigations
GET /investigations/{id}
```

## Workflow tests

Test:

```text
Triage
Log Analysis
Threat Intelligence
Risk Assessment
Persistence
```

## Frontend tests

Test:

```text
incident selection
investigation submission
report modal
pagination
theme switching
dashboard rendering
API error handling
```

---

# 34. Adding a New Agent

A new agent should have a clearly defined responsibility.

Recommended pattern:

```text
Input
  |
  v
Agent
  |
  +-- Prompt
  +-- Tools
  +-- LLM
  +-- Structured Output
  |
  v
Workflow State
  |
  v
Next Stage
```

When adding an agent:

1. Define input.
2. Define output.
3. Define state changes.
4. Add error handling.
5. Add observability.
6. Add tests.
7. Update persistence if required.
8. Update API schema if exposed.
9. Update frontend if displayed.

Avoid creating an agent that duplicates an existing stage.

---

# 35. Workflow State

The workflow state conceptually contains:

```python
state = {
    "incident": ...,
    "logs": ...,
    "indicators": ...,
    "triage_result": ...,
    "log_analysis": ...,
    "threat_intelligence": ...,
    "risk_assessment": ...,
}
```

When adding a new state field, check all affected layers:

```text
State definition
    |
Agent
    |
Workflow
    |
Persistence
    |
API schema
    |
Frontend
    |
Tests
```

---

# 36. API Contract Discipline

Before changing an API response:

1. Inspect backend schemas.
2. Inspect repository output.
3. Inspect frontend API consumption.
4. Identify all dependent fields.
5. Make backward-compatible changes where practical.
6. Test the endpoint directly.
7. Test the UI.

Do not rename fields simply for style.

---

# 37. Performance Considerations

Potential bottlenecks:

- LLM latency
- Threat intelligence calls
- Database queries
- Large security logs
- Repeated API calls

Possible improvements:

- Redis caching
- Async operations
- Parallel independent enrichment calls
- Pagination
- Database indexes
- Streaming investigation status
- Background workers

Do not parallelize workflow stages when one stage depends on the output of another.

---

# 38. Observability Roadmap

Ideally Langfuse traces should correlate with an investigation ID:

```text
Investigation ID
     |
     +-- Triage
     |
     +-- Log Analysis
     |
     +-- Threat Intelligence
     |
     +-- Risk Assessment
     |
     +-- Final Result
```

Useful observability fields:

- Investigation ID
- Model
- Input tokens
- Output tokens
- Total tokens
- Cost
- Latency
- Errors
- Number of LLM calls

---

# 39. Recommended Demo Flow

For a project demonstration:

```text
1. Open http://localhost:3000
2. Show Dashboard
3. Open Available Incidents
4. Select an incident
5. Start Manual Investigation
6. Explain the LangGraph stages
7. Show the risk assessment
8. Open Completed Investigations
9. Open a report
10. Show incident ID, incident, logs, indicators, status, severity, risk score and raw output
11. Show Investigation Analytics
12. Show Risk Posture
13. Show Platform Health
14. Demonstrate Dark Mode
15. Explain Langfuse observability
16. Explain Docker deployment
```

---

# 40. Interview Explanation

A concise explanation of the project:

> This project is an AI-powered cybersecurity incident analysis assistant built using a multi-stage agentic workflow. FastAPI is used for the backend, React is used for the frontend, and LangGraph orchestrates the investigation stages. The workflow performs triage, log analysis, threat intelligence, risk assessment and persistence. Cosmos DB stores available incidents, PostgreSQL stores completed investigations, Redis provides caching or memory functionality, and Langfuse provides observability for LLM calls, token usage, latency and cost. The application is containerized with Docker and the production frontend is served through Nginx.

---

# 41. Git Workflow

Before major changes:

```powershell
git status
```

Create a clean checkpoint.

Recommended commit prefixes:

```text
feat:
fix:
refactor:
docs:
test:
chore:
```

Examples:

```text
feat: add MITRE ATT&CK mapping
fix: correct investigation report fields
feat: add SIEM ingestion
docs: update deployment guide
test: add risk assessment workflow tests
```

---

# 42. Do Not Perform Without Explicit Approval

Avoid these operations unless explicitly requested:

```text
Delete PostgreSQL volumes
Reset Cosmos DB
Delete incident records
Delete completed investigations
Rotate credentials
Change production ports
Remove Redis
Remove Langfuse instrumentation
Replace the LangGraph architecture
```

---

# 43. First-Day Checklist for the Next Coding Agent

Run:

```powershell
cd D:\Workspace\csai-incident-analysis-assistant
git status
docker ps
python --version
docker --version
docker compose version
```

Then verify:

```text
http://localhost:8000/health
http://localhost:8000/incidents
http://localhost:8000/investigations
http://localhost:3000
```

Then inspect:

```text
app/main.py
app/schemas/api.py
frontend/frontend/src/App.jsx
frontend/frontend/src/App.css
docker-compose.yml
docker/backend.Dockerfile
docker/frontend.Dockerfile
```

Only after these checks should enhancement work begin.

---

# 44. Current Handoff Point

The current application has recently undergone frontend dark-theme improvements.

The latest frontend Docker image was rebuilt using:

```powershell
docker build --no-cache -f .\docker\frontend.Dockerfile -t cybersecurity-ai-agent-frontend:latest .
```

The old frontend container was removed and the new frontend container was started successfully.

Current production frontend:

```text
http://localhost:3000
```

The immediate verification task is to visually inspect:

- Completed Investigations View button
- Completed Investigations pagination/footer
- Platform Health cards and icons
- Manual Investigation header and output
- Investigation Analytics graphs
- Risk Posture pie-chart center

If these are correct, the project can proceed to the next enhancement.

---

# 45. Final Handoff Principle

**Do not treat this project as a blank project.**

It already has:

```text
React Frontend
      +
FastAPI Backend
      +
LangGraph/LangChain Workflow
      +
PostgreSQL
      +
Cosmos DB
      +
Redis
      +
Langfuse
      +
Docker
```

The safest approach is:

```text
Understand existing implementation
            |
            v
Preserve existing data
            |
            v
Make one focused enhancement
            |
            v
Test backend
            |
            v
Test frontend
            |
            v
Test Docker
            |
            v
Verify user workflow
            |
            v
Commit
```

The next coding agent should maintain backward compatibility, protect existing data, preserve the investigation workflow, and document every major architectural change.

---

# END OF HANDOFF
