document.addEventListener('DOMContentLoaded', () => {
    const counterEl = document.getElementById('user-counter');
    let count = 124;

    setInterval(() => {
        count += Math.floor(Math.random() * 5) - 2;
        if (count < 50) count = 50;
        counterEl.innerText = `LIVE: ${count} TROLLI W AKCJI`;
    }, 3000);
});