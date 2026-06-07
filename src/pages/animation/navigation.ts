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
    label: '慣性スクロール(Lenis)',
  },
  // {
  //   href: 'inertial-scroll/js',
  //   label: '慣性スクロール(js)',
  // },
  {
    href: 'parallax/lenis',
    label: 'パララックス（Lenis）',
  },
  // {
  //   href: 'parallax/js',
  //   label: 'パララックス（js）',
  // },
  // {
  //   href: 'animation-api-tutorial',
  //   label: 'WEB Animation API チュートリアル'
  // },
  {
    href: 'animation-api-tutorial/basic',
    label: 'WEB Animation API チュートリアル',
  },
  {
    href: 'animation-api-tutorial/scroll',
    label: 'WEB Animation API スクロールアニメーション',
  },
];
