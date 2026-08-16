# Required Configuration (Names Only)

Provide these values through a secure local or deployment secrets mechanism. Do not put values in source control.

| Name | Purpose |
|---|---|
| `DATABASE_URL` | MySQL-compatible connection string |
| `JWT_SECRET` | Session signing secret |
| `OAUTH_SERVER_URL` | Current OAuth service base URL |
| `VITE_APP_ID` | OAuth client/application ID |
| `VITE_OAUTH_PORTAL_URL` | OAuth browser portal URL |
| `BUILT_IN_FORGE_API_URL` | Current Manus platform API endpoint |
| `BUILT_IN_FORGE_API_KEY` | Current server-side platform API credential |
| `VITE_FRONTEND_FORGE_API_URL` | Current frontend platform API endpoint |
| `VITE_FRONTEND_FORGE_API_KEY` | Current frontend platform API credential |

For a non-Manus move, replace the Manus-specific values with the adopted auth and storage configuration.
