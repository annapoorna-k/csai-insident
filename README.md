# 🛡️ AI Cybersecurity Incident Analysis Agent

An AI-powered cybersecurity incident analysis system that automatically analyzes suspicious security incidents, evaluates their severity and risk, and provides security analysts with structured investigation results.

The system uses a **multi-stage agentic workflow** built with **LangGraph and LangChain**, with a FastAPI backend and React frontend.

---

## 🚀 Project Overview

Cybersecurity teams receive large numbers of security alerts and incidents every day. Manually investigating every alert can be time-consuming and may delay the response to high-risk threats.

This project provides an AI-powered assistant that helps security analysts:

- Analyze cybersecurity incidents
- Examine security logs
- Identify and analyze indicators of compromise (IOCs)
- Perform threat intelligence analysis
- Assess incident severity
- Calculate risk scores
- Store investigation results
- Review completed investigations
- Monitor application and service health
- Observe LLM usage, latency, tokens, and costs

The system follows a **multi-stage agentic investigation workflow** where each stage performs a specific security analysis task.

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │      React UI        │
                         │     Frontend         │
                         └──────────┬───────────┘
                                    │
                                    │ HTTP / REST
                                    ▼
                         ┌──────────────────────┐
                         │      FastAPI         │
                         │       Backend        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                    ┌──────────────────────────────┐
                    │       LangGraph Workflow     │
                    │                              │
                    │  1. Triage                   │
                    │  2. Log Analysis             │
                    │  3. Threat Intelligence      │
                    │  4. Risk Assessment          │
                    │  5. Persistence              │
                    └──────────────┬───────────────┘
                                   │
             ┌─────────────────────┼─────────────────────┐
             │                     │                     │
             ▼                     ▼                     ▼
      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
      │ PostgreSQL  │      │   Cosmos DB │      │    Redis    │
      │             │      │             │      │             │
      │ Investig.   │      │ Incidents   │      │ Cache /     │
      │ Results     │      │             │      │ Memory      │
      └─────────────┘      └─────────────┘      └─────────────┘

                         ┌──────────────────────┐
                         │      Langfuse        │
                         │    Observability     │
                         └──────────────────────┘