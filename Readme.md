# Trackwork — Bug Tracker API

REST API for a bug & ticket tracking system, built with Node.js, Express, and MongoDB. Supports JWT authentication, project/team management, defect (bug) reports with file attachments and comment threads, and a separate lightweight ticket/task board.

## Tech stack

- **Runtime:** Node.js (ESM) + Express 5
- **Database:** MongoDB via Mongoose
- **Auth:** JWT (access + refresh tokens, sent as httpOnly cookies and in the response body)
- **File uploads:** Multer → Cloudinary
- **Validation:** Zod (bug creation)
- **Security:** Helmet, CORS

## Getting started

```bash
npm install
cp .env.example .env   # fill in the values below
npm run dev             # nodemon src/index.js
```

The server logs its port and Mongo connection status on boot.

### Environment variables

| Variable                                                                 | Description                                                   |
| ------------------------------------------------------------------------ | ------------------------------------------------------------- |
| `PORT`                                                                   | Port the server listens on                                    |
| `CORS_ORIGIN`                                                            | Origin allowed to call the API (e.g. your frontend's dev URL) |
| `MONGODB_URI`                                                            | MongoDB connection string                                     |
| `NODE_ENV`                                                               | `development` / `production`                                  |
| `ACCESS_TOKEN_SECRET` / `ACCESS_TOKEN_EXPIRY`                            | JWT access token secret + lifetime                            |
| `REFRESH_TOKEN_SECRET` / `REFRESH_TOKEN_EXPIRY`                          | JWT refresh token secret + lifetime                           |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary credentials for bug attachment uploads             |

## API overview

Base URL: `/api/v1`

### Auth — `/auth`

| Method | Route       | Description                                                             |
| ------ | ----------- | ----------------------------------------------------------------------- |
| POST   | `/register` | `{ username, email, fullname, password, role? }`                        |
| POST   | `/login`    | `{ email\|username, password }` → `{ user, accessToken, refreshToken }` |

### Projects — `/projects` _(JWT required)_

| Method | Route                           | Description                                                      |
| ------ | ------------------------------- | ---------------------------------------------------------------- |
| POST   | `/`                             | Create a project                                                 |
| GET    | `/`                             | List projects you own or are a member of                         |
| PATCH  | `/:projectId`                   | Update name/description (owner only)                             |
| DELETE | `/:projectId`                   | Delete a project (owner only)                                    |
| POST   | `/:projectId/members`           | Add a member by `{ identifier }` (username or email, owner only) |
| DELETE | `/:projectId/members/:memberId` | Remove a member (owner only)                                     |

### Bugs — defect reports with attachments + comments

| Method | Route                               | Description                                                                                      |
| ------ | ----------------------------------- | ------------------------------------------------------------------------------------------------ |
| POST   | `/projects/:projectId/bugs`         | Create (multipart, up to 5 `attachments` files) — `{ title, description, priority, assignedTo }` |
| GET    | `/projects/:projectId/bugs`         | List — query: `page, limit, status, priority, search, sortBy, sortOrder`                         |
| GET    | `/projects/:projectId/bugs/summary` | Aggregate counts: total/open/in-progress/resolved/critical                                       |
| GET    | `/bugs/:bugId`                      | Fetch one                                                                                        |
| PATCH  | `/bugs/:bugId`                      | Update (status, priority, assignedTo, etc.)                                                      |
| DELETE | `/bugs/:bugId`                      | Delete (creator or project owner only)                                                           |

Status enum: `OPEN / IN_PROGRESS / RESOLVED`. Priority enum: `LOW / MEDIUM / HIGH / CRITICAL`. `assignedTo` accepts a username or email and is resolved to a user ID server-side.

### Tickets — lightweight task/work-item board

| Method | Route                         | Description                                          |
| ------ | ----------------------------- | ---------------------------------------------------- |
| POST   | `/tickets/project/:projectId` | Create — requires you to already be a project member |
| GET    | `/tickets/project/:projectId` | List — query: `page, limit, status, priority`        |
| GET    | `/tickets/:ticketId`          | Fetch one                                            |
| PATCH  | `/tickets/:ticketId`          | Update                                               |
| DELETE | `/tickets/:ticketId`          | Delete (creator or project owner only)               |

Status enum: `Open / In Progress / Under Review / Resolved`. Priority enum: `Low / Medium / High / Critical`. Note the different casing from Bugs — Bugs and Tickets are intentionally separate systems.

### Comments — on bugs only

| Method | Route                   | Description                   |
| ------ | ----------------------- | ----------------------------- |
| POST   | `/bugs/:bugId/comments` | Add a comment — `{ content }` |
| GET    | `/bugs/:bugId/comments` | List comments on a bug        |
| DELETE | `/comments/:commentId`  | Delete (author only)          |

## Project structure

```
src/
  app.js, index.js         Express app + entrypoint
  routes/                  one router per resource
  controllers/              request handling
  services/                  business logic / DB queries
  models/                    Mongoose schemas
  middleware/               auth, role (project-owner), multer, error handling
  validators/                Zod schemas
  utils/                     ApiError, ApiResponse, asyncHandler, cloudinary, resolveUser
```

## Known limitations

- No global admin role enforcement yet — permissions are project-scoped (owner vs. member), not tied to a user's `role` field.
- Deleting a project does not cascade-delete its bugs/tickets.
- No user search/listing endpoint beyond the username/email lookup used internally for adding members and assigning bugs/tickets.
