const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const DB_PATH = path.join(__dirname, 'db.json');

const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

const mockPrintBadge = (attendeeId) => {
    return new Promise((resolve) => {
        console.log(`🖨️ Printing badge for ${attendeeId}...`);
        setTimeout(() => {
            console.log(`✅ Badge printed for ${attendeeId}`);
            resolve({ success: true });
        }, 2000);
    });
};

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

    try {
        await mockPrintBadge(attendeeId);
        attendee.status = 'checked_in';
        writeDB(db);

        res.json({ 
            success: true, 
            message: `${attendee.name} checked in successfully!`,
            attendee 
        });
    } catch (error) {
        res.status(500).json({ error: 'Printing failed' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Kiosk running at http://localhost:${PORT}`);
});