"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './styles/Header.module.css';

// TypeScript interfaces for the header data structure
interface NavigationItem {
  title: string;
  href: string;
}

interface GroupName {
  movies: NavigationItem;
  events: NavigationItem;
  plays: NavigationItem;
}

interface SignIn {
  title: string;
  href: string;
}

interface HeaderData {
  uid: string;
  title: string;
  group_name: GroupName;
  sign_in: SignIn;
}

interface HeaderProps {
  data: HeaderData | null;
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
  


const Header: React.FC<HeaderProps> = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch all movies for search
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/movies');
        const data = await response.json();
        setAllMovies(data.movies || []);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const filteredMovies = allMovies.filter(movie =>
      movie.movie_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredMovies);
    setShowSearchResults(true);
  }, [searchQuery, allMovies]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      const firstMovie = searchResults[0];
      const movieSlug = firstMovie.movie_name.toLowerCase().replace(/[^a-z0-9]/g, '');
      router.push(`/movies/${movieSlug}`);
      setSearchQuery('');
      setShowSearchResults(false);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    const movieSlug = movie.movie_name.toLowerCase().replace(/[^a-z0-9]/g, '');
    router.push(`/movies/${movieSlug}`);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleSearchBlur = () => {
    setTimeout(() => setShowSearchResults(false), 200);
  };

  if (!data) {
    return <div className={styles.header}>Loading...</div>;
  }

  return (
    <header className={styles.header}>
      {/* Top Row: Title, Search, and Sign In */}
      <div className={styles.headerTop}>
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            {data.title}
          </Link>
        </div>
        
        <div className={styles.searchSection}>
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search for movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchResults(true)}
                onBlur={handleSearchBlur}
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className={styles.searchResults}>
                {searchResults.map((movie, index) => (
                  <div
                    key={index}
                    className={styles.searchResultItem}
                    onClick={() => handleMovieClick(movie)}
                  >
                    <img
                      src={movie.movie_image.url}
                      alt={movie.movie_name}
                      className={styles.searchResultImage}
                    />
                    <div className={styles.searchResultInfo}>
                      <div className={styles.searchResultTitle}>{movie.movie_name}</div>
                      <div className={styles.searchResultGenre}>{movie.movie_description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>

        <div className={styles.signInSection}>
          <Link href={data.sign_in.href} className={styles.signInButton}>
            {data.sign_in.title}
          </Link>
        </div>
      </div>

      {/* Bottom Row: Navigation Menu */}
      <nav className={styles.navigation}>
        <div className={styles.navContainer}>
          <Link href={data.group_name.movies.href} className={styles.navLink}>
            {data.group_name.movies.title}
          </Link>
          <Link href={data.group_name.events.href} className={styles.navLink}>
            {data.group_name.events.title}
          </Link>
          <Link href={data.group_name.plays.href} className={styles.navLink}>
            {data.group_name.plays.title}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header; 