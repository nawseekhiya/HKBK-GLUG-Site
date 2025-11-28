# API Documentation

Base URL: `/api`

## Error Handling

All API errors follow a standard JSON structure:

```json
{
  "status": "error",
  "code": "ERROR_CODE",
  "message": "Human readable message",
  "details": null // Optional details object or array
}
```

### Common Error Codes

| Status | Code | Description |
| :--- | :--- | :--- |
| 400 | `BAD_REQUEST` | Invalid request format or parameters |
| 400 | `VALIDATION_ERROR` | Request validation failed (details contains field errors) |
| 401 | `UNAUTHORIZED` | Authentication required or invalid token |
| 403 | `FORBIDDEN` | Authenticated user does not have permission |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Resource conflict (e.g., duplicate email) |
| 500 | `INTERNAL_SERVER_ERROR` | Unexpected server error |

## Events

### List Events

`GET /api/events`

**Query Parameters:**
-   `page`: Page number (default: 1)
-   `limit`: Items per page (default: 20)
-   `sort`: Sort field and order (e.g., `date:asc`, `date:desc`) (default: `date:asc`)
-   `upcoming`: Filter upcoming events (`true` or `false`)
-   `tag`: Filter by tag

**Response:**
```json
{
  "data": [
    {
      "_id": "...",
      "title": "Event Title",
      "date": "2023-10-27T10:00:00.000Z",
      ...
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 10,
    "totalPages": 1
  }
}
```

### Get Event

`GET /api/events/:id`

**Response:**
```json
{
  "_id": "...",
  "title": "Event Title",
  ...
}
```

**Errors:**
-   `404 Not Found`: If event does not exist or is deleted.

### Create Event

`POST /api/events`

**Body:**
```json
{
  "title": "Event Title", // Required
  "date": "2023-10-27T10:00:00.000Z", // Required, ISO Date
  "description": "Description...",
  "venue": "Venue Name",
  "capacity": 100,
  "tags": ["tag1", "tag2"],
  "banner": "http://example.com/image.jpg"
}
```

**Response:**
-   `201 Created`: Returns created event.

**Errors:**
-   `400 Bad Request`: Validation error.

### Update Event

`PUT /api/events/:id`

**Body:** (Partial updates allowed)
```json
{
  "title": "Updated Title"
}
```

**Response:**
-   `200 OK`: Returns updated event.

### Delete Event

`DELETE /api/events/:id`

**Response:**
-   `204 No Content`

**Notes:**
-   Soft delete is implemented. Deleted events are not returned in list or get operations.
