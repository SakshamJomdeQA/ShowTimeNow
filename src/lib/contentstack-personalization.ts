import { getEntry } from '../../lib/contentstack-utils';

// Contentstack Personalization Configuration
export const PERSONALIZATION_CONFIG = {
  // Age-based content categories
  AGE_GROUPS: {
    CHILD: { min: 0, max: 12, label: 'child' },
    TEEN: { min: 13, max: 17, label: 'teen' },
    ADULT: { min: 18, max: 100, label: 'adult' }
  },
  
  // Content type UIDs for different age groups
  CONTENT_TYPES: {
    CHILD_CONTENT: 'child_movies',
    TEEN_CONTENT: 'teen_movies', 
    ADULT_CONTENT: 'adult_movies',
    FAMILY_CONTENT: 'family_movies'
  },
  
  // Personalization rules
  RULES: {
    STRICT_AGE_FILTERING: true,
    INCLUDE_FAMILY_CONTENT: true,
    CROSS_AGE_RECOMMENDATIONS: false
  }
};

// Personalization interfaces
export interface PersonalizedContent {
  memberId: string;
  age: number;
  gender: string;
  preferences: string[];
  content: MovieContent[];
  recommendations: MovieContent[];
  watchlist: MovieContent[];
  recentlyWatched: MovieContent[];
}

export interface MovieContent {
  uid: string;
  title: string;
  genre: string;
  rating: number;
  ageGroup: string;
  description: string;
  image: string;
  personalizedReason: string;
  contentstackData: any;
}

export interface PersonalizationProfile {
  memberId: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  role: 'parent' | 'child';
  preferences: string[];
  viewingHistory: string[];
  watchlist: string[];
}

// Get age group for personalization
export function getAgeGroup(age: number): string {
  if (age <= PERSONALIZATION_CONFIG.AGE_GROUPS.CHILD.max) {
    return PERSONALIZATION_CONFIG.AGE_GROUPS.CHILD.label;
  } else if (age <= PERSONALIZATION_CONFIG.AGE_GROUPS.TEEN.max) {
    return PERSONALIZATION_CONFIG.AGE_GROUPS.TEEN.label;
  } else {
    return PERSONALIZATION_CONFIG.AGE_GROUPS.ADULT.label;
  }
}

// Check if content is age-appropriate
export function isAgeAppropriate(contentAgeGroup: string, userAge: number): boolean {
  const userAgeGroup = getAgeGroup(userAge);
  
  // Strict age filtering
  if (PERSONALIZATION_CONFIG.RULES.STRICT_AGE_FILTERING) {
    if (userAgeGroup === 'child') {
      return contentAgeGroup === 'child' || contentAgeGroup === 'family';
    } else if (userAgeGroup === 'teen') {
      return contentAgeGroup === 'teen' || contentAgeGroup === 'family';
    } else {
      return true; // Adults can watch all content
    }
  }
  
  // Flexible filtering
  return true;
}

// Fetch personalized content from Contentstack
export async function fetchPersonalizedContent(profile: PersonalizationProfile): Promise<PersonalizedContent> {
  try {
    console.log('Fetching personalized content for:', profile);
    
    // Fetch content based on age group
    const ageGroup = getAgeGroup(profile.age);
    const contentTypes = getContentTypesForAge(ageGroup);
    
    let allContent: MovieContent[] = [];
    
    // Fetch from multiple content types
    for (const contentType of contentTypes) {
      try {
        const content = await fetchContentByType(contentType, profile);
        allContent = [...allContent, ...content];
      } catch (error) {
        console.error(`Error fetching ${contentType}:`, error);
      }
    }
    
    // Apply personalization filters
    const personalizedContent = applyPersonalizationFilters(allContent, profile);
    
    return {
      memberId: profile.memberId,
      age: profile.age,
      gender: profile.gender,
      preferences: profile.preferences,
      content: personalizedContent.content,
      recommendations: personalizedContent.recommendations,
      watchlist: personalizedContent.watchlist,
      recentlyWatched: personalizedContent.recentlyWatched
    };
    
  } catch (error) {
    console.error('Error in fetchPersonalizedContent:', error);
    return generateFallbackContent(profile);
  }
}

// Get content types based on age group
function getContentTypesForAge(ageGroup: string): string[] {
  const types = [];
  
  // Always include family content
  if (PERSONALIZATION_CONFIG.RULES.INCLUDE_FAMILY_CONTENT) {
    types.push(PERSONALIZATION_CONFIG.CONTENT_TYPES.FAMILY_CONTENT);
  }
  
  // Add age-specific content
  switch (ageGroup) {
    case 'child':
      types.push(PERSONALIZATION_CONFIG.CONTENT_TYPES.CHILD_CONTENT);
      break;
    case 'teen':
      types.push(PERSONALIZATION_CONFIG.CONTENT_TYPES.TEEN_CONTENT);
      break;
    case 'adult':
      types.push(PERSONALIZATION_CONFIG.CONTENT_TYPES.ADULT_CONTENT);
      break;
  }
  
  return types;
}

// Fetch content from specific Contentstack content type
async function fetchContentByType(contentType: string, profile: PersonalizationProfile): Promise<MovieContent[]> {
  try {
    // This would be your actual Contentstack content type UID
    const contentEntry = await getEntry(contentType, 'your_content_uid_here');
    
    if (!contentEntry || !Array.isArray(contentEntry.movies_blocks)) {
      return [];
    }
    
    return contentEntry.movies_blocks
      .map((movie: any) => ({
        uid: movie.uid || '',
        title: movie.movie_name || '',
        genre: movie.genre || 'general',
        rating: movie.star_rating?.value || 4.0,
        ageGroup: movie.age_group || getAgeGroup(profile.age),
        description: movie.description || 'A great movie for everyone.',
        image: movie.movie_image?.url || '/api/placeholder/300/200',
        personalizedReason: generatePersonalizedReason(movie, profile),
        contentstackData: movie
      }))
      .filter((movie: MovieContent) => isAgeAppropriate(movie.ageGroup, profile.age));
      
  } catch (error) {
    console.error(`Error fetching ${contentType}:`, error);
    return [];
  }
}

// Apply personalization filters
function applyPersonalizationFilters(content: MovieContent[], profile: PersonalizationProfile) {
  // Filter by preferences
  const preferenceFiltered = content.filter(movie => 
    profile.preferences.some(pref => 
      movie.genre.toLowerCase().includes(pref.toLowerCase()) ||
      movie.title.toLowerCase().includes(pref.toLowerCase())
    )
  );
  
  // Sort by rating and relevance
  const sortedContent = preferenceFiltered.sort((a, b) => {
    // Priority: preference match, then rating
    const aPreferenceMatch = profile.preferences.some(pref => 
      a.genre.toLowerCase().includes(pref.toLowerCase())
    );
    const bPreferenceMatch = profile.preferences.some(pref => 
      b.genre.toLowerCase().includes(pref.toLowerCase())
    );
    
    if (aPreferenceMatch && !bPreferenceMatch) return -1;
    if (!aPreferenceMatch && bPreferenceMatch) return 1;
    
    return b.rating - a.rating;
  });
  
  return {
    content: sortedContent,
    recommendations: sortedContent.slice(0, 6),
    watchlist: getWatchlist(content),
    recentlyWatched: getRecentlyWatched(content)
  };
}

// Generate personalized reason for content
function generatePersonalizedReason(movie: any, profile: PersonalizationProfile): string {
  const reasons = [];
  
  // Age-based reasons
  const ageGroup = getAgeGroup(profile.age);
  if (movie.age_group === ageGroup) {
    reasons.push(`perfect for ${ageGroup} viewers`);
  }
  
  // Preference-based reasons
  if (profile.preferences.includes(movie.genre)) {
    reasons.push(`matches your ${movie.genre} preferences`);
  }
  
  // Gender-based reasons (optional)
  if (profile.gender === 'female' && movie.genre === 'romance') {
    reasons.push('popular among female viewers');
  }
  
  if (profile.gender === 'male' && movie.genre === 'action') {
    reasons.push('popular among male viewers');
  }
  
  return reasons.length > 0 ? reasons.join(', ') : 'recommended for you';
}

// Get watchlist (mock implementation)
function getWatchlist(content: MovieContent[]): MovieContent[] {
  // In real implementation, fetch from user's watchlist
  return content.sort(() => 0.5 - Math.random()).slice(0, 4);
}

// Get recently watched (mock implementation)
function getRecentlyWatched(content: MovieContent[]): MovieContent[] {
  // In real implementation, fetch from user's watch history
  return content.sort(() => 0.5 - Math.random()).slice(0, 4);
}

// Generate fallback content
function generateFallbackContent(profile: PersonalizationProfile): PersonalizedContent {
  const mockContent: MovieContent[] = [
    {
      uid: '1',
      title: 'Family Adventure',
      genre: 'adventure',
      rating: 4.5,
      ageGroup: 'family',
      description: 'A fun adventure for the whole family.',
      image: '/api/placeholder/300/200',
      personalizedReason: 'family-friendly content',
      contentstackData: {}
    }
  ];
  
  return {
    memberId: profile.memberId,
    age: profile.age,
    gender: profile.gender,
    preferences: profile.preferences,
    content: mockContent,
    recommendations: mockContent,
    watchlist: mockContent,
    recentlyWatched: mockContent
  };
} 