function updateLiveTime() {
    const timeElement = document.getElementById('live-time');
    if (!timeElement) {
        return;
    }

    const now = new Date();
    const userTimezone = document.querySelector('meta[name="user-timezone"]')?.content || 'Pacific/Auckland';
    const visitorTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const timeString = now.toLocaleTimeString('en-US', {
        timeZone: userTimezone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    });
    if (userTimezone === visitorTimezone) {
        timeElement.textContent = timeString;
        return;
    }
    try {
        const authorHour = parseInt(now.toLocaleString('en-CA', { timeZone: userTimezone, hour: '2-digit', hour12: false }));
        const authorDay = parseInt(now.toLocaleString('en-CA', { timeZone: userTimezone, day: '2-digit' }));
        const visitorHour = parseInt(now.toLocaleString('en-CA', { timeZone: visitorTimezone, hour: '2-digit', hour12: false }));
        const visitorDay = parseInt(now.toLocaleString('en-CA', { timeZone: visitorTimezone, day: '2-digit' }));     
        let hourDifference = (authorHour - visitorHour);
        if (authorDay > visitorDay || (authorDay === 1 && visitorDay > 25)) {
            hourDifference += 24;
        } else if (authorDay < visitorDay || (visitorDay === 1 && authorDay > 25)) {
            hourDifference -= 24;
        }
        
        const offset = Math.round(hourDifference);
        
        let offsetText = "";
        if (offset > 0) {
            offsetText = `${offset}h ahead`;
        } else if (offset < 0) {
            offsetText = `${Math.abs(offset)}h behind`;
        }

        if (offsetText) {
             timeElement.innerHTML = `${timeString} - <span style="color: #666 !important;">${offsetText}</span>`;
        } else {
            timeElement.textContent = timeString;
        }

    } catch (e) {
        console.error("Error calculating timezone offset:", e);
        timeElement.textContent = timeString;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('live-time')) {
        updateLiveTime();
        setInterval(updateLiveTime, 60000);
    }
});
