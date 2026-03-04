import { SiteCategory } from './types';

export const TIER_LIMITS = {
  free: {
    generations: 10,
    edits: 0,
    model: 'gemini' as const,
    watermark: true,
    customSlug: false,
  },
  pro: {
    generations: 200,
    edits: 300,
    model: 'claude' as const,
    watermark: false,
    customSlug: true,
  },
} as const;

export const CATEGORIES: { value: SiteCategory; label: string; emoji: string; description: string }[] = [
  { value: 'event', label: 'Event', emoji: '🎉', description: 'Parties, meetups, gatherings' },
  { value: 'valentine', label: 'Valentine / Personal', emoji: '💝', description: 'Love letters, anniversaries, special messages' },
  { value: 'personal', label: 'Personal', emoji: '✨', description: 'About me, portfolio, personal page' },
  { value: 'funny', label: 'Funny', emoji: '😂', description: 'Roast your friends, memes, jokes' },
  { value: 'work', label: 'Work', emoji: '💼', description: 'Team pages, project showcases, work events' },
  { value: 'other', label: 'Other', emoji: '🌐', description: 'Anything else you can imagine' },
];

export const FONTS = [
  'Inter', 'Georgia', 'Arial', 'Helvetica', 'Times New Roman',
  'Courier New', 'Verdana', 'Trebuchet MS', 'Palatino',
  'Garamond', 'Comic Sans MS', 'Impact',
];

export const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72];

export const PRO_PRICE = 2.99;
export const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID || 'price_placeholder';
