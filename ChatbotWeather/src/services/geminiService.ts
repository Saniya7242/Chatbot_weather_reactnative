import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyDz0uIr723OvNq1eJQVKd63UN1cS5rfV9U';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface GeminiResponse {
  text: string;
  error?: string;
}

class GeminiService {
  private conversationHistory: ChatMessage[] = [];

  // Add message to conversation history
  addMessage(text: string, isUser: boolean) {
    const message: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
    };
    this.conversationHistory.push(message);
  }

  // Get conversation context for Gemini
  private getConversationContext(): string {
    const recentMessages = this.conversationHistory.slice(-10);
    return recentMessages
      .map(msg => `${msg.isUser ? 'User' : 'Assistant'}: ${msg.text}`)
      .join('\n');
  }

  // Generate response using Gemini API
  async generateResponse(userInput: string): Promise<GeminiResponse> {
    try {
      this.addMessage(userInput, true);

      const conversationContext = this.getConversationContext();

      const prompt = `
You are a helpful and friendly AI assistant. You can help with various topics including weather, general knowledge, and casual conversation.

Recent conversation:
${conversationContext}

User: ${userInput}

Instructions:
1. Respond naturally and conversationally as if you're a helpful friend
2. Keep responses concise but informative (2-4 sentences)
3. Be enthusiastic and helpful
4. If user asks about weather, you can provide general advice but suggest they use the weather app for specific forecasts
5. If user asks general questions, be conversational and helpful
6. IMPORTANT: Respond with ONLY natural text, no JSON format

Just give a friendly, natural response as if you're talking to a friend.
      `;

      const response = await axios.post(
        `${GEMINI_BASE_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const aiText = response.data.candidates[0].content.parts[0].text;
      const cleanText = aiText.trim();
      
      this.addMessage(cleanText, false);
      
      return {
        text: cleanText,
      };
    } catch (error: any) {
      console.error('Error generating Gemini response:', error);
      
      let errorMessage = "I'm having trouble connecting right now. Please try again!";
      
      if (error.response?.status === 404) {
        errorMessage = "I'm having trouble connecting to my brain right now. Let me try a different approach!";
      } else if (error.response?.status === 429) {
        errorMessage = "I'm getting a bit overwhelmed with requests. Give me a moment and try again!";
      } else if (error.response?.status === 400) {
        errorMessage = "I didn't understand that. Could you rephrase your question?";
      }
      
      return {
        text: errorMessage,
        error: error.message,
      };
    }
  }

  // Clear conversation history
  clearHistory() {
    this.conversationHistory = [];
  }

  // Get conversation history
  getHistory(): ChatMessage[] {
    return this.conversationHistory;
  }
}

export default new GeminiService();
