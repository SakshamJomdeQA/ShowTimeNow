// Contentstack Personalize Edge API Configuration
export const PERSONALIZE_CONFIG = {
  // API Configuration (Note: Personalize Edge API may not be available for all plans)
  API_BASE_URL: 'https://personalize.contentstack.com',
  API_KEY: process.env.CONTENTSTACK_PERSONALIZE_API_KEY || '',
  ENVIRONMENT: process.env.CONTENTSTACK_PERSONALIZE_ENVIRONMENT || '',
  REGION: process.env.CONTENTSTACK_PERSONALIZE_REGION || 'us',
  
  // Content Type IDs
  CONTENT_TYPE_IDS: {
    MOVIES: process.env.CONTENTSTACK_MOVIES_CONTENT_TYPE_ID || '',
  },
  
  // Content Entry UIDs (using existing UIDs)
  ENTRY_UIDS: {
    MOVIES: process.env.CONTENTSTACK_MOVIES_ENTRY_UID || 'blte6b69fa2ddeb70b4',
  },
  
  // Age-specific Entry IDs from environment variables
  AGE_ENTRY_IDS: {
    ADULT_MOVIES: process.env.CONTENTSTACK_ADULT_MOVIES_ENTRY_ID || '',
    TEEN_MOVIES: process.env.CONTENTSTACK_TEEN_MOVIES_ENTRY_ID || '',
    CHILD_MOVIES: process.env.CONTENTSTACK_CHILD_MOVIES_ENTRY_ID || '',
  },
  
  // Personalization Variant UIDs (if Personalize is available)
  VARIANT_UIDS: {
    ADULT_MOVIES: process.env.CONTENTSTACK_ADULT_MOVIES_VARIANT_ID || '',
    TEEN_MOVIES: process.env.CONTENTSTACK_TEEN_MOVIES_VARIANT_ID || '',
    CHILD_MOVIES: process.env.CONTENTSTACK_CHILD_MOVIES_VARIANT_ID || '',
  },
  
  // Custom Attributes (as defined in Personalize)
  CUSTOM_ATTRIBUTES: {
    AGE: 'age',
    GENRE: 'genre',
  },
  
  // Audience Rules
  AUDIENCE_RULES: {
    ADULT: 'adult_movies',
    TEEN: 'teen_movies', 
    CHILD: 'child_movies',
  }
};

// Personalize Edge API Endpoints
export const PERSONALIZE_ENDPOINTS = {
  // Get personalized content - try different API patterns
  GET_PERSONALIZED_CONTENT: (entryId: string, variantId: string) => 
    `https://api.contentstack.io/v3/content_types/movies_types/entries/${entryId}?version=${variantId}`,
  
  // Alternative: Use Delivery API with variant parameter
  GET_PERSONALIZED_CONTENT_ALT: (entryId: string, variantId: string) => 
    `https://cdn.contentstack.io/v3/content_types/movies_types/entries/${entryId}?variant=${variantId}`,
  
  // Get all variants for an entry
  GET_ENTRY_VARIANTS: (entryId: string) => 
    `${PERSONALIZE_CONFIG.API_BASE_URL}/v1/entries/${entryId}/variants`,
  
  // Get audience information
  GET_AUDIENCES: () => 
    `${PERSONALIZE_CONFIG.API_BASE_URL}/v1/audiences`,
  
  // Get custom attributes
  GET_CUSTOM_ATTRIBUTES: () => 
    `${PERSONALIZE_CONFIG.API_BASE_URL}/v1/custom-attributes`,
};

// Personalization request interface
export interface PersonalizeRequest {
  entryId: string;
  variantId: string;
  customAttributes: {
    [key: string]: string | number | boolean;
  };
  userId?: string;
  sessionId?: string;
}

// Personalization response interface
export interface PersonalizeResponse {
  success: boolean;
  data: {
    entry: any;
    variant: any;
    audience: any;
    personalization: {
      matchedAudience: string;
      confidence: number;
      attributes: any;
    };
  };
  error?: string;
} 