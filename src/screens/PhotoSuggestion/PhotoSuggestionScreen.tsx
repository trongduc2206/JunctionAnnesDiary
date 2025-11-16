import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Photo } from '../../types';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { Button, PhotoCard } from '../../components/common';
import { SAMPLE_PHOTOS, INTERVIEW_QUESTIONS } from '../../constants/data';
import { photoService } from '../../services/photoService';

type PhotoSuggestionScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PhotoSuggestion'
>;

interface Props {
  navigation: PhotoSuggestionScreenNavigationProp;
}

const PhotoSuggestionScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [autoSelectedPhotos, setAutoSelectedPhotos] = useState<Photo[]>([]);
  const [firstQuestion] = useState(
    INTERVIEW_QUESTIONS.find(q => q.category === 'events')?.text ||
    'Tell me about this special day in your life.'
  );
  const [introText] = useState(
    "I found these beautiful photos from your wedding day. When you look at them, what feelings come back to you?"
  );

  useEffect(() => {
    requestPermissions();
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const photos = await photoService.getAllPhotos();
      setAllPhotos(photos);

      // Auto-select wedding photos
      const weddingPhotos = photos.filter(p => p.category === 'wedding');
      if (weddingPhotos.length > 0) {
        // Select up to 3 wedding photos for the series
        const selectedSeries = weddingPhotos.slice(0, 3);
        setAutoSelectedPhotos(selectedSeries);
        // Pre-select the first wedding photo
        setSelectedPhoto(selectedSeries[0]);
      }
    } catch (error) {
      console.error('Error loading photos:', error);
      setAllPhotos(SAMPLE_PHOTOS);

      // Auto-select wedding photos from sample photos
      const weddingPhotos = SAMPLE_PHOTOS.filter(p => p.category === 'wedding');
      if (weddingPhotos.length > 0) {
        const selectedSeries = weddingPhotos.slice(0, 3);
        setAutoSelectedPhotos(selectedSeries);
        setSelectedPhoto(selectedSeries[0]);
      }
    }
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need access to your photos to help you create stories from your memories.',
        [{ text: 'OK' }]
      );
    }
  };

  const handlePhotoSelect = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const handlePickPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newPhoto: Photo = {
          id: `user-${Date.now()}`,
          url: asset.uri,
          description: 'Your photo',
          category: 'other',
        };

        // Add to photo service and reload photos
        await photoService.addUserPhoto(newPhoto);
        await loadPhotos();
        setSelectedPhoto(newPhoto);
      }
    } catch (error) {
      console.error('Error picking photo:', error);
      Alert.alert('Error', 'Failed to pick photo. Please try again.');
    }
  };

  const handleContinue = () => {
    if (selectedPhoto) {
      navigation.navigate('Interview', { photoId: selectedPhoto.id });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Wedding Story</Text>
          <Text style={styles.subtitle}>{introText}</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Auto-Selected Wedding Photos */}
          {autoSelectedPhotos.length > 0 && (
            <View style={styles.autoSelectedSection}>
              <Text style={styles.sectionTitle}>I've picked these for you</Text>
              <View style={styles.collageContainer}>
                {/* Main large photo on the left */}
                {autoSelectedPhotos[0] && (
                  <TouchableOpacity
                    key={autoSelectedPhotos[0].id}
                    style={[
                      styles.collagePhoto,
                      styles.collagePhotoLarge,
                      selectedPhoto?.id === autoSelectedPhotos[0].id && styles.collagePhotoSelected,
                    ]}
                    onPress={() => handlePhotoSelect(autoSelectedPhotos[0])}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: autoSelectedPhotos[0].url }}
                      style={styles.collageImage}
                      resizeMode="cover"
                    />
                    {selectedPhoto?.id === autoSelectedPhotos[0].id && (
                      <View style={styles.selectedOverlay}>
                        <View style={styles.selectedBadge}>
                          <Text style={styles.selectedText}>✓</Text>
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>
                )}

                {/* Right column with 2 smaller photos */}
                {autoSelectedPhotos.length > 1 && (
                  <View style={styles.collageRightColumn}>
                    {autoSelectedPhotos.slice(1, 3).map((photo) => (
                      <TouchableOpacity
                        key={photo.id}
                        style={[
                          styles.collagePhoto,
                          styles.collagePhotoSmall,
                          selectedPhoto?.id === photo.id && styles.collagePhotoSelected,
                        ]}
                        onPress={() => handlePhotoSelect(photo)}
                        activeOpacity={0.8}
                      >
                        <Image
                          source={{ uri: photo.url }}
                          style={styles.collageImage}
                          resizeMode="cover"
                        />
                        {selectedPhoto?.id === photo.id && (
                          <View style={styles.selectedOverlay}>
                            <View style={styles.selectedBadge}>
                              <Text style={styles.selectedText}>✓</Text>
                            </View>
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          )}

          {/* First Question Preview */}
          {selectedPhoto && (
            <View style={styles.questionPreview}>
              <Text style={styles.questionLabel}>I'd love to hear about this...</Text>
              <Text style={styles.questionText}>{firstQuestion}</Text>
            </View>
          )}

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Add Photo Button */}
          <View style={styles.addPhotoSection}>
            <Button
              title="📸 I'd prefer a different photo"
              onPress={handlePickPhoto}
              size="large"
            />
          </View>

          {/* Other Available Photos */}
          {allPhotos.filter(p => p.category !== 'wedding').length > 0 && (
            <View style={styles.otherPhotosSection}>
              <Text style={styles.sectionTitle}>Or explore these other moments</Text>
              {allPhotos
                .filter(p => p.category !== 'wedding')
                .map((photo) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    selected={selectedPhoto?.id === photo.id}
                    onPress={() => handlePhotoSelect(photo)}
                  />
                ))}
            </View>
          )}
        </ScrollView>

        {/* Bottom Action */}
        {selectedPhoto && (
          <View style={styles.bottomAction}>
            <Button
              title="Let's start talking about this"
              onPress={handleContinue}
              size="large"
            />
          </View>
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
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  title: {
    fontSize: FONTS.extraLarge,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.title,
    color: COLORS.textSecondary,
    lineHeight: FONTS.title * 1.4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl + 80,
  },
  autoSelectedSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  collageContainer: {
    flexDirection: 'row',
    height: 280,
    gap: SPACING.xs,
  },
  collagePhoto: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.divider,
  },
  collagePhotoLarge: {
    flex: 2,
  },
  collageRightColumn: {
    flex: 1,
    gap: SPACING.xs,
  },
  collagePhotoSmall: {
    flex: 1,
  },
  collagePhotoSelected: {
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  collageImage: {
    width: '100%',
    height: '100%',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 28,
    color: COLORS.textWhite,
    fontWeight: '700',
  },
  questionPreview: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  questionLabel: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  questionText: {
    fontSize: FONTS.large,
    color: COLORS.textPrimary,
    lineHeight: FONTS.large * 1.4,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    marginHorizontal: SPACING.md,
  },
  addPhotoSection: {
    marginBottom: SPACING.lg,
  },
  otherPhotosSection: {
    marginTop: SPACING.lg,
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

export default PhotoSuggestionScreen;
