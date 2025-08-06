"use client";
import React, { useEffect, useState } from 'react';
import { getEntry } from '../../../lib/contentstack-utils';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

import './movies.css';

// Define the type for the header entry data
interface HeaderData {
  uid: string;
  title: string;
  group_name: {
    movies: { title: string; href: string };
    events: { title: string; href: string };
    plays: { title: string; href: string };
  };
  sign_in: { title: string; href: string };
}

// Movie image interface
interface MovieImage {
  uid: string;
  title: string;
  url: string;
}

// Star rating interface
interface StarRating {
  value: number;
}

// Movie link interface
interface MovieLink {
  title: string;
  href: string;
}

// Individual movie interface
interface Movie {
  movie_image: MovieImage;
  star_rating: StarRating;
  link_movie: MovieLink;
  movie_name: string;
  movie_description: string;
}

// Movie block interface (since each movie is wrapped in "movie_1")
interface MovieBlock {
  movie_1: Movie;
}

// Recommended movies data interface
interface RecommendedMoviesData {
  uid: string;
  title: string;
  movies_blocks: MovieBlock[];
}

// Footer data interface
interface FooterData {
  uid: string;
  company_name: {
    company_name: string;
    info: string;
  };
  legal: {
    title: string;
    privacy_policy: {
      title: string;
      href: string;
    };
    terms_of_services: {
      title: string;
      href: string;
    };
  };
  menu: {
    title: string;
    homepage: {
      title: string;
      href: string;
    };
    movies: {
      title: string;
      href: string;
    };
    events: {
      title: string;
      href: string;
    };
    shows: {
      title: string;
      href: string;
    };
  };
}

const MoviesPage = () => {
  const [data, setData] = useState<HeaderData | null>(null);
  const [moviesData, setMoviesData] = useState<RecommendedMoviesData | null>(null);
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMovies, setFilteredMovies] = useState<MovieBlock[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const entry = await getEntry('header_page', 'bltbba189546c0058fa');
      console.log(entry);
      setData(entry as unknown as HeaderData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      const moviesEntry = await getEntry('movies_types', 'bltbc9d353f08052686');
      console.log('Movies data:', moviesEntry);
      setMoviesData(moviesEntry as unknown as RecommendedMoviesData);
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    const fetchFooter = async () => {
      // Create static footer data since footer_page content type doesn't exist
      const staticFooterData: FooterData = {
        uid: 'static-footer',
        company_name: {
          company_name: 'ShowTimeNow',
          info: 'ShowTimeNow is a fast, user-friendly platform to book movies, events, and live shows instantly.'
        },
        legal: {
          title: 'Legal',
          privacy_policy: {
            title: 'Privacy Policy',
            href: '/privacy'
          },
          terms_of_services: {
            title: 'Terms of Service',
            href: '/terms'
          }
        },
        menu: {
          title: '',
          homepage: {
            title: 'Homepage',
            href: '/'
          },
          movies: {
            title: 'Movies',
            href: '/movies'
          },
          events: {
            title: 'Events',
            href: '/events'
          },
          shows: {
            title: 'Shows',
            href: '/shows'
          }
        }
      };
      setFooterData(staticFooterData);
    };
    fetchFooter();
  }, []);

  useEffect(() => {
    if (!moviesData) return;
    
    if (searchQuery.trim() === '') {
      setFilteredMovies(moviesData.movies_blocks);
    } else {
      const filtered = moviesData.movies_blocks.filter(block =>
        block.movie_1.movie_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [searchQuery, moviesData]);

  return (
    <div>
      <Header data={data} />
      <main className="movies-main">
        <div className="movies-container">
          <div className="movies-header">
            <h2 className="movies-title">Movies</h2>
            <div className="movies-search">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="movies-search-input"
              />
              <div className="movies-search-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
          {moviesData && (
            <div className="movies-grid">
              {filteredMovies.map((block, index: number) => {
                const movie = block.movie_1;
                return (
                  <div key={index} className="movie-card">
                    <div className="movie-image">
                      <img 
                        src={movie.movie_image.url} 
                        alt={movie.movie_name}
                        className="movie-poster"
                      />
                    </div>
                    <div className="movie-info">
                      <h3 className="movie-title">{movie.movie_name}</h3>
                      <p className="movie-genre">{movie.movie_description}</p>
                      <div className="movie-rating">
                        ⭐ {movie.star_rating.value}/5
                      </div>
                      <Link href={`/movies/${movie.movie_name.toLowerCase().replace(/[^a-z0-9]/g, '')}`} className="book-button">
                        Book Now
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer data={footerData} />
    </div>
  );
};

export default MoviesPage; 