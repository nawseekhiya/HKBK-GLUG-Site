# Background Jobs

The server includes background processes for handling asynchronous tasks and scheduled operations.

## Mail Queue Worker

The mail worker processes emails from the `EmailQueue` collection. It handles sending emails via the configured provider (e.g., SendGrid) with retry logic and exponential backoff.

### Running the Worker

```bash
npm run worker
```

### Configuration

-   `WORKER_CONCURRENCY`: Number of emails to process in parallel (default: 1).
-   `MAX_EMAIL_ATTEMPTS`: Maximum number of retry attempts before marking as failed (default: 5).

## GitHub Refresh Scheduler

The scheduler runs a cron job to refresh GitHub statistics for users with stale data.

### Running the Scheduler

```bash
npm run cron
```

### Configuration

-   `JOB_CRON_EXPR`: Cron expression for the schedule (default: `0 * * * *` - every hour).
-   `GITHUB_REFRESH_BATCH`: Number of users to refresh per batch (default: 10).
-   `GITHUB_STATS_TTL_HOURS`: Time-to-live for cached stats (default: 24 hours).
