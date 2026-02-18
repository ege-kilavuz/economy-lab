import type { ModuleMeta } from './types';

export const MODULES: ModuleMeta[] = [
  {
    id: 'inflation',
    title: 'Enflasyon Laboratuvarı',
    description: 'Sepet ve maaş üzerinden alım gücü nasıl eriyor? İnteraktif deney.',
    minutes: 6,
  },
  {
    id: 'interest',
    title: 'Faiz & Kredi Laboratuvarı',
    description: 'Basit/bileşik faiz ve kredi taksiti: toplam geri ödeme nasıl şişer?',
    minutes: 7,
  },
  {
    id: 'central-bank',
    title: 'Merkez Bankası Karar Odası',
    description: 'Faiz kararının enflasyon, büyüme ve işsizlik üzerindeki trade-off etkileri (basitleştirilmiş).',
    minutes: 8,
  },
];
