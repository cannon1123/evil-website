const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const question = document.getElementById('question');
const mainImage = document.getElementById('main-image');

let clickCount = 0;
let yesFontSize = 1.25; // Rozmiar w rem
let yesPadding = 2.5;   // Padding w rem

// Lista tekstów na przycisk "NIE"
const noTexts = [
    "Nie 😢",
    "Na pewno?",
    "Serio?",
    "Pomyśl jeszcze raz!",
    "Złamiesz mi serce 💔",
    "Będę płakać...",
    "Proszęęęęę...",
    "Dam Ci czekoladę!",
    "Nie rób mi tego!",
    "Ok, teraz przesadzasz",
    "Jesteś bez serca!",
    "Dobra, koniec tego!" 
];

// Smutne GIFy
const sadGifs = [
    "https://media.tenor.com/KoukV5l00GEAAAAi/sad-bear.gif",
    "https://media.tenor.com/1-1M5e5i7yAAAAAi/sad-cry.gif",
    "https://media.tenor.com/P4b0dJv4C2kAAAAi/milk-and-mocha-bear.gif"
];

// GIF na sukces
const happyGif = "https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif";

function handleNo() {
    clickCount++;
    
    // 1. Zmień tekst na przycisku "NIE"
    if (clickCount < noTexts.length) {
        noBtn.innerText = noTexts[clickCount];
    } else {
        noBtn.innerText = "TAK! 😍";
        noBtn.style.backgroundColor = "#10b981";
        noBtn.onclick = acceptLove;
        // Reset pozycji, żeby łatwiej było kliknąć
        noBtn.style.transform = "translate(0, 0)";
        return;
    }

    // 2. Powiększ przycisk "TAK"
    yesFontSize += 0.4; // Trochę wolniejszy wzrost, żeby gra trwała dłużej
    yesBtn.style.fontSize = `${yesFontSize}rem`;
    
    // Ograniczamy padding, żeby nie rozwaliło ekranu za szybko
    if(yesPadding < 5) {
        yesPadding += 0.2;
        yesBtn.style.padding = `${yesPadding}rem ${yesPadding * 2}rem`;
    }

    // 3. Zmień obrazek na smutny
    const gifIndex = clickCount % sadGifs.length;
    mainImage.src = sadGifs[gifIndex];

    // 4. Przesuń przycisk "NIE" (TELEPORTACJA PO KLIKNIĘCIU)
    // Zwiększyłem zakres ruchu do +/- 150px, żeby uciekał dalej
    const x = (Math.random() - 0.5) * 300; 
    const y = (Math.random() - 0.5) * 300;
    noBtn.style.transform = `translate(${x}px, ${y}px)`;
}

function acceptLove() {
    mainImage.src = happyGif;
    question.innerText = "Jeeeeej! Wiedziałem! 💖💖💖";
    
    // Ukryj przyciski i pokaż komunikat
    document.getElementById('btn-container').innerHTML = `
        <div class="text-2xl text-pink-600 font-bold mt-4 animate-bounce px-4">
            Widzimy się 14 lutego! 😘
        </div>
    `;

    launchConfetti();
}

function launchConfetti() {
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}