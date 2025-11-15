import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, SIZES, SHADOWS } from '../../constants/theme';
import { Button } from '../../components/common';
import { VOICE_PROMPTS } from '../../constants/data';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [greeting] = useState(
    VOICE_PROMPTS.greeting[
      Math.floor(Math.random() * VOICE_PROMPTS.greeting.length)
    ]
  );

  const handleStartInterview = () => {
    navigation.navigate('PhotoSuggestion');
  };

  return (
    <LinearGradient
      colors={[COLORS.background, COLORS.primaryLight]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>Anne's Diary</Text>
          <Text style={styles.tagline}>Preserving Your Legacy</Text>
        </View>

        {/* Main content */}
        <View style={styles.mainContent}>
          {/* AI Avatar */}
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryDark]}
              style={styles.avatar}
            >
              <Ionicons
                name="heart"
                size={SIZES.iconSizeLarge}
                color={COLORS.textWhite}
              />
            </LinearGradient>
          </View>

          {/* Greeting */}
          <View style={styles.greetingCard}>
            <Text style={styles.greeting}>{greeting}</Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsContainer}>
            <Button
              title="Start New Story"
              onPress={handleStartInterview}
              size="large"
              icon={
                <Ionicons
                  name="add-circle"
                  size={32}
                  color={COLORS.textWhite}
                />
              }
            />

            <TouchableOpacity
              style={styles.secondaryAction}
              onPress={() => navigation.navigate('DiaryTab')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="book"
                size={SIZES.iconSize}
                color={COLORS.primary}
              />
              <Text style={styles.secondaryActionText}>
                View My Stories
              </Text>
            </TouchableOpacity>
          </View>

          {/* Memory Suggestions */}
          <View style={styles.suggestionsContainer}>
            <Text style={styles.sectionTitle}>
              Memory Suggestions for Today
            </Text>
            <View style={styles.suggestionCards}>
              {[
                {
                  icon: 'cake',
                  title: 'Birthday Memories',
                  subtitle: 'Celebrate special moments',
                },
                {
                  icon: 'home',
                  title: 'Childhood Home',
                  subtitle: 'Where it all began',
                },
                {
                  icon: 'heart',
                  title: 'Love Stories',
                  subtitle: 'Cherished relationships',
                },
              ].map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionCard}
                  onPress={handleStartInterview}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={suggestion.icon as any}
                    size={32}
                    color={COLORS.primary}
                  />
                  <View style={styles.suggestionText}>
                    <Text style={styles.suggestionTitle}>
                      {suggestion.title}
                    </Text>
                    <Text style={styles.suggestionSubtitle}>
                      {suggestion.subtitle}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  header: {
    paddingTop: SPACING.xl + 40,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.lg,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: FONTS.extraLarge + 4,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginBottom: SPACING.xs,
  },
  tagline: {
    fontSize: FONTS.title,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  mainContent: {
    paddingHorizontal: SPACING.md,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: SIZES.avatarSize * 1.5,
    height: SIZES.avatarSize * 1.5,
    borderRadius: SIZES.avatarSize * 0.75,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
  },
  greetingCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SIZES.borderRadius,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    ...SHADOWS.medium,
  },
  greeting: {
    fontSize: FONTS.title,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: FONTS.title * 1.5,
  },
  actionsContainer: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
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
  suggestionsContainer: {
    marginTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  suggestionCards: {
    gap: SPACING.sm,
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: SIZES.borderRadius,
    padding: SPACING.md,
    gap: SPACING.md,
    ...SHADOWS.small,
  },
  suggestionText: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: FONTS.title,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  suggestionSubtitle: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
  },
});

export default HomeScreen;
