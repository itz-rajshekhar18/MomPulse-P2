# MomPulse 🌸

A comprehensive maternal health platform that supports women through their entire journey - from period tracking to pre-pregnancy planning, pregnancy, and postpartum recovery.

🌐 **Live Demo**: [https://mom-pulse-p2.vercel.app](https://mom-pulse-p2.vercel.app)

## 🌟 Features

### 📅 Period Tracking & Predictions
- **ML-Powered Predictions**: Advanced machine learning algorithms predict next period dates, ovulation, and fertile windows
- **Cycle Analytics**: Track cycle length, regularity, and patterns over time
- **Symptom Tracking**: Log symptoms, flow intensity, and mood
- **Fertility Insights**: Personalized insights based on your cycle data

### 🤰 Pre-Pregnancy Planning
- **Fertility Window Tracking**: Know your most fertile days
- **Cycle Trend Analysis**: Visualize your cycle patterns with interactive charts
- **Health Recommendations**: Personalized nutrition and lifestyle tips
- **Ovulation Predictions**: ML-based ovulation date predictions

### 👶 Postpartum Recovery
- **Recovery Tracking**: Monitor your postpartum recovery journey
- **Health Metrics**: Track pain, bleeding, energy levels, and mood
- **Risk Assessment**: ML-powered recovery score and risk level analysis
- **Personalized Support**: Tailored recommendations for your recovery

### 🤖 AI Assistant
- **24/7 Support**: AI-powered assistant available anytime
- **Stage-Specific Guidance**: Contextual advice based on your current stage
- **Conversation History**: Persistent chat history across sessions
- **Multi-Stage Support**: Separate conversations for each life stage

### 👥 Community
- **Section-Based Communities**: Connect with others in similar stages
- **Share Experiences**: Post updates, ask questions, and support others
- **Reputation System**: Earn points for helpful contributions
- **Comments & Likes**: Engage with community posts

### 📚 Sanctuary (Articles & Videos)
- **Curated Content**: Expert articles on nutrition, mental health, sleep, and movement
- **Video Library**: Educational videos and guided exercises
- **Category Filtering**: Find content relevant to your needs
- **Newsletter**: Stay updated with the latest wellness tips

### 🩺 Consultation Booking
- **Expert Specialists**: Connect with OB-GYNs, midwives, and lactation consultants
- **Group Sessions**: Join collective workshops and seminars
- **Flexible Plans**: Free and premium membership options

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.2.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Lucide React Icons
- **Charts**: Recharts
- **Date Handling**: date-fns

### Backend
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Email/Password, Google OAuth)
- **Storage**: Firebase Storage
- **ML Backend**: Python Flask (deployed on Render)

### Machine Learning
- **Framework**: scikit-learn
- **Models**: Gradient Boosting Regressor, Ridge Regression
- **Features**: Cycle length prediction, ovulation detection, regularity analysis
- **Deployment**: Render (Python 3.11.9)

### AI Integration
- **Provider**: OpenRouter API
- **Model**: Advanced language models for conversational AI
- **Features**: Context-aware responses, stage-specific guidance

## 📁 Project Structure

```
mompulse/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   │   ├── chat/                 # AI Assistant API
│   │   ├── ml/                   # ML prediction APIs
│   │   └── cycles/               # Cycle data APIs
│   ├── dashboard/                # Dashboard pages
│   │   ├── period/               # Period tracking
│   │   ├── pre-pregnancy/        # Pre-pregnancy planning
│   │   └── postpartum/           # Postpartum recovery
│   ├── community/                # Community page
│   ├── consultation/             # Consultation booking
│   ├── sanctuary/                # Articles & videos
│   ├── ai-assistant/             # AI chat interface
│   ├── insights/                 # Fertility insights
│   ├── recovery/                 # Recovery tracking
│   └── profile/                  # User profile
├── components/                   # React components
│   ├── dashboard/                # Dashboard components
│   ├── community/                # Community components
│   ├── consultation/             # Consultation components
│   ├── sanctuary/                # Sanctuary components
│   ├── ai-assistant/             # AI Assistant components
│   ├── insights/                 # Insights components
│   ├── profile/                  # Profile components
│   └── animations/               # Animation components
├── lib/                          # Utility libraries
│   ├── firebase.ts               # Firebase configuration
│   ├── firestore.ts              # Firestore functions
│   └── usePeriodPrediction.ts    # ML prediction hook
├── contexts/                     # React contexts
│   └── AuthContext.tsx           # Authentication context
├── ml-backend/                   # Python ML backend
│   ├── period_tracker_ml.py      # Flask server
│   ├── requirements.txt          # Python dependencies
│   ├── render.yaml               # Render deployment config
│   └── runtime.txt               # Python version
└── public/                       # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Firebase account
- OpenRouter API key (for AI Assistant)
- Python 3.11+ (for local ML backend development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mompulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your credentials:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   # Google OAuth
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   
   # OpenRouter API (for AI Assistant)
   NEXT_PUBLIC_OPEN_ROUTER_API_KEY=your_openrouter_api_key
   
   # ML Backend URL
   ML_BACKEND_URL=https://mompulse-p2-2.onrender.com
   ```

4. **Set up Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database
   - Deploy Firestore rules: `npm run deploy:rules`

5. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🤖 ML Backend Setup

The ML backend is deployed on Render at `https://mompulse-p2-2.onrender.com`.

### Local Development

To run the ML backend locally:

1. **Navigate to ml-backend directory**
   ```bash
   cd ml-backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask server**
   ```bash
   python period_tracker_ml.py
   ```
   
   Server runs on `http://localhost:10000`

5. **Update environment variable**
   
   In `.env.local`:
   ```env
   ML_BACKEND_URL=http://localhost:10000
   ```

### ML Backend Endpoints

- **Health Check**: `GET /api/health`
- **Predict Cycle**: `POST /api/predict`
- **Get Insights**: `POST /api/insights`

See [ML_BACKEND_DEPLOYMENT.md](./ML_BACKEND_DEPLOYMENT.md) for detailed documentation.

## 📊 Firestore Data Structure

```
users/
  {userId}/
    - profile data
    - currentStage: 'planning' | 'pregnancy' | 'postpartum' | 'period'
    
    cycles/
      {cycleId}/
        - start_date, end_date
        - symptoms, flow_intensity
        - notes
    
    conversations/
      {conversationId}/
        messages/
          {messageId}/
            - message, isUser, timestamp
    
    recoveryLogs/
      {logId}/
        - day, deliveryType
        - sleep, pain, bleeding, energy
        - recoveryScore, riskLevel
    
    predictions/
      period/
        - nextPeriodDate, ovulationDate
        - fertileWindow, confidence

community/
  {section}/  # 'period' | 'pre-pregnancy' | 'postpartum' | 'general'
    posts/
      {postId}/
        - content, userId, userName
        - likesCount, commentsCount
        
        comments/
          {commentId}/
            - content, userId, userName
        
        likes/
          {userId}/
            - userName, createdAt

communityProfiles/
  {userId}/
    - postsCount, commentsCount
    - reputation, badges
```

## 🎨 Key Features Implementation

### Context-Aware Navigation
- Navigation adapts based on user's current stage
- Pre-pregnancy users see "Insights" link
- Postpartum users see "Recovery" link
- Active page highlighted in purple

### ML-Powered Predictions
- Gradient Boosting Regressor for cycle length prediction
- Feature engineering with rolling statistics
- Confidence scoring based on data points
- Regularity analysis with standard deviation

### Community Isolation
- Posts are section-specific (period, pre-pregnancy, postpartum)
- Firestore rules enforce section isolation
- Users can only see posts from their current section

### AI Assistant
- Stage-specific conversation contexts
- Persistent chat history in Firestore
- Session storage for performance
- OpenRouter API integration

## 🔒 Security

- Firebase Authentication for user management
- Firestore Security Rules for data access control
- Environment variables for sensitive data
- CORS configuration for ML backend
- Input validation on all forms

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS breakpoints
- Touch-friendly UI components
- Bottom navigation for mobile
- Adaptive layouts for all screen sizes

## 🚀 Deployment

### Live Application
- **Frontend**: [https://mom-pulse-p2.vercel.app](https://mom-pulse-p2.vercel.app)
- **ML Backend**: [https://mompulse-p2-2.onrender.com](https://mompulse-p2-2.onrender.com)

### Frontend (Vercel/Netlify)
1. Connect your Git repository
2. Set environment variables
3. Deploy with automatic builds

### ML Backend (Render)
1. Already deployed at `https://mompulse-p2-2.onrender.com`
2. Automatic deployments from `main` branch
3. Python 3.11.9 runtime
4. Free tier with auto-scaling

### Firestore Rules
```bash
npm run deploy:rules
```

## 📚 Documentation

- [AI Assistant Setup](./AI_ASSISTANT_SETUP.md)
- [AI Assistant Features](./AI_ASSISTANT_FEATURES.md)
- [ML Backend Deployment](./ML_BACKEND_DEPLOYMENT.md)
- [Quick Start ML Predictions](./QUICK_START_ML_PREDICTIONS.md)
- [Animation Guide](./ANIMATION_GUIDE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase for backend infrastructure
- OpenRouter for AI capabilities
- Render for ML backend hosting
- All contributors and testers

## 📞 Support

For support, email support@mompulse.com or join our community forum.

## 🔗 Links

- **Live Application**: [https://mom-pulse-p2.vercel.app](https://mom-pulse-p2.vercel.app)
- **ML Backend API**: [https://mompulse-p2-2.onrender.com](https://mompulse-p2-2.onrender.com)
- **Documentation**: See docs folder for detailed guides

---

Built with ❤️ for mothers everywhere 🌸
