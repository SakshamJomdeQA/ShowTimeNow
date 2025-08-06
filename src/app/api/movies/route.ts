import { NextResponse } from 'next/server';
import { getEntry } from '../../../../lib/contentstack-utils';

export async function GET() {
  try {
    // Fetch recommended movies
    const recommendedEntry = await getEntry('movies_types', 'bltbc9d353f08052686');
    const recommendedData = recommendedEntry as unknown as {
      movies_blocks: {
        movie_1: {
          movie_name: string;
          movie_image: {
            uid: string;
            title: string;
            url: string;
          };
          star_rating: { value: number };
          link_movie: { href: string };
          movie_description: string;
        };
      }[];
    };

    // Fetch theatre movies
    const theatreEntry = await getEntry('theatres', 'blte30aa41004b9f283');
    const theatreData = theatreEntry as unknown as {
      main_block: {
        theatre_1: {
          sub_blocks: {
            sub_theatre: {
              movie_name: string;
              movie_image: {
                uid: string;
                title: string;
                url: string;
              };
              movie_trailer: {
                uid: string;
                title: string;
                url: string;
              };
              theatre_blocks: any[];
            };
          }[];
        };
      }[];
    };

    // Combine movies from both sources
    const allMovies: Array<{
      movie_name: string;
      movie_image: {
        uid: string;
        title: string;
        url: string;
      };
      movie_description: string;
      star_rating: { value: number };
      source: string;
    }> = [];

    // Add recommended movies
    if (recommendedData?.movies_blocks) {
      recommendedData.movies_blocks.forEach(block => {
        allMovies.push({
          movie_name: block.movie_1.movie_name,
          movie_image: block.movie_1.movie_image,
          movie_description: block.movie_1.movie_description,
          star_rating: block.movie_1.star_rating,
          source: 'recommended'
        });
      });
    }

    // Add theatre movies
    if (theatreData?.main_block) {
      theatreData.main_block.forEach(block => {
        block.theatre_1.sub_blocks.forEach(subBlock => {
          const movie = subBlock.sub_theatre;
          // Check if movie already exists (avoid duplicates)
          const existingMovie = allMovies.find(m => 
            m.movie_name.toLowerCase() === movie.movie_name.toLowerCase()
          );
          if (!existingMovie) {
            allMovies.push({
              movie_name: movie.movie_name,
              movie_image: movie.movie_image,
              movie_description: 'Now showing in theatres',
              star_rating: { value: 4.0 },
              source: 'theatre'
            });
          }
        });
      });
    }

    return NextResponse.json({ movies: allMovies });
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json({ movies: [] }, { status: 500 });
  }
} 