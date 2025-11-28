# Database Schema Documentation

## Models

### User

Stores user profile and authentication information.

| Field | Type | Required | Default | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `name` | String | Yes | - | Trimmed |
| `email` | String | Yes | - | Unique, Trimmed, Lowercase, Regex validated |
| `passwordHash` | String | Yes | - | **Never log this** |
| `avatar` | String | No | "" | URL to avatar image |
| `bio` | String | No | "" | User biography |
| `githubUsername` | String | No | "" | GitHub profile username |
| `role` | String | No | "user" | Enum: "user", "admin" |
| `joinedAt` | Date | No | Date.now | - |
| `createdAt` | Date | - | - | Auto-generated |
| `updatedAt` | Date | - | - | Auto-generated |

**Indexes:**
-   `{ email: 1 }` (Unique)

**Transforms:**
-   `toJSON`: Removes `passwordHash` and `__v`.

### Event

Stores event details.

| Field | Type | Required | Default | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `title` | String | Yes | - | Trimmed |
| `description` | String | No | "" | - |
| `date` | Date | Yes | - | - |
| `venue` | String | No | "TBD" | - |
| `capacity` | Number | No | 0 | Min: 0 |
| `tags` | [String] | No | [] | Array of strings |
| `banner` | String | No | "" | URL to banner image |
| `createdAt` | Date | - | - | Auto-generated |
| `updatedAt` | Date | - | - | Auto-generated |

**Indexes:**
-   `{ date: 1 }` (For querying by date)
