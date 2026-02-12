const display = document.getElementById('display');
const bubble = document.getElementById('comment-bubble');
const equalBtn = document.getElementById('equal-btn');
const historyEl = document.getElementById('history');

// --- POPRAWKA: Rozdzielamy body strony od body kalkulatora ---
const body = document.getElementById('main-body'); // Cała strona (tło)
const calculatorBody = document.getElementById('calculator-body'); // Sam kalkulator

// --- NOWE ELEMENTY (TEGO BRAKOWAŁO) ---
const popeClock = document.getElementById('pope-clock');
const swordsOverlay = document.getElementById('swords-overlay');
const deadPixel = document.getElementById('dead-pixel');

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

// --- LISTA SPECJALNYCH LICZB ---
const specialResponses = {
    // STARE
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

    // NOWE (Twoje propozycje)
    "2137": { text: "Jeszcze jak!", action: "cream" }, 
    "67": { text: "I'm six seven 😎", action: "sixseven" },    
    "500": { text: "Daję, ale zabieram", action: "inflation" }, 
    "800": { text: "Daję, ale zabieram", action: "inflation" }, 
    "60": { text: "ROZPRUŁEŚ SIĘ!", action: "police" }, 
    "1410": { text: "Dwa nagie miecze", action: "swords" } 
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
        <li>Papieska godzina zmienia kolory. (NOWE)</li>
        <li>Podziel 1 przez 0, żeby zobaczyć kosmos. (NOWE)</li>
        <li>Grunwaldzkie miecze. (NOWE)</li>
        <li>500 plus rozdaje monety. (NOWE)</li>
        <li>Sześćdziesiona wzywa bagiety. (NOWE)</li>
        <li>Six Seven - wiesz o co chodzi. (NOWE)</li>
        <li>Uśmiech pojawia się, gdy liczba ma dwie takie same cyfry.</li>
        <li>Zielona liczba kojarzy się z dymem.</li>
        <li>Wpisz liczbę, którą ludzie łączą z diabłem.</li>
        <li>Odwróć kalkulator, a zobaczysz coś nieoczekiwanego.</li>
    </ul>
`;

function startHelpSequence() {
    helpStep = 0;
    updateModal();
    helpModal.classList.add('visible'); 
}

function closeHelp() {
    helpModal.classList.remove('visible');
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
        currentInput = "2137"; 
        display.value = "2137";
    }
}

function updateModal() {
    const step = trollSteps[helpStep];
    modalTitle.innerText = "OSTRZEŻENIE"; 
    modalText.innerText = step.text;
    modalAction.innerText = step.btn;
    if (helpStep === 5) {
        if (Math.random() > 0.5) modalText.innerText += " (Ta rada jest kłamstwem)";
    }
}
helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) closeHelp();
});


// --- STANDARDOWA LOGIKA KALKULATORA ---

function showComment(text) {
    bubble.innerText = text;
    bubble.style.opacity = "1";
    setTimeout(() => { bubble.style.opacity = "0"; }, 3000);
}

// --- FUNKCJA LOSOWYCH ZDARZEŃ ---
function triggerRandomEvent() {
    const chance = Math.random();
    
    // 1% szans na Flashbang
    if (chance < 0.01) {
        body.classList.add('flashbang-active');
        setTimeout(() => body.classList.remove('flashbang-active'), 2000);
        showComment("OCZY BOLĄ?");
    }
    // 2% szans na Grawitację (przyciski spadają)
    else if (chance > 0.01 && chance < 0.03) {
        document.querySelectorAll('.btn').forEach(btn => {
            const rot = (Math.random() - 0.5) * 60;
            const y = Math.random() * 200 + 50;
            btn.style.transform = `translateY(${y}px) rotate(${rot}deg)`;
            btn.style.pointerEvents = 'none'; // nie da się klikać jak spadną
        });
        showComment("Awaria grawitacji...");
        // Reset po 3 sek
        setTimeout(() => {
            document.querySelectorAll('.btn').forEach(btn => {
                btn.style.transform = '';
                btn.style.pointerEvents = '';
            });
        }, 3000);
    }
    // 3% szans na Martwy Piksel
    else if (chance > 0.03 && chance < 0.06) {
        if(deadPixel) {
             deadPixel.style.opacity = '1';
             setTimeout(() => deadPixel.style.opacity = '0', 5000);
        }
    }
}

function append(val) {
    triggerRandomEvent(); 

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
    
    // RESET WSZYSTKICH TRYBÓW
    document.body.classList.remove('evil-mode');
    document.body.classList.remove('cream-mode'); 
    document.body.classList.remove('police-mode'); 
    document.getElementById('glitch-overlay').style.opacity = "0";
    if(popeClock) popeClock.style.opacity = "0"; 
    if(swordsOverlay) swordsOverlay.style.opacity = "0"; 
    
    // Reset wizualny
    body.style.transform = "";       
    display.style.fontSize = "";     
    display.style.transform = "";    
    display.style.color = ""; 
    
    // Reset przycisków (jeśli była Czarna Dziura)
    document.querySelectorAll('.btn').forEach(btn => {
        btn.classList.remove('sucked-in');
        btn.style.transform = '';
        btn.style.opacity = '1';
        btn.style.pointerEvents = '';
    });       
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

    // OBSŁUGA CZARNEJ DZIURY (1/0)
    if (currentInput === "1/0") {
        display.value = "BLACK HOLE";
        document.querySelectorAll('.btn').forEach((btn, i) => {
            setTimeout(() => {
                btn.classList.add('sucked-in'); // Klasa CSS wsysania
            }, i * 50);
        });
        // Rozrzucenie przycisków po chwili
        setTimeout(() => {
            document.querySelectorAll('.btn').forEach(btn => {
                btn.classList.remove('sucked-in');
                const x = (Math.random() - 0.5) * 300;
                const y = (Math.random() - 0.5) * 300;
                btn.style.transform = `translate(${x}px, ${y}px) rotate(${Math.random()*360}deg)`;
            });
            display.value = "ZBIERAJ JE";
        }, 2000);
        currentInput = "";
        return;
    }

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
            if(body) body.style.transform = "rotate(180deg)";
            display.value = text;
            break;
        case "scream": 
            display.value = text;
            display.style.fontSize = "3rem";
            break;
        
        // --- NOWE EFEKTY ---
        case "cream": // 2137
            body.classList.add('cream-mode');
            if(popeClock) popeClock.style.opacity = '1';
            display.value = text;
            // Spawn latającej kremówki
            const cake = document.createElement('div');
            cake.innerHTML = '🍰';
            cake.className = 'flying-object';
            document.body.appendChild(cake);
            setTimeout(() => cake.remove(), 4000);
            break;
        
        case "inflation": // 500/800
            display.value = calculatedResult * 0.8; 
            showComment("Inflacja: -20%");
            // Spawn monet
            for(let i=0; i<10; i++) {
                setTimeout(() => {
                    const coin = document.createElement('div');
                    coin.innerHTML = '🪙';
                    coin.className = 'falling-coin';
                    coin.style.left = Math.random() * 100 + 'vw';
                    coin.style.animationDuration = (Math.random() + 1) + 's';
                    document.body.appendChild(coin);
                    setTimeout(() => coin.remove(), 2000);
                }, i * 100);
            }
            break;

        case "police": // 60
            body.classList.add('police-mode');
            display.value = text;
            break;

        case "sixseven": // 67
            display.value = text;
            body.style.transform = "scale(1.1)"; 
            setTimeout(() => body.style.transform = "scale(1)", 200);
            break;

        case "swords": // 1410
            if(swordsOverlay) swordsOverlay.style.opacity = '1';
            display.value = text;
            setTimeout(() => { if(swordsOverlay) swordsOverlay.style.opacity = '0'; }, 3000);
            break;
        // ------------------

        case "chaos": // 420.69
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