import type { Navigation } from '@/type/navigation';
export const SITE_NAME = 'Astro playground';
export const SITE_DESCRIPTION =
  'Astro playgroundはAstroの技術や実装ケースを試すためのサイトです。';
export const SITE_KEYWORDS =
  'Astro, playground, アストロ, プレイグラウンド, Astro playground';
export const SITE_IMAGE_PATH = '/ogp_image.jpg';

export const NAVIGATION: Navigation[] = [
  {
    href: '/semantic-a11y',
    label: 'HTMLセマンティクス検証（ケース1〜3）',
  },
  {
    href: '/dialog-menu',
    label: 'ダイアログメニュー',
  },
  {
    href: '/normal-menu',
    label: 'メニュー（div + role）',
  },
  // {
  //   href: '/tab',
  //   label: 'タブ',
  // },
  // {
  //   href: '/modal',
  //   label: 'モーダル',
  // },
  // {
  //   href: '/control-youtube-iframe',
  //   label: 'YouTube iframeの制御',
  // },
];
