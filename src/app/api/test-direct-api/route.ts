import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🧪 Testing Direct Contentstack API');
    
    // Use the exact API format provided by the user
    const baseUrl = 'https://cdn.contentstack.io';
    const contentTypeUid = 'movies_types';
    const entryUid = 'bltbc9d353f08052686';
    const apiKey = 'bltd5475b5a045b6137';
    const accessToken = 'cs9629d8dc6e846c4ad99c622b';
    const variantUid = 'csa198cb7b00312cbd';
    
    const url = `${baseUrl}/v3/content_types/${contentTypeUid}/entries/${entryUid}`;
    
    const headers = {
      'api_key': apiKey,
      'access_token': accessToken,
      'x-cs-variant-uid': variantUid,
      'Content-Type': 'application/json'
    };
    
    console.log('🎯 Making Personalize Edge API call with variant');
    console.log('🌐 URL:', url);
    console.log('🔑 Using variant ID:', variantUid);
    console.log('🔑 Headers:', { ...headers, api_key: '***', delivery_token: '***' });
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    
    const dataWithMovies = data as unknown as { movies_blocks?: Array<{ movie_1: unknown }> };
    console.log('📦 API Response:', {
      hasData: !!data,
      hasMoviesBlocks: !!dataWithMovies?.movies_blocks,
      movieCount: Array.isArray(dataWithMovies?.movies_blocks) ? dataWithMovies.movies_blocks.length : 0
    });
    
    // Extract and process the movies
    const movies = dataWithMovies?.movies_blocks || [];
    const processedMovies = movies.map((movieBlock: { movie_1: unknown }) => {
      const movie = movieBlock.movie_1 as unknown as {
        movie_name?: string;
        movie_description?: string;
        star_rating?: { value: number };
        movie_image?: { url: string };
        link_movie?: { href: string };
      };
      return {
        title: movie?.movie_name || 'Unknown Movie',
        genre: movie?.movie_description || 'Unknown',
        rating: movie?.star_rating?.value || 4.0,
        image: movie?.movie_image?.url || '/api/placeholder/300/200',
        link: movie?.link_movie?.href || '#'
      };
    });
    
    return NextResponse.json({
      success: true,
      test: 'Direct Contentstack API Test',
      result: {
        movieCount: processedMovies.length,
        variantUsed: variantUid,
        movies: processedMovies,
        rawResponse: data
      }
    });

  } catch (error) {
    console.error('❌ Direct API Test Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      test: 'Direct Contentstack API Test'
    }, { status: 500 });
  }
} 