import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { StoryCard } from '../../components/common';
import { LegacyStory, RootStackParamList } from '../../types';
import { SAMPLE_PHOTOS } from '../../constants/data';
import { storageService } from '../../services/storageService';

type DiaryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DiaryScreen: React.FC = () => {
  const navigation = useNavigation<DiaryScreenNavigationProp>();

  const defaultStories: LegacyStory[] = [
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
  const [stories, setStories] = useState<LegacyStory[]>(defaultStories);

  useEffect(() => {
    // In a real app, load stories from storage here
    const loadStory = async () => {
          const loadedStory = await storageService.getAllStories();
          setStories([...defaultStories, ...loadedStory]);
          
        };
        loadStory();
  }, []);

  const handleStoryPress = (storyId: string) => {
    navigation.navigate('StoryPreview', { storyId });
  };

  const handlePlayStory = (storyId: string) => {
    console.log('Play story audio:', storyId);
    navigation.navigate('StoryPreview', { storyId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {stories.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="book-outline"
              size={80}
              color={COLORS.border}
            />
            <Text style={styles.emptyTitle}>No Stories Yet</Text>
            <Text style={styles.emptySubtitle}>
              Start creating your first legacy story
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>My Legacy Stories</Text>
              <Text style={styles.headerSubtitle}>
                {stories.length} {stories.length === 1 ? 'story' : 'stories'}{' '}
                preserved
              </Text>
            </View>

            {stories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onPress={() => handleStoryPress(story.id)}
                onPlay={() => handlePlayStory(story.id)}
              />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  headerTitle: {
    fontSize: FONTS.extraLarge,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: FONTS.title,
    color: COLORS.textSecondary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  emptyTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONTS.title,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default DiaryScreen;
