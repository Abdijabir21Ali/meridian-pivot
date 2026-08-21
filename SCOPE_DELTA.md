# Scope Delta Analysis - Solstice Events Co.

## Original Spec (Pre-Pivot)

- Poll warehouse API every 5 minutes
- Cache stock
- Expose query endpoint
- Synchronous check-in: wait for printer response before showing "Checked In"

## New Spec (Post-Pivot)

- Publish print request to message queue
- Expose webhook endpoint for printer callback
- UI shows "pending" state until webhook confirmation arrives
- Frontend polls status endpoint for updates

## Dropped Features

| Feature                         | Reason                              |
| ------------------------------- | ----------------------------------- |
| Synchronous printer call        | Vendor deprecated sync API          |
| Immediate "Checked In" response | No longer possible with async model |

## Modified Features

| Feature       | Before                   | After                         |
| ------------- | ------------------------ | ----------------------------- |
| Check-in flow | Wait 2 sec, show success | Show pending, poll for status |
| Status update | Direct DB update         | Webhook triggers DB update    |

## Added Features

| Feature                 | Purpose                               |
| ----------------------- | ------------------------------------- |
| Bull queue + Redis      | Decouple printer from HTTP request    |
| Worker process          | Handle print jobs asynchronously      |
| Webhook endpoint        | Receive printer completion callbacks  |
| Status polling endpoint | Allow frontend to check progress      |
| Pending state UI        | User feedback during async processing |

## Reprioritized Backlog (What I'd do differently)

1. **Higher priority**: Better error handling for queue failures (retry with exponential backoff)
2. **Higher priority**: Add logging/monitoring to track webhook delivery
3. **Medium priority**: Use WebSockets instead of polling for real-time updates
4. **Lower priority**: Add UI animations to show transition from pending to checked-in

## Regression Check

✅ Duplicate scan protection still works (status checked before queue add)
✅ All 3 attendees can check in successfully
✅ Status persists correctly in database
