import OpenAI from 'openai';
import * as FileSystem from 'expo-file-system';

/**
 * OpenAI Service
 * Handles Speech-to-Text (Whisper) and AI Story Generation (GPT)
 */

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export class OpenAIService {
  /**
   * Convert speech to text using OpenAI Whisper API
   * @param audioUri - Local file URI of the audio recording
   * @returns Transcribed text
   */
  async speechToText(audioUri: string): Promise<string> {
    try {
      // Convert the local file URI to a Blob
      const response = await fetch(audioUri);
      const audioBlob = await response.blob();

      // Create File object
      const audioFile = new File([audioBlob], 'recording.m4a', { type: 'audio/m4a' });

      // Transcribe using Whisper
      /* Enable this before submitting */
      // const transcription = await openai.audio.transcriptions.create({
      //   file: audioFile,
      //   model: 'whisper-1',
      //   language: 'en',
      // });

      // return transcription.text;

      // Mocked response for testing without API call
      return "I'm feeling happy"
    } catch (error) {
      console.error('Speech-to-text error:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  /**
   * Generate a legacy story from interview responses
   * @param photoDescription - Description of the photo
   * @param responses - Array of interview Q&A pairs
   * @returns Generated story narrative
   */
  async generateStory(
    photoDescription: string,
    responses: { question: string; answer: string }[]
  ): Promise<{ title: string; narrative: string }> {
    try {
      const prompt = this.buildStoryPrompt(photoDescription, responses);

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'You are a compassionate storyteller helping elderly people preserve their legacy stories. Your task is to take interview responses and weave them into a beautiful, first-person narrative that captures the warmth, emotion, and significance of their memories. Write in a conversational, warm tone as if the person is telling the story themselves.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 1000,
      });

      const content = completion.choices[0]?.message?.content || '';

      // Extract title and narrative from the response
      const lines = content.split('\n').filter((line) => line.trim());
      const title = lines[0]?.replace(/^Title:\s*/i, '').trim() || 'My Story';
      const narrative = lines
        .slice(1)
        .join('\n')
        .replace(/^Narrative:\s*/i, '')
        .trim();

      return { title, narrative };
    } catch (error) {
      console.error('Story generation error:', error);
      throw new Error('Failed to generate story');
    }
  }

  /**
   * Build the prompt for story generation
   */
  private buildStoryPrompt(
    photoDescription: string,
    responses: { question: string; answer: string }[]
  ): string {
    let prompt = `Photo: ${photoDescription}\n\n`;
    prompt += 'Interview Responses:\n';

    responses.forEach((response, index) => {
      prompt += `\nQ${index + 1}: ${response.question}\n`;
      prompt += `A${index + 1}: ${response.answer}\n`;
    });

    prompt += `\n\nBased on the photo and interview responses above, write a heartfelt first-person narrative story. Format your response as:
Title: [A short, meaningful title]
Narrative: [The full story in 3-4 paragraphs, written from the person's perspective, capturing emotions, details, and the significance of this memory]`;

    return prompt;
  }

  /**
   * Helper: Convert base64 to Blob
   */
  private base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }
}

// Export singleton instance
export const openaiService = new OpenAIService();

// Export utility functions
export const transcribeAudio = (audioUri: string) =>
  openaiService.speechToText(audioUri);
export const generateStoryFromInterview = (
  photoDescription: string,
  responses: { question: string; answer: string }[]
) => openaiService.generateStory(photoDescription, responses);
