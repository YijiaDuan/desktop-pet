/* ==========================================================
 * 宠物定义：大白鹅
 * ----------------------------------------------------------
 * 每个宠物模块导出一个对象，必须包含：
 *   id, displayName, emoji, available
 *   svg     —— SVG 字符串（根元素必须带 .pet 类）
 *   styles  —— 该宠物专属 CSS（用 .pet-{id} 作为命名空间）
 *   voice   —— 各种气泡台词
 * 可选：
 *   hooks.head  —— 用于 lookAt() 的元素 selector，相对宠物根
 * ========================================================== */

export const goose = {
  id: 'goose',
  displayName: '大白鹅',
  emoji: '🪿',
  available: true,

  voice: {
    honk:     '嘎！',
    startled: '！？',
    nuzzle:   '蹭蹭~',
    wakeup:   '？',
    drag:     '喂！',
    sleep:    'Zzz',
    dizzy:    '@_@',
    autosleep:'Zzz...',
  },

  hooks: {
    head:  '.goose-head-pivot',
    eye:   '.goose-eye',
    blush: '.goose-blush',
  },

  svg: `
    <svg class="pet pet-goose" viewBox="0 0 200 200" width="200" height="200">
      <ellipse cx="100" cy="180" rx="50" ry="6" fill="rgba(0,0,0,0.18)"/>

      <g class="goose-body">
        <g class="goose-legs">
          <rect x="78"  y="155" width="6" height="18" fill="#ff8c42" rx="2"/>
          <polygon points="70,173 92,173 86,180 76,180" fill="#ff8c42"/>
          <rect x="106" y="155" width="6" height="18" fill="#e87530" rx="2"/>
          <polygon points="98,173 120,173 114,180 104,180" fill="#e87530"/>
        </g>

        <polygon points="42,118 60,108 58,128" fill="#fff" stroke="#d8d8d8" stroke-width="1.5"/>
        <ellipse cx="100" cy="130" rx="55" ry="38" fill="#fff" stroke="#d8d8d8" stroke-width="2"/>

        <path class="goose-wing"
              d="M 78 115 Q 100 95, 135 110 Q 130 140, 100 145 Q 80 140, 78 115 Z"
              fill="#fafafa" stroke="#d8d8d8" stroke-width="1.5"/>
        <path d="M 90 120 Q 110 125, 125 122" stroke="#e0e0e0" stroke-width="1" fill="none"/>
        <path d="M 88 130 Q 108 135, 122 132" stroke="#e0e0e0" stroke-width="1" fill="none"/>

        <g class="goose-neck-head">
          <path d="M 110 100 Q 138 80, 142 55"
                stroke="#fff" stroke-width="22" stroke-linecap="round" fill="none"/>
          <g class="goose-head-pivot">
            <circle cx="142" cy="50" r="22" fill="#fff" stroke="#d8d8d8" stroke-width="2"/>
            <polygon points="160,46 178,50 160,56" fill="#ff8c42" stroke="#e87530" stroke-width="1"/>
            <line x1="163" y1="50" x2="174" y2="51" stroke="#c85a18" stroke-width="0.8"/>
            <circle class="goose-eye" cx="148" cy="44" r="3" fill="#222"/>
            <line class="goose-eye-line" x1="144" y1="44" x2="152" y2="44"
                  stroke="#222" stroke-width="1.5" stroke-linecap="round"/>
            <circle class="goose-blush" cx="138" cy="56" r="4" fill="#ffb6c1" opacity="0"/>
          </g>
        </g>
      </g>

      <g class="goose-zs" font-family="serif" font-weight="bold" fill="#90a4ae">
        <text x="160" y="40" font-size="14">z</text>
        <text x="160" y="40" font-size="18">Z</text>
        <text x="160" y="40" font-size="22">Z</text>
      </g>
    </svg>
  `,

  styles: `
    /* 呼吸 */
    @keyframes breathe {
      0%, 100% { transform: scaleY(1) scaleX(1); }
      50%      { transform: scaleY(1.03) scaleX(0.99); }
    }
    @keyframes goose-sleep-breathe {
      0%, 100% { transform: scaleY(1) scaleX(1); }
      50%      { transform: scaleY(1.06) scaleX(0.97); }
    }
    .pet-goose .goose-body {
      transform-box: fill-box;
      transform-origin: 50% 100%;
      animation: breathe 3s ease-in-out infinite;
    }
    .pet-goose.sleeping .goose-body {
      animation: goose-sleep-breathe 5s ease-in-out infinite;
    }

    /* 翅膀 */
    @keyframes goose-flap {
      0%, 100% { transform: rotate(0deg); }
      25%      { transform: rotate(-25deg); }
      75%      { transform: rotate(15deg); }
    }
    .pet-goose .goose-wing {
      transform-box: fill-box;
      transform-origin: 80% 30%;
    }
    .pet-goose.honking  .goose-wing,
    .pet-goose.startled .goose-wing { animation: goose-flap .4s ease-in-out 3; }

    /* 头摇 (dizzy) */
    @keyframes goose-wobble {
      0%, 100% { transform: rotate(0deg) translateX(0); }
      25%      { transform: rotate(-8deg) translateX(-2px); }
      75%      { transform: rotate(8deg) translateX(2px); }
    }
    .pet-goose .goose-head-pivot {
      transform-box: fill-box;
      transform-origin: 50% 100%;
    }
    .pet-goose.dizzy .goose-head-pivot { animation: goose-wobble .5s ease-in-out infinite; }

    /* 受惊弹跳（作用在整个宠物根） */
    @keyframes goose-startle {
      0%   { transform: translateY(0); }
      30%  { transform: translateY(-30px); }
      60%  { transform: translateY(0) scaleX(1.05) scaleY(0.95); }
      100% { transform: translateY(0); }
    }
    .pet-goose.startled { animation: goose-startle .5s ease-out; }

    /* 蹭头：脖子摆动 */
    @keyframes goose-nuzzle {
      0%, 100% { transform: rotate(0); }
      50%      { transform: rotate(8deg); }
    }
    .pet-goose.nuzzling .goose-neck-head {
      animation: goose-nuzzle .6s ease-in-out infinite;
    }

    /* 拖拽：腿晃 + 整体倾斜 */
    @keyframes goose-dangly-legs {
      0%, 100% { transform: rotate(-8deg); }
      50%      { transform: rotate(8deg); }
    }
    .pet-goose.dragging .goose-legs {
      animation: goose-dangly-legs .4s ease-in-out infinite;
    }
    .pet-goose.dragging { transform: rotate(-3deg); }

    /* 眨眼 */
    .pet-goose .goose-eye {
      transform-box: fill-box;
      transform-origin: 50% 50%;
      transition: transform .08s;
    }
    .pet-goose.blinking .goose-eye  { transform: scaleY(0.05); }
    .pet-goose.sleeping .goose-eye  { transform: scaleY(0.05); }
    .pet-goose.sleeping .goose-eye-line { opacity: 1; }
    .pet-goose .goose-eye-line { opacity: 0; transition: opacity .2s; }

    /* Z 字 */
    .pet-goose .goose-zs { opacity: 0; transition: opacity .4s; }
    .pet-goose.sleeping .goose-zs,
    .pet-goose.drowsy   .goose-zs { opacity: 1; }
    @keyframes goose-z-float {
      0%   { transform: translate(0, 0) scale(1); opacity: 0; }
      20%  { opacity: 1; }
      100% { transform: translate(20px, -40px) scale(1.4); opacity: 0; }
    }
    .pet-goose .goose-zs text { animation: goose-z-float 2.5s ease-out infinite; }
    .pet-goose .goose-zs text:nth-child(2) { animation-delay: .8s; }
    .pet-goose .goose-zs text:nth-child(3) { animation-delay: 1.6s; }
  `,
};
