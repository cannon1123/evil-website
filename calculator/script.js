const display = document.getElementById('display');
const bubble = document.getElementById('comment-bubble');
const equalBtn = document.getElementById('equal-btn');
const historyEl = document.getElementById('history');
const body = document.getElementById('calculator-body');

let currentInput = "";
let grudgeOffset = 0; // AC nie czyści wszystkiego (pkt 6)
let escapeCount = 0; // Licznik ucieczek przycisku (max 5)
let evilMode = false;
let lastResult = null;

// BAZA DANYCH MEMICZNYCH / PRZEKLĘTYCH LICZB (Twoje 30 punktów)
const specialResponses = {
    "69": { text: "nice 😏", action: "normal" },
    "420": { text: "blaze it 🌿", action: "slow" },
    "666": { text: "😈 ERROR", action: "evil" },
    "13": { text: "PECH...", action: "glitch" },
    "404": { text: "Not Found", action: "normal" },
    "1337": { text: "hacker mode", action: "console" },
    "7": { text: "7 (chyba)", action: "doubt" },
    "0": { text: "nic", action: "crisis" },
    "1": { text: "minimalizm", action: "normal" },
    "21": { text: "21 😎", action: "normal" },
    "42": { text: "odpowiedź na wszystko", action: "normal" },
    "88": { text: "88 (dużo)", action: "big" },
    "100": { text: "100% pewności", action: "normal" },
    "123": { text: "hasło za proste", action: "normal" },
    "1234": { text: "kolejna osoba...", action: "normal" },
    "8008": { text: "BOOBS", action: "rotate" },
    "9000": { text: "IT'S OVER 9000!!!", action: "scream" },
    "999": { text: "666 (ups)", action: "flip" },
    "3.14": { text: "3.1415926535...", action: "nerd" },
    "2.718": { text: "człowiek kultury", action: "normal" },
    "69.69": { text: "nice nice", action: "normal" },
    "420.69": { text: "CHAOS", action: "chaos" },
    "1000": { text: "zmęczyłem się...", action: "delay" },
    "777": { text: "JACKPOT! (ale wynik zły)", action: "fake_win" },
    "9999": { text: "za dużo", action: "reset" }
};

// Komentarze pasywno-agresywne (pkt 3, 7, 11)
const comments = [
    "serio?", "to w pamięci policz", "marnujesz prąd", 
    "nudzi mi się", "czy liczby mają sens?", "wynik to iluzja"
];

// --- FUNKCJE POMOCNICZE ---

function showComment(text) {
    bubble.innerText = text;
    bubble.style.opacity = "1";
    setTimeout(() => { bubble.style.opacity = "0"; }, 3000);
}

function append(val) {
    // Pkt 7: Nuda kalkulatora
    if (currentInput.length > 10 && Math.random() > 0.9) {
        showComment("przestań klikać...");
        return;
    }
    
    // Pkt 9: Jedynki
    if (val === '1' && currentInput.includes('111')) {
        showComment("minimalizm");
    }

    currentInput += val;
    display.value = currentInput;
}

function toggleSign() {
    if(currentInput) {
        if(currentInput.startsWith('-')) currentInput = currentInput.substring(1);
        else currentInput = '-' + currentInput;
        display.value = currentInput;
    }
}

function pressAC() {
    // Pkt 6: AC nie czyści wszystkiego (uraz)
    currentInput = "";
    display.value = "0";
    historyEl.innerText = "";
    
    if (Math.random() > 0.7) {
        grudgeOffset += (Math.random() > 0.5 ? 0.1 : -0.1); // Zapamiętuje błąd
        showComment("pamiętam to...");
    }
    
    // Resetuj uciekający przycisk
    resetEqualBtn();
    
    // Wyłącz tryb evil jeśli był
    document.body.classList.remove('evil-mode');
}

// --- LOGIKA UCIEKAJĄCEGO PRZYCISKU (5 ruchów max) ---
equalBtn.addEventListener('mouseover', () => {
    // Warunek: musi coś być wpisane i licznik < 5
    if (currentInput.length > 0 && escapeCount < 5) {
        const x = Math.random() * (window.innerWidth - 100);
        const y = Math.random() * (window.innerHeight - 100);
        
        equalBtn.classList.add('running');
        equalBtn.style.left = `${Math.max(20, x)}px`;
        equalBtn.style.top = `${Math.max(20, y)}px`;
        
        escapeCount++;
    }
});

function resetEqualBtn() {
    escapeCount = 0;
    equalBtn.classList.remove('running');
    equalBtn.style.position = '';
    equalBtn.style.left = '';
    equalBtn.style.top = '';
}

// --- GŁÓWNA FUNKCJA OBLICZAJĄCA ---
function calculate() {
    resetEqualBtn(); // Przycisk wraca po kliknięciu

    // Pkt 8: Sekretny tryb Evil (jeśli wpiszesz 666 na początku)
    if (currentInput === "666") {
        triggerEvilMode();
        return;
    }

    // Pkt 25 & 26: Dzielenie przez zero
    if (currentInput.includes('/0')) {
        if (currentInput.includes('0/0')) display.value = "mam granice";
        else display.value = "nie dzisiaj";
        // Pkt 12: Obrażanie się (freeze)
        equalBtn.disabled = true;
        setTimeout(() => { equalBtn.disabled = false; }, 3000);
        currentInput = "";
        return;
    }

    // Pkt 4: Losowa amnezja (pokazuje poprzedni wynik)
    if (Math.random() > 0.95 && lastResult !== null) {
        display.value = lastResult;
        showComment("...to chyba to?");
        return;
    }

    // Pkt 10: Gaslighting (zmiana historii)
    historyEl.innerText = currentInput + " =";

    try {
        // Pkt 5: Zmienne prawa matematyki (2+2)
        if (currentInput === "2+2") {
            const variants = ["4", "5", "zależy", "ok"];
            display.value = variants[Math.floor(Math.random() * variants.length)];
            currentInput = "";
            return;
        }

        // Ewaluacja wyniku
        let result = eval(currentInput);

        // Pkt 6: Dodanie "urazu" (grudge)
        result += grudgeOffset;

        // Pkt 1: "Prawie dobrze" (losowy błąd +/- 1)
        if (Math.random() > 0.8 && !evilMode) {
            result += (Math.random() > 0.5 ? 1 : -1);
            showComment("na pewno dobrze");
        }

        // --- SPRAWDZANIE LISTY 30 PUNKTÓW ---
        // Sprawdzamy czy wynik lub wpisana komenda jest na liście specjalnej
        let magicKey = null;
        if (specialResponses[currentInput]) magicKey = currentInput; // Np. wpisano "69"
        else if (specialResponses[result]) magicKey = result;        // Np. wynik to 69

        if (magicKey) {
            handleSpecialEffect(magicKey, result);
        } else {
            // Normalny (lub lekko błędny) wynik
            // Zaokrąglenie długich ułamków, żeby nie rozwaliło ekranu
            if (result.toString().length > 10) result = result.toFixed(8);
            display.value = result;
        }

        lastResult = display.value;
        currentInput = result.toString();

        // Losowy komentarz jeśli brak efektu specjalnego
        if (!magicKey && Math.random() > 0.7) {
            showComment(comments[Math.floor(Math.random() * comments.length)]);
        }

    } catch (e) {
        display.value = "ERROR";
        showComment("co ty wpisujesz?");
    }
}

function handleSpecialEffect(key, calculatedResult) {
    const effect = specialResponses[key];
    const text = effect.text;

    switch (effect.action) {
        case "slow": // 420
            display.value = "...";
            setTimeout(() => { display.value = text; }, 2000);
            break;
        case "evil": // 666
            triggerEvilMode();
            display.value = text;
            break;
        case "rotate": // 8008
            body.style.transform = "rotate(180deg)";
            display.value = text;
            break;
        case "scream": // 9000
            display.value = text;
            display.style.fontSize = "3rem"; // Powiększenie
            break;
        case "chaos": // 420.69
            display.value = "WTF?";
            setInterval(() => {
                display.style.color = '#' + Math.floor(Math.random()*16777215).toString(16);
            }, 100);
            break;
        default:
            display.value = text;
            break;
    }
}

function triggerEvilMode() {
    evilMode = true;
    document.body.classList.add('evil-mode');
    document.getElementById('glitch-overlay').style.opacity = "0.5";
    showComment("WITAJ W PIEKLE");
}