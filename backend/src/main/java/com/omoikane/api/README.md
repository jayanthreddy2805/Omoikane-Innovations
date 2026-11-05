# Backend package map

| Package | Responsibility |
|---|---|
| `admin` | Admin authentication and management endpoints |
| `careers` | Career request, validation, persistence and API endpoint |
| `contact` | Contact request, persistence and API endpoint |
| `subscription` | Email subscription, reactivation and unsubscribe workflow |
| `email` | Shared Resend email delivery |
| `common.config` | Cross-cutting security, CORS, rate limiting and errors |
| `common.dto` | Response types shared by multiple APIs |

Each feature owns its controller, request models, persistence model, repository and service. Tests use the same feature package under `src/test/java`.

`OmoikaneApiApplication.java` is the only backend entry point.
