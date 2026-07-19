var usdRate = 0.000077; 
var eurRate = 0.000071;
var todos = [];
var doneTodosCount = 0;
var timerRunsCount = 0;

if (localStorage.getItem('statTodos')) { doneTodosCount = Number(localStorage.getItem('statTodos')); }
if (localStorage.getItem('statTimers')) { timerRunsCount = Number(localStorage.getItem('statTimers')); }

function updateStatsDOM() {
    var statTodosEl = document.getElementById('stat-todos');
    var statTimersEl = document.getElementById('stat-timers');
    var statRatingEl = document.getElementById('stat-rating');
    if (statTodosEl) { statTodosEl.innerText = doneTodosCount; }
    if (statTimersEl) { statTimersEl.innerText = timerRunsCount; }
    var rating = (doneTodosCount * 20) + (timerRunsCount * 30);
    if (rating > 100) { rating = 100; }
    if (statRatingEl) { statRatingEl.innerText = rating + "%"; }
}

var audio = new Audio('https://zeno.fm'); 
var isMusicPlaying = false;

function toggleMusic() {
    var btn = document.getElementById('musicBtn');
    if (!btn) return;
    if (isMusicPlaying) {
        audio.pause();
        btn.innerText = "🎵 Включить Lofi Радио";
        btn.style.background = "#a855f7";
        isMusicPlaying = false;
    } else {
        audio.play().then(function() {
            btn.innerText = "⏸️ Поставить на паузу";
            btn.style.background = "#28a745";
            isMusicPlaying = true;
        }).catch(function() {
            alert("Кликни на кнопку музыки ещё раз!");
        });
    }
}

function calc(op) {
    var n1 = Number(document.getElementById('num1').value);
    var n2 = Number(document.getElementById('num2').value);
    var r = 0;
    if (op === '+') { r = n1 + n2; }
    else if (op === '-') { r = n1 - n2; }
    else if (op === '*') { r = n1 * n2; }
    else if (op === '/') { r = n2 === 0 ? "На 0 нельзя!" : n1 / n2; }
    else if (op === '%') { r = n1 % n2; }
    else if (op === '^') { r = Math.pow(n1, n2); }
    else if (op === 'sqrt') { r = Math.sqrt(n1); }
    document.getElementById('calcResult').innerText = "Результат: " + r;
}

function convert() {
    var rub = Number(document.getElementById('convInput').value);
    var type = document.getElementById('convType').value;
    var currentRate = type === 'usd' ? usdRate : eurRate; 
    var sym = type === 'usd' ? '$' : '€';
    document.getElementById('convResult').innerText = "Итого: " + (rub * currentRate).toFixed(2) + " " + sym;
}

function addTodo() {
    var txt = document.getElementById('todoInput').value;
    if (txt) { todos.push({text: txt, done: false}); document.getElementById('todoInput').value = ''; saveAndRender(); }
}
function toggleTodo(i) { 
    todos[i].done = !todos[i].done;
    if (todos[i].done) { doneTodosCount++; localStorage.setItem('statTodos', doneTodosCount); } 
    else { if (doneTodosCount > 0) { doneTodosCount--; } localStorage.setItem('statTodos', doneTodosCount); }
    updateStatsDOM(); saveAndRender(); 
}
function deleteTodo(i) { todos.splice(i, 1); saveAndRender(); }
function saveAndRender() { localStorage.setItem('myTodos', JSON.stringify(todos)); render(); }
function render() {
    var list = document.getElementById('todoList');
    if (!list) return;
    list.innerHTML = '';
    todos.forEach(function(t, i) {
        var checkedClass = t.done ? 'completed' : '';
        list.innerHTML += '<li class="todo-item"><span class="' + checkedClass + '" onclick="toggleTodo(' + i + ')" style="cursor:pointer;">' + t.text + '</span><button style="background:#dc3545; padding:2px 6px;" onclick="deleteTodo(' + i + ')">✕</button></li>';
    });
}

var timer; var timeLeft = 1500; var isRunning = false;
function changeTimerDuration() { if (!isRunning) { var selectEl = document.getElementById('timerMinutes'); if (selectEl) { timeLeft = Number(selectEl.value) * 60; } updateTimerDisplay(); } }
function updateTimerDisplay() { var m = Math.floor(timeLeft / 60).toString().padStart(2, '0'); var s = (timeLeft % 60).toString().padStart(2, '0'); var displayEl = document.getElementById('timer-display'); if (displayEl) { displayEl.innerText = m + ':' + s; } }
defineTimerLogic();

function defineTimerLogic() {
    window.toggleTimer = function() {
        if (isRunning) { clearInterval(timer); document.getElementById('timerBtn').innerText = 'Старт'; } 
        else { 
            var selectMinutes = document.getElementById('timerMinutes'); if (selectMinutes) { selectMinutes.disabled = true; }
            timerRunsCount++; localStorage.setItem('statTimers', timerRunsCount); updateStatsDOM();
            timer = setInterval(function() { timeLeft--; updateTimerDisplay(); if (timeLeft <= 0) { clearInterval(timer); alert('Время вышло!'); resetTimer(); } }, 1000);
            document.getElementById('timerBtn').innerText = 'Пауза';
        }
        isRunning = !isRunning;
    };
    window.resetTimer = function() { 
        clearInterval(timer); isRunning = false; var selectMinutes = document.getElementById('timerMinutes'); if (selectMinutes) { selectMinutes.disabled = false; }
        timeLeft = (selectMinutes ? Number(selectMinutes.value) : 25) * 60; document.getElementById('timerBtn').innerText = 'Старт'; updateTimerDisplay(); 
    };
}

var secret = Math.floor(Math.random() * 100) + 1; var attempts = 0;
function checkGuess() {
    var g = Number(document.getElementById('guessInput').value); attempts++; var out = document.getElementById('gameResult');
    if (g === secret) { out.innerText = "🎉 Угадано! Число " + secret + ". Попыток: " + attempts; }
    else if (g < secret) { out.innerText = "📉 Мало! Попыток: " + attempts; }
    else { out.innerText = "📈 Много! Попыток: " + attempts; }
}
function resetGame() { secret = Math.floor(Math.random() * 100) + 1; attempts = 0; document.getElementById('gameResult').innerText = 'Удачи! Попыток: 0'; document.getElementById('guessInput').value = ''; }

function changeAdvancedTheme() {
    var selectEl = document.getElementById('themeSelect'); if (!selectEl) return; var selectedTheme = selectEl.value; document.body.style.backgroundImage = "none";
    if (selectedTheme === 'light') { applyColors('#f4f7f6', '#ffffff', '#333333', '#cccccc'); } 
    else if (selectedTheme === 'dark') { applyColors('#1e1e24', '#2a2a32', '#ffffff', '#444444'); } 
    else if (selectedTheme === 'neon-blue') { applyColors('#0d1117', '#161b22', '#58a6ff', '#1f6feb'); } 
    else if (selectedTheme === 'matrix') { applyColors('#000000', '#0d0d0d', '#00ff00', '#00aa00'); } 
    else if (selectedTheme === 'space-bg') { document.body.style.backgroundImage = "url('https://unsplash.com')"; document.body.style.backgroundSize = "cover"; document.body.style.backgroundAttachment = "fixed"; applyColors('transparent', 'rgba(20, 20, 35, 0.75)', '#ffffff', '#a855f7'); }
    localStorage.setItem('myAdvancedTheme', selectedTheme);
}

function applyColors(bg, cardBg, text, border) {
    document.body.style.backgroundColor = bg; document.body.style.color = text;
    var boxes = document.querySelectorAll('.box'); boxes.forEach(function(box) { box.style.backgroundColor = cardBg; box.style.color = text; });
    var inputs = document.querySelectorAll('input, select'); inputs.forEach(function(input) { input.style.backgroundColor = cardBg === 'transparent' ? 'rgba(0,0,0,0.4)' : cardBg; input.style.color = text; input.style.borderColor = border; });
}

var savedAdvancedTheme = localStorage.getItem('myAdvancedTheme') || 'light';
var selectThemeEl = document.getElementById('themeSelect'); if (selectThemeEl) { selectThemeEl.value = savedAdvancedTheme; }
var savedTodos = localStorage.getItem('myTodos'); if (savedTodos) { todos = JSON.parse(savedTodos); }

render(); updateStatsDOM(); setTimeout(changeAdvancedTheme, 150);

var hour = new Date().getHours(); var welcomeEl = document.getElementById('welcome-msg');
if (welcomeEl) {
    if (hour >= 5 && hour < 12) { welcomeEl.innerText = "Доброе утро, Амирхон!"; }
    else if (hour >= 12 && hour < 18) { welcomeEl.innerText = "Добрый день, Амирхон!"; }
    else if (hour >= 18 && hour < 23) { welcomeEl.innerText = "Добрый вечер, Амирхон!"; }
    else { welcomeEl.innerText = "Доброй ночи, Амирхон!"; }
}
function toggleTheme() {}
