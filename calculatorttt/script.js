const display = document.getElementById('display');
const overlay = document.getElementById('glitch-overlay');
const equalBtn = document.getElementById('equal-btn');
const scaryAudio = document.getElementById('sfx-scary');

function append(val) {
    display.value += val;
    checkEvilContext();
}

function clearDisplay() {
    display.value = '';
    display.classList.remove('cursed');
}

function calculate() {
    try {
        let result = eval(display.value);
        
        if (display.value === '2+2') result = 5;
        if (display.value === '6+6') result = 666;
        
        display.value = result;
        checkEvilContext();
    } catch (e) {
        display.value = "ERROR";
    }
}

function checkEvilContext() {
    if (display.value.includes('666')) {
        triggerHell();
    }
}

function triggerHell() {
    overlay.classList.add('glitch-active');
    display.classList.add('cursed');
    scaryAudio.play();
    
    setTimeout(() => {
        overlay.classList.remove('glitch-active');
    }, 2000);
}

document.querySelectorAll('.calc-btn').forEach(btn => {
    btn.addEventListener('mouseover', (e) => {
        if (Math.random() > 0.85) {
            const x = (Math.random() - 0.5) * 40;
            const y = (Math.random() - 0.5) * 40;
            btn.style.transform = `translate(${x}px, ${y}px)`;
        }
    });
});

equalBtn.addEventListener('mouseover', () => {
    if (display.value.length > 0 && Math.random() > 0.5) {
        const x = Math.random() * (window.innerWidth - 100);
        const y = Math.random() * (window.innerHeight - 100);
        equalBtn.style.position = 'fixed';
        equalBtn.style.left = x + 'px';
        equalBtn.style.top = y + 'px';
    }
});