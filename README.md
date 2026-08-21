# Meridian Pivot - Solstice Events Check-in Kiosk

## Project Overview
A check-in kiosk service for Solstice Events Co. that handles attendee check-ins with badge printing.

## The Pivot
This project demonstrates handling a **non-negotiable requirement change**:
- **Before**: Synchronous API call to printer (waits for response)
- **After**: Asynchronous queue + webhook model (pending state, callback)

## Tech Stack
- **Backend**: Node.js + Express
- **Queue**: Bull (Redis 3.0.504)
- **Database**: JSON file (db.json)
- **Frontend**: Vanilla HTML/CSS/JS

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Redis
```bash
redis-cli ping
# Should return PONG
```

### 3. Run the Application (2 Terminals)

**Terminal 1 - Server:**
```bash
npm start
```

**Terminal 2 - Worker:**
```bash
npm run worker
```

### 4. Access the Kiosk
Open your browser: `http://localhost:3000`

## Test Attendees
| ID | Name |
|----|------|
| ATT-001 | Alice |
| ATT-002 | Bob |
| ATT-003 | Charlie |

## Duplicate Scan Protection
Attendees who are already checked in cannot get a second badge printed.

## Project Structure
```
meridian-pivot/
├── server.js              # Express app & endpoints
├── db.json                # Attendee database
├── src/
│   ├── queueWorker.js     # Bull queue worker
│   └── printerService.js  # Printer logic (shared)
├── public/
│   ├── index.html         # Kiosk UI
│   ├── style.css          # Styling
│   └── script.js          # Frontend logic
├── JOURNAL.md             # Learning & Blocker Journal
├── SCOPE_DELTA.md         # Trade-off documentation
└── ADAPTABILITY_INDEX.md  # Confidential self-rating
```

## Key Features
✅ Asynchronous check-in with pending state  
✅ Webhook callback for printer completion  
✅ Duplicate scan protection  
✅ Frontend polling for status updates  
✅ All 3 test attendees supported  

## Commit History
- **Commit 1**: Synchronous check-in kiosk (pre-pivot)  
- **Commit 2**: Pivot to async queue + webhook model

## Scope Delta Highlights
- **Dropped**: Synchronous printer calls
- **Added**: Bull queue, webhook endpoint, status polling
- **Modified**: UI shows pending state before final confirmation
