# API Documentation

Base URL: `/api`

## Authentication

Authentication is handled via JSON Web Tokens (JWT).

-   **Access Token**: Short-lived (15 minutes). Sent in `Authorization` header as `Bearer <token>`.
-   **Refresh Token**: Long-lived (7 days). Used to obtain new access tokens.

### Register

`POST /api/auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "githubUsername": "johndoe"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": { ... }
  }
}
```

### Login

`POST /api/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": { ... },
    "accessToken": "eyJ...",
    "refreshToken": "7f8..."
  }
}
```

### Refresh Token

`POST /api/auth/refresh`

**Body:**
```json
{
  "refreshToken": "7f8..."
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "new_refresh_token..."
  }
}
```

### Logout

`POST /api/auth/logout`

**Body:**
```json
{
  "refreshToken": "7f8..."
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

### Get Current User

`GET /api/auth/me`

**Headers:**
`Authorization: Bearer <access_token>`

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": { ... }
  }
}
```

## Error Handling

Standard error response:
```json
{
  "status": "error",
  "code": "ERROR_CODE",
  "message": "Message"
}
```

Common Auth Errors:
-   `401 UNAUTHORIZED`: Invalid or expired token.
-   `403 FORBIDDEN`: Insufficient permissions.

## Events

### List Events
`GET /api/events`
... (Standard CRUD endpoints as before)

## Registrations

### Register User (Authenticated)

`POST /api/events/:eventId/register`

**Headers:**
`Authorization: Bearer <access_token>`

**Body:**
```json
{
  "meta": {
    "tShirtSize": "L",
    "dietaryRestrictions": "None"
  }
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "registrationId": "60d5ec...",
    "status": "pending",
    "registeredAt": "2023-01-01T12:00:00Z"
  }
}
```

**Errors:**
- `400 Bad Request`: Validation error or Event full.
- `409 Conflict`: User already registered.

### Register Guest

`POST /api/events/:eventId/register-guest`

**Body:**
```json
{
  "name": "Guest Name",
  "email": "guest@example.com",
  "phone": "1234567890",
  "usn": "1HK19CS001",
  "meta": {
    "source": "web"
  }
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "registrationId": "60d5ec...",
    "status": "pending",
    "registeredAt": "2023-01-01T12:00:00Z"
  }
}
```

**Errors:**
- `400 Bad Request`: Validation error or Event full.
- `409 Conflict`: Email already registered.
