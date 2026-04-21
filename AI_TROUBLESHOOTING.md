# 🔧 AI Assistant Troubleshooting Guide

## Common Issues & Solutions

### ❌ Issue 1: "No endpoints found" Error

**Error Message:**
```
OpenRouter API error: {
  error: {
    message: 'No endpoints found for [model-name]',
    code: 404
  }
}
```

**Cause:** The specified AI model is not available or the endpoint has changed.

**Solution:**
✅ **FIXED** - Updated to use `google/gemini-flash-1.5` which is reliable and free.

**Alternative Models** (if needed):
```typescript
// In app/api/chat/route.ts, change the model to one of these:

// Option 1: GPT-4o-mini (Current - Recommended)
model: 'openai/gpt-4o-mini'

// Option 2: GPT-3.5 Turbo
model: 'openai/gpt-3.5-turbo'

// Option 3: Claude Haiku (Fast and efficient)
model: 'anthropic/claude-3-haiku'

// Option 4: Meta Llama (if available)
model: 'meta-llama/llama-3.2-3b-instruct:free'
```

---

### ❌ Issue 2: API Key Not Working

**Error Message:**
```
OpenRouter API error: { error: { message: 'Invalid API key' } }
```

**Solutions:**

1. **Check API Key Format**
   ```env
   # Correct format in .env
   NEXT_PUBLIC_OPEN_ROUTER_API_KEY=sk-or-v1-...
   ```

2. **Verify API Key is Active**
   - Go to [OpenRouter Dashboard](https://openrouter.ai/keys)
   - Check if key is active and not expired
   - Generate new key if needed

3. **Restart Development Server**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

4. **Check Environment Variable Loading**
   ```typescript
   // In app/api/chat/route.ts
   console.log('API Key exists:', !!process.env.NEXT_PUBLIC_OPEN_ROUTER_API_KEY);
   ```

---

### ❌ Issue 3: Slow Response Times

**Symptoms:** AI takes more than 10 seconds to respond

**Solutions:**

1. **Check Network Connection**
   - Ensure stable internet connection
   - Test API directly: https://openrouter.ai/api/v1/models

2. **Reduce Max Tokens**
   ```typescript
   // In app/api/chat/route.ts
   max_tokens: 200  // Reduced from 300
   ```

3. **Use Faster Model**
   ```typescript
   model: 'openai/gpt-4o-mini'  // Already using fast model
   ```

4. **Check OpenRouter Status**
   - Visit [OpenRouter Status](https://status.openrouter.ai/)

---

### ❌ Issue 4: Rate Limit Exceeded

**Error Message:**
```
OpenRouter API error: { error: { message: 'Rate limit exceeded' } }
```

**Solutions:**

1. **Check Usage Limits**
   - Free tier: Limited requests per minute
   - View usage: [OpenRouter Dashboard](https://openrouter.ai/activity)

2. **Implement Client-Side Rate Limiting**
   ```typescript
   // In app/ai-assistant/page.tsx
   const [lastMessageTime, setLastMessageTime] = useState(0);
   
   const handleSendMessage = async (message: string) => {
     const now = Date.now();
     if (now - lastMessageTime < 2000) {
       alert('Please wait a moment before sending another message');
       return;
     }
     setLastMessageTime(now);
     // ... rest of code
   };
   ```

3. **Upgrade Plan** (if needed)
   - Visit [OpenRouter Pricing](https://openrouter.ai/pricing)

---

### ❌ Issue 5: Empty or Incomplete Responses

**Symptoms:** AI returns empty string or cuts off mid-sentence

**Solutions:**

1. **Increase Max Tokens**
   ```typescript
   // In app/api/chat/route.ts
   max_tokens: 500  // Increased from 300
   ```

2. **Check System Prompt**
   - Ensure system prompt is not too restrictive
   - Verify prompt doesn't conflict with response

3. **Adjust Temperature**
   ```typescript
   temperature: 0.8  // More creative (was 0.7)
   ```

---

### ❌ Issue 6: CORS Errors

**Error Message:**
```
Access to fetch at 'https://openrouter.ai/...' has been blocked by CORS policy
```

**Solution:**
✅ **Already Fixed** - Using Next.js API route as proxy

**Verification:**
- API calls go through `/api/chat` (server-side)
- No direct client-to-OpenRouter calls
- CORS not an issue with this architecture

---

### ❌ Issue 7: Typing Indicator Stuck

**Symptoms:** Typing indicator (● ● ●) doesn't disappear

**Solutions:**

1. **Check Error Handling**
   ```typescript
   // Ensure typing indicator is removed in catch block
   setMessages((prev) => prev.filter((msg) => msg.id !== 'typing'));
   ```

2. **Add Timeout**
   ```typescript
   // In app/ai-assistant/page.tsx
   const timeoutId = setTimeout(() => {
     setMessages((prev) => prev.filter((msg) => msg.id !== 'typing'));
   }, 30000); // 30 second timeout
   ```

---

### ❌ Issue 8: Messages Not Scrolling

**Symptoms:** New messages appear but don't auto-scroll

**Solutions:**

1. **Check Ref**
   ```typescript
   const messagesEndRef = useRef<HTMLDivElement>(null);
   
   useEffect(() => {
     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);
   ```

2. **Add Scroll Container**
   ```typescript
   <div className="flex-1 overflow-y-auto">
     {/* messages */}
     <div ref={messagesEndRef} />
   </div>
   ```

---

### ❌ Issue 9: Stage Switcher Not Working

**Symptoms:** Clicking stage doesn't update AI behavior

**Solutions:**

1. **Verify State Update**
   ```typescript
   const handleStageChange = (newStage: string) => {
     console.log('Switching to:', newStage);
     setCurrentStage(newStage);
     setShowStageSelector(false);
   };
   ```

2. **Check Stage Prop**
   ```typescript
   // In API call
   body: JSON.stringify({
     messages: [...messages, userMessage],
     stage: currentStage,  // Ensure this is passed
   })
   ```

---

### ❌ Issue 10: Build Errors

**Error Message:**
```
Type error: Property 'X' does not exist on type 'Y'
```

**Solutions:**

1. **Check TypeScript Types**
   ```typescript
   interface Message {
     id: string;
     message: string;
     isUser: boolean;
     timestamp: string;
     isInsight?: boolean;
   }
   ```

2. **Run Type Check**
   ```bash
   npm run build
   ```

3. **Clear Next.js Cache**
   ```bash
   rm -rf .next
   npm run dev
   ```

---

## 🔍 Debugging Tips

### Enable Detailed Logging

**In API Route** (`app/api/chat/route.ts`):
```typescript
console.log('Request:', { messages, stage });
console.log('API Key exists:', !!apiKey);
console.log('Response status:', response.status);
console.log('Response data:', data);
```

**In Frontend** (`app/ai-assistant/page.tsx`):
```typescript
console.log('Sending message:', message);
console.log('Current stage:', currentStage);
console.log('Response:', data);
```

### Check Network Tab

1. Open browser DevTools (F12)
2. Go to Network tab
3. Send a message
4. Look for `/api/chat` request
5. Check:
   - Request payload
   - Response status
   - Response body
   - Timing

### Test API Directly

**Using curl:**
```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "google/gemini-flash-1.5",
    "messages": [
      {"role": "user", "content": "Hello"}
    ]
  }'
```

---

## 📊 Performance Monitoring

### Check Response Times

```typescript
// In app/api/chat/route.ts
const startTime = Date.now();

// ... API call ...

const endTime = Date.now();
console.log(`API call took ${endTime - startTime}ms`);
```

### Monitor API Usage

- Visit [OpenRouter Activity](https://openrouter.ai/activity)
- Check:
  - Requests per day
  - Tokens used
  - Costs (if applicable)
  - Error rates

---

## 🆘 Getting Help

### OpenRouter Support
- **Documentation**: https://openrouter.ai/docs
- **Discord**: https://discord.gg/openrouter
- **Status Page**: https://status.openrouter.ai/

### Model-Specific Issues
- **Gemini Flash**: https://ai.google.dev/gemini-api/docs
- **Model List**: https://openrouter.ai/models

### Next.js Issues
- **API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **Environment Variables**: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables

---

## ✅ Quick Checklist

Before reporting an issue, verify:

- [ ] API key is correct in `.env`
- [ ] Development server restarted after `.env` changes
- [ ] Using correct model name: `google/gemini-flash-1.5`
- [ ] Network connection is stable
- [ ] OpenRouter service is operational
- [ ] No rate limits exceeded
- [ ] Browser console shows no errors
- [ ] Build completes successfully

---

## 🎯 Current Configuration (Working)

```typescript
// app/api/chat/route.ts
{
  model: 'openai/gpt-4o-mini',
  temperature: 0.7,
  max_tokens: 300,
}
```

**Status**: ✅ Working with GPT-4o-mini

---

**Need more help?** Check the main documentation files:
- `AI_ASSISTANT_SETUP.md` - Setup guide
- `AI_ASSISTANT_FEATURES.md` - Feature overview
- `TASK_8_COMPLETE.md` - Implementation details
