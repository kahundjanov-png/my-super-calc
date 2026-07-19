// --- ЧАСТЬ 1: БАЗА, МУЗЫКА И ЗВУКИ ---
var usdRate = 0.000077, eurRate = 0.000071, todos = [];
var doneTodosCount = Number(localStorage.getItem('statTodos')) || 0;
var timerRunsCount = Number(localStorage.getItem('statTimers')) || 0;

function updateStatsDOM() {
    if (document.getElementById('stat-todos')) document.getElementById('stat-todos').innerText = doneTodosCount;
    if (document.getElementById('stat-timers')) document.getElementById('stat-timers').innerText = timerRunsCount;
    var rating = Math.min((doneTodosCount * 20) + (timerRunsCount * 30), 100);
    if (document.getElementById('stat-rating')) document.getElementById('stat-rating').innerText = rating + "%";
}

var audio = new Audio('./music.mp3'), isMusicPlaying = false;
function toggleMusic() {
    var btn = document.getElementById('musicBtn'); if (!btn) return;
    if (isMusicPlaying) { audio.pause(); btn.innerText = "🎵 Включить Lofi Радио"; btn.style.background = "#a855f7"; } 
    else { audio.play().then(function() { btn.innerText = "⏸️ Пауза"; btn.style.background = "#28a745"; }).catch(function(){ alert("Нажми кнопку ещё раз!"); }); }
    isMusicPlaying = !isMusicPlaying;
}

function playLaserSound() {
    try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        var osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.type = 'sine'; osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.1);
    } catch(e) {}
}
// --- ЧАСТЬ 2: КАЛЬКУЛЯТОР, ДЕЛА И ТАЙМЕР ---
function calc(op) {
    var n1 = Number(document.getElementById('num1').value), n2 = Number(document.getElementById('num2').value), r = 0;
    if (op === '+') r = n1 + n2; if (op === '-') r = n1 - n2; if (op === '*') r = n1 * n2;
    if (op === '/') r = n2 === 0 ? "На 0 нельзя!" : n1 / n2; if (op === '%') r = n1 % n2;
    if (op === '^') r = Math.pow(n1, n2); if (op === 'sqrt') r = Math.sqrt(n1);
    document.getElementById('calcResult').innerText = "Результат: " + r;
}

function convert() {
    var rub = Number(document.getElementById('convInput').value), type = document.getElementById('convType').value;
    var rate = type === 'usd' ? usdRate : eurRate, sym = type === 'usd' ? '$' : '€';
    document.getElementById('convResult').innerText = "Итого: " + (rub * rate).toFixed(2) + " " + sym;
}

function addTodo() { var txt = document.getElementById('todoInput').value; if (txt) { todos.push({text: txt, done: false}); document.getElementById('todoInput').value = ''; saveAndRender(); } }
function toggleTodo(i) { 
    todos[i].done = !todos[i].done; doneTodosCount += todos[i].done ? 1 : -1; doneTodosCount = Math.max(0, doneTodosCount);
    localStorage.setItem('statTodos', doneTodosCount); updateStatsDOM(); saveAndRender(); 
}
function deleteTodo(i) { todos.splice(i, 1); saveAndRender(); }
function saveAndRender() { localStorage.setItem('myTodos', JSON.stringify(todos)); render(); }
function render() {
    var list = document.getElementById('todoList'); if (!list) return; list.innerHTML = '';
    todos.forEach(function(t, i) { list.innerHTML += '<li class="todo-item"><span class="' + (t.done?'completed':'') + '" onclick="toggleTodo(' + i + ')" style="cursor:pointer;">' + t.text + '</span><button style="background:#dc3545; padding:2px 6px;" onclick="deleteTodo(' + i + ')">✕</button></li>'; });
}

var timer, timeLeft = 1500, isRunning = false;
function changeTimerDuration() { if (!isRunning) { timeLeft = Number(document.getElementById('timerMinutes').value) * 60; updateTimerDisplay(); } }
function updateTimerDisplay() { var m = Math.floor(timeLeft / 60).toString().padStart(2, '0'), s = (timeLeft % 60).toString().padStart(2, '0'); if (document.getElementById('timer-display')) document.getElementById('timer-display').innerText = m + ':' + s; }
function toggleTimer() {
    if (isRunning) { clearInterval(timer); document.getElementById('timerBtn').innerText = 'Старт'; } 
    else { 
        if (document.getElementById('timerMinutes')) document.getElementById('timerMinutes').disabled = true;
        timerRunsCount++; localStorage.setItem('statTimers', timerRunsCount); updateStatsDOM();
        timer = setInterval(function() { timeLeft--; updateTimerDisplay(); if (timeLeft <= 0) { clearInterval(timer); alert('Время вышло!'); resetTimer(); } }, 1000);
        document.getElementById('timerBtn').innerText = 'Пауза';
    }
    isRunning = !isRunning;
}
function resetTimer() { clearInterval(timer); isRunning = false; if (document.getElementById('timerMinutes')) document.getElementById('timerMinutes').disabled = false; timeLeft = (document.getElementById('timerMinutes') ? Number(document.getElementById('timerMinutes').value) : 25) * 60; document.getElementById('timerBtn').innerText = 'Старт'; updateTimerDisplay(); }
// --- ЧАСТЬ 3: ИГРЫ, ТЕМЫ И СТАРТ ---
var secret = Math.floor(Math.random() * 100) + 1, attempts = 0;
function checkGuess() {
    var g = Number(document.getElementById('guessInput').value); attempts++; var out = document.getElementById('gameResult');
    if (g === secret) out.innerText = "🎉 Угадано число " + secret + "! Попыток: " + attempts;
    else out.innerText = g < secret ? "📉 Мало! Попыток: " + attempts : "📈 Много! Попыток: " + attempts;
}
function resetGame() { secret = Math.floor(Math.random() * 100) + 1; attempts = 0; document.getElementById('gameResult').innerText = 'Удачи! Попыток: 0'; document.getElementById('guessInput').value = ''; }

var score = Number(localStorage.getItem('clickScore')) || 0, clickPower = Number(localStorage.getItem('clickPower')) || 1, upgradePrice = Number(localStorage.getItem('upgradePrice')) || 10, autoIncome = Number(localStorage.getItem('autoIncome')) || 0, autoclickerPrice = Number(localStorage.getItem('autoclickerPrice')) || 50;
function updateClickerDOM() {
    if (document.getElementById('click-score')) document.getElementById('click-score').innerText = "Монет: " + score;
    if (document.getElementById('click-power-info')) document.getElementById('click-power-info').innerText = "Сила клика: " + clickPower + " | Пассивный доход: " + autoIncome + "/сек";
    if (document.getElementById('upgradeBtn')) document.getElementById('upgradeBtn').innerText = "Улучшить клик (Цена: " + upgradePrice + ")";
    if (document.getElementById('autoclickBtn')) document.getElementById('autoclickBtn').innerText = "Робот-шахтёр +1/сек (Цена: " + autoclickerPrice + ")";
    if (document.getElementById('miners-count')) document.getElementById('miners-count').innerText = "Нанято роботов-шахтёров: " + autoIncome + " 🤖";
    if (document.getElementById('clicker-lvl')) document.getElementById('clicker-lvl').innerText = "🌟 ТВОЙ УРОВЕНЬ: " + (Math.floor(score / 300) + 1) + " 🌟";
    var planet = document.getElementById('click-object'); if (planet) planet.innerText = score >= 500 ? "🌌" : (score >= 100 ? "🪐" : "🌍");
}
function doClick(e) {
    score += clickPower; playLaserSound(); var p = document.getElementById('click-object');
    if (p) { p.style.transform = "scale(0.85)"; setTimeout(function() { p.style.transform = "scale(1)"; }, 100); }
    var num = document.createElement('div'); num.innerText = "+" + clickPower; num.style.position = 'absolute'; num.style.left = '45%'; num.style.top = '0px'; num.style.fontSize = '24px'; num.style.fontWeight = 'bold'; num.style.color = '#ffc107'; num.style.pointerEvents = 'none'; num.style.transition = 'all 0.6s ease-out'; p.parentElement.appendChild(num); setTimeout(function() { num.style.transform = 'translateY(-60px)'; num.style.opacity = '0'; }, 10); setTimeout(function() { num.remove(); }, 600);
    saveClickerProgress();
}
function buyUpgrade() { if (score >= upgradePrice) { score -= upgradePrice; clickPower++; upgradePrice = Math.round(upgradePrice * 1.5); saveClickerProgress(); } else { alert("Недостаточно монеток!"); } }
function buyAutoclicker() { if (score >= autoclickerPrice) { score -= autoclickerPrice; autoIncome++; autoclickerPrice = Math.round(autoclickerPrice * 1.6); saveClickerProgress(); } else { alert("Недостаточно монеток!"); } }
function resetClickerGame() { if (confirm("Обнулить прогресс кликера?")) { score = 0; clickPower = 1; upgradePrice = 10; autoIncome = 0; autoclickerPrice = 50; saveClickerProgress(); } }
function saveClickerProgress() { localStorage.setItem('clickScore', score); localStorage.setItem('clickPower', clickPower); localStorage.setItem('upgradePrice', upgradePrice); localStorage.setItem('autoIncome', autoIncome); localStorage.setItem('autoclickerPrice', autoclickerPrice); updateClickerDOM(); }
setInterval(function() { if (autoIncome > 0) { score += autoIncome; saveClickerProgress(); } }, 1000);

function changeAdvancedTheme() {
    var selectedTheme = document.getElementById('themeSelect') ? document.getElementById('themeSelect').value : 'light';
    document.body.style.backgroundImage = "none";
    if (selectedTheme === 'light') applyColors('#f4f7f6', '#ffffff', '#333333', '#cccccc');
    if (selectedTheme === 'dark') applyColors('#1e1e24', '#2a2a32', '#ffffff', '#444444');
    if (selectedTheme === 'neon-blue') applyColors('#0d1117', '#161b22', '#58a6ff', '#1f6feb');
    if (selectedTheme === 'matrix') applyColors('#000000', '#0d0d0d', '#00ff00', '#00aa00');
    if (selectedTheme === 'space-bg') { document.body.style.backgroundImage = "url('https://unsplash.com')"; document.body.style.backgroundSize = "cover"; document.body.style.backgroundAttachment = "fixed"; applyColors('transparent', 'rgba(20, 20, 35, 0.75)', '#ffffff', '#a855f7'); }
    localStorage.setItem('myAdvancedTheme', selectedTheme);
}
function applyColors(bg, cardBg, text, border) {
    document.body.style.backgroundColor = bg; document.body.style.color = text;
    document.querySelectorAll('.box').forEach(function(b) { b.style.backgroundColor = cardBg; b.style.color = text; });
    document.querySelectorAll('input, select').forEach(function(i) { i.style.backgroundColor = cardBg==='transparent'?'rgba(0,0,0,0.4)':cardBg; i.style.color = text; i.style.borderColor = border; });
}

var savedTheme = localStorage.getItem('myAdvancedTheme') || 'light';
if (document.getElementById('themeSelect')) document.getElementById('themeSelect').value = savedTheme;
if (localStorage.getItem('myTodos')) todos = JSON.parse(localStorage.getItem('myTodos'));

render(); updateStatsDOM(); updateClickerDOM(); setTimeout(changeAdvancedTheme, 150);

var hour = new Date().getHours(), msg = "Привет, Амирхон!";
if (hour >= 5 && hour < 12) msg = "Доброе утро, Амирхон!";
else if (hour >= 12 && hour < 18) msg = "Добрый день, Амирхон!";
else if (hour >= 18 && hour < 23) msg = "Добрый вечер, Амирхон!";
else msg = "Доброй ночи, Амирхон!";
if (document.getElementById('welcome-msg')) document.getElementById('welcome-msg').innerText = msg;
function toggleTheme() {}
