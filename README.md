# 🚀 FakeVerifier - AI-Powered News Credibility Verification Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.0-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-green?style=for-the-badge&logo=openai)](https://openai.com/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-Qwen-blue?style=for-the-badge&logo=openai)](https://openrouter.ai/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

> **Advanced AI-powered platform for real-time news verification and credibility assessment using multiple news APIs and AI models (OpenAI GPT-4o for paid users, OpenRouter Qwen for free users)**

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [API Integrations](#-api-integrations)
- [Features in Detail](#-features-in-detail)
- [Getting Started](#-getting-started)
- [Environment Setup](#-environment-setup)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

FakeVerifier is a sophisticated web application that leverages artificial intelligence to verify the credibility of news content, social media posts, and online information. Built with modern web technologies, it provides real-time analysis using multiple news APIs and advanced AI models to help users distinguish between factual and misleading information.

### 🎯 **Problem Statement**
In today's digital age, misinformation spreads rapidly across social media and news platforms. Users often struggle to verify the authenticity of information they encounter online, leading to the spread of fake news and misinformation.

### 💡 **Solution**
FakeVerifier addresses this challenge by providing:
- **Real-time AI analysis** using GPT-4o for content credibility assessment
- **Multi-source news verification** from 4+ major news APIs
- **Comprehensive scoring system** with confidence levels and detailed explanations
- **User-friendly interface** for easy content submission and result interpretation
- **Historical tracking** of verification attempts and results

## ✨ Key Features

### 🔍 **Advanced Content Analysis**
- **Multi-format support**: Text, URLs, and social media content
- **AI-powered verification**: Multi-model integration (GPT-4o for paid users, Qwen for free users)
- **Real-time scoring**: Confidence percentages and credibility ratings
- **Detailed explanations**: Comprehensive reasoning for each verification result
- **Tier-based model selection**: Automatic model selection based on user subscription status

### 📰 **Multi-Source News Integration**
- **News API**: Real-time articles from 80,000+ sources
- **NewsAPI.ai**: Advanced news aggregation and analysis
- **Finlight API**: Financial and business news coverage
- **New York Times API**: Premium news content and analysis
- **News Source Videos**: Direct video content from major news outlets

### 🎨 **Modern User Interface**
- **Responsive design**: Mobile-first approach with Tailwind CSS
- **Real-time chat interface**: ChatGPT-like experience for content submission
- **Interactive dashboard**: Usage analytics and verification history
- **Dark/Light mode**: Customizable theme preferences
- **Accessibility**: WCAG compliant design patterns

### 🔐 **Authentication & Security**
- **Firebase Authentication**: Secure user management
- **Role-based access**: User permissions and data isolation
- **API key management**: Secure environment variable handling
- **Data encryption**: End-to-end data protection

### 📊 **Analytics & Insights**
- **Usage tracking**: Comprehensive user activity monitoring
- **Verification history**: Persistent chat and analysis records
- **Performance metrics**: Response times and accuracy tracking
- **Export capabilities**: Data export for further analysis

## 🛠 Technology Stack

### **Frontend**
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Modern component library
- **Framer Motion**: Smooth animations and transitions

### **Backend & APIs**
- **Next.js API Routes**: Server-side API endpoints
- **OpenAI GPT-4o**: Advanced AI content analysis for paid users
- **OpenRouter Qwen**: Cost-effective AI analysis for free users
- **Firebase Firestore**: NoSQL database for user data
- **Firebase Authentication**: User management system

### **News APIs**
- **News API**: 80,000+ news sources
- **NewsAPI.ai**: Advanced news aggregation
- **Finlight API**: Financial news coverage
- **New York Times API**: Premium news content

### **Development Tools**
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Git**: Version control

## 🏗 Architecture

### **System Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   APIs          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Firebase      │    │   OpenAI        │    │   News APIs     │
│   (Auth/DB)     │    │   (GPT-4o)      │    │   (4 Sources)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Data Flow**
1. **User Input**: Content submission via chat interface
2. **Content Processing**: URL extraction and keyword analysis
3. **Multi-API Query**: Parallel requests to news sources
4. **AI Analysis**: GPT-4o processes content with news context
5. **Result Generation**: Structured response with confidence scoring
6. **Data Storage**: Firebase persistence for user history
7. **UI Update**: Real-time interface updates with results

## 🔌 API Integrations

### **News Sources**
| API | Purpose | Coverage | Rate Limit |
|-----|---------|----------|------------|
| News API | General news articles | 80,000+ sources | 1,000/day |
| NewsAPI.ai | Advanced aggregation | Global coverage | 1,000/day |
| Finlight | Financial news | Business focus | 1,000/day |
| NYT API | Premium content | US & International | 1,000/day |

### **AI Processing**
- **Model**: GPT-4o (OpenAI's latest model)
- **Context Window**: 128K tokens
- **Analysis Types**: Credibility, fact-checking, AI detection
- **Response Format**: Structured JSON with confidence scores

### **Video Content**
- **News Source Videos**: Direct from major news outlets
- **Platforms**: CNN, BBC, Fox News, MSNBC, Reuters, Bloomberg
- **Content Types**: News videos, analysis, interviews
- **Embedding**: Direct video player integration

## 🚀 Features in Detail

### **1. Intelligent Content Analysis**
```typescript
// Example: Content verification flow
const analysis = await verifyContent({
  content: "Breaking news about AI developments",
  type: "news",
  includeVideos: true,
  confidenceThreshold: 75
});
```

### **2. Real-time News Verification**
- **Keyword Extraction**: Intelligent content parsing
- **Multi-source Cross-referencing**: 4+ news APIs simultaneously
- **Temporal Analysis**: Recent vs. historical information
- **Source Credibility**: Weighted scoring based on source reputation

### **3. User Experience Features**
- **Chat-like Interface**: Familiar messaging experience
- **Real-time Updates**: Live progress indicators
- **History Management**: Persistent conversation storage
- **Export Functionality**: Data export in multiple formats

### **4. Advanced Analytics**
- **Usage Tracking**: Comprehensive user activity monitoring
- **Performance Metrics**: Response times and accuracy rates
- **Trend Analysis**: Verification patterns over time
- **Custom Dashboards**: Personalized analytics views

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Firebase project
- OpenAI API key
- News API keys (optional for full functionality)

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/pdevulapally/fakeverifier-website.git
cd fakeverifier-website
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment Setup**
```bash
cp .env.example .env.local
```

4. **Configure environment variables**
```env
# OpenAI
OPENAI_API_KEY=your-openai-api-key

# News APIs (Optional)
NEWS_API_KEY=your-news-api-key
NEWSAPI_AI_KEY=your-newsapi-ai-key
FINLIGHT_API_KEY=your-finlight-api-key
NYT_API_KEY=your-nyt-api-key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

5. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

6. **Open your browser**
```
https://your-app-domain.com
```

## 📁 Project Structure

```
fakeverifier-website/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   └── ai-analysis/         # AI analysis endpoint
│   ├── login/                   # Authentication pages
│   ├── settings/                # User settings
│   ├── usage/                   # Analytics dashboard
│   └── verify/                  # Main verification interface
├── components/                   # React components
│   ├── ui/                      # Shadcn/ui components
│   ├── enhanced-chat-input.tsx  # Chat input component
│   ├── enhanced-chat-interface.tsx # Main chat interface
│   ├── demo-modal.tsx           # Interactive demo
│   ├── hero-section.tsx         # Landing page hero
│   ├── token-system.tsx         # Usage tracking
│   └── verify-sidebar.tsx       # Navigation sidebar
├── lib/                         # Utility libraries
│   ├── firebase.ts              # Firebase configuration
│   └── utils.ts                 # Helper functions
├── public/                      # Static assets
├── styles/                      # Global styles
└── types/                       # TypeScript definitions
```

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### **Netlify**
1. Build command: `npm run build`
2. Publish directory: `out`
3. Configure environment variables

### **Firebase Hosting**
```bash
npm run build
firebase deploy
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Code Standards**
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write comprehensive tests for new features
- Update documentation for API changes

## 📊 Performance Metrics

### **Response Times**
- **AI Analysis**: < 5 seconds average
- **News API Queries**: < 2 seconds parallel
- **Database Operations**: < 100ms average
- **Page Load**: < 2 seconds initial load

### **Scalability**
- **Concurrent Users**: 1000+ simultaneous
- **API Rate Limits**: Optimized for production usage
- **Database**: Firebase Firestore auto-scaling
- **CDN**: Global content delivery

## 🔒 Security Features

- **Input Validation**: Comprehensive content sanitization
- **API Key Protection**: Server-side environment variables
- **User Authentication**: Firebase Auth integration
- **Data Encryption**: End-to-end encryption for sensitive data
- **Rate Limiting**: Protection against abuse
- **CORS Configuration**: Secure cross-origin requests

## 🤖 AI Model Integration

### **Multi-Tier AI System**
FakeVerifier uses a sophisticated tier-based AI system to optimize costs while maintaining quality:

#### **Free Users (OpenRouter)**
- **Model**: Qwen 2.5 Coder 7B Instruct
- **Provider**: OpenRouter (free tier)
- **Features**: Cost-effective analysis with good accuracy
- **Token Limit**: 2000 tokens per request
- **Use Cases**: Basic news verification, content analysis

#### **Paid Users (OpenAI)**
- **Model**: GPT-4o / GPT-4o Search Preview
- **Provider**: OpenAI (premium tier)
- **Features**: Advanced analysis with superior accuracy
- **Token Limit**: 3000 tokens per request
- **Use Cases**: Comprehensive verification, real-time search, detailed analysis

### **Automatic Model Selection**
The system automatically selects the appropriate AI model based on:
- User authentication status
- Subscription tier (free vs paid)
- Content type (real-time vs historical)
- Analysis complexity requirements

For detailed setup instructions, see [OpenRouter Setup Guide](OPENROUTER_SETUP.md).

## 📈 Future Roadmap

### **Phase 1 (Current)**
- ✅ Multi-source news verification
- ✅ AI-powered analysis
- ✅ User authentication
- ✅ Real-time chat interface
- ✅ Tier-based AI model selection

### **Phase 2 (Planned)**
- 🔄 Browser extension
- 🔄 Mobile application
- 🔄 Advanced analytics dashboard
- 🔄 API rate limit optimization

### **Phase 3 (Future)**
- 📋 Machine learning model training
- 📋 Real-time fact-checking alerts
- 📋 Social media integration
- 📋 Multi-language support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 About the Developer

**Preet** - Full Stack Developer specializing in AI/ML applications and modern web technologies.

### **Technical Skills**
- **Frontend**: React, Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Firebase, API Development
- **AI/ML**: OpenAI GPT, Natural Language Processing
- **Databases**: Firebase Firestore, SQL, NoSQL
- **DevOps**: Vercel, Netlify, CI/CD

### **Contact**
- **GitHub**: [@pdevulapally](https://github.com/pdevulapally)
- **LinkedIn**: [PreethamDevulapally](https://www.linkedin.com/in/preethamdevulapally/)
- **Portfolio**: [Preetham Devulapally](https://preetham-devulapally.vercel.app/)

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and OpenAI**

[![GitHub stars](https://img.shields.io/github/stars/pdevulapally/fakeverifier-website?style=social)](https://github.com/pdevulapally/fakeverifier-website/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/pdevulapally/fakeverifier-website?style=social)](https://github.com/pdevulapally/fakeverifier-website/network)
[![GitHub issues](https://img.shields.io/github/issues/pdevulapally/fakeverifier-website)](https://github.com/pdevulapally/fakeverifier-website/issues)

</div>
