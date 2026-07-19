// === ЧАСТЬ 1: НАСТРОЙКИ, СТАТИСТИКА, ВОДА, ЗАКЛАДКИ И КАЛЬКУЛЯТОР ===
var usdRate = 0.000077, eurRate = 0.000071, todos = [], myLinks = [];
var waterCount = Number(localStorage.getItem('waterCount')) || 0;
var doneTodos = Number(localStorage.getItem('statTodos')) || 0;
var timerRuns = Number(localStorage.getItem('statTimers')) || 0;

function updateStats() {
    document.getElementById('stat-todos').innerText = doneTodos;
    document.getElementById('stat-timers').innerText = timerRuns;
    document.getElementById('stat-rating').innerText = Math.min((doneTodos * 20) + (timerRuns * 30), 100) + "%";
}

function saveNote() { localStorage.setItem('myNote', document.getElementById('notePad').value); }
function addWater() { waterCount++; localStorage.setItem('waterCount', waterCount); renderWater(); }
function resetWater() { if(confirm("Сбросить?")) { waterCount = 0; localStorage.setItem('waterCount', 0); renderWater(); } }
function renderWater() { document.getElementById('waterCups').innerText = "🥛 × " + waterCount; }

function addLink() {
    var n = document.getElementById('linkName').value, u = document.getElementById('linkUrl').value;
    if (n && u) {
        if (!u.startsWith('http')) u = 'https://' + u;
        myLinks.push({name: n, url: u});
        localStorage.setItem('myLinks', JSON.stringify(myLinks));
        renderLinks();
        document.getElementById('linkName').value = '';
        document.getElementById('linkUrl').value = '';
    }
}
function deleteLink(i) { myLinks.splice(i, 1); localStorage.setItem('myLinks', JSON.stringify(myLinks)); renderLinks(); }
function renderLinks() {
    var l = document.getElementById('linkList'); l.innerHTML = '';
    myLinks.forEach(function(x, i) {
        l.innerHTML += '<li class="link-item"><a href="' + x.url + '" target="_blank">🔗 ' + x.name + '</a><button style="background:#dc3545;font-size:12px;padding:2px 6px;" onclick="deleteLink(' + i + ')">✕</button></li>';
    });
}

function calc(op) {
    var n1 = Number(document.getElementById('num1').value), n2 = Number(document.getElementById('num2').value), r = 0;
    if (op === '+') r = n1 + n2; if (op === '-') r = n1 - n2; if (op === '*') r = n1 * n2; if (op === '/') r = n2 === 0 ? "Error" : n1 / n2;
    document.getElementById('calcResult').innerText = "Результат: " + r;
}
function convert() {
    var v = Number(document.getElementById('convInput').value), t = document.getElementById('convType').value, r = t === 'usd' ? usdRate : eurRate;
    document.getElementById('convResult').innerText = "Итого: " + (v * r).toFixed(2) + (t === 'usd' ? ' $' : ' €');
}
// === ЧАСТЬ 2: ДЕЛА, ТАЙМЕР, ИГРЫ, ДИЗАЙН И СТАРТ САЙТА ===
function addTodo() { var t = document.getElementById('todoInput').value; if(t){ todos.push({text:t, done:false}); document.getElementById('todoInput').value=''; saveTodos(); } }
function toggleTodo(i) { todos[i].done=!todos[i].done; doneTodos+=todos[i].done?1:-1; doneTodos=Math.max(0,doneTodos); localStorage.setItem('statTodos', doneTodos); updateStats(); saveTodos(); }
function deleteTodo(i) { todos.splice(i,1); saveTodos(); }
function saveTodos() { localStorage.setItem('myTodos', JSON.stringify(todos)); renderTodos(); }
function renderTodos() { var l=document.getElementById('todoList'); l.innerHTML=''; todos.forEach(function(t,i){ l.innerHTML+='<li class="todo-item"><span class="'+(t.done?'completed':'')+'" onclick="toggleTodo('+i+')">'+t.text+'</span><button onclick="deleteTodo('+i+')" style="background:#dc3545;padding:2px 6px;">✕</button></li>'; }); }

var timer, timeLeft=1500, isRunning=false;
function changeTimer() { if(!isRunning) { timeLeft=Number(document.getElementById('timerMinutes').value)*60; updateTimer(); } }
function updateTimer() { var m=Math.floor(timeLeft/60).toString().padStart(2,'0'), s=(timeLeft%60).toString().padStart(2,'0'); document.getElementById('timer-display').innerText=m+':'+s; }
function toggleTimer() { if(isRunning){ clearInterval(timer); document.getElementById('timerBtn').innerText='Старт'; } else { document.getElementById('timerMinutes').disabled=true; timerRuns++; localStorage.setItem('statTimers', timerRuns); updateStats(); timer=setInterval(function(){ timeLeft--; updateTimer(); if(timeLeft<=0){ clearInterval(timer); alert('Время вышло!'); resetTimer(); } },1000); document.getElementById('timerBtn').innerText='Пауза'; } isRunning=!isRunning; }
function resetTimer() { clearInterval(timer); isRunning=false; document.getElementById('timerMinutes').disabled=false; timeLeft=Number(document.getElementById('timerMinutes').value)*60; document.getElementById('timerBtn').innerText='Старт'; updateTimer(); }

var secret=Math.floor(Math.random()*100)+1, attempts=0;
function checkGuess() { var g=Number(document.getElementById('guessInput').value); attempts++; var o=document.getElementById('gameResult'); if(g===secret)o.innerText="🎉 Угадал за "+attempts; else o.innerText=g<secret?"📉 Мало":"📈 Много"; }
function resetGame() { secret=Math.floor(Math.random()*100)+1; attempts=0; document.getElementById('gameResult').innerText='Удачи!'; }

var score=Number(localStorage.getItem('clickScore'))||0, clickPower=Number(localStorage.getItem('clickPower'))||1, upgradePrice=Number(localStorage.getItem('upgradePrice'))||10, autoIncome=Number(localStorage.getItem('autoIncome'))||0, autoclickerPrice=Number(localStorage.getItem('autoclickerPrice'))||50;
function updateClickerDOM() { document.getElementById('click-score').innerText="Монет: "+score; document.getElementById('click-power-info').innerText="Клик: "+clickPower+" | Авто: "+autoIncome+"/с"; document.getElementById('upgradeBtn').innerText="Клик ("+upgradePrice+")"; document.getElementById('autoclickBtn').innerText="Робот ("+autoclickerPrice+")"; document.getElementById('miners-count').innerText="Роботов: "+autoIncome; document.getElementById('clicker-lvl').innerText="🌟 ЛВЛ: "+(Math.floor(score/300)+1)+" 🌟"; document.getElementById('click-object').innerText=score>=500?"🌌":(score>=100?"🪐":"🌍"); }
function doClick(e) { score+=clickPower; try{var c=new(window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(600,c.currentTime);o.frequency.exponentialRampToValueAtTime(100,c.currentTime+0.1);g.gain.setValueAtTime(0.1,c.currentTime);g.gain.exponentialRampToValueAtTime(0.01,c.currentTime+0.1);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+0.1);}catch(x){} var p=document.getElementById('click-object'); p.style.transform="scale(0.8)"; setTimeout(function(){p.style.transform="scale(1)"},100); var n=document.createElement('div'); n.innerText="+"+clickPower; n.style.position='absolute'; n.style.left='45%'; n.style.fontSize='20px'; n.style.color='#ffc107'; n.style.transition='0.6s'; p.parentElement.appendChild(n); setTimeout(function(){n.style.transform='translateY(-50px)'; n.style.opacity='0'},10); setTimeout(function(){n.remove()},600); saveClicker(); }
function buyUpgrade() { if(score>=upgradePrice){ score-=upgradePrice; clickPower++; upgradePrice=Math.round(upgradePrice*1.5); saveClicker(); } else alert("Мало монет!"); }
function buyAutoclicker() { if(score>=autoclickerPrice){ score-=autoclickerPrice; autoIncome++; autoclickerPrice=Math.round(autoclickerPrice*1.6); saveClicker(); } else alert("Мало монет!"); }
function resetClicker() { if(confirm("Обнулить кликер?")){ score=0; clickPower=1; upgradePrice=10; autoIncome=0; autoclickerPrice=50; saveClicker(); } }
function saveClicker() { localStorage.setItem('clickScore',score); localStorage.setItem('clickPower',clickPower); localStorage.setItem('upgradePrice',upgradePrice); localStorage.setItem('autoIncome',autoIncome); localStorage.setItem('autoclickerPrice',autoclickerPrice); updateClickerDOM(); }
setInterval(function(){ if(autoIncome>0){ score+=autoIncome; saveClicker(); } },1000);

function playDice() { var p=Math.floor(Math.random()*6)+1, b=Math.floor(Math.random()*6)+1; document.getElementById('player-dice').innerText=p; document.getElementById('bot-dice').innerText=b; var r=document.getElementById('diceResult'); if(p>b){ r.innerText="🎉 Ты выиграл +50 монет!"; score+=50; saveClicker(); } else if(p<b) r.innerText="📉 Бот выиграл!"; else r.innerText="🤝 Ничья!"; }

function changeTheme() {
    var s=document.getElementById('themeSelect').value; document.body.style.backgroundImage="none";
    if(s==='light')applyColors('#f4f7f6','#ffffff','#333333','#cccccc'); if(s==='dark')applyColors('#1e1e24','#2a2a32','#ffffff','#444444'); if(s==='neon-blue')applyColors('#0d1117','#161b22','#58a6ff','#1f6feb'); if(s==='matrix')applyColors('#000000','#0d0d0d','#00ff00','#00aa00');
    if(s==='space-bg'){ document.body.style.backgroundImage="url('https://unsplash.com')"; document.body.style.backgroundSize="cover"; document.body.style.backgroundAttachment="fixed"; applyColors('transparent','rgba(20,20,35,0.75)','#ffffff','#a855f7'); }
    localStorage.setItem('myAdvancedTheme', s);
}
function applyColors(bg,cb,t,b) { document.body.style.backgroundColor=bg; document.body.style.color=t; document.querySelectorAll('.box').forEach(function(x){x.style.backgroundColor=cb; x.style.color=t;}); document.querySelectorAll('input, select, textarea').forEach(function(x){x.style.backgroundColor=cb==='transparent'?'rgba(0,0,0,0.4)':cb; x.style.color=t; x.style.borderColor=b;}); }

var savedTheme=localStorage.getItem('myAdvancedTheme')||'light'; document.getElementById('themeSelect').value=savedTheme;
if(localStorage.getItem('myTodos'))todos=JSON.parse(localStorage.getItem('myTodos')); if(localStorage.getItem('myLinks'))myLinks=JSON.parse(localStorage.getItem('myLinks')); if(localStorage.getItem('myNote'))document.getElementById('notePad').value=localStorage.getItem('myNote');

renderTodos(); renderWater(); renderLinks(); updateStats(); updateClickerDOM(); setTimeout(changeTheme,150);
var h=new Date().getHours(), m="Привет!"; if(h>=5&&h<12)m="Доброе утро, Амирхон!"; else if(h>=12&&h<18)m="Добрый день, Амирхон!"; else if(h>=18&&h<23)m="Добрый вечер, Амирхон!"; else m="Доброй ночи, Амирхон!";
document.getElementById('welcome-msg').innerText=m;
function toggleTheme() {}
