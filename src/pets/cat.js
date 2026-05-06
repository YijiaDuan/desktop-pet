/* ==========================================================
 * 宠物定义：团子（橘猫）
 *  性格：慵懒、爱睡、被打扰会嫌弃。
 *  视觉：橘色虎斑、肚皮浅、卷尾、塌耳。
 * ========================================================== */

export const cat = {
  id: 'cat',
  displayName: '团子（猫）',
  emoji: '🐱',
  available: true,

  voice: {
    honk:     '喵...',         // 慵懒的喵
    startled: '嘶！',           // 弓背炸毛
    nuzzle:   '呼噜~',          // 蹭你
    wakeup:   '...?',
    drag:     '喵呜！',         // 被拎起来时的抗议
    sleep:    'Zzz',
    dizzy:    '@_@',
    autosleep:'Zzz...',
    eating:   '吧唧',
    preening: '',              // 静音舔毛
    peek:     '...',
    windy:    '咦?',
    walking:  '',
    stretch:  '啊———',         // 标志性的猫式伸展
  },

  hooks: {
    head:       '.cat-head-pivot',
    headCenter: { x: 0.815, y: 0.6 },  // 头大概在右上区
    eye:        '.cat-eye',
    blush:      '.cat-blush',
  },

  svg: `
    <svg class="pet pet-cat" viewBox="0 0 200 200" width="200" height="200">
      <!-- 投影 -->
      <ellipse cx="100" cy="180" rx="55" ry="5" fill="rgba(0,0,0,0.18)"/>

      <g class="cat-body-group">
        <!-- 尾巴：从身体后方卷起 -->
        <path class="cat-tail"
              d="M 50 145 Q 22 130, 28 100 Q 32 78, 52 78 Q 62 78, 56 92"
              fill="none" stroke="#e8a04a" stroke-width="14" stroke-linecap="round"/>
        <path class="cat-tail-stripe"
              d="M 50 145 Q 22 130, 28 100 Q 32 78, 52 78 Q 62 78, 56 92"
              fill="none" stroke="#c47a2a" stroke-width="14" stroke-linecap="round"
              stroke-dasharray="3 10" opacity="0.5"/>

        <!-- 后腿（左侧） -->
        <g class="cat-legs cat-back-legs">
          <rect x="68" y="155" width="10" height="20" fill="#e8a04a" stroke="#c47a2a" stroke-width="1" rx="3"/>
          <rect x="84" y="155" width="10" height="20" fill="#d68f3a" stroke="#a76822" stroke-width="1" rx="3"/>
        </g>

        <!-- 前腿（右侧） -->
        <g class="cat-legs cat-front-legs">
          <rect x="135" y="155" width="10" height="20" fill="#e8a04a" stroke="#c47a2a" stroke-width="1" rx="3"/>
          <rect x="151" y="155" width="10" height="20" fill="#d68f3a" stroke="#a76822" stroke-width="1" rx="3"/>
        </g>

        <!-- 身体 -->
        <ellipse class="cat-body" cx="100" cy="140" rx="62" ry="30"
                 fill="#e8a04a" stroke="#c47a2a" stroke-width="2"/>
        <!-- 肚皮浅色 -->
        <ellipse cx="100" cy="150" rx="48" ry="17" fill="#fff5d8" opacity="0.65"/>
        <!-- 虎斑（背上几道） -->
        <path d="M 75 122 Q 90 117, 100 121" stroke="#c47a2a" stroke-width="2.2" fill="none" opacity="0.55" stroke-linecap="round"/>
        <path d="M 92 116 Q 107 110, 122 116" stroke="#c47a2a" stroke-width="2.2" fill="none" opacity="0.55" stroke-linecap="round"/>
        <path d="M 112 122 Q 127 117, 142 122" stroke="#c47a2a" stroke-width="2.2" fill="none" opacity="0.55" stroke-linecap="round"/>

        <g class="cat-head-pivot">
          <!-- 耳朵 -->
          <polygon class="cat-ear cat-ear-l" points="148,108 156,86 168,108"
                   fill="#e8a04a" stroke="#c47a2a" stroke-width="1.5"/>
          <polygon class="cat-ear cat-ear-r" points="160,108 174,86 180,108"
                   fill="#e8a04a" stroke="#c47a2a" stroke-width="1.5"/>
          <!-- 内耳 -->
          <polygon points="151,106 156,92 165,106" fill="#f7c2a0"/>
          <polygon points="163,106 173,92 178,106" fill="#f7c2a0"/>

          <!-- 脸 -->
          <circle cx="163" cy="125" r="23" fill="#e8a04a" stroke="#c47a2a" stroke-width="2"/>
          <!-- 脸颊蓬松感 -->
          <path d="M 142 132 Q 138 128, 143 124" stroke="#c47a2a" stroke-width="1.5" fill="#e8a04a"/>
          <path d="M 184 132 Q 188 128, 183 124" stroke="#c47a2a" stroke-width="1.5" fill="#e8a04a"/>

          <!-- 眼睛（杏眼） -->
          <ellipse class="cat-eye cat-eye-l" cx="156" cy="123" rx="2.2" ry="3.6" fill="#222"/>
          <ellipse class="cat-eye cat-eye-r" cx="172" cy="123" rx="2.2" ry="3.6" fill="#222"/>
          <!-- 睡觉时的眯眯眼 -->
          <line class="cat-eye-line cat-eye-line-l"
                x1="152" y1="123" x2="160" y2="123"
                stroke="#222" stroke-width="1.8" stroke-linecap="round"/>
          <line class="cat-eye-line cat-eye-line-r"
                x1="168" y1="123" x2="176" y2="123"
                stroke="#222" stroke-width="1.8" stroke-linecap="round"/>

          <!-- 鼻 + 嘴 ω -->
          <polygon points="161,131 166,131 163.5,134" fill="#d56565" stroke="#a44" stroke-width="0.5"/>
          <path d="M 163.5 134 Q 159 138, 156 135"
                stroke="#444" stroke-width="1.3" fill="none" stroke-linecap="round"/>
          <path d="M 163.5 134 Q 168 138, 171 135"
                stroke="#444" stroke-width="1.3" fill="none" stroke-linecap="round"/>

          <!-- 胡须 -->
          <line x1="146" y1="131" x2="132" y2="129" stroke="#888" stroke-width="0.8" stroke-linecap="round"/>
          <line x1="146" y1="134" x2="132" y2="134" stroke="#888" stroke-width="0.8" stroke-linecap="round"/>
          <line x1="146" y1="137" x2="132" y2="139" stroke="#888" stroke-width="0.8" stroke-linecap="round"/>
          <line x1="180" y1="131" x2="194" y2="129" stroke="#888" stroke-width="0.8" stroke-linecap="round"/>
          <line x1="180" y1="134" x2="194" y2="134" stroke="#888" stroke-width="0.8" stroke-linecap="round"/>
          <line x1="180" y1="137" x2="194" y2="139" stroke="#888" stroke-width="0.8" stroke-linecap="round"/>

          <!-- 双颊腮红（双击时显示） -->
          <g class="cat-blush" opacity="0">
            <circle cx="148" cy="135" r="4" fill="#ff9eb1"/>
            <circle cx="178" cy="135" r="4" fill="#ff9eb1"/>
          </g>
        </g>
      </g>

      <!-- 睡眠 Z 字 -->
      <g class="cat-zs" font-family="serif" font-weight="bold" fill="#90a4ae">
        <text x="180" y="60" font-size="14">z</text>
        <text x="180" y="60" font-size="18">Z</text>
        <text x="180" y="60" font-size="22">Z</text>
      </g>
    </svg>
  `,

  styles: `
    /* 呼吸 */
    @keyframes cat-breathe {
      0%, 100% { transform: scaleY(1) scaleX(1); }
      50%      { transform: scaleY(1.04) scaleX(0.99); }
    }
    @keyframes cat-sleep-breathe {
      0%, 100% { transform: scaleY(1) scaleX(1); }
      50%      { transform: scaleY(1.07) scaleX(0.97); }
    }
    .pet-cat .cat-body-group {
      transform-box: fill-box;
      transform-origin: 50% 100%;
      animation: cat-breathe 3.5s ease-in-out infinite;
    }
    .pet-cat.sleeping .cat-body-group {
      animation: cat-sleep-breathe 5.5s ease-in-out infinite;
    }

    /* 喵叫：耳朵抽动（无翅膀拍） */
    @keyframes cat-ear-twitch {
      0%, 100% { transform: rotate(0deg); }
      30%      { transform: rotate(-15deg); }
      60%      { transform: rotate(8deg); }
    }
    .pet-cat .cat-ear { transform-box: fill-box; transform-origin: 50% 100%; }
    .pet-cat.honking .cat-ear-l { animation: cat-ear-twitch .4s ease-in-out 2; }
    .pet-cat.honking .cat-ear-r { animation: cat-ear-twitch .4s ease-in-out 2 reverse; }

    /* 头摇（dizzy） */
    @keyframes cat-wobble {
      0%, 100% { transform: rotate(0deg) translateX(0); }
      25%      { transform: rotate(-7deg) translateX(-2px); }
      75%      { transform: rotate(7deg) translateX(2px); }
    }
    .pet-cat .cat-head-pivot {
      transform-box: fill-box;
      transform-origin: 50% 100%;
    }
    .pet-cat.dizzy .cat-head-pivot { animation: cat-wobble .5s ease-in-out infinite; }

    /* 受惊：跳一下 */
    @keyframes cat-startle {
      0%   { transform: translateY(0) scaleY(1); }
      30%  { transform: translateY(-25px) scaleY(1.1); }
      60%  { transform: translateY(0) scaleX(1.05) scaleY(0.92); }
      100% { transform: translateY(0); }
    }
    .pet-cat.startled { animation: cat-startle .55s ease-out; }

    /* 蹭头（nuzzling）：头左右摇 */
    @keyframes cat-nuzzle {
      0%, 100% { transform: rotate(0); }
      50%      { transform: rotate(7deg); }
    }
    .pet-cat.nuzzling .cat-head-pivot {
      animation: cat-nuzzle .6s ease-in-out infinite;
    }

    /* 拖拽：身体倾斜 + 腿晃 */
    @keyframes cat-dangly-legs {
      0%, 100% { transform: rotate(-7deg); }
      50%      { transform: rotate(7deg); }
    }
    .pet-cat.dragging .cat-legs {
      animation: cat-dangly-legs .4s ease-in-out infinite;
    }
    .pet-cat.dragging { transform: rotate(-3deg); }

    /* 眨眼 */
    .pet-cat .cat-eye {
      transform-box: fill-box;
      transform-origin: 50% 50%;
      transition: transform .08s;
    }
    .pet-cat.blinking .cat-eye   { transform: scaleY(0.05); }
    .pet-cat.sleeping .cat-eye   { opacity: 0; }
    .pet-cat.sleeping .cat-eye-line { opacity: 1; }
    .pet-cat .cat-eye-line { opacity: 0; transition: opacity .2s; }

    /* Z 字 */
    .pet-cat .cat-zs { opacity: 0; transition: opacity .4s; }
    .pet-cat.sleeping .cat-zs,
    .pet-cat.drowsy   .cat-zs { opacity: 1; }
    @keyframes cat-z-float {
      0%   { transform: translate(0, 0) scale(1); opacity: 0; }
      20%  { opacity: 1; }
      100% { transform: translate(20px, -40px) scale(1.4); opacity: 0; }
    }
    .pet-cat .cat-zs text { animation: cat-z-float 2.5s ease-out infinite; }
    .pet-cat .cat-zs text:nth-child(2) { animation-delay: .8s; }
    .pet-cat .cat-zs text:nth-child(3) { animation-delay: 1.6s; }

    /* ====== 自发动作 ====== */

    /* 进食：低头啄碗（猫式） */
    @keyframes cat-eat {
      0%, 100% { transform: rotate(0deg) translate(0, 0); }
      20%      { transform: rotate(25deg) translate(-3px, 10px); }
      40%      { transform: rotate(0deg); }
      65%      { transform: rotate(28deg) translate(-3px, 10px); }
      85%      { transform: rotate(0deg); }
    }
    .pet-cat.eating .cat-head-pivot { animation: cat-eat 2.2s ease-in-out; }

    /* 舔毛：头转向身体侧面 */
    @keyframes cat-preen {
      0%, 100% { transform: rotate(0deg) translate(0, 0); }
      30%, 70% { transform: rotate(70deg) translate(-25px, 18px); }
    }
    .pet-cat.preening .cat-head-pivot { animation: cat-preen 2.5s ease-in-out; }

    /* 探头（peek）：头微微前倾 */
    @keyframes cat-peek {
      0%, 100% { transform: translate(0, 0) rotate(0); }
      35%, 65% { transform: translate(2px, -3px) rotate(-5deg); }
    }
    .pet-cat.peek .cat-head-pivot { animation: cat-peek 1.7s ease-in-out; }

    /* 起风：身子轻摇 + 尾巴甩 */
    @keyframes cat-windy-body {
      0%, 100% { transform: rotate(0deg); }
      25%      { transform: rotate(-2deg); }
      75%      { transform: rotate(2deg); }
    }
    @keyframes cat-tail-swish {
      0%, 100% { transform: rotate(0deg); }
      50%      { transform: rotate(-15deg); }
    }
    .pet-cat .cat-tail,
    .pet-cat .cat-tail-stripe {
      transform-box: fill-box;
      transform-origin: 100% 100%;
    }
    .pet-cat.windy .cat-body-group { animation: cat-windy-body 1s ease-in-out 2; }
    .pet-cat.windy .cat-tail,
    .pet-cat.windy .cat-tail-stripe { animation: cat-tail-swish .5s ease-in-out 4; }

    /* 走动：身体上下颠（窗口位移由 JS 推） */
    @keyframes cat-walk-bob {
      0%, 100% { transform: translateY(0); }
      25%, 75% { transform: translateY(-2px); }
    }
    .pet-cat.walking .cat-body-group {
      animation: cat-walk-bob .35s linear infinite;
    }
    .pet-cat.walking-left { transform: scaleX(-1); }

    /* 伸展：经典猫式拉长 */
    @keyframes cat-stretch-body {
      0%, 100% { transform: scaleX(1) scaleY(1); }
      30%, 70% { transform: scaleX(1.18) scaleY(0.85); }
    }
    @keyframes cat-stretch-tail {
      0%, 100% { transform: rotate(0); }
      30%, 70% { transform: rotate(-25deg); }
    }
    .pet-cat.stretch .cat-body-group { animation: cat-stretch-body 2.2s ease-in-out; }
    .pet-cat.stretch .cat-tail,
    .pet-cat.stretch .cat-tail-stripe { animation: cat-stretch-tail 2.2s ease-in-out; }
  `,
};
