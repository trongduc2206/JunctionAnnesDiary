import { InterviewQuestion, Photo } from '../types';

// Sample interview questions categorized by type
export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // People questions
  {
    id: 'q1',
    text: 'Who were you with in this moment?',
    category: 'people',
    followUpQuestions: [
      'What were they like?',
      'What did they mean to you?',
    ],
  },
  {
    id: 'q2',
    text: 'Who was most important to you at this time?',
    category: 'people',
  },

  // Feelings questions
  {
    id: 'q3',
    text: 'What were you feeling on this day?',
    category: 'feelings',
    followUpQuestions: [
      'Why did you feel that way?',
      'Do you remember what made you feel that?',
    ],
  },
  {
    id: 'q4',
    text: 'What emotions come back when you see this photo?',
    category: 'feelings',
  },

  // Events questions
  {
    id: 'q5',
    text: 'What was happening in this moment?',
    category: 'events',
    followUpQuestions: [
      'How did it all begin?',
      'What happened next?',
    ],
  },
  {
    id: 'q6',
    text: 'Can you tell me about the day this photo was taken?',
    category: 'events',
  },

  // Significance questions
  {
    id: 'q7',
    text: 'Why was this moment important to you?',
    category: 'significance',
  },
  {
    id: 'q8',
    text: 'What made this time in your life special?',
    category: 'significance',
  },

  // Legacy questions
  {
    id: 'q9',
    text: 'What would you tell your grandchildren about this time in your life?',
    category: 'legacy',
  },
  {
    id: 'q10',
    text: 'What do you want your family to remember about this moment?',
    category: 'legacy',
  },

  // Details questions
  {
    id: 'q11',
    text: 'What do you remember most vividly about this day?',
    category: 'details',
    followUpQuestions: [
      'Were there any sounds or smells you remember?',
      'What were you wearing?',
    ],
  },
  {
    id: 'q12',
    text: 'Where were you when this photo was taken?',
    category: 'details',
  },
];

// Sample Unsplash photos for demo (elderly-friendly themes)
export const SAMPLE_PHOTOS: Photo[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200',
    description: 'Vintage bakery storefront',
    category: 'business',
    date: '1965-06-15',
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=200',
    description: 'Wedding celebration',
    category: 'wedding',
    date: '1962-08-20',
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=200',
    description: 'Birthday party with cake',
    category: 'birthday',
    date: '1970-03-12',
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=200',
    description: 'Childhood home in the countryside',
    category: 'childhood',
    date: '1948-07-04',
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1511800453077-8c0afa94175f?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1511800453077-8c0afa94175f?w=200',
    description: 'Family holiday gathering',
    category: 'holiday',
    date: '1975-12-25',
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=200',
    description: 'Family portrait',
    category: 'family',
    date: '1968-05-10',
  },
  {
    id: '7',
    url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=200',
    description: 'Graduation ceremony',
    category: 'milestone',
    date: '1960-06-01',
  },
  {
    id: '8',
    url: 'https://images.unsplash.com/photo-1464547323744-4edd0cd0c746?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1464547323744-4edd0cd0c746?w=200',
    description: 'Anniversary celebration',
    category: 'celebration',
    date: '1985-08-20',
  },
];

// Voice prompts for AI companion
export const VOICE_PROMPTS = {
  greeting: [
    'Hello! I\'m here to help you share your beautiful memories.',
    'Welcome back! Shall we continue your story?',
    'It\'s wonderful to see you again. What memories shall we explore today?',
  ],
  photoIntroduction: [
    'I found this lovely photo. Would you like to tell me about it?',
    'This photo looks special. Can you share the story behind it?',
    'Let\'s talk about this moment. What do you remember?',
  ],
  encouragement: [
    'That\'s a beautiful memory. Please, tell me more.',
    'How wonderful! What else do you remember?',
    'Thank you for sharing. I\'d love to hear more details.',
  ],
  completion: [
    'What a wonderful story! Would you like to save it?',
    'Thank you for sharing this precious memory with me.',
    'This is a beautiful legacy for your family. Shall we save it?',
  ],
  listening: [
    'I\'m listening...',
    'Please take your time...',
    'Go ahead, I\'m here...',
  ],
};

// Memory categories with descriptions
export const MEMORY_CATEGORIES = {
  birthday: 'Birthday celebrations and special occasions',
  childhood: 'Early years and childhood memories',
  business: 'Work, career, and professional achievements',
  wedding: 'Wedding day and marriage memories',
  holiday: 'Holidays and family traditions',
  family: 'Family gatherings and moments together',
  celebration: 'Special celebrations and milestones',
  milestone: 'Life achievements and important moments',
  other: 'Other precious memories',
};
