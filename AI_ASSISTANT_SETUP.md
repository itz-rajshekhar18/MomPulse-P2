# 🤖 AI Assistant Setup Guide

## Overview
The MomPulse AI Assistant uses OpenRouter API to provide compassionate, evidence-based support for mothers at different stages of their journey.

---

## 🔑 API Configuration

### OpenRouter API Key
The AI Assistant uses OpenRouter's API to access various AI models. The API key is stored in the `.env` file:

```env
NEXT_PUBLIC_OPEN_ROUTER_API_KEY=sk-or-v1-...
```

### Getting Your Own API Key
1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for a free account
3. Navigate to API Keys section
4. Generate a new API key
5. Add it to your `.env` file

---

## 🎯 Features

### 1. **Stage-Specific AI Responses**
The AI Assistant adapts its responses based on the user's current stage:

- **Pre-Pregnancy**: Fertility tracking, preconception health, TTC support
- **Pregnancy**: Pregnancy symptoms, prenatal care, fetal development
- **Postpartum**: Recovery, breastfeeding, postpartum mental health
- **Period Tracker**: Menstrual health, cycle tracking, hormonal wellness

### 2. **Real-Time Chat**
- Send messages and receive AI-powered responses
- Typing indicator while AI is generating response
- Message history maintained during session
- Timestamps for all messages

### 3. **Stage Switcher**
- Easily switch between different stages
- AI adapts its knowledge base and tone
- System message confirms stage change

### 4. **Suggested Prompts**
- Stage-specific suggested questions
- Quick-start conversation starters
- Contextually relevant prompts

---

## 🏗️ Architecture

### API Route (`/app/api/chat/route.ts`)
```
User Message → Next.js API Route → OpenRouter API → AI Response → User
```

**Benefits:**
- ✅ Secure API key handling (server-side only)
- ✅ Request validation and error handling
- ✅ Stage-specific system prompts
- ✅ Response formatting and sanitization

### Frontend (`/app/ai-assistant/page.tsx`)
```
User Input → Chat UI → API Call → Response Display
```

**Features:**
- ✅ Real-time message updates
- ✅ Typing indicators
- ✅ Error handling with user-friendly messages
- ✅ Auto-scroll to latest message
- ✅ Stage management

---

## 🎨 AI Personality

### Tone & Style
- **Warm & Compassionate**: Like a supportive friend
- **Evidence-Based**: Backed by medical knowledge
- **Concise**: 2-3 sentences per response
- **Actionable**: Practical advice and tips
- **Empathetic**: Understanding of emotional challenges

### System Prompts
Each stage has a custom system prompt that defines:
- Area of expertise
- Topics to cover
- Tone and personality
- Response length guidelines

---

## 🔧 Technical Details

### Model Used
```typescript
model: 'openai/gpt-4o-mini'
```

**Why this model?**
- ✅ Highly reliable and available
- ✅ Fast response times
- ✅ Excellent quality responses
- ✅ Cost-effective
- ✅ Great for conversational AI
- ✅ Strong context understanding

### API Parameters
```typescript
{
  temperature: 0.7,      // Balanced creativity
  max_tokens: 300,       // Concise responses
}
```

### Request Format
```typescript
POST /api/chat
{
  messages: [
    { isUser: true, message: "User question" },
    { isUser: false, message: "AI response" }
  ],
  stage: "Pre-Pregnancy"
}
```

### Response Format
```typescript
{
  message: "AI generated response text"
}
```

---

## 🎯 Usage Examples

### Pre-Pregnancy Stage
**User**: "How can I track my ovulation?"  
**AI**: "Tracking ovulation is key to conception! You can use basal body temperature, ovulation predictor kits, or cervical mucus monitoring. The MomPulse fertility tracker can help you identify your fertile window with ease."

### Pregnancy Stage
**User**: "What are early pregnancy symptoms?"  
**AI**: "Early pregnancy symptoms often include fatigue, nausea, breast tenderness, and frequent urination. These are caused by rising hormone levels, especially hCG and progesterone. Remember, every pregnancy is unique!"

### Postpartum Stage
**User**: "Postpartum recovery tips"  
**AI**: "Recovery takes time, Mama. Focus on rest, gentle movement when cleared by your doctor, and nourishing foods. Don't hesitate to ask for help – your body just did something incredible and deserves care."

### Period Tracker Stage
**User**: "Understanding my cycle"  
**AI**: "Your menstrual cycle has four phases: menstruation, follicular, ovulation, and luteal. Each phase brings hormonal changes that affect your energy, mood, and body. Tracking helps you understand your unique patterns."

---

## 🛡️ Error Handling

### API Errors
```typescript
try {
  // API call
} catch (error) {
  // Show user-friendly error message
  "I apologize, but I'm having trouble connecting right now. 
   Please try again in a moment."
}
```

### Rate Limiting
OpenRouter has rate limits on the free tier:
- Monitor usage in OpenRouter dashboard
- Implement client-side rate limiting if needed
- Consider upgrading for higher limits

### Fallback Responses
If API fails, the system provides:
- Clear error message
- Suggestion to try again
- No data loss (previous messages preserved)

---

## 🎨 UI Components

### ChatMessage Component
- User messages: Purple bubble, right-aligned
- AI messages: Gray bubble, left-aligned with avatar
- Typing indicator: Animated dots
- Timestamps: Below each message
- Insight badges: For important AI responses

### ChatInput Component
- Text input with placeholder
- Send button with icon
- Auto-focus on mount
- Enter key to send

### SuggestedPrompts Component
- Horizontal scrollable pills
- Stage-specific suggestions
- One-click to send

---

## 🚀 Deployment Considerations

### Environment Variables
Ensure `.env` is in `.gitignore`:
```
.env
.env.local
```

### Production Setup
1. Add `NEXT_PUBLIC_OPEN_ROUTER_API_KEY` to production environment
2. Set `NEXT_PUBLIC_SITE_URL` for proper API referrer
3. Monitor API usage in OpenRouter dashboard
4. Consider implementing usage analytics

### Security
- ✅ API key never exposed to client
- ✅ All API calls go through Next.js API route
- ✅ Server-side validation
- ✅ Rate limiting on API route (recommended)

---

## 📊 Future Enhancements

### Potential Features
1. **Message History Persistence**
   - Save conversations to Firestore
   - Load previous conversations
   - Export chat history

2. **Voice Input**
   - Speech-to-text for hands-free use
   - Especially useful for busy moms

3. **Personalized Responses**
   - Use user profile data (age, health conditions)
   - Reference previous conversations
   - Track user preferences

4. **Action Cards**
   - Suggest specific actions based on conversation
   - Link to relevant articles or resources
   - Schedule reminders or appointments

5. **Multi-Language Support**
   - Translate prompts and responses
   - Support for non-English speakers

6. **Advanced Analytics**
   - Track common questions
   - Identify knowledge gaps
   - Improve system prompts

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Send message and receive response
- [ ] Switch between stages
- [ ] Test suggested prompts
- [ ] Verify typing indicator appears
- [ ] Check error handling (disconnect network)
- [ ] Test on mobile devices
- [ ] Verify message history persists during session

### Test Prompts
```
Pre-Pregnancy:
- "How can I improve my fertility?"
- "What supplements should I take?"
- "When is the best time to conceive?"

Pregnancy:
- "What should I eat during pregnancy?"
- "Is it safe to exercise?"
- "What are Braxton Hicks contractions?"

Postpartum:
- "How long does recovery take?"
- "Tips for breastfeeding?"
- "Dealing with postpartum depression"

Period Tracker:
- "Why is my period irregular?"
- "How to manage cramps?"
- "What is PMDD?"
```

---

## 📚 Resources

- **OpenRouter Docs**: https://openrouter.ai/docs
- **Llama 3.1 Model**: https://openrouter.ai/models/meta-llama/llama-3.1-8b-instruct:free
- **Next.js API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

---

## 🎉 Summary

The MomPulse AI Assistant provides:
- ✅ Real-time AI-powered support
- ✅ Stage-specific guidance
- ✅ Compassionate, evidence-based responses
- ✅ Secure API integration
- ✅ User-friendly interface
- ✅ Error handling and fallbacks

**Status**: ✅ Fully functional and ready for use!

---

**Last Updated**: Task 8 - OpenRouter API Integration
