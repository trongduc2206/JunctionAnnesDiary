import { LegacyStory } from '../types';
import { SAMPLE_PHOTOS } from './data';

export const DEFAULT_STORIES: LegacyStory[] = [
  {
    id: '1',
    title: 'The Day My Bakery Opened',
    photo: SAMPLE_PHOTOS[0],
    narrative:
      'It was a beautiful morning in June 1965 when I opened the doors to my first bakery. The smell of fresh bread filled the air...',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    audioUrl: 'mock-audio-url-1',
    metadata: {
      category: 'business',
      wordCount: 250,
      duration: 120,
    },
  },
  {
    id: '2',
    title: 'Our Wedding Day',
    photo: SAMPLE_PHOTOS[1],
    narrative:
      'August 20th, 1962 was the happiest day of my life. The church was decorated with white roses, and I wore my grandmother\'s pearl necklace...',
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
    audioUrl: 'mock-audio-url-2',
    metadata: {
      category: 'wedding',
      wordCount: 320,
      duration: 150,
    },
  },
  {
    id: '3',
    title: 'Growing Up in the Countryside',
    photo: SAMPLE_PHOTOS[3],
    narrative:
      'The old farmhouse where I grew up still appears in my dreams. I can still smell the lavender that grew along the fence...',
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-05T09:15:00Z',
    audioUrl: 'mock-audio-url-3',
    metadata: {
      category: 'childhood',
      wordCount: 280,
      duration: 135,
    },
  },
];
