const display = document.getElementById('display');
const bubble = document.getElementById('comment-bubble');
const equalBtn = document.getElementById('equal-btn');
const historyEl = document.getElementById('history');
const body = document.getElementById('calculator-body');

// Zmienne do Modala Pomocy
const helpModal = document.getElementById('help-modal');
const modalBox = document.getElementById('modal-box');
const modalTitle = document.getElementById('modal-title');
const modalText = document.getElementById('modal-text');
const modalAction = document.getElementById('modal-action');
let helpStep = 0;

let currentInput = "";
let grudgeOffset = 0;
let escapeCount = 0;
let evilMode = false;
let lastResult = null;

// --- TWOJA LISTA 30 PUNKTÓW (MEMOWE LICZBY) ---
const specialResponses = {
    "69": { text: "nice 😏", action: "normal" },
    "420": { text: "blaze it 🌿", action: "slow" },
    "666": { text: "😈 ERROR", action: "evil" },
    "13": { text: "PECH...", action: "glitch" },
    "404": { text: "Not Found", action: "normal" },
    "1337": { text: "hacker mode", action: "normal" },
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
    "9999": { text: "za dużo", action: "reset" },
};

const comments = [
    "serio?", "to w pamięci policz", "marnujesz prąd", 
    "nudzi mi się", "czy liczby mają sens?", "wynik to iluzja", "dasz radę w głowie"
];

// --- LOGIKA POMOCY (TROLL) ---
const trollSteps = [
    { text: "Czy na pewno chcesz zobaczyć podpowiedzi?", btn: "TAK, PEWNIE" },
    { text: "Dasz radę bez nich.", btn: "NIE DAM RADY" },
    { text: "To naprawdę bardzo proste.", btn: "POKAŻ MI" },
    { text: "Ostatnia szansa. Serio.", btn: "ZARYZYKUJĘ" },
    { text: "Nie cofniemy tego.", btn: "ROZUMIEM RYZYKO" },
    { text: "Podpowiedzi mogą być nieprawdziwe.", btn: "OK, POKAŻ" },
    { text: "Kliknij, jeśli nie wierzysz w siebie.", btn: "KLIKAM ZE WSTYDEM" },
    { text: "Użytkownicy tacy jak Ty zwykle tego żałują.", btn: "MAM TO GDZIEŚ" },
    { text: "OK, ale nie mów, że Cię nie ostrzegałem.", btn: "POKAŻ W KOŃCU!" },
    { text: "Pokaż podpowiedź (wersja zła).", btn: "DAWAJ TO!" }
];

const finalHints = `
    <ul class='text-left text-xs space-y-2 list-disc pl-4 text-gray-400'>
        <li>Liczba bestii otwiera wrota piekła.</li>
        <li>Zielona liczba spowalnia czas.</li>
        <li>Gdy nic podzielisz przez nic, poznasz granice.</li>
        <li>Obróć kalkulator do góry nogami (cyfry kobiet).</li>
        <li>Dwa plus dwa to nie zawsze cztery.</li>
        <li>Over 9000 to krzyk mocy.</li>
        <li>Nie ufaj liczbie 13.</li>
    </ul>
`;

function startHelpSequence() {
    helpStep = 0;
    updateModal();
    helpModal.classList.add('pointer-events-auto'); // Włączamy klikanie w modal
    helpModal.classList.remove('opacity-0');
    helpModal.classList.add('opacity-100');
    modalBox.classList.add('scale-100');
}

function closeHelp() {
    helpModal.classList.remove('opacity-100');
    helpModal.classList.add('opacity-0');
    modalBox.classList.remove('scale-100');
    
    // Wyłączamy interakcję po animacji
    setTimeout(() => {
        helpModal.classList.remove('pointer-events-auto');
    }, 300);
}

function nextHelpStep() {
    if (helpStep === 1) {
        modalText.style.opacity = '0';
        setTimeout(() => { modalText.style.opacity = '1'; }, 2000);
    }

    if (helpStep === 4) {
        modalAction.innerText = "...";
        modalAction.disabled = true;
        setTimeout(() => {
            modalAction.innerText = trollSteps[4].btn;
            modalAction.disabled = false;
            helpStep++;
            updateModal();
        }, 1500); 
        return;
    }

    helpStep++;

    if (helpStep < trollSteps.length) {
        updateModal();
    } else {
        modalTitle.innerText = "KSIĘGA ZAKAZANA";
        modalText.innerHTML = finalHints;
        modalAction.innerText = "ZAMKNIJ (NA WŁASNĄ ODPOWIEDZIALNOŚĆ)";
        modalAction.onclick = closeHelp;
        
        currentInput = "665"; 
        display.value = "665";
    }
}

function updateModal() {
    const step = trollSteps[helpStep];
    modalTitle.innerText = `OSTRZEŻENIE ${helpStep + 1}/10`;
    modalText.innerText = step.text;
    modalAction.innerText = step.btn;
    
    if (helpStep === 5) {
        if (Math.random() > 0.5) modalText.innerText += " (Ta rada jest kłamstwem)";
    }
}

// Zamknij modal klikając w tło
helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) closeHelp();
});


// --- STANDARDOWA LOGIKA KALKULATORA ---

function showComment(text) {
    bubble.innerText = text;
    bubble.style.opacity = "1";
    setTimeout(() => { bubble.style.opacity = "0"; }, 3000);
}

function append(val) {
    if (currentInput.length > 12 && Math.random() > 0.8) {
        showComment("przestań klikać...");
        return;
    }
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
    currentInput = "";
    display.value = "0";
    historyEl.innerText = "";
    if (Math.random() > 0.7) {
        grudgeOffset += (Math.random() > 0.5 ? 0.2 : -0.2); 
        showComment("pamiętam to...");
    }
    resetEqualBtn();
    document.body.classList.remove('evil-mode');
    document.getElementById('glitch-overlay').style.opacity = "0";
    
    // Reset efektów wizualnych
    body.style.transform = "";       
    display.style.fontSize = "";     
    display.style.transform = "";    
    display.style.color = "";        
}

equalBtn.addEventListener('mouseover', () => {
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

function calculate() {
    resetEqualBtn();

    if (currentInput === "666") { triggerEvilMode(); return; }
    if (currentInput.includes('/0')) {
        if (currentInput.includes('0/0')) display.value = "mam granice";
        else display.value = "nie dzisiaj";
        equalBtn.disabled = true;
        setTimeout(() => { equalBtn.disabled = false; }, 3000);
        currentInput = "";
        return;
    }

    if (Math.random() > 0.95 && lastResult !== null) {
        display.value = lastResult;
        showComment("...to chyba to?");
        return;
    }

    historyEl.innerText = currentInput + " =";

    try {
        if (currentInput === "2+2") {
            const variants = ["4", "5", "zależy", "ok"];
            display.value = variants[Math.floor(Math.random() * variants.length)];
            currentInput = "";
            return;
        }

        if (currentInput === "69*69") { display.value = "skup się"; return; }
        if (currentInput === "420*0") { display.value = "i tak wyszło nic"; return; }
        if (currentInput === "666+1") { display.value = "👀"; return; }

        let result = eval(currentInput);
        result += grudgeOffset;

        if (Math.random() > 0.8 && !evilMode && Math.abs(result) > 10) {
            result += (Math.random() > 0.5 ? 1 : -1);
            showComment("na pewno dobrze");
        }

        let magicKey = null;
        if (specialResponses[currentInput]) magicKey = currentInput;
        else if (specialResponses[result]) magicKey = result;

        if (magicKey) {
            handleSpecialEffect(magicKey, result);
        } else {
            if (result.toString().length > 10) result = parseFloat(result.toFixed(6));
            display.value = result;
        }

        lastResult = display.value;
        currentInput = result.toString();

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
        case "slow":
            display.value = "...";
            setTimeout(() => { display.value = text; }, 1500);
            break;
        case "evil":
            triggerEvilMode();
            display.value = text;
            break;
        case "rotate":
            body.style.transform = "rotate(180deg)";
            display.value = text;
            break;
        case "scream":
            display.value = text;
            display.style.fontSize = "3rem";
            break;
        case "chaos":
            display.value = "WTF?";
            setInterval(() => {
                display.style.color = '#' + Math.floor(Math.random()*16777215).toString(16);
            }, 100);
            break;
        case "delay":
            display.value = "...liczę...";
            setTimeout(() => { display.value = calculatedResult; }, 2000);
            break;
        case "flip":
             display.style.transform = "scaleY(-1)";
             display.value = "666";
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