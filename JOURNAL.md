# Learning & Blocker Journal

## Day 1-2: Solo Recon

### Day 1 (Start Time: 10:00 AM)

**Tool Assigned:** Bull (Redis Queue)

**Initial struggles:**

- Never used Redis before. Had to learn what it does.
- Redis 3.0.504 compatibility issue with BullMQ → switched to Bull.
- Understanding queue/worker pattern vs direct function calls.

**Errors encountered:**

1. `Error: Redis version needs to be greater or equal than 5.0.0`
   - **Fix**: Switched from `bullmq` to `bull` which supports Redis 3.0.
   - **Time spent**: 15 min researching, 5 min implementing.

2. `npm run worker` → `Missing script: "worker"`
   - **Fix**: Added `"worker": "node src/queueWorker.js"` to package.json scripts.
   - **Time spent**: 2 min.

**Dead ends:**

- Trying to use `bullmq` with Redis 3.0 → didn't work. Had to switch.
- Forgetting to start Redis before running app → "Connection refused" error.

**Time tracking:**

- Time-box: 4 hours
- Actual time: 3.5 hours

---

### Day 4: The Pivot (Start Time: 2:00 PM)

**New requirement:** Switch from synchronous polling to async webhook model.

**Challenges:**

- Understanding how webhook callback works.
- Frontend polling vs real-time updates.

**Errors encountered:**

1. Webhook not updating DB → Worker wasn't calling the endpoint.
   - **Fix**: Verified `axios.post('http://localhost:3000/webhook')` URL matches server port.
   - **Time spent**: 10 min.

**Time tracking:**

- Time-box: 3 hours
- Actual time: 2.5 hours
