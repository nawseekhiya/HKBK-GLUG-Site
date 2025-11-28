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

### EventRegistration

Tracks authenticated user registrations for events.

| Field | Type | Required | Default | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `event` | ObjectId | Yes | - | Ref: Event |
| `user` | ObjectId | Yes | - | Ref: User |
| `registeredAt` | Date | No | Date.now | - |
| `checkInStatus` | String | No | "pending" | Enum: "pending", "checked-in", "cancelled", "no-show" |
| `meta` | Map | No | - | Key-value pairs for extra info |
| `createdAt` | Date | - | - | Auto-generated |
| `updatedAt` | Date | - | - | Auto-generated |

**Indexes:**
-   `{ event: 1, user: 1 }` (Unique)
-   `{ event: 1 }`

### GuestRegistration

Tracks guest (non-authenticated) registrations for events.

| Field | Type | Required | Default | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `event` | ObjectId | Yes | - | Ref: Event |
| `name` | String | Yes | - | Trimmed |
| `email` | String | Yes | - | Trimmed, Lowercase, Regex validated |
| `phone` | String | No | - | Trimmed |
| `usn` | String | No | - | Trimmed, Uppercase |
| `registeredAt` | Date | No | Date.now | - |
| `checkInStatus` | String | No | "pending" | Enum: "pending", "checked-in", "cancelled", "no-show" |
| `meta` | Map | No | - | Key-value pairs for extra info |
| `createdAt` | Date | - | - | Auto-generated |
| `updatedAt` | Date | - | - | Auto-generated |

**Indexes:**
-   `{ event: 1, email: 1 }` (Unique)
-   `{ event: 1 }`

### RefreshToken

Stores JWT refresh tokens.

| Field | Type | Required | Default | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `user` | ObjectId | Yes | - | Ref: User |
| `tokenHash` | String | Yes | - | SHA-256 hash |
| `expiresAt` | Date | Yes | - | - |
| `revokedAt` | Date | No | - | - |
| `replacedByTokenHash` | String | No | - | For rotation chains |
| `createdAt` | Date | - | - | Auto-generated |
| `updatedAt` | Date | - | - | Auto-generated |

**Indexes:**
-   `{ user: 1 }`
-   `{ expiresAt: 1 }` (TTL Index)
