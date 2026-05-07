/* ==========================================================
 * 宠物注册表
 * ----------------------------------------------------------
 * 加新宠物：
 *   1. 复制 goose.js，按它的接口实现你的 SVG + 动画
 *   2. 在这里 import 进来
 *   3. 加进 PETS 数组，设 available: true
 * ========================================================== */

import { goose } from './goose.js';
import { cat }   from './cat.js';

// 暂时没有 coming-soon 项；保留这个工厂方便以后再加
// const comingSoon = (id, name, emoji) => ({
//   id, displayName: name, emoji, available: false,
// });

export const PETS = [
  goose,
  cat,
];

export const DEFAULT_PET_ID = 'goose';

export function findPet(id) {
  return PETS.find(p => p.id === id) || PETS[0];
}
