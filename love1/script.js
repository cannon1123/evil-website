const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const question = document.getElementById('question');
const mainImage = document.getElementById('main-image');
const body = document.getElementById('main-body');
const msgBubble = document.getElementById('msg-bubble');
const nameInput = document.getElementById('name-input');
const nameModal = document.getElementById('name-modal');
const gameContainer = document.getElementById('game-container');

// Dźwięki
const sfxNo = document.getElementById('sfx-no'); // Vine boom / error
const sfxWin = document.getElementById('sfx-win'); // Yippee / fanfare

let clickCount = 0;
let yesFontSize = 1.25; 
let yesPadding = 2.5; 
let userName = "mnie"; // Domyślne

// START GRY (Po wpisaniu imienia)
function startGame() {
    const inputVal = nameInput.value.trim();
    if (inputVal) {
        userName = inputVal;
        question.innerText = `Zostaniesz Walentynką ${userName}? 💖`;
    } else {
        question.innerText = "Zostaniesz moją Walentynką? 💖";
    }
    
    // Ukryj modal
    nameModal.style.opacity = '0';
    setTimeout(() => { nameModal.style.display = 'none'; }, 300);
}

const noTexts = [
    "Nie 😢", "Na pewno?", "Serio?", "Pomyśl!", "Łamiesz serce 💔",
    "Płaczę...", "Proszę...", "Dam czekoladę!", "Okrucieństwo!",
    "Brak serca!", "KONIEC!", "Ostatnia szansa!"
];

const sadGifs = [
    "https://media.tenor.com/KoukV5l00GEAAAAi/sad-bear.gif",
    "https://media.tenor.com/1-1M5e5i7yAAAAAi/sad-cry.gif",
    "https://media.tenor.com/P4b0dJv4C2kAAAAi/milk-and-mocha-bear.gif"
];

const happyGif = "https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif";

function handleNo(event) {
    clickCount++;
    
    // 0. Efekty dźwiękowe (co drugie kliknięcie, żeby nie spamować)
    if (clickCount % 2 === 0) {
        sfxNo.currentTime = 0;
        sfxNo.volume = 0.3;
        sfxNo.play().catch(e => console.log("Audio play failed"));
    }

    // 1. Spawn pękniętego serca w miejscu kliknięcia
    spawnFloatingEmoji(event.clientX, event.clientY, "💔");

    // 2. Zmiana tła na ciemniejsze (stopniowo)
    changeBackgroundMood(clickCount);

    // 3. Teksty i logika przycisków
    if (clickCount < noTexts.length) {
        noBtn.innerText = noTexts[clickCount];
        
        // Pokaż dymek z tekstem nad obrazkiem
        msgBubble.innerText = getRandomComplaint();
        msgBubble.style.opacity = '1';
        setTimeout(() => { msgBubble.style.opacity = '0'; }, 1000);
    } else {
        // Kapitulacja
        noBtn.innerText = "TAK! 😍";
        noBtn.style.backgroundColor = "#10b981";
        noBtn.onclick = acceptLove;
        noBtn.style.transform = "translate(0, 0)";
        body.style.backgroundColor = "#ffe4e6"; // Reset tła
        return;
    }

    // 4. Powiększanie TAK
    yesFontSize += 0.4;
    yesBtn.style.fontSize = `${yesFontSize}rem`;
    if(yesPadding < 5) {
        yesPadding += 0.2;
        yesBtn.style.padding = `${yesPadding}rem ${yesPadding * 2}rem`;
    }

    // 5. Zmiana GIFa
    const gifIndex = clickCount % sadGifs.length;
    mainImage.src = sadGifs[gifIndex];

    // 6. Ucieczka przycisku
    const x = (Math.random() - 0.5) * 350; 
    const y = (Math.random() - 0.5) * 350;
    noBtn.style.transform = `translate(${x}px, ${y}px)`;

    // 7. Trzęsienie ekranu (przy wysokim poziomie)
    if (clickCount > 5) {
        gameContainer.classList.add('shake');
        setTimeout(() => gameContainer.classList.remove('shake'), 500);
    }
}

function acceptLove() {
    mainImage.src = happyGif;
    
    if (userName === "mnie") {
        question.innerText = "Jeeeeej! Wiedziałem! 💖";
    } else {
        question.innerText = `Jeeeeej! ${userName} się cieszy! 💖`;
    }

    // Reset tła na jasne
    body.style.backgroundColor = "#ffe4e6"; 
    body.classList.remove('dark-mood');
    
    // Dźwięk sukcesu
    sfxWin.volume = 0.4;
    sfxWin.play().catch(e => {});

    document.getElementById('btn-container').innerHTML = `
        <div class="text-2xl text-pink-600 font-bold mt-4 animate-bounce px-4">
            Widzimy się 14 lutego! 😘
        </div>
    `;

    launchConfetti();
    
    // Spawn dużej ilości serduszek
    for(let i=0; i<10; i++) {
        setTimeout(() => {
            spawnFloatingEmoji(
                Math.random() * window.innerWidth, 
                window.innerHeight, 
                "💖"
            );
        }, i * 200);
    }
}

// Funkcja zmieniająca kolor tła na bardziej "agresywny"
function changeBackgroundMood(level) {
    if (level > 3 && level <= 8) {
        // Lekko czerwone
        body.style.backgroundColor = "#fecdd3"; 
    } else if (level > 8 && level <= 12) {
        // Ciemniejsze
        body.style.backgroundColor = "#f87171"; 
    } else if (level > 12) {
        // Mroczne
        body.style.backgroundColor = "#7f1d1d"; 
        body.classList.add('dark-mood'); // Zmiana wzoru tła
        question.style.color = "#ffffff"; // Biały tekst na ciemnym tle
    }
}

// Funkcja tworząca latające emoji
function spawnFloatingEmoji(x, y, emoji) {
    const el = document.createElement('div');
    el.innerText = emoji;
    el.classList.add('floating-emoji');
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);

    // Usuń po zakończeniu animacji
    setTimeout(() => { el.remove(); }, 1500);
}

function getRandomComplaint() {
    const complaints = ["Ała!", "Dlaczego?", "Ejej!", "Foch!", "Smuteczek...", "Okrutnik!"];
    return complaints[Math.floor(Math.random() * complaints.length)];
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
        if (timeLeft <= 0) return clearInterval(interval);

        var particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}