"use client";
import React, { useRef } from 'react';
import Link from 'next/link';
import styles from './styles/RecommendedMovies.module.css';

interface RecommendedMoviesProps {
  data: RecommendedMoviesData | null;
  personalizedContent?: {
    movies: Array<{
      title: string;
      genre: string;
      rating: number;
      image: string;
      link: string;
      description: string;
      personalizedReason: string;
    }>;
  } | null;
}

  // Recommended movies data interface
  interface RecommendedMoviesData {
    uid: string;
    title: string;
    movies_blocks: {
      movie_1: {
        movie_name: string;
        movie_description: string;
        movie_image: {
          url: string;
        };
        star_rating: {
          value: number;
        };
        link_movie: {
          href: string;
        };
      };
    }[];
  }

const RecommendedMovies: React.FC<RecommendedMoviesProps> = ({ data, personalizedContent }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  // Use personalized content if available, otherwise use default data
  // const moviesToShow = personalizedContent?.movies || data?.movies_blocks || [];
  const sectionTitle = personalizedContent ? 'Personalized Recommendations' : (data?.title || 'Recommended Movies');

  if (!data && !personalizedContent) {
    return <div>Loading movies...</div>;
  }

  return (
    <section className={styles.recommendedSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
        <div className={styles.scrollContainer}>
          <div ref={scrollContainerRef} className={styles.moviesGrid}>
          {personalizedContent ? (
            // Render personalized movies
            personalizedContent.movies.map((movie, index: number) => (
              <div key={index} className={styles.movieCard}>
                <div className={styles.movieImage}>
                  <img 
                    src={movie.image} 
                    alt={movie.title}
                    className={styles.poster}
                  />
                </div>
                <div className={styles.movieInfo}>
                  <h3 className={styles.movieTitle}>{movie.title}</h3>
                  <p className={styles.movieGenre}>{movie.genre}</p>
                  <div className={styles.rating}>
                    ⭐ {movie.rating}/5
                  </div>
                  <Link href={`/movies/${movie.title.toLowerCase().replace(/[^a-z0-9]/g, '')}`} className={styles.bookButton}>
                    Book Now
                  </Link>
                </div>
              </div>
            ))
          ) : (
            // Render default movies
            data?.movies_blocks.map((block, index: number) => {
              const movie = block.movie_1;
              return (
                <div key={index} className={styles.movieCard}>
                  <div className={styles.movieImage}>
                    <img 
                      src={movie.movie_image.url} 
                      alt={movie.movie_name}
                      className={styles.poster}
                    />
                  </div>
                  <div className={styles.movieInfo}>
                    <h3 className={styles.movieTitle}>{movie.movie_name}</h3>
                    <p className={styles.movieGenre}>{movie.movie_description}</p>
                    <div className={styles.rating}>
                      ⭐ {movie.star_rating.value}/5
                    </div>
                    <Link href={`/movies/${movie.movie_name.toLowerCase().replace(/[^a-z0-9]/g, '')}`} className={styles.bookButton}>
                      Book Now
                    </Link>
                  </div>
                </div>
              );
            })
          )}
          </div>
          <button onClick={scrollRight} className={styles.scrollButton}>
            →
          </button>
        </div>
      </div>
    </section>
  );
};

export default RecommendedMovies;