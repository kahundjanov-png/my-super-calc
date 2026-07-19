var usdRate = 0.000077; 
var eurRate = 0.000071;

var todos = [];

function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme');
    var nextTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('myTheme', nextTheme);
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
    if (txt) { 
        todos.push({text: txt, done: false}); 
        document.getElementById('todoInput').value = ''; 
        saveAndRender(); 
    }
}
function toggleTodo(i) { 
    todos[i].done = !todos[i].done; 
    saveAndRender(); 
}
function deleteTodo(i) { 
    todos.splice(i, 1); 
    saveAndRender(); 
}
function saveAndRender() {
    localStorage.setItem('myTodos', JSON.stringify(todos));
    render();
}
function render() {
    var list = document.getElementById('todoList');
    if(!list) return;
    list.innerHTML = '';
    todos.forEach(function(t, i) {
        var checkedClass = t.done ? 'completed' : '';
        list.innerHTML += '<li class="todo-item">' +
            '<span class="' + checkedClass + '" onclick="toggleTodo(' + i + ')" style="cursor:pointer;">' + t.text + '</span>' +
            '<button style="background:#dc3545; padding:2px 6px;" onclick="deleteTodo(' + i + ')">✕</button>' +
        '</li>';
    });
}

// --- НАСТРАИВАЕМЫЙ ТАЙМЕР ---
var timer;
var timeLeft = 1500; // 25 минут по умолчанию (25 * 60)
var isRunning = false;

// Функция, которая меняет время, когда ты выбираешь минуты в списке
function changeTimerDuration() {
    if (!isRunning) {
        var selectEl = document.getElementById('timerMinutes');
        var minutes = Number(selectEl.value);
        timeLeft = minutes * 60;
        updateTimerDisplay();
    }
}

// Обновление цифр на экране
function updateTimerDisplay() {
    var m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    var s = (timeLeft % 60).toString().padStart(2, '0');
    var displayEl = document.getElementById('timer-display');
    if (displayEl) { displayEl.innerText = m + ':' + s; }
}

function toggleTimer() {
    if (isRunning) { 
        clearInterval(timer); 
        document.getElementById('timerBtn').innerText = 'Старт'; 
    } else { 
        // Блокируем выбор минут во время работы таймера, чтобы время не сбивалось
        document.getElementById('timerMinutes').disabled = true;

        timer = setInterval(function() { 
            timeLeft--; 
            updateTimerDisplay();
            if (timeLeft <= 0) { 
                clearInterval(timer); 
                alert('Время вышло! Отличная работа.'); 
                resetTimer(); 
            } 
        }, 1000);
        document.getElementById('timerBtn').innerText = 'Пауза';
    }
    isRunning = !isRunning;
}

function resetTimer() { 
    clearInterval(timer); 
    isRunning = false; 
    
    // Разблокируем выбор времени обратно
    document.getElementById('timerMinutes').disabled = false;
    
    // Сбрасываем время на то, которое сейчас выбрано в списке
    var selectEl = document.getElementById('timerMinutes');
    var minutes = selectEl ? Number(selectEl.value) : 25;
    timeLeft = minutes * 60;
    
    document.getElementById('timerBtn').innerText = 'Старт'; 
    updateTimerDisplay(); 
}


var secret = Math.floor(Math.random() * 100) + 1;
var attempts = 0;
function checkGuess() {
    var g = Number(document.getElementById('guessInput').value);
    attempts++;
    var out = document.getElementById('gameResult');
    if (g === secret) { out.innerText = "🎉 Угадано! Число " + secret + ". Попыток: " + attempts; }
    else if (g < secret) { out.innerText = "📉 Мало! Попыток: " + attempts; }
    else { out.innerText = "📈 Много! Попыток: " + attempts; }
}
function resetGame() { 
    secret = Math.floor(Math.random() * 100) + 1; 
    attempts = 0; 
    document.getElementById('gameResult').innerText = 'Удачи! Попыток: 0'; 
    document.getElementById('guessInput').value = ''; 
}

var score = 0;
var clickPower = 1;
var upgradePrice = 10;
var autoIncome = 0;
var autoclickerPrice = 50;

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
    
    if(scoreEl) scoreEl.innerText = "Монет: " + score;
    if(powerEl) powerEl.innerText = "Сила клика: " + clickPower + " | Пассивный доход: " + autoIncome + "/сек";
    if(upgEl) upgEl.innerText = "Улучшить клик (Цена: " + upgradePrice + ")";
    if(autoEl) autoEl.innerText = "Робот-шахтёр +1/сек (Цена: " + autoclickerPrice + ")";
    if(minersEl) minersEl.innerText = "Нанято роботов-шахтёров: " + autoIncome + " 🤖";
    checkPlanetEvolution();
}

function checkPlanetEvolution() {
    var planet = document.getElementById('click-object');
    if (!planet) return;
    if (score >= 500) { planet.innerText = "🌌"; } 
    else if (score >= 100) { planet.innerText = "🪐"; } 
    else { planet.innerText = "🌍"; }
}

function doClick(event) {
    score = score + clickPower;
    var planet = document.getElementById('click-object');
    if(planet) {
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
    num.style.position = 'absolute';
    num.style.left = '45%';
    num.style.top = '0px';
    num.style.fontSize = '24px';
    num.style.fontWeight = 'bold';
    num.style.color = '#ffc107';
    num.style.pointerEvents = 'none';
    num.style.transition = 'all 0.6s ease-out';
    planet.parentElement.appendChild(num);
    setTimeout(function() {
        num.style.transform = 'translateY(-60px)';
        num.style.opacity = '0';
    }, 10);
    setTimeout(function() { num.remove(); }, 600);
}

function buyUpgrade() {
    if (score >= upgradePrice) {
        score = score - upgradePrice;
        clickPower = clickPower + 1;
        upgradePrice = Math.round(upgradePrice * 1.5);
        saveClickerProgress();
    } else { alert("Недостаточно монеток!"); }
}

function buyAutoclicker() {
    if (score >= autoclickerPrice) {
        score = score - autoclickerPrice;
        autoIncome = autoIncome + 1;
        autoclickerPrice = Math.round(autoclickerPrice * 1.6);
        saveClickerProgress();
    } else { alert("Недостаточно монеток!"); }
}

function saveClickerProgress() {
    localStorage.setItem('clickScore', score);
    localStorage.setItem('clickPower', clickPower);
    localStorage.setItem('upgradePrice', upgradePrice);
    localStorage.setItem('autoIncome', autoIncome);
    localStorage.setItem('autoclickerPrice', autoclickerPrice);
    updateClickerDOM();
}

setInterval(function() {
    if (autoIncome > 0) {
        score = score + autoIncome;
        saveClickerProgress();
    }
}, 1000);

// Инициализация при старте
var savedTheme = localStorage.getItem('myTheme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

var savedTodos = localStorage.getItem('myTodos');
if (savedTodos) { todos = JSON.parse(savedTodos); }
render();
updateClickerDOM();

var hour = new Date().getHours();
var welcomeEl = document.getElementById('welcome-msg');
if(welcomeEl) {
    if (hour >= 5 && hour < 12) { welcomeEl.innerText = "Доброе утро, Амирхон!"; }
    else if (hour >= 12 && hour < 18) { welcomeEl.innerText = "Добрый день, Амирхон!"; }
    else if (hour >= 18 && hour < 23) { welcomeEl.innerText = "Добрый вечер, Амирхон!"; }
    else { welcomeEl.innerText = "Доброй ночи, Амирхон!"; }
}


   

