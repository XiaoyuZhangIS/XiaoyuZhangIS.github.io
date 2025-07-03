function updateLiveTime() {
    const now = new Date();
    const userTimezone = document.querySelector('meta[name="user-timezone"]')?.content || 'Pacific/Auckland';
    
    const localTime = new Date(now.toLocaleString("en-US", {timeZone: userTimezone}));
    const timeString = localTime.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const utcTime = new Date();
    utcTime.setTime(utcTime.getTime() + (utcTime.getTimezoneOffset() * 60000));
    const offset = Math.round((localTime.getTime() - utcTime.getTime()) / (1000 * 60 * 60));
    
    const offsetText = offset > 0 ? `${offset}h ahead` : offset < 0 ? `${Math.abs(offset)}h behind` : "UTC";
    
    const timeElement = document.getElementById('live-time');
    if (timeElement) {
        timeElement.textContent = `${timeString} - ${offsetText}`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('live-time')) {
        updateLiveTime();
        setInterval(updateLiveTime, 60000); 
    }
});
