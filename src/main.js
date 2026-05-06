/* ==========================================================
 * Desktop Goose · 前端逻辑（Tauri global API 版本）
 * ========================================================== */

// withGlobalTauri: true 之后，全部 API 都挂在 window.__TAURI__ 上
const { getCurrentWindow } = window.__TAURI__.window;
const appWin = getCurrentWindow();

const goose   = document.getElementById('goose');
const wrap    = document.getElementById('goose-wrap');
const bubble  = document.getElementById('bubble');
const blush   = document.getElementById('blush');
const menu    = document.getElementById('menu');
const headGroup = document.getElementById('head-group');

const STATES = ['idle','curious','drowsy','sleeping','honking',
                'startled','dizzy','dragging','nuzzling'];

let state = 'idle';
let lastInput = Date.now();
let mouseHistory = [];
let hoverStartedAt = 0;
let isWindowDragging = false;

function setState(s) {
  if (s === state) return;
  STATES.forEach(x => goose.classList.remove(x));
  goose.classList.add(s);
  state = s;
}

let bubbleTimer;
function say(text, ms = 1200) {
  bubble.textContent = text;
  bubble.classList.add('show');
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => bubble.classList.remove('show'), ms);
}

function lookAt(mouseX, mouseY) {
  if (['sleeping','dragging','startled'].includes(state)) return;
  const r = wrap.getBoundingClientRect();
  const headX = r.left + r.width * 0.71;
  const headY = r.top  + r.height * 0.25;
  const dx = mouseX - headX, dy = mouseY - headY;
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  const clamped = Math.max(-25, Math.min(25, angle * 0.15));
  headGroup.style.transform = `rotate(${clamped}deg)`;
}

function scheduleBlink() {
  const wait = 2000 + Math.random() * 4000;
  setTimeout(() => {
    if (state !== 'sleeping' && !isWindowDragging) {
      goose.classList.add('blinking');
      setTimeout(() => goose.classList.remove('blinking'), 120);
    }
    scheduleBlink();
  }, wait);
}
scheduleBlink();

/* ---------- 鼠标移动 ---------- */
document.addEventListener('mousemove', e => {
  lastInput = Date.now();

  if (state === 'sleeping' || state === 'drowsy') {
    if (getSpeed(e) > 1.2) wakeUp();
  }

  trackCircling(e);

  if (['dragging','startled','honking'].includes(state)) return;

  lookAt(e.clientX, e.clientY);
  if (state === 'idle') setState('curious');
});

let lastMove = {x:0, y:0, t:Date.now()};
function getSpeed(e) {
  const now = Date.now();
  const dt = Math.max(now - lastMove.t, 1);
  const v = Math.hypot(e.clientX - lastMove.x, e.clientY - lastMove.y) / dt;
  lastMove = {x: e.clientX, y: e.clientY, t: now};
  return v;
}

function trackCircling(e) {
  const now = Date.now();
  const r = wrap.getBoundingClientRect();
  const cx = r.left + r.width/2, cy = r.top + r.height/2;
  const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
  if (dist < 50 || dist > 180) { mouseHistory = []; return; }

  const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
  mouseHistory.push({angle, t: now});
  mouseHistory = mouseHistory.filter(p => now - p.t < 1500);

  if (mouseHistory.length < 8) return;

  let total = 0;
  for (let i = 1; i < mouseHistory.length; i++) {
    let d = mouseHistory[i].angle - mouseHistory[i-1].angle;
    if (d >  Math.PI) d -= 2*Math.PI;
    if (d < -Math.PI) d += 2*Math.PI;
    total += d;
  }
  if (Math.abs(total) > Math.PI * 1.8) {
    triggerDizzy();
    mouseHistory = [];
  }
}

function triggerDizzy() {
  if (['dragging','startled'].includes(state)) return;
  setState('dizzy');
  say('@_@', 1500);
  setTimeout(() => { if (state === 'dizzy') setState('idle'); }, 1600);
}

/* ---------- 拖拽：交给 Tauri 拖动整个窗口 ---------- */
let downAt = 0, downPos = {x:0, y:0}, didDrag = false;
let clickTimer = null;

wrap.addEventListener('pointerdown', (e) => {
  if (e.button === 2) return;
  e.preventDefault();
  downAt = Date.now();
  downPos = {x: e.clientX, y: e.clientY};
  didDrag = false;
});

document.addEventListener('pointermove', async (e) => {
  if (downAt === 0 || didDrag) return;
  const moved = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
  if (moved > 4) {
    didDrag = true;
    isWindowDragging = true;
    setState('dragging');
    say('喂！', 800);
    try {
      await appWin.startDragging();
    } catch (err) {
      console.error('startDragging failed:', err);
    }
    setTimeout(() => {
      isWindowDragging = false;
      if (state === 'dragging') setState('idle');
    }, 100);
  }
});

document.addEventListener('pointerup', e => {
  if (downAt === 0) return;
  downAt = 0;
  if (didDrag) return;
  if (!wrap.contains(e.target)) return;

  if (clickTimer) {
    clearTimeout(clickTimer); clickTimer = null;
    onDoubleClick();
  } else {
    clickTimer = setTimeout(() => {
      clickTimer = null;
      onSingleClick();
    }, 250);
  }
});

function onSingleClick() {
  if (state === 'sleeping' || state === 'drowsy') { wakeUp(); return; }
  setState('honking');
  say('嘎！', 900);
  setTimeout(() => { if (state === 'honking') setState('idle'); }, 700);
}

function onDoubleClick() {
  setState('startled');
  say('！？', 900);
  blush.setAttribute('opacity', '0.8');
  setTimeout(() => blush.setAttribute('opacity', '0'), 1200);
  setTimeout(() => { if (state === 'startled') setState('idle'); }, 600);
}

/* ---------- 悬停 3 秒 ---------- */
wrap.addEventListener('pointerenter', () => {
  hoverStartedAt = Date.now();
  setTimeout(() => {
    if (Date.now() - hoverStartedAt >= 2900
        && !['dragging','sleeping','startled','honking'].includes(state)) {
      setState('nuzzling');
      say('蹭蹭~', 1500);
      setTimeout(() => { if (state === 'nuzzling') setState('idle'); }, 2000);
    }
  }, 3000);
});
wrap.addEventListener('pointerleave', () => { hoverStartedAt = 0; });

/* ---------- 右键菜单 ---------- */
wrap.addEventListener('contextmenu', e => {
  e.preventDefault();
  menu.style.left = e.clientX + 'px';
  menu.style.top  = e.clientY + 'px';
  menu.classList.add('show');
});
document.addEventListener('click', e => {
  if (!menu.contains(e.target)) menu.classList.remove('show');
});
menu.addEventListener('click', async e => {
  const act = e.target.dataset.act;
  if (act === 'wake')  wakeUp();
  if (act === 'sleep') { setState('sleeping'); say('Zzz', 1000); }
  if (act === 'honk')  onSingleClick();
  if (act === 'quit')  await appWin.close();
  menu.classList.remove('show');
});

/* ---------- 闲置 → 困倦 → 睡眠 ---------- */
const DROWSY_AFTER = 5 * 60 * 1000;
const SLEEP_AFTER  = 15 * 60 * 1000;

function tick() {
  const idleFor = Date.now() - lastInput;
  if (['dragging','startled','honking','dizzy','nuzzling'].includes(state)) {
    requestAnimationFrame(tick); return;
  }
  if (idleFor > SLEEP_AFTER && state !== 'sleeping') {
    setState('sleeping');
    say('Zzz...', 1500);
  } else if (idleFor > DROWSY_AFTER && state !== 'drowsy' && state !== 'sleeping') {
    setState('drowsy');
  } else if (state === 'curious' && idleFor > 1500) {
    setState('idle');
  }
  requestAnimationFrame(tick);
}
tick();

function wakeUp() {
  setState('curious');
  say('？', 800);
  lastInput = Date.now();
}
