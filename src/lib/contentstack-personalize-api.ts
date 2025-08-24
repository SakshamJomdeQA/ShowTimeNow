import { PERSONALIZE_CONFIG } from './contentstack-personalize-config';
import { personalizeSdk } from '../../lib/contentstack';

export class ContentstackPersonalizeAPI {
  private apiKey: string;
  private environment: string;
  private region: string;

  constructor() {
    this.apiKey = PERSONALIZE_CONFIG.API_KEY;
    this.environment = PERSONALIZE_CONFIG.ENVIRONMENT;
    this.region = PERSONALIZE_CONFIG.REGION;
  }

  // Get personalized movies based on family member profile using the actual Personalize Edge SDK
  async getPersonalizedMovies(familyMember: {
    id: string;
    name: string;
    age: number;
    gender: string;
    preferences: string[];
  }): Promise<any> {
    try {
      // Determine which entry and variant to use based on age
      let entryId: string;
      let variantId: string;

      // Custom logic: Mike (20) should use child movies, Emma (16) should use teen movies
      if (familyMember.name === 'Mike') {
        // Mike specifically uses child movies variant
        entryId = process.env.CONTENTSTACK_CHILD_MOVIES_ENTRY_ID || 'bltbc9d353f08052686';
        variantId = process.env.CONTENTSTACK_CHILD_MOVIES_VARIANT_ID || 'csa80cbe7b155a6117';
      } else if (familyMember.age >= 18) {
        entryId = process.env.CONTENTSTACK_ADULT_MOVIES_ENTRY_ID || 'bltbc9d353f08052686';
        variantId = process.env.CONTENTSTACK_ADULT_MOVIES_VARIANT_ID || 'cs88979cadf5706241';
      } else if (familyMember.age >= 13) {
        entryId = process.env.CONTENTSTACK_TEEN_MOVIES_ENTRY_ID || 'bltbc9d353f08052686';
        variantId = process.env.CONTENTSTACK_TEEN_MOVIES_VARIANT_ID || 'cs1b972cd08e51b6d2';
      } else {
        entryId = process.env.CONTENTSTACK_CHILD_MOVIES_ENTRY_ID || 'bltbc9d353f08052686';
        variantId = process.env.CONTENTSTACK_CHILD_MOVIES_VARIANT_ID || 'csa80cbe7b155a6117';
      }

      console.log('🎯 Using Entry/Variant IDs:', {
        member: familyMember.name,
        age: familyMember.age,
        entryId,
        variantId,
        variantType: familyMember.name === 'Mike' ? 'CHILD_VARIANT' : familyMember.age >= 18 ? 'ADULT_VARIANT' : familyMember.age >= 13 ? 'TEEN_VARIANT' : 'CHILD_VARIANT'
      });

      // Use Personalize Edge SDK to get the actual variant content
      console.log('🎯 Using Contentstack Personalize Edge SDK to fetch variant content');
      
      try {
        // Set user attributes for personalization
        (personalizeSdk as any).set('age', familyMember.age);
        (personalizeSdk as any).set('gender', familyMember.gender);
        (personalizeSdk as any).set('preferences', familyMember.preferences.join(','));
        
        console.log('🔧 Set user attributes:', {
          age: familyMember.age,
          gender: familyMember.gender,
          preferences: familyMember.preferences.join(',')
        });
        
        // Use the working API call format with variant support
        console.log('🎯 Using direct API call with variant support');
        
        // Make the API call using the correct format
        const baseUrl = 'https://cdn.contentstack.io';
        const contentTypeUid = 'movies_types';
        const apiKey = 'bltd5475b5a045b6137';
        const accessToken = 'cs9629d8dc6e846c4ad99c622b';
        
        const url = `${baseUrl}/v3/content_types/${contentTypeUid}/entries/${entryId}`;
        
        const headers = {
          'api_key': apiKey,
          'access_token': accessToken,
          'x-cs-variant-uid': variantId,
          'Content-Type': 'application/json'
        };
        
        console.log('🌐 Making API call to:', url);
        console.log('🔑 Using variant ID:', variantId);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: headers
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        const personalizedEntry = data?.entry;
        
        console.log('📦 API Response:', {
          hasData: !!personalizedEntry,
          hasMoviesBlocks: !!(personalizedEntry as any)?.movies_blocks,
          movieCount: Array.isArray((personalizedEntry as any)?.movies_blocks) ? (personalizedEntry as any).movies_blocks.length : 0
        });
        
        // If this is the child variant, we should have 4 specific movies
        if (variantId === 'csa80cbe7b155a6117') {
          console.log('👶 Child variant detected - should have 4 movies');
          console.log('⚠️ Note: This should return child movies (Pokemon, Jujutsu Kaisen, etc.)');
          console.log('📋 Expected movies: Pokemon, Jujutsu Kaisen, Demon Slayer, and 1 more child movie');
        }
        
        console.log('📦 Personalized entry from SDK:', {
          hasData: !!personalizedEntry,
          hasMoviesBlocks: !!personalizedEntry?.movies_blocks,
          movieCount: Array.isArray(personalizedEntry?.movies_blocks) ? personalizedEntry.movies_blocks.length : 0
        });
        
        if (personalizedEntry && personalizedEntry.movies_blocks && Array.isArray(personalizedEntry.movies_blocks)) {
          const movieCount = personalizedEntry.movies_blocks.length;
          console.log(`✅ Got ${movieCount} movies from personalized entry for ${familyMember.name}`);
          
          // Process the personalized movies
          const processedMovies = personalizedEntry.movies_blocks.map((movie: any) => {
            const movieData = movie.movie_1;
            return {
              id: movieData?.uid || `movie_${Math.random()}`,
              title: movieData?.movie_name || 'Unknown Movie',
              genre: movieData?.movie_description || 'Unknown',
              rating: movieData?.star_rating?.value || 4.0,
              ageGroup: this.getMovieAgeGroup(movieData),
              description: movieData?.movie_description || 'A great movie.',
              image: movieData?.movie_image?.url || '/api/placeholder/300/200',
              link: movieData?.link_movie?.href || '#',
              personalizedReason: `Personalized for ${familyMember.name} (${familyMember.age} years old)`
            };
          });
          
          console.log(`🎬 Processed ${processedMovies.length} movies for ${familyMember.name}:`, 
            processedMovies.map((m: any) => m.title));
          
          return {
            success: true,
            memberId: familyMember.id,
            memberName: familyMember.name,
            personalizedContent: { movies: processedMovies },
            recommendations: processedMovies.slice(0, 6),
            watchlist: processedMovies.slice(0, 4),
            recentlyWatched: processedMovies.slice(0, 4),
            variantUsed: variantId,
            movieCount: processedMovies.length
          };
        } else {
          console.log('⚠️ No personalized content found, falling back to custom filtering');
          return this.getCustomPersonalizedContent(familyMember, variantId);
        }
        
      } catch (sdkError) {
        console.error('❌ Personalize SDK error:', sdkError);
        console.log('⚠️ Falling back to custom personalization');
        return this.getCustomPersonalizedContent(familyMember, variantId);
      }

    } catch (error) {
      console.error('Error in getPersonalizedMovies:', error);
      return this.getFallbackContent(familyMember);
    }
  }

  // Get personalized content using regular Contentstack API with variant-specific filtering
  private async getCustomPersonalizedContent(familyMember: any, variantId: string) {
    try {
      console.log('🎬 Fetching movies from Contentstack for:', familyMember.name);
      
      // Since all entry IDs are the same, we'll use the base entry and apply variant-specific filtering
      const entryId = process.env.CONTENTSTACK_ADULT_MOVIES_ENTRY_ID || 'bltbc9d353f08052686';
      
      console.log(`📋 Using entry ID: ${entryId} and variant ID: ${variantId} for ${familyMember.name}`);
      
      // Use the new getEntryWithVariant function to fetch movies with variant support
      const { getEntry } = await import('../../lib/contentstack-utils');
      const moviesResponse = await getEntry('movies_types', entryId);
      
      if (!moviesResponse || !moviesResponse.movies_blocks || !Array.isArray(moviesResponse.movies_blocks)) {
        console.error(`No movies data available from Contentstack for entry: ${entryId}`);
        return this.getFallbackContent(familyMember);
      }

      // Filter movies based on variant ID and preferences
      let filteredMovies = this.filterMoviesByVariantAndPreferences(moviesResponse.movies_blocks, familyMember, variantId);
      
      // If no movies match strict filtering, show age-appropriate movies
      if (filteredMovies.length === 0) {
        console.log('⚠️ No movies passed strict filtering, showing age-appropriate movies');
        filteredMovies = this.filterMoviesByAgeOnly(moviesResponse.movies_blocks, familyMember);
      }
      
      console.log(`📽️ Found ${filteredMovies.length} movies for ${familyMember.name} using variant: ${variantId}`);
      console.log(`🎬 Movies for ${familyMember.name}:`, filteredMovies.map(m => m.title));

      return {
        success: true,
        memberId: familyMember.id,
        memberName: familyMember.name,
        personalizedContent: { movies: filteredMovies },
        recommendations: filteredMovies.slice(0, 6),
        watchlist: filteredMovies.slice(0, 4),
        recentlyWatched: filteredMovies.slice(0, 4)
      };

    } catch (error) {
      console.error('Error fetching custom personalized content:', error);
      return this.getFallbackContent(familyMember);
    }
  }

  // Filter movies based on variant ID and preferences
  private filterMoviesByVariantAndPreferences(movies: any[], familyMember: any, variantId: string) {
    console.log(`🔍 Filtering ${movies.length} movies for ${familyMember.name} using variant: ${variantId}`);
    
    // Create variant-specific filtering logic
    const variantFilters: { [key: string]: { genres: string[]; maxRating: number; keywords: string[] } } = {
      'csa80cbe7b155a6117': { // Child movies variant
        genres: ['animation', 'family', 'adventure', 'comedy', 'action', 'sports'], // Added action and sports
        maxRating: 4.5,
        keywords: ['kid', 'family', 'fun', 'adventure']
      },
      'cs1b972cd08e51b6d2': { // Teen movies variant
        genres: ['action', 'adventure', 'comedy', 'romance', 'sci-fi'],
        maxRating: 4.8,
        keywords: ['teen', 'young', 'action', 'adventure']
      },
      'cs88979cadf5706241': { // Adult movies variant
        genres: ['action', 'drama', 'thriller', 'romance', 'comedy', 'sci-fi'],
        maxRating: 5.0,
        keywords: ['adult', 'drama', 'thriller', 'action']
      }
    };
    
    const filter = variantFilters[variantId] || variantFilters['cs88979cadf5706241']; // Default to adult
    
    const filteredMovies = movies.filter(movie => {
      try {
        // Extract movie data from the block structure
        const movieData = movie.movie_1;
        if (!movieData) return false;
        
        // Variant-based genre filtering - more flexible for children
        const hasMatchingGenre = filter.genres.some((genre: string) => 
          movieData.movie_description?.toLowerCase().includes(genre.toLowerCase())
        );
        
        if (!hasMatchingGenre && familyMember.age < 13) {
          console.log(`⚠️ Genre filter: ${movieData.movie_name} (${movieData.movie_description}) doesn't match variant genres, but allowing for child age`);
          // Continue to next filter instead of rejecting
        } else if (!hasMatchingGenre) {
          console.log(`❌ Genre filter: ${movieData.movie_name} (${movieData.movie_description}) doesn't match variant genres: ${filter.genres.join(', ')}`);
          return false;
        }
        
        // Rating-based filtering
        const movieRating = movieData.star_rating?.value || 4.0;
        if (movieRating > filter.maxRating) {
          console.log(`❌ Rating filter: ${movieData.movie_name} (${movieRating}) exceeds max rating: ${filter.maxRating}`);
          return false;
        }
        
        // Preference-based filtering - make it more flexible
        const hasMatchingPreference = familyMember.preferences.some((pref: string) => 
          movieData.movie_description?.toLowerCase().includes(pref.toLowerCase()) ||
          movieData.movie_name?.toLowerCase().includes(pref.toLowerCase())
        );
        
        // For children, if no exact preference match, still allow age-appropriate movies
        if (!hasMatchingPreference && familyMember.age < 13) {
          console.log(`⚠️ No preference match for ${movieData.movie_name}, but allowing for child age`);
          // Continue to next filter instead of rejecting
        } else if (!hasMatchingPreference) {
          console.log(`❌ Preference filter: ${movieData.movie_name} (${movieData.movie_description}) doesn't match preferences: ${familyMember.preferences.join(', ')}`);
          return false;
        }
        
        console.log(`✅ Movie passed variant filters: ${movieData.movie_name} (${movieData.movie_description}) for variant: ${variantId}`);
        return true;
      } catch (error) {
        console.error('Error filtering movie:', movie, error);
        return false;
      }
    });
    
    console.log(`📊 Variant filtering results: ${filteredMovies.length}/${movies.length} movies passed filters for variant: ${variantId}`);
    
    return filteredMovies.map(movie => {
      const movieData = movie.movie_1;
      return {
        id: movieData.uid,
        title: movieData.movie_name,
        genre: movieData.movie_description || 'general',
        rating: movieData.star_rating?.value || 4.0,
        ageGroup: this.getMovieAgeGroup(movieData),
        description: movieData.movie_description || 'A great movie for everyone.',
        image: movieData.movie_image?.url || '/api/placeholder/300/200',
        personalizedReason: this.generatePersonalizedReason(movieData, familyMember, null)
      };
    });
  }

  // Filter movies based on age only (fallback method)
  private filterMoviesByAgeOnly(movies: any[], familyMember: any) {
    const ageGroup = this.getAgeGroup(familyMember.age);
    console.log(`🔍 Age-only filtering ${movies.length} movies for ${familyMember.name} (age: ${familyMember.age}, group: ${ageGroup})`);
    
    const filteredMovies = movies.filter(movie => {
      try {
        const movieData = movie.movie_1;
        if (!movieData) return false;
        
        // Age-based filtering
        const movieAgeGroup = this.getMovieAgeGroup(movieData);
        if (!this.isAgeAppropriate(movieAgeGroup, familyMember.age)) {
          console.log(`❌ Age filter: ${movieData.movie_name} (${movieAgeGroup}) not appropriate for ${ageGroup}`);
          return false;
        }
        
        console.log(`✅ Movie passed age filter: ${movieData.movie_name} (${movieData.movie_description})`);
        return true;
      } catch (error) {
        console.error('Error filtering movie:', movie, error);
        return false;
      }
    });
    
    console.log(`📊 Age filtering results: ${filteredMovies.length}/${movies.length} movies passed age filters`);
    
    return filteredMovies.map(movie => {
      const movieData = movie.movie_1;
      return {
        id: movieData.uid,
        title: movieData.movie_name,
        genre: movieData.movie_description || 'general',
        rating: movieData.star_rating?.value || 4.0,
        ageGroup: this.getMovieAgeGroup(movieData),
        description: movieData.movie_description || 'A great movie for everyone.',
        image: movieData.movie_image?.url || '/api/placeholder/300/200',
        personalizedReason: this.generatePersonalizedReason(movieData, familyMember, null)
      };
    });
  }

  // Generate personalized reason for content
  private generatePersonalizedReason(movie: any, familyMember: any, personalization: any): string {
    const reasons = [];
    
    // Age-based reason
    const ageGroup = this.getAgeGroup(familyMember.age);
    if (movie.age_group === ageGroup) {
      reasons.push(`perfect for ${ageGroup} viewers`);
    }
    
    // Preference-based reason
    if (familyMember.preferences.some((pref: string) => movie.genre?.includes(pref))) {
      reasons.push(`matches your ${movie.genre} preferences`);
    }
    
    // Audience-based reason
    if (personalization?.matchedAudience) {
      reasons.push(`recommended by ${personalization.matchedAudience} audience`);
    }
    
    return reasons.length > 0 ? reasons.join(', ') : 'recommended for you';
  }

  // Get age group
  private getAgeGroup(age: number): string {
    if (age < 13) return 'child';
    if (age < 18) return 'teen';
    return 'adult';
  }

  // Get movie age group based on content
  private getMovieAgeGroup(movie: any): string {
    const description = movie.movie_description?.toLowerCase() || '';
    
    if (description.includes('animation') || description.includes('family')) {
      return 'child';
    } else if (description.includes('action') || description.includes('adventure') || description.includes('sci-fi')) {
      return 'teen';
    } else if (description.includes('drama') || description.includes('thriller') || description.includes('crime')) {
      return 'adult';
    }
    
    return 'general';
  }

  // Check if movie is age appropriate
  private isAgeAppropriate(movieAgeGroup: string, userAge: number): boolean {
    const userAgeGroup = this.getAgeGroup(userAge);
    
    if (userAgeGroup === 'child') {
      return movieAgeGroup === 'child' || movieAgeGroup === 'general';
    } else if (userAgeGroup === 'teen') {
      return movieAgeGroup === 'child' || movieAgeGroup === 'teen' || movieAgeGroup === 'general';
    } else {
      return true; // Adults can watch everything
    }
  }

  // Get fallback content when personalization fails
  private getFallbackContent(familyMember: any) {
    return {
      success: false,
      memberId: familyMember.id,
      memberName: familyMember.name,
      personalizedContent: { movies: [] },
      recommendations: [],
      watchlist: [],
      recentlyWatched: [],
      fallback: true,
      error: 'Personalization failed, showing fallback content'
    };
  }
}

// Export singleton instance
export const personalizeAPI = new ContentstackPersonalizeAPI(); 