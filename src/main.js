/* ==========================================================
 * Desktop Pet · 通用前端
 *  - 宠物加载器（pets/*.js）
 *  - 通用状态机
 *  - 鼠标交互 + 窗口拖动（通过 Tauri）
 * ========================================================== */

import { PETS, DEFAULT_PET_ID, findPet } from './pets/index.js';

const { getCurrentWindow } = window.__TAURI__.window;
const appWin = getCurrentWindow();

const petContainer = document.getElementById('pet-container');
const petStyles    = document.getElementById('pet-styles');
const bubble       = document.getElementById('bubble');
const menu         = document.getElementById('menu');

const STATES = ['idle','curious','drowsy','sleeping','honking',
                'startled','dizzy','dragging','nuzzling','blinking'];

/* ---------- 当前宠物 + 状态 ---------- */
let activePet = findPet(loadStoredPetId() || DEFAULT_PET_ID);
let petRoot, headPivot, blush;

let state = 'idle';
let lastInput = Date.now();
let mouseHistory = [];
let hoverStartedAt = 0;
let isWindowDragging = false;

function loadStoredPetId() {
  try { return localStorage.getItem('activePetId'); } catch { return null; }
}
function saveStoredPetId(id) {
  try { localStorage.setItem('activePetId', id); } catch {}
}

function mountPet(pet) {
  activePet = pet;
  petStyles.textContent = pet.styles;
  petContainer.innerHTML = pet.svg;
  petRoot   = petContainer.querySelector('.pet');
  headPivot = pet.hooks?.head  ? petContainer.querySelector(pet.hooks.head)  : null;
  blush     = pet.hooks?.blush ? petContainer.querySelector(pet.hooks.blush) : null;
  state = 'idle';
  applyState();
  saveStoredPetId(pet.id);
  rebuildMenu();
}

function applyState() {
  if (!petRoot) return;
  STATES.forEach(s => petRoot.classList.remove(s));
  petRoot.classList.add(state);
}

function setState(s) {
  if (s === state) return;
  state = s;
  applyState();
}

function v(key, fallback = '') {
  return activePet.voice?.[key] ?? fallback;
}

let bubbleTimer;
function say(text, ms = 1200) {
  if (!text) return;
  bubble.textContent = text;
  bubble.classList.add('show');
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => bubble.classList.remove('show'), ms);
}

/* ---------- 头跟随光标 ---------- */
function lookAt(mouseX, mouseY) {
  if (!headPivot) return;
  if (['sleeping','dragging','startled'].includes(state)) return;
  const r = petRoot.getBoundingClientRect();
  const headX = r.left + r.width * 0.71;
  const headY = r.top  + r.height * 0.25;
  const dx = mouseX - headX, dy = mouseY - headY;
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  const clamped = Math.max(-25, Math.min(25, angle * 0.15));
  headPivot.style.transform = `rotate(${clamped}deg)`;
}

/* ---------- 随机眨眼 ---------- */
function scheduleBlink() {
  const wait = 2000 + Math.random() * 4000;
  setTimeout(() => {
    if (state !== 'sleeping' && !isWindowDragging && petRoot) {
      petRoot.classList.add('blinking');
      setTimeout(() => petRoot.classList.remove('blinking'), 120);
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
  const sp = Math.hypot(e.clientX - lastMove.x, e.clientY - lastMove.y) / dt;
  lastMove = {x: e.clientX, y: e.clientY, t: now};
  return sp;
}

function trackCircling(e) {
  if (!petRoot) return;
  const now = Date.now();
  const r = petRoot.getBoundingClientRect();
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
  say(v('dizzy', '@_@'), 1500);
  setTimeout(() => { if (state === 'dizzy') setState('idle'); }, 1600);
}

/* ---------- 拖拽（交给 Tauri 拖窗） ---------- */
let downAt = 0, downPos = {x:0, y:0}, didDrag = false;
let clickTimer = null;

petContainer.addEventListener('pointerdown', (e) => {
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
    say(v('drag', '...'), 800);
    try { await appWin.startDragging(); }
    catch (err) { console.error('startDragging failed:', err); }
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
  if (!petContainer.contains(e.target)) return;

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
  say(v('honk', '!'), 900);
  setTimeout(() => { if (state === 'honking') setState('idle'); }, 700);
}

function onDoubleClick() {
  setState('startled');
  say(v('startled', '!?'), 900);
  if (blush) {
    blush.setAttribute('opacity', '0.8');
    setTimeout(() => blush.setAttribute('opacity', '0'), 1200);
  }
  setTimeout(() => { if (state === 'startled') setState('idle'); }, 600);
}

/* ---------- 悬停 3 秒 ---------- */
petContainer.addEventListener('pointerenter', () => {
  hoverStartedAt = Date.now();
  setTimeout(() => {
    if (Date.now() - hoverStartedAt >= 2900
        && !['dragging','sleeping','startled','honking'].includes(state)) {
      setState('nuzzling');
      say(v('nuzzle', '~'), 1500);
      setTimeout(() => { if (state === 'nuzzling') setState('idle'); }, 2000);
    }
  }, 3000);
});
petContainer.addEventListener('pointerleave', () => { hoverStartedAt = 0; });

/* ---------- 右键菜单（含选宠物） ---------- */
function rebuildMenu() {
  menu.innerHTML = '';
  const add = (label, action, opts = {}) => {
    const el = document.createElement('div');
    el.textContent = label;
    if (opts.disabled) el.classList.add('disabled');
    if (opts.checked)  el.classList.add('checked');
    if (!opts.disabled) el.dataset.act = action;
    menu.appendChild(el);
    return el;
  };
  const hr = () => menu.appendChild(document.createElement('hr'));

  add('叫醒',     'wake');
  add('让它睡',   'sleep');
  add('打个招呼', 'honk');
  hr();

  const head = document.createElement('div');
  head.className = 'menu-head';
  head.textContent = '换一只';
  menu.appendChild(head);

  for (const pet of PETS) {
    const checked = pet.id === activePet.id;
    const tail = pet.available
      ? (checked ? '   ✓' : '')
      : '   · 即将上线';
    add(`${pet.emoji}  ${pet.displayName}${tail}`,
        `pet:${pet.id}`, { disabled: !pet.available, checked });
  }

  hr();
  add('退出', 'quit');
}

petContainer.addEventListener('contextmenu', e => {
  e.preventDefault();
  rebuildMenu();
  const x = Math.min(e.clientX, window.innerWidth  - 180);
  const y = Math.min(e.clientY, window.innerHeight - 220);
  menu.style.left = x + 'px';
  menu.style.top  = y + 'px';
  menu.classList.add('show');
});

document.addEventListener('click', e => {
  if (!menu.contains(e.target)) menu.classList.remove('show');
});

menu.addEventListener('click', async e => {
  const act = e.target.dataset.act;
  if (!act) return;
  if (act === 'wake')  wakeUp();
  if (act === 'sleep') { setState('sleeping'); say(v('sleep','Zzz'), 1000); }
  if (act === 'honk')  onSingleClick();
  if (act === 'quit')  { await appWin.close(); return; }
  if (act.startsWith('pet:')) {
    const id = act.slice(4);
    const pet = findPet(id);
    if (pet && pet.available && pet.id !== activePet.id) {
      mountPet(pet);
      say(pet.emoji, 800);
    }
  }
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
    say(v('autosleep', 'Zzz...'), 1500);
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
  say(v('wakeup', '?'), 800);
  lastInput = Date.now();
}

/* ---------- 启动：挂载初始宠物 ---------- */
mountPet(activePet);
