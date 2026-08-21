const Queue = require('bull');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'db.json');

const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

const mockPrintBadge = (attendeeId) => {
    return new Promise((resolve) => {
        console.log(`🖨️ [Worker] Printing badge for ${attendeeId}...`);
        setTimeout(() => {
            console.log(`✅ [Worker] Badge printed for ${attendeeId}`);
            resolve({ success: true });
        }, 2000);
    });
};

const queue = new Queue('print-queue', {
    redis: { host: 'localhost', port: 6379 }
});

// Bull uses queue.process() with job parameter
queue.process(async (job) => {
    const { attendeeId } = job.data;

    try {
        await mockPrintBadge(attendeeId);
        await axios.post('http://localhost:3000/webhook', { attendeeId });
        console.log(`📨 [Worker] Webhook sent for ${attendeeId}`);
        return { success: true };
    } catch (error) {
        console.error(`❌ [Worker] Failed for ${attendeeId}:`, error.message);
        throw error;
    }
});

console.log('🧠 Queue Worker is running...');