import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, VoiceState, InterviewQuestion } from '../../types';
import { COLORS, FONTS, SPACING, SIZES, SHADOWS } from '../../constants/theme';
import { Button, VoiceIndicator } from '../../components/common';
import { SAMPLE_PHOTOS, INTERVIEW_QUESTIONS } from '../../constants/data';
import { elevenLabsService } from '../../services/elevenLabsService';
import { openaiService } from '../../services/openaiService';
import { storageService } from '../../services/storageService';

type InterviewScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Interview'
>;

type InterviewScreenRouteProp = RouteProp<RootStackParamList, 'Interview'>;

interface Props {
  navigation: InterviewScreenNavigationProp;
  route: InterviewScreenRouteProp;
}

const InterviewScreen: React.FC<Props> = ({ navigation, route }) => {
  const { photoId } = route.params;
  const photo = SAMPLE_PHOTOS.find((p) => p.id === photoId);

  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [transcripts, setTranscripts] = useState<{ question: string; answer: string }[]>([]);
  const [audioRecordings, setAudioRecordings] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);

  useEffect(() => {
    // Initialize audio service
    elevenLabsService.initialize();

    // Select relevant questions based on photo category
    const relevantQuestions = INTERVIEW_QUESTIONS.filter(
      (q) => q.category !== 'details' || Math.random() > 0.5
    ).slice(0, 5);

    setQuestions(relevantQuestions);

    if (relevantQuestions.length > 0) {
      setCurrentQuestion(relevantQuestions[0]);
      // Speak the first question
      speakQuestion(relevantQuestions[0].text);
    }

    // Cleanup on unmount
    return () => {
      elevenLabsService.cleanup();
    };
  }, []);

  const speakQuestion = async (questionText: string) => {
    try {
      await elevenLabsService.speak(questionText);
    } catch (error) {
      console.error('Error speaking question:', error);
    }
  };

  const handleStartListening = async () => {
    try {
      setVoiceState('listening');

      // Start recording user's response
      await elevenLabsService.startRecording();

      // Auto-stop after 30 seconds (or user can tap again to stop)
      setTimeout(async () => {
        if (voiceState === 'listening') {
          await handleStopListening();
        }
      }, 30000);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording. Please check microphone permissions.');
      setVoiceState('idle');
    }
  };

  const handleStopListening = async () => {
    try {
      setVoiceState('processing');

      // Stop recording and get audio URI
      const audioUri = await elevenLabsService.stopRecording();

      // Save the audio recording
      setAudioRecordings([...audioRecordings, audioUri]);

      // Transcribe the audio
      try {
        const transcription = await elevenLabsService.speechToText(audioUri);

        // Save transcript with question
        if (currentQuestion) {
          setTranscripts([
            ...transcripts,
            { question: currentQuestion.text, answer: transcription },
          ]);
        }

        setResponses([...responses, transcription]);
      } catch (transcriptionError) {
        console.error('Transcription error:', transcriptionError);
        // Still save as recorded even if transcription fails
        setResponses([...responses, `Response ${responses.length + 1} recorded`]);
      }

      // Move to next question
      if (currentQuestionIndex < questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        const nextQuestion = questions[nextIndex];
        setCurrentQuestion(nextQuestion);

        // Speak the next question
        await speakQuestion(nextQuestion.text);
      }

      setVoiceState('idle');
    } catch (error) {
      console.error('Error stopping recording:', error);
      alert('Failed to save recording.');
      setVoiceState('idle');
    }
  };

  const handleMicPress = async () => {
    if (voiceState === 'listening') {
      await handleStopListening();
    } else if (voiceState === 'idle') {
      await handleStartListening();
    }
  };

  const handleComplete = async () => {
    try {
      setIsGeneratingStory(true);

      // Stop any ongoing audio
      await elevenLabsService.cleanup();

      // Generate story from transcripts using AI
      if (transcripts.length > 0) {
        const photoDescription = photo?.description || 'A meaningful photo';

        const storyResult = await openaiService.generateStory(
          photoDescription,
          transcripts
        );

        // In a real app, you would save the story to storage here
        const storyId = 'temp-' + Date.now();
        await storageService.saveStory({
          id: storyId,
          photo: photo ?? null,
          title: storyResult.title,
          narrative: storyResult.narrative,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          metadata: {},
          audioUrl: "mock-audio-url-N",
        });

        // Navigate to story preview with generated story ID
        navigation.navigate('StoryPreview', { storyId: storyId });
      } else {
        // No transcripts available, navigate anyway with mock data
        console.log('No transcripts available, navigating with mock story.');
        navigation.navigate('StoryPreview', { storyId: 'temp-' + Date.now() });
      }
    } catch (error) {
      console.error('Error generating story:', error);
      alert('Failed to generate story. Please try again.');
    } finally {
      setIsGeneratingStory(false);
    }
  };

  if (!photo) {
    return (
      <View style={styles.container}>
        <Text>Photo not found</Text>
      </View>
    );
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isComplete = currentQuestionIndex >= questions.length - 1 && responses.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
        </View>

        {/* Photo */}
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: photo.url }}
            style={styles.photo}
            resizeMode="cover"
          />
          {photo.description && (
            <View style={styles.photoDescription}>
              <Text style={styles.photoDescriptionText}>
                {photo.description}
              </Text>
            </View>
          )}
        </View>

        {/* Voice Indicator */}
        <VoiceIndicator state={voiceState} />

        {/* Current Question */}
        {currentQuestion && !isComplete && (
          <View style={styles.questionContainer}>
            <Text style={styles.question}>{currentQuestion.text}</Text>
          </View>
        )}

        {/* Completion Message */}
        {isComplete && (
          <View style={styles.completionContainer}>
            <Ionicons
              name="checkmark-circle"
              size={SIZES.iconSizeLarge}
              color={COLORS.success}
            />
            <Text style={styles.completionText}>
              What a wonderful story! Would you like to save it?
            </Text>
          </View>
        )}

        {/* Previous Responses */}
        {responses.length > 0 && (
          <View style={styles.responsesContainer}>
            <Text style={styles.responsesTitle}>Your Responses:</Text>
            {responses.map((response, index) => (
              <View key={index} style={styles.responseCard}>
                <Ionicons
                  name="mic"
                  size={24}
                  color={COLORS.primary}
                />
                <Text style={styles.responseText}>
                  Response {index + 1} recorded
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        {!isComplete ? (
          <>
            <TouchableOpacity
              style={styles.micButton}
              onPress={handleMicPress}
              disabled={voiceState === 'processing'}
              activeOpacity={0.8}
            >
              <Ionicons
                name={voiceState === 'listening' ? 'stop-circle' : 'mic'}
                size={SIZES.iconSizeLarge}
                color={COLORS.textWhite}
              />
            </TouchableOpacity>
            <Text style={styles.micHint}>
              {voiceState === 'idle'
                ? 'Tap to answer'
                : voiceState === 'listening'
                ? 'Tap to stop'
                : 'Processing...'}
            </Text>
          </>
        ) : (
          <Button
            title={isGeneratingStory ? 'Generating Story...' : 'Save My Story'}
            onPress={handleComplete}
            size="large"
            disabled={isGeneratingStory}
            icon={
              <Ionicons
                name="save"
                size={32}
                color={COLORS.textWhite}
              />
            }
          />
        )}
      </View>
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
    paddingBottom: SPACING.xxl + 100,
  },
  progressContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.divider,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  progressText: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
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
  photoDescription: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: SPACING.md,
  },
  photoDescriptionText: {
    fontSize: FONTS.title,
    color: COLORS.textWhite,
    fontWeight: '600',
  },
  questionContainer: {
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.lg,
    backgroundColor: COLORS.cardBackground,
    borderRadius: SIZES.borderRadius,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  question: {
    fontSize: FONTS.large,
    color: COLORS.textPrimary,
    lineHeight: FONTS.large * 1.4,
    textAlign: 'center',
  },
  completionContainer: {
    alignItems: 'center',
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.lg,
    padding: SPACING.xl,
  },
  completionText: {
    fontSize: FONTS.large,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginTop: SPACING.md,
    lineHeight: FONTS.large * 1.4,
  },
  responsesContainer: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
  },
  responsesTitle: {
    fontSize: FONTS.title,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  responseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: SIZES.borderRadius,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
    ...SHADOWS.small,
  },
  responseText: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
  },
  micButton: {
    width: SIZES.avatarSize * 1.2,
    height: SIZES.avatarSize * 1.2,
    borderRadius: SIZES.avatarSize * 0.6,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
  },
  micHint: {
    fontSize: FONTS.title,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
});

export default InterviewScreen;
