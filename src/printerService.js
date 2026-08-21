// src/printerService.js

const mockPrintBadge = (attendeeId) => {
    return new Promise((resolve) => {
        console.log(`🖨️ [Printer Service] Printing badge for ${attendeeId}...`);
        setTimeout(() => {
            console.log(`✅ [Printer Service] Badge printed for ${attendeeId}`);
            resolve({ success: true });
        }, 2000);
    });
};

module.exports = { mockPrintBadge };