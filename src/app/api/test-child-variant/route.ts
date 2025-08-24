import { NextResponse } from 'next/server';
import { ContentstackPersonalizeAPI } from '../../../lib/contentstack-personalize-api';

export async function GET() {
  try {
    console.log('🧪 Testing Child Variant API');
    
    // Create a child family member for testing
    const childMember = {
      id: 'child_test',
      name: 'Test Child',
      age: 8,
      gender: 'male',
      preferences: ['animation', 'adventure', 'comedy']
    };

    const personalizeAPI = new ContentstackPersonalizeAPI();
    
    // Test getting personalized content for child
    const result = await personalizeAPI.getPersonalizedMovies(childMember);
    
    console.log('📊 Child Variant Test Result:', {
      success: result.success,
      memberName: result.memberName,
      movieCount: result.movieCount,
      variantUsed: result.variantUsed,
      movieTitles: result.personalizedContent?.movies?.map((m: { title: string }) => m.title) || []
    });

    return NextResponse.json({
      success: true,
      test: 'Child Variant Test',
      result: {
        success: result.success,
        memberName: result.memberName,
        movieCount: result.movieCount,
        variantUsed: result.variantUsed,
        movies: result.personalizedContent?.movies?.map((m: {
          title: string;
          genre: string;
          ageGroup: string;
          rating: number;
          image: string;
          link: string;
          description: string;
          personalizedReason: string;
        }) => ({
          title: m.title,
          genre: m.genre,
          ageGroup: m.ageGroup,
          rating: m.rating,
          image: m.image,
          link: m.link,
          description: m.description,
          personalizedReason: m.personalizedReason
        })) || [],
        recommendations: result.recommendations?.length || 0,
        watchlist: result.watchlist?.length || 0
      }
    });

  } catch (error) {
    console.error('❌ Child Variant Test Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      test: 'Child Variant Test'
    }, { status: 500 });
  }
} 