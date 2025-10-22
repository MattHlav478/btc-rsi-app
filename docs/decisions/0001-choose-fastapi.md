# ADR 0001: Choose FastAPI for Backend Framework

## Status
Accepted

## Context
We need a modern, async-first web framework capable of serving RESTful endpoints and integrating with external APIs. Developer productivity and type safety are priorities.

## Decision
Adopt **FastAPI** as the primary backend framework. It offers automatic OpenAPI generation, excellent Pydantic integration, and strong async support.

## Consequences
- Simplifies schema validation via Pydantic models.
- Enables rapid prototyping of REST endpoints.
- Requires ASGI server (e.g., Uvicorn) for deployment.
