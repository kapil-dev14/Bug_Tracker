# 3. Lock Down the API Contract

When building the frontend, you need to know **exactly** what endpoints exist, what payload to send, and what response to expect.

Below is a quick reference map of the core API endpoints for the **Bug Tracker API**.

---

# 🔐 Authentication Endpoints (`/api/auth`)

| Method   | Endpoint    | Access  | Request Body                      | Success Response                 |
| -------- | ----------- | ------- | --------------------------------- | -------------------------------- |
| **POST** | `/register` | Public  | `{ name, email, password, role }` | `{ success: true, token, user }` |
| **POST** | `/login`    | Public  | `{ email, password }`             | `{ success: true, token, user }` |
| **GET**  | `/me`       | Private | `Authorization: Bearer <token>`   | `{ success: true, data: user }`  |

---

# 📁 Project Endpoints (`/api/projects`)

| Method     | Endpoint | Access               | Description                                           |
| ---------- | -------- | -------------------- | ----------------------------------------------------- |
| **GET**    | `/`      | Private              | Get all projects the authenticated user has access to |
| **POST**   | `/`      | Admin / Project Lead | Create a new project                                  |
| **GET**    | `/:id`   | Private              | Get details of a specific project                     |
| **PUT**    | `/:id`   | Admin / Project Lead | Update project information                            |
| **DELETE** | `/:id`   | Admin                | Delete a project                                      |

---

# 👥 Team Member Endpoints (`/api/projects/:projectId/members`)

| Method     | Endpoint     | Access               | Description                    |
| ---------- | ------------ | -------------------- | ------------------------------ |
| **GET**    | `/`          | Private              | Get all members of a project   |
| **POST**   | `/`          | Admin / Project Lead | Add a member to a project      |
| **PUT**    | `/:memberId` | Admin / Project Lead | Update a member's role         |
| **DELETE** | `/:memberId` | Admin / Project Lead | Remove a member from a project |

---

# 🐛 Bug Endpoints (`/api/bugs`)

| Method     | Endpoint | Access            | Description                                                         |
| ---------- | -------- | ----------------- | ------------------------------------------------------------------- |
| **GET**    | `/`      | Private           | Get filtered & paginated bugs (`?status=Open&priority=High&page=1`) |
| **POST**   | `/`      | Private           | Create a new bug ticket                                             |
| **GET**    | `/:id`   | Private           | Get a single bug with comments and attachments                      |
| **PUT**    | `/:id`   | Developer / Admin | Update status, priority, assignee, or other editable fields         |
| **DELETE** | `/:id`   | Admin             | Delete a bug ticket                                                 |

---

# 💬 Comment Endpoints (`/api/bugs/:bugId/comments`)

| Method     | Endpoint      | Access                | Description                |
| ---------- | ------------- | --------------------- | -------------------------- |
| **GET**    | `/`           | Private               | Get all comments for a bug |
| **POST**   | `/`           | Private               | Add a comment to a bug     |
| **PUT**    | `/:commentId` | Comment Owner / Admin | Edit a comment             |
| **DELETE** | `/:commentId` | Comment Owner / Admin | Delete a comment           |

---

# 📎 Attachment Endpoints (`/api/bugs/:bugId/attachments`)

| Method     | Endpoint         | Access        | Description                    |
| ---------- | ---------------- | ------------- | ------------------------------ |
| **POST**   | `/`              | Private       | Upload one or more attachments |
| **GET**    | `/`              | Private       | Get all attachments for a bug  |
| **DELETE** | `/:attachmentId` | Owner / Admin | Remove an attachment           |

---

<!-- # 🔔 Notification Endpoints (`/api/notifications`)

| Method  | Endpoint    | Access  | Description                      |
| ------- | ----------- | ------- | -------------------------------- |
| **GET** | `/`         | Private | Get current user's notifications |
| **PUT** | `/:id/read` | Private | Mark a notification as read      |
| **PUT** | `/read-all` | Private | Mark all notifications as read   | -->

---

# 📊 Dashboard & Analytics (`/api/dashboard`)

| Method  | Endpoint                 | Access  | Description                                        |
| ------- | ------------------------ | ------- | -------------------------------------------------- |
| **GET** | `/stats`                 | Private | Get dashboard statistics using MongoDB aggregation |
| **GET** | `/project-summary`       | Private | Get project-wise bug summary                       |
| **GET** | `/developer-performance` | Admin   | Get developer workload and performance metrics     |
| **GET** | `/recent-activity`       | Private | Get recent bug activity timeline                   |

---

# 👤 User Endpoints (`/api/users`)

| Method     | Endpoint | Access        | Description          |
| ---------- | -------- | ------------- | -------------------- |
| **GET**    | `/`      | Admin         | Get all users        |
| **GET**    | `/:id`   | Private       | Get a user's profile |
| **PUT**    | `/:id`   | Owner / Admin | Update user profile  |
| **DELETE** | `/:id`   | Admin         | Delete a user        |

---

<!--
# 🏷️ Label & Category Endpoints (`/api/labels`)

| Method     | Endpoint | Access  | Description        |
| ---------- | -------- | ------- | ------------------ |
| **GET**    | `/`      | Private | Get all labels     |
| **POST**   | `/`      | Admin   | Create a new label |
| **PUT**    | `/:id`   | Admin   | Update a label     |
| **DELETE** | `/:id`   | Admin   | Delete a label     | -->
