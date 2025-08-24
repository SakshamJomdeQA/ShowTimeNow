# ShowTimeNow - Product Requirements Document (PRD)

## 1. Executive Summary

### 1.1 Product Overview
ShowTimeNow is a modern, user-friendly platform for booking movies, events, and live shows instantly. The platform features advanced personalization capabilities using Contentstack's Personalize Edge API to deliver tailored content based on family member profiles.

### 1.2 Target Audience
- **Primary**: Families with multiple members (parents and children)
- **Secondary**: Individual users seeking personalized entertainment recommendations
- **Tertiary**: Movie enthusiasts and event-goers

### 1.3 Key Value Propositions
- **Personalized Content**: AI-driven recommendations based on age, gender, and preferences
- **Family-Centric Design**: Multi-account system for different family members
- **Seamless Booking**: One-click booking for movies, events, and shows
- **Modern UI/UX**: Responsive design with smooth animations and intuitive navigation

## 2. Product Vision & Goals

### 2.1 Vision Statement
"To revolutionize entertainment booking by providing personalized, family-friendly experiences that adapt to each user's preferences and age-appropriate content."

### 2.2 Strategic Goals
- **Q1**: Launch MVP with basic personalization
- **Q2**: Implement advanced family account management
- **Q3**: Expand to events and live shows
- **Q4**: Mobile app development

### 2.3 Success Metrics
- User engagement with personalized content
- Family account adoption rate
- Booking conversion rate
- User satisfaction scores

## 3. User Stories & Requirements

### 3.1 Core User Stories

#### US-001: Family Account Management
**As a** family user  
**I want to** switch between different family member accounts  
**So that** each member gets personalized content based on their age and preferences

**Acceptance Criteria:**
- Account switcher shows "Use Account" initially
- Users can select from predefined family members (John, Sarah, Mike, Emma)
- Selected account shows personalized content
- Account switcher only appears on homepage and movies page

#### US-002: Personalized Content Delivery
**As a** family member  
**I want to** see movies and content tailored to my age and preferences  
**So that** I get relevant recommendations

**Acceptance Criteria:**
- Content varies based on age groups (child, teen, adult)
- Personalization uses Contentstack variants
- Real-time content updates when switching accounts
- Personalized reason displayed (optional)

#### US-003: Movie Discovery & Booking
**As a** user  
**I want to** browse and book movies easily  
**So that** I can enjoy entertainment without friction

**Acceptance Criteria:**
- Movie grid with posters, titles, genres, ratings
- Search functionality with real-time results
- Movie detail pages with comprehensive information
- One-click booking system

#### US-004: Responsive Design
**As a** user  
**I want to** access the platform on any device  
**So that** I can book entertainment anywhere, anytime

**Acceptance Criteria:**
- Mobile-responsive design
- Touch-friendly interface
- Fast loading times
- Cross-browser compatibility

### 3.2 Technical Requirements

#### TR-001: Content Management
- **Contentstack Integration**: Seamless CMS integration
- **Variant Management**: Support for multiple content variants
- **Real-time Updates**: Live content synchronization
- **API Performance**: Sub-2-second response times

#### TR-002: Personalization Engine
- **Edge API Integration**: Contentstack Personalize Edge SDK
- **Variant Selection**: Dynamic content based on user attributes
- **Caching Strategy**: Optimized content delivery
- **Fallback Mechanism**: Default content when personalization fails

#### TR-003: Frontend Architecture
- **Next.js 15**: Modern React framework
- **TypeScript**: Type-safe development
- **CSS Modules**: Scoped styling
- **Component Library**: Reusable UI components

## 4. Feature Specifications

### 4.1 Account Management System

#### 4.1.1 Family Member Profiles
```typescript
interface FamilyMember {
  name: string;           // John, Sarah, Mike, Emma
  age: number;           // 45, 38, 10, 16
  gender: string;        // male, female
  role: string;          // Parent, Child
  preferences: string[]; // [animation, action, drama]
  avatar: string;        // Emoji representation
}
```

#### 4.1.2 Account Switcher UI
- **Location**: Header component (homepage and movies page only)
- **Default State**: "Use Account" with generic avatar
- **Selected State**: Family member name with personalized avatar
- **Dropdown**: List of available family members with selection indicators

### 4.2 Personalization Engine

#### 4.2.1 Content Variants
- **Child Variant** (`csa198cb7b00312cbd`): Age-appropriate content for children
- **Teen Variant**: Content suitable for teenagers
- **Adult Variant**: General audience content

#### 4.2.2 Personalization Logic
```typescript
// Age-based variant selection
if (age < 13) → Child Variant
else if (age < 18) → Teen Variant
else → Adult Variant

// Special cases
if (name === 'Mike') → Child Variant (regardless of age)
```

#### 4.2.3 API Integration
- **Endpoint**: `/api/personalized-content`
- **Parameters**: memberId, age, gender, preferences
- **Response**: Personalized movies with metadata

### 4.3 Movie Management

#### 4.3.1 Movie Data Structure
```typescript
interface Movie {
  title: string;
  genre: string;
  rating: number;
  image: string;
  link: string;
  description: string;
  personalizedReason?: string;
}
```

#### 4.3.2 Movie Display Features
- **Grid Layout**: Responsive movie cards
- **Search**: Real-time movie search
- **Filtering**: Genre and rating filters
- **Details**: Comprehensive movie information pages

### 4.4 UI/UX Components

#### 4.4.1 Header Component
- **Logo**: ShowTimeNow branding
- **Search**: Global movie search
- **Account Switcher**: Family member selection
- **Navigation**: Movies, Events, Plays

#### 4.4.2 Movie Cards
- **Poster**: High-quality movie images
- **Title**: Movie name
- **Genre**: Movie category
- **Rating**: Star rating display
- **Book Button**: One-click booking

#### 4.4.3 Responsive Design
- **Mobile**: Single-column layout
- **Tablet**: Two-column layout
- **Desktop**: Multi-column grid
- **Touch**: Swipe gestures for navigation

## 5. Technical Architecture

### 5.1 Frontend Stack
```
Next.js 15 (App Router)
├── TypeScript
├── CSS Modules
├── Contentstack SDK
└── Personalize Edge SDK
```

### 5.2 Backend Integration
```
Contentstack CMS
├── Content Types
│   ├── movies_types
│   ├── header_page
│   └── theatres
├── Variants
│   ├── Child (csa198cb7b00312cbd)
│   ├── Teen
│   └── Adult
└── Personalize Edge API
```

### 5.3 API Endpoints
```
/api/movies              # Get all movies
/api/personalized-content # Get personalized content
/api/test-child-variant  # Test child variant
/api/test-direct-api     # Test direct API calls
```

### 5.4 Data Flow
1. **User Selection**: Family member selected in header
2. **Event Dispatch**: Custom event sent to HomePage
3. **API Call**: Personalization API called with user data
4. **Content Fetch**: Variant-specific content retrieved
5. **UI Update**: Movies grid updated with personalized content

## 6. User Interface Design

### 6.1 Design System
- **Color Palette**: 
  - Primary: #f84464 (Pink)
  - Secondary: #ff6b8a (Light Pink)
  - Background: #1a1a1a (Dark)
  - Text: #ffffff (White)

- **Typography**:
  - Headings: Bold, 2rem
  - Body: Regular, 0.9rem
  - Captions: Light, 0.8rem

- **Spacing**:
  - Small: 0.5rem
  - Medium: 1rem
  - Large: 2rem

### 6.2 Component Library
- **Header**: Navigation and account management
- **MovieCard**: Individual movie display
- **MovieGrid**: Responsive movie layout
- **SearchBar**: Global search functionality
- **AccountSwitcher**: Family member selection

## 7. Performance Requirements

### 7.1 Loading Times
- **Initial Load**: < 3 seconds
- **Page Navigation**: < 1 second
- **Search Results**: < 500ms
- **Personalization**: < 2 seconds

### 7.2 Scalability
- **Concurrent Users**: 1000+
- **Content Updates**: Real-time
- **API Response**: < 2 seconds
- **Caching**: CDN + Browser caching

## 8. Security & Privacy

### 8.1 Data Protection
- **User Data**: No personal information stored
- **Family Profiles**: Predefined, non-editable
- **API Keys**: Environment variables
- **HTTPS**: Secure communication

### 8.2 Content Safety
- **Age Verification**: Content filtering by age
- **Variant Control**: Admin-controlled content variants
- **Fallback Content**: Safe default content

## 9. Testing Strategy

### 9.1 Unit Testing
- Component rendering
- API integration
- Personalization logic
- User interactions

### 9.2 Integration Testing
- Contentstack API
- Personalize Edge API
- End-to-end workflows
- Cross-browser compatibility

### 9.3 User Testing
- Family member scenarios
- Personalization accuracy
- UI/UX feedback
- Performance testing

## 10. Deployment & DevOps

### 10.1 Environment Setup
- **Development**: Local development server
- **Staging**: Preview environment
- **Production**: Live platform

### 10.2 CI/CD Pipeline
- **Build**: Next.js build process
- **Test**: Automated testing
- **Deploy**: Vercel deployment
- **Monitor**: Performance monitoring

## 11. Future Enhancements

### 11.1 Phase 2 Features
- **Event Booking**: Live events and shows
- **Mobile App**: Native iOS/Android apps
- **Advanced Personalization**: ML-driven recommendations
- **Social Features**: Reviews and ratings

### 11.2 Phase 3 Features
- **Multi-language**: Internationalization
- **Offline Support**: PWA capabilities
- **Voice Search**: AI-powered search
- **AR/VR**: Immersive experiences

## 12. Success Metrics & KPIs

### 12.1 User Engagement
- **Daily Active Users**: Target 500+
- **Session Duration**: Target 5+ minutes
- **Page Views**: Target 10+ per session
- **Bounce Rate**: Target < 30%

### 12.2 Personalization Metrics
- **Account Switches**: Track family member selection
- **Content Relevance**: User satisfaction with recommendations
- **Variant Usage**: Distribution across content variants
- **API Performance**: Response times and reliability

### 12.3 Business Metrics
- **Booking Conversion**: Target 15%+
- **User Retention**: Target 70% monthly
- **Feature Adoption**: Personalization usage
- **Customer Satisfaction**: NPS score target 8+

## 13. Risk Assessment

### 13.1 Technical Risks
- **API Dependencies**: Contentstack service availability
- **Performance**: Large content libraries
- **Browser Compatibility**: Modern browser requirements
- **Mobile Responsiveness**: Touch interface optimization

### 13.2 Mitigation Strategies
- **Fallback Content**: Default content when APIs fail
- **Caching**: Aggressive caching strategies
- **Progressive Enhancement**: Graceful degradation
- **Testing**: Comprehensive cross-device testing

## 14. Conclusion

ShowTimeNow represents a modern approach to entertainment booking with a focus on personalization and family-friendly experiences. The platform successfully integrates advanced content management with real-time personalization, creating a unique user experience that adapts to individual preferences while maintaining a cohesive family experience.

The technical architecture ensures scalability, performance, and maintainability, while the user interface provides an intuitive and engaging experience across all devices. With continuous monitoring and iterative improvements, ShowTimeNow is positioned to become a leading platform in the entertainment booking space.

---

**Document Version**: 1.0  
**Last Updated**: December 2024  
**Next Review**: January 2025 