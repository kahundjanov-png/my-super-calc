var usdRate = 0.011;
var eurRate = 0.010;
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

var timer;
var timeLeft = 1500;
var isRunning = false;
function toggleTimer() {
    if (isRunning) { 
        clearInterval(timer); 
        document.getElementById('timerBtn').innerText = 'Старт'; 
    } else { 
        timer = setInterval(function() { 
            timeLeft--; 
            var m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            var s = (timeLeft % 60).toString().padStart(2, '0');
            document.getElementById('timer-display').innerText = m + ':' + s;
            if (timeLeft <= 0) { 
                clearInterval(timer); 
                alert('Время вышло!'); 
                resetTimer(); 
            } 
        }, 1000);
        document.getElementById('timerBtn').innerText = 'Пауза';
    }
    isRunning = !isRunning;
}
function resetTimer() { 
    clearInterval(timer); 
    timeLeft = 1500; 
    isRunning = false; 
    document.getElementById('timerBtn').innerText = 'Старт'; 
    document.getElementById('timer-display').innerText = "25:00"; 
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

var savedTheme = localStorage.getItem('myTheme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

var savedTodos = localStorage.getItem('myTodos');
if (savedTodos) { todos = JSON.parse(savedTodos); }
render();

var hour = new Date().getHours();
if (hour >= 5 && hour < 12) { document.getElementById('welcome-msg').innerText = "Доброе утро, Амирхон!"; }
else if (hour >= 12 && hour < 18) { document.getElementById('welcome-msg').innerText = "Добрый день, Амирхон!"; }
else if (hour >= 18 && hour < 23) { document.getElementById('welcome-msg').innerText = "Добрый evening, Амирхон!"; }
else { document.getElementById('welcome-msg').innerText = "Доброй ночи, Амирхон!"; }

fetch('https://er-api.com')
    .then(function(res) { return res.json(); })
    .then(function(data) {
        if (data && data.rates) {
            usdRate = data.rates.USD;
            eurRate = data.rates.EUR;
            document.getElementById('rates-info').innerText = "Курсы обновлены через API";
            convert();
        }
    })
    .catch(function() {
        document.getElementById('rates-info').innerText = "Сеть недоступна. Базовые курсы.";
    });
