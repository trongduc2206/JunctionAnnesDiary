// Core types for Anne's Diary app

export interface Photo {
  id: string;
  url: string;
  thumbnail?: string;
  description?: string;
  category?: PhotoCategory;
  date?: string;
  people?: string[];
}

export type PhotoCategory =
  | 'birthday'
  | 'childhood'
  | 'business'
  | 'wedding'
  | 'holiday'
  | 'family'
  | 'celebration'
  | 'milestone'
  | 'other';

export interface LegacyStory {
  id: string;
  title: string;
  photo: Photo | null;
  narrative: string;
  audioUrl?: string;
  createdAt: string;
  updatedAt: string;
  metadata: StoryMetadata;
}

export interface StoryMetadata {
  duration?: number; // in seconds
  wordCount?: number;
  category?: PhotoCategory;
  tags?: string[];
  people?: string[];
}

export interface InterviewQuestion {
  id: string;
  text: string;
  category: QuestionCategory;
  followUpQuestions?: string[];
}

export type QuestionCategory =
  | 'people'
  | 'feelings'
  | 'events'
  | 'significance'
  | 'legacy'
  | 'details';

export interface InterviewSession {
  id: string;
  photo: Photo;
  questions: InterviewQuestion[];
  responses: InterviewResponse[];
  currentQuestionIndex: number;
  status: InterviewStatus;
  startedAt: string;
  completedAt?: string;
}

export interface InterviewResponse {
  questionId: string;
  audioUrl?: string;
  transcript: string;
  timestamp: string;
}

export type InterviewStatus = 'in_progress' | 'completed' | 'paused';

export type VoiceState = 'idle' | 'listening' | 'speaking' | 'processing';

export interface UserProfile {
  id: string;
  name: string;
  age?: number;
  avatar?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  voiceSpeed: 'slow' | 'normal' | 'fast';
  fontSize: 'large' | 'extra-large';
  autoPlay: boolean;
  hapticFeedback: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  avatar?: string;
  sharedStories: string[]; // story IDs
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  PhotoSuggestion: undefined;
  Interview: { photoId: string };
  StoryPreview: { storyId: string };
  Diary: undefined;
  Profile: undefined;
};
