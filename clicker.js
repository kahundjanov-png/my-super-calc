// --- ОТДЕЛЬНЫЙ ФАЙЛ ИГРЫ-КЛИКЕРА ---
var score = 0;
var clickPower = 1;
var upgradePrice = 10;
var autoIncome = 0;
var autoclickerPrice = 50;
var playerLvl = 1;

if (localStorage.getItem('clickScore')) score = Number(localStorage.getItem('clickScore'));
if (localStorage.getItem('clickPower')) clickPower = Number(localStorage.getItem('clickPower'));
if (localStorage.getItem('upgradePrice')) upgradePrice = Number(localStorage.getItem('upgradePrice'));
if (localStorage.getItem('autoIncome')) autoIncome = Number(localStorage.getItem('autoIncome'));
if (localStorage.getItem('autoclickerPrice')) autoclickerPrice = Number(localStorage.getItem('autoclickerPrice'));

function updateClickerDOM() {
    var scoreEl = document.getElementById('click-score');
    var powerEl = document.getElementById('click-power-info');
    var upgEl = document.getElementById('upgradeBtn');
    var autoEl = document.getElementById('autoclickBtn');
    var minersEl = document.getElementById('miners-count');
    var lvlEl = document.getElementById('clicker-lvl');
    
    playerLvl = Math.floor(score / 300) + 1;
    if (lvlEl) { lvlEl.innerText = "🌟 ТВОЙ УРОВЕНЬ: " + playerLvl + " 🌟"; }

    if (scoreEl) { scoreEl.innerText = "Монет: " + score; }
    if (powerEl) { powerEl.innerText = "Сила клика: " + clickPower + " | Пассивный доход: " + autoIncome + "/сек"; }
    if (upgEl) { upgEl.innerText = "Улучшить клик (Цена: " + upgradePrice + ")"; }
    if (autoEl) { autoEl.innerText = "Робот-шахтёр +1/сек (Цена: " + autoclickerPrice + ")"; }
    if (minersEl) { minersEl.innerText = "Нанято роботов-шахтёров: " + autoIncome + " 🤖"; }
    checkPlanetEvolution();
}

function checkPlanetEvolution() {
    var planet = document.getElementById('click-object');
    if (!planet) return;
    if (score >= 500) { planet.innerText = "🌌"; } 
    else if (score >= 100) { planet.innerText = "🪐"; } 
    else { planet.innerText = "🌍"; }
}

function playLaserSound() {
    try {
        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var oscillator = audioCtx.createOscillator();
        var gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        oscillator.connect(gainNode); gainNode.connect(audioCtx.destination);
        oscillator.start(); oscillator.stop(audioCtx.currentTime + 0.1);
    } catch(e) {}
}

function doClick(event) {
    score = score + clickPower;
    playLaserSound();
    var planet = document.getElementById('click-object');
    if (planet) {
        planet.style.transform = "scale(0.85)";
        setTimeout(function() { planet.style.transform = "scale(1)"; }, 100);
    }
    createFloatingText(event);
    saveClickerProgress();
}

function createFloatingText(event) {
    var planet = document.getElementById('click-object');
    if (!planet) return;
    var num = document.createElement('div');
    num.innerText = "+" + clickPower;
    num.style.position = 'absolute'; num.style.left = '45%'; num.style.top = '0px';
    num.style.fontSize = '24px'; num.style.fontWeight = 'bold'; num.style.color = '#ffc107';
    num.style.pointerEvents = 'none'; num.style.transition = 'all 0.6s ease-out';
    planet.parentElement.appendChild(num);
    setTimeout(function() { num.style.transform = 'translateY(-60px)'; num.style.opacity = '0'; }, 10);
    setTimeout(function() { num.remove(); }, 600);
}

function buyUpgrade() {
    if (score >= upgradePrice) {
        score = score - upgradePrice; clickPower = clickPower + 1; upgradePrice = Math.round(upgradePrice * 1.5); saveClickerProgress();
    } else { alert("Недостаточно монеток!"); }
}

function buyAutoclicker() {
    if (score >= autoclickerPrice) {
        score = score - autoclickerPrice; autoIncome = autoIncome + 1; autoclickerPrice = Math.round(autoclickerPrice * 1.6); saveClickerProgress();
    } else { alert("Недостаточно монеток!"); }
}

function resetClickerGame() {
    if (confirm("Хочешь полностью обнулить монеты и уровень?")) {
        score = 0; clickPower = 1; upgradePrice = 10; autoIncome = 0; autoclickerPrice = 50; saveClickerProgress();
    }
}

function saveClickerProgress() {
    localStorage.setItem('clickScore', score); localStorage.setItem('clickPower', clickPower);
    localStorage.setItem('upgradePrice', upgradePrice); localStorage.setItem('autoIncome', autoIncome);
    localStorage.setItem('autoclickerPrice', autoclickerPrice);
    updateClickerDOM();
}

setInterval(function() { if (autoIncome > 0) { score = score + autoIncome; saveClickerProgress(); } }, 1000);

updateClickerDOM();
