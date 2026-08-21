document.getElementById('checkinBtn').addEventListener('click', async () => {
    const input = document.getElementById('attendeeId');
    const messageDiv = document.getElementById('message');
    const attendeeId = input.value.trim();

    if (!attendeeId) {
        messageDiv.textContent = '❌ Please enter an ID';
        messageDiv.className = 'message error';
        return;
    }

    messageDiv.textContent = '⏳ Submitting request...';
    messageDiv.className = 'message';

    try {
        const response = await fetch('/checkin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ attendeeId })
        });

        const data = await response.json();

        if (!response.ok) {
            messageDiv.textContent = `❌ ${data.error}`;
            messageDiv.className = 'message error';
            return;
        }

        // Show pending state
        messageDiv.textContent = `⏳ ${data.message}`;
        messageDiv.className = 'message';

        // Poll for status every 2 seconds
        const pollInterval = setInterval(async () => {
            try {
                const statusRes = await fetch(`/status/${attendeeId}`);
                const statusData = await statusRes.json();

                if (statusData.status === 'checked_in') {
                    clearInterval(pollInterval);
                    messageDiv.textContent = `✅ ${attendeeId} is now CHECKED IN!`;
                    messageDiv.className = 'message success';
                } else if (statusData.status === 'not_checked_in') {
                    // Edge case: if it somehow reverts
                    clearInterval(pollInterval);
                    messageDiv.textContent = `❌ Status reset. Try again.`;
                    messageDiv.className = 'message error';
                }
                // If still 'pending', keep polling
            } catch (err) {
                // Silent fail, keep polling
            }
        }, 2000);

        // Safety: stop polling after 30 seconds (timeout)
        setTimeout(() => {
            clearInterval(pollInterval);
            if (messageDiv.textContent.includes('pending')) {
                messageDiv.textContent = `⏰ Timeout. Check status manually.`;
                messageDiv.className = 'message error';
            }
        }, 30000);

    } catch (error) {
        messageDiv.textContent = '❌ Network error';
        messageDiv.className = 'message error';
    }
});