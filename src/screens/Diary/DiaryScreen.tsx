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
import { storageService } from '../../services/storageService';

type DiaryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DiaryScreen: React.FC = () => {
  const navigation = useNavigation<DiaryScreenNavigationProp>();
  const [stories, setStories] = useState<LegacyStory[]>([]);

  useEffect(() => {
    const loadStories = async () => {
      const loadedStories = await storageService.getAllStories();
      setStories(loadedStories);
    };
    loadStories();
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
