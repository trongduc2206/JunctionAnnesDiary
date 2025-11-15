import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../types';
import { COLORS, FONTS, SPACING, SIZES, SHADOWS } from '../../constants/theme';
import { Button } from '../../components/common';
import { SAMPLE_PHOTOS } from '../../constants/data';
import { elevenLabsService } from '../../services/elevenLabsService';
import { storageService } from '../../services/storageService';

type StoryPreviewScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'StoryPreview'
>;

type StoryPreviewScreenRouteProp = RouteProp<
  RootStackParamList,
  'StoryPreview'
>;

interface Props {
  navigation: StoryPreviewScreenNavigationProp;
  route: StoryPreviewScreenRouteProp;
}

const StoryPreviewScreen: React.FC<Props> = ({ navigation, route }) => {
  const { storyId } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock story data - in real app, this would come from storage/API
  const mockStory = {
    id: storyId,
    title: 'The Day My Bakery Opened',
    photo: SAMPLE_PHOTOS[0],
    narrative: `It was a beautiful morning in June 1965 when I opened the doors to my first bakery. The smell of fresh bread filled the air, and I could hardly contain my excitement. My husband had helped me paint the walls a soft cream color, and we had hung lace curtains in the windows.

I remember feeling both nervous and thrilled. Would people like my pastries? Would they come back? But as the first customers walked in, drawn by the aroma of cinnamon rolls and fresh croissants, I knew this was the beginning of something special.

The bakery became more than just a business—it became a gathering place for the community. Neighbors would stop by for their morning coffee, and children would press their noses against the display case, choosing their favorite treats.

Those were some of the happiest years of my life. Every loaf of bread, every cake I decorated, was made with love. And the friendships I formed with my customers became treasures that I carry with me to this day.`,
    createdAt: new Date().toISOString(),
    audioUrl: 'mock-audio-url',
  };

  const [story, setStory] = useState<any>(null);

  // Initialize audio service and load story on mount
  useEffect(() => {
    console.log('storyId:', storyId);
    elevenLabsService.initialize();

    // Load story
    const loadStory = async () => {
      const loadedStory = await storageService.getStory(storyId);
      console.log('Loaded story:', loadedStory);
      setStory(loadedStory);
    };
    loadStory();

    // Cleanup on unmount
    return () => {
      elevenLabsService.stopSpeaking();
    };
  }, [storyId]);

  const handleSave = () => {
    // Stop audio before navigating
    elevenLabsService.stopSpeaking();
    navigation.navigate('Home');
  };

  const handleShare = () => {
    // In real app, implement sharing functionality
    console.log('Share story');
  };

  const handlePlayAudio = async () => {
    try {
      if (isPlaying) {
        // Stop if already playing
        await elevenLabsService.stopSpeaking();
        setIsPlaying(false);
      } else {
        // Play the story narrative using ElevenLabs
        setIsLoading(true);
        await elevenLabsService.speak(story?.narrative || mockStory.narrative);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      alert('Failed to play audio. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Header */}
        <View style={styles.successHeader}>
          <Ionicons
            name="checkmark-circle"
            size={SIZES.iconSizeLarge}
            color={COLORS.success}
          />
          <Text style={styles.successText}>Your story is ready!</Text>
        </View>

        {/* Photo */}
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: story?.photo?.url || mockStory.photo.url }}
            style={styles.photo}
            resizeMode="cover"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>{story?.title || mockStory.title}</Text>

        {/* Date */}
        <Text style={styles.date}>
          Created on{' '}
          {new Date(story?.createdAt || mockStory.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </Text>

        {/* Audio Player */}
        <TouchableOpacity
          style={styles.audioPlayer}
          onPress={handlePlayAudio}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          <View style={styles.audioIcon}>
            <Ionicons
              name={isPlaying ? 'stop' : 'play'}
              size={SIZES.iconSize}
              color={COLORS.textWhite}
            />
          </View>
          <View style={styles.audioInfo}>
            <Text style={styles.audioTitle}>
              {isLoading ? 'Loading...' : isPlaying ? 'Stop Story' : 'Listen to Your Story'}
            </Text>
            <Text style={styles.audioDuration}>~ 2 minutes</Text>
          </View>
        </TouchableOpacity>

        {/* Narrative */}
        <View style={styles.narrativeContainer}>
          <Text style={styles.narrativeTitle}>Your Story</Text>
          <Text style={styles.narrative}>{story?.narrative || mockStory.narrative}</Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button
            title="Save to My Diary"
            onPress={handleSave}
            size="large"
            icon={
              <Ionicons name="save" size={32} color={COLORS.textWhite} />
            }
          />

          <TouchableOpacity
            style={styles.secondaryAction}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Ionicons
              name="share-social"
              size={SIZES.iconSize}
              color={COLORS.primary}
            />
            <Text style={styles.secondaryActionText}>
              Share with Family
            </Text>
          </TouchableOpacity>
        </View>
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
    paddingBottom: SPACING.xxl,
  },
  successHeader: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  successText: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
  },
  photoContainer: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    borderRadius: SIZES.borderRadius,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  photo: {
    width: '100%',
    height: 280,
    backgroundColor: COLORS.divider,
  },
  title: {
    fontSize: FONTS.extraLarge,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  date: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  audioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    borderRadius: SIZES.borderRadius,
    padding: SPACING.md,
    gap: SPACING.md,
    ...SHADOWS.small,
  },
  audioIcon: {
    width: SIZES.iconSizeLarge,
    height: SIZES.iconSizeLarge,
    borderRadius: SIZES.iconSizeLarge / 2,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioInfo: {
    flex: 1,
  },
  audioTitle: {
    fontSize: FONTS.title,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  audioDuration: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
  },
  narrativeContainer: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.xl,
  },
  narrativeTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  narrative: {
    fontSize: FONTS.title,
    color: COLORS.textSecondary,
    lineHeight: FONTS.title * 1.6,
  },
  actionsContainer: {
    marginHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: SIZES.borderRadius,
    height: SIZES.buttonHeight,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    ...SHADOWS.small,
  },
  secondaryActionText: {
    fontSize: FONTS.title,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

export default StoryPreviewScreen;
