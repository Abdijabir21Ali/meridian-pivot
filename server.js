const express = require('express');
const fs = require('fs');
const path = require('path');
const Queue = require('bull');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const DB_PATH = path.join(__dirname, 'db.json');

const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// Connect to Redis queue (Bull syntax)
const queue = new Queue('print-queue', {
    redis: { host: 'localhost', port: 6379 }
});

// --------------------------
// PIVOT: ASYNC CHECK-IN
// --------------------------
app.post('/checkin', async (req, res) => {
    const { attendeeId } = req.body;

    if (!attendeeId) {
        return res.status(400).json({ error: 'Missing attendeeId' });
    }

    const db = readDB();
    const attendee = db.attendees.find(a => a.id === attendeeId);

    if (!attendee) {
        return res.status(404).json({ error: 'Attendee not found' });
    }

    if (attendee.status === 'checked_in') {
        return res.status(409).json({ error: 'Already checked in. No second badge printed.' });
    }

    attendee.status = 'pending';
    writeDB(db);

    // Add job to queue (Bull syntax)
    await queue.add({ attendeeId });

    res.json({ 
        success: true, 
        message: `⏳ ${attendee.name} is pending... waiting for printer.`,
        status: 'pending',
        attendee 
    });
});

// Webhook endpoint (called by worker when printer finishes)
app.post('/webhook', (req, res) => {
    const { attendeeId } = req.body;

    if (!attendeeId) {
        return res.status(400).json({ error: 'Missing attendeeId' });
    }

    const db = readDB();
    const attendee = db.attendees.find(a => a.id === attendeeId);

    if (!attendee) {
        return res.status(404).json({ error: 'Attendee not found' });
    }

    if (attendee.status === 'pending') {
        attendee.status = 'checked_in';
        writeDB(db);
        console.log(`✅ Webhook: ${attendee.name} is now CHECKED IN`);
    }

    res.json({ success: true });
});

// Get status (for frontend polling)
app.get('/status/:id', (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const attendee = db.attendees.find(a => a.id === id);

    if (!attendee) {
        return res.status(404).json({ error: 'Attendee not found' });
    }

    res.json({ status: attendee.status });
});

app.listen(PORT, () => {
    console.log(`🚀 Async Kiosk running at http://localhost:${PORT}`);
    console.log(`📌 Remember to run the worker: npm run worker`);
});