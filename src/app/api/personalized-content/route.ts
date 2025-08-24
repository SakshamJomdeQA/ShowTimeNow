import { NextRequest, NextResponse } from 'next/server';
import { personalizeAPI } from '../../../lib/contentstack-personalize-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId') || '';
    const age = parseInt(searchParams.get('age') || '0');
    const gender = searchParams.get('gender') || '';
    const preferences = searchParams.get('preferences')?.split(',') || [];

    console.log('Personalized content request:', { memberId, age, gender, preferences });

    // Create family member profile for personalization
    const familyMember = {
      id: memberId,
      name: memberId,
      age,
      gender,
      preferences
    };

    // Fetch personalized content using Contentstack Personalize Edge API
    const personalizedContent = await personalizeAPI.getPersonalizedMovies(familyMember);

    console.log('Personalized content generated:', {
      memberId,
      success: personalizedContent.success,
      recommendationsCount: personalizedContent.recommendations?.length || 0,
      watchlistCount: personalizedContent.watchlist?.length || 0,
      recentlyWatchedCount: personalizedContent.recentlyWatched?.length || 0
    });

    return NextResponse.json(personalizedContent);

  } catch (error) {
    console.error('Error in personalized content API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch personalized content'
      },
      { status: 500 }
    );
  }
} 