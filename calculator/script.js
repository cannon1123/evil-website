let display = document.getElementById('display');
let bubble = document.getElementById('comment-bubble');
let equalBtn = document.getElementById('equal-btn');
let lastResult = null;
let escapeCount = 0;
let isHardcore = false;
let clickStreak = 0;

const cursedData = {
    '69': 'nice 😏', '420': 'blaze it 🌿', '666': '😈 ERROR', '13': 'PECH...',
    '404': 'wynik nie znaleziony', '1337': 'hacker detected', '21': '21 😎',
    '42': 'odpowiedź na wszystko', '8008': 'BOOBS', '9000': "IT'S OVER 9000!!!",
    '1/0': 'nie dzisiaj', '0/0': 'nawet ja mam granice', '3.14': '3.1415926535...',
    '777': 'JACKPOT! (ale wynik zły)', '123': 'hasło za proste'
};

const insults = ["serio?", "dasz radę w głowie", "to było łatwe", "marnujesz mój czas", "klikaj dalej..."];
const philosophy = ["czy liczby mają sens?", "wynik to tylko iluzja", "dlaczego tu jesteś?"];

function showComment(txt) {
    bubble.innerText = txt;
    setTimeout(() => { bubble.innerText = ''; }, 3000);
}

function append(val) {
    clickStreak++;
    if (clickStreak > 15) showComment("znudziło mi się");
    display.value += val;
}

function pressAC() {
    display.value = '';
    clickStreak = 0;
    if (Math.random() > 0.7) showComment("pamiętam co tam było...");
}

// Logika uciekającego przycisku (tylko 5 razy)
equalBtn.addEventListener('mouseover', () => {
    if (escapeCount < 5 && display.value.length > 0) {
        const x = Math.random() * (window.innerWidth - 100);
        const y = Math.random() * (window.innerHeight - 100);
        equalBtn.classList.add('moving');
        equalBtn.style.left = x + 'px';
        equalBtn.style.top = y + 'px';
        escapeCount++;
    }
});

function resetEqualBtn() {
    escapeCount = 0;
    equalBtn.classList.remove('moving');
    equalBtn.style.position = '';
    equalBtn.style.left = '';
    equalBtn.style.top = '';
}

function performCalculation() {
    const input = display.value;
    resetEqualBtn();

    // Sekretny tryb evil (666)
    if (input.includes('666')) {
        triggerHardcore();
    }

    // Losowa amnezja (punkt 4)
    if (Math.random() > 0.9 && lastResult !== null) {
        display.value = lastResult;
        showComment("...chyba tak było?");
        return;
    }

    try {
        // Zmienne prawa matematyki (2+2)
        if (input === '2+2') {
            const r = [4, 5, 'zależy'][Math.floor(Math.random() * 3)];
            display.value = r;
            return;
        }

        let result = eval(input);

        // Prawie dobrze (+1/-1)
        if (Math.random() > 0.8 && !isHardcore) {
            result += (Math.random() > 0.5 ? 1 : -1);
        }

        // Cursed Numbers logic
        if (cursedData[result]) {
            handleCursed(result);
            return;
        }

        // Pasywno-agresywne komentarze
        if (input.length < 4) showComment(insults[Math.floor(Math.random() * insults.length)]);

        // Filozofowanie
        if (Math.random() > 0.95) showComment(philosophy[Math.floor(Math.random() * philosophy.length)]);

        lastResult = result;
        display.value = result;

    } catch (e) {
        display.value = "GASLIGHTING ERROR";
    }
}

function handleCursed(num) {
    const effect = cursedData[num];
    if (num === 420) {
        display.value = "...";
        setTimeout(() => { display.value = effect; }, 3000); // Wolne liczenie
    } else if (num === 8008) {
        document.querySelector('.calculator-body').style.transform = 'rotate(180deg)';
        display.value = effect;
    } else {
        display.value = effect;
    }
}

function triggerHardcore() {
    isHardcore = true;
    document.querySelector('.calculator-body').classList.add('hardcore-mode');
    document.getElementById('screen-glitch').classList.add('glitch-flash');
    showComment("WITAJ W PIEKLE");
}

// Zapobieganie kopiowaniu / konsoli (podstawowe)
document.addEventListener('keydown', e => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) e.preventDefault();
});