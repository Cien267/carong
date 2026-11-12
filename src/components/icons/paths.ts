/** Icon monoline 24x24, nét 1.5, đầu nét vuông cho cảm giác dấu in. */
export const ICONS = {
  brewer: 'M8 3h8l1 5H7l1-5ZM7 8l-1 12h12L17 8M9 13h6M18 11h2v4h-2',
  grinder: 'M7 3h10v4H7zM12 7v4M8 11h8l-1 10H9zM18 5h3',
  flame: 'M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.500.2 2 1 3 2 3 .5-3-1-5 1-8.500Z',
  cooking: 'M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.500.2 2 1 3 2 3 .5-3-1-5 1-8.500Z',
  cup: 'M5 9h12v7a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9ZM17 11h2a2 2 0 0 1 0 4h-2M8 3v3M12 3v3',
  accessory: 'M5 9h12v7a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9ZM17 11h2a2 2 0 0 1 0 4h-2M8 3v3M12 3v3',
  bag: 'M5 8h14l-1 13H6L5 8ZM9 8V6a3 3 0 0 1 6 0v2',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  close: 'M6 6l12 12M18 6 6 18',
  check: 'M5 12l5 5L20 7',
  cart: 'M3 4h2.500l2.200 11h10.300l2-8H6.500M9 20h.01M17 20h.01',
  box: 'M3 7l9-4 9 4v10l-9 4-9-4V7ZM3 7l9 4 9-4M12 11v10',
  shield: 'M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3Z',
  pin: 'M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11ZM12 7.500a2.500 2.500 0 1 0 0 5 2.500 2.500 0 0 0 0-5Z',
  bean: 'M12 3c4 0 7 4 7 9s-3 9-7 9-7-4-7-9 3-9 7-9ZM12 4c-2.500 4 2.500 8 0 16',
} as const;

export type IconName = keyof typeof ICONS;
