import type { Navigation } from '@/type/navigation';

export const NAVIGATION: Navigation[] = [
  {
    href: 'transition-animation/astro',
    label: '遷移アニメーション(Astro)',
  },
  {
    href: 'header-animation/change-elements-size',
    label: 'スクロール後に要素の大きさ変化を与えるアニメーション',
  },
  {
    href: 'inertial-scroll/lenis',
    label: '慣性スクロール(Lenis)'
  },
  {
    href: 'inertial-scroll/js',
    label: '慣性スクロール(js)'
  },
  {
    href: 'parallax-animation/lenis',
    label: 'パララックス・スクロール（Lenis）',
  },
  {
    href: 'parallax-animation/js',
    label: 'パララックス・スクロール（js）',
  },
];
