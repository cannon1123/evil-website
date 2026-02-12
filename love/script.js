const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const question = document.getElementById('question');
const mainImage = document.getElementById('main-image');
const audio = document.getElementById('love-song');

let clickCount = 0;
let yesFontSize = 1.25; // Rozmiar w rem
let yesPadding = 2.5;   // Padding w rem

// Lista tekstów na przycisk "NIE" (Coraz bardziej zdesperowane)
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
    "Dobra, koniec tego!" // Po tym "Nie" znika albo zamienia się w TAK
];

// Lista smutnych GIFów (zmieniają się, gdy klikasz NIE)
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
        // Ostateczność: Przycisk NIE zamienia się w TAK
        noBtn.innerText = "TAK! 😍";
        noBtn.style.backgroundColor = "#10b981"; // Zielony
        noBtn.onclick = acceptLove; // Teraz działa jak TAK
    }

    // 2. Powiększ przycisk "TAK" (Agresywnie)
    yesFontSize += 0.5;
    yesPadding += 0.2;
    yesBtn.style.fontSize = `${yesFontSize}rem`;
    yesBtn.style.padding = `${yesPadding}rem ${yesPadding * 2}rem`;

    // 3. Zmień obrazek na smutny (co 3 kliknięcia)
    if (clickCount % 3 === 0) {
        const gifIndex = (clickCount / 3) % sadGifs.length;
        mainImage.src = sadGifs[gifIndex];
    }

    // 4. Przesuń przycisk "NIE" losowo żeby trudniej było trafić
    const x = Math.random() * 100 - 50; // Ruch o +/- 50px
    const y = Math.random() * 100 - 50;
    noBtn.style.transform = `translate(${x}px, ${y}px)`;
}

function acceptLove() {
    // 1. Zmień wygląd strony na sukces
    mainImage.src = happyGif;
    question.innerText = "Jeeeeej! Wiedziałem! 💖💖💖";
    
    // Ukryj przyciski
    document.getElementById('btn-container').innerHTML = `
        <div class="text-2xl text-pink-600 font-bold mt-4 animate-bounce">
            Widzimy się 14 lutego! 😘
        </div>
    `;

    // 2. Odpal konfetti (dużo konfetti)
    launchConfetti();

    // 3. Opcjonalnie: muzyka
    // audio.play(); 
}

// Funkcja do konfetti
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