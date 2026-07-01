// アニメーションを再生してよいか（isMotion）を一元管理するストア。
//  - 初期値は OS の prefers-reduced-motion（reduce なら再生しない = false）
//  - Header のボタンクリックで toggleMotion() が呼ばれ、値が反転する
//  - 各アニメーションは onMotionChange() で購読し、isMotion を見て分岐する

// このファイルは src/pages 配下なので Astro にエンドポイントとして
// ビルド時に一度 import される。window が無い環境でも壊れないようガードする。
const query =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

// reduce を希望している = モーションを控える → isMotion は false
let isMotion = query ? !query.matches : true;

type Listener = (isMotion: boolean) => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((fn) => fn(isMotion));
}

export function getIsMotion() {
  return isMotion;
}

export function setMotion(next: boolean) {
  if (next === isMotion) return;
  isMotion = next;
  notify();
}

export function toggleMotion() {
  setMotion(!isMotion);
}

// 購読。登録した瞬間に現在値でも一度呼ぶので、初期状態の反映にも使える。
// 戻り値を呼べば解除できる。
export function onMotionChange(listener: Listener) {
  listeners.add(listener);
  listener(isMotion);
  return () => listeners.delete(listener);
}

// OS 側の設定変更にも追従する。
query?.addEventListener('change', (event) => setMotion(!event.matches));
