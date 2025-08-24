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
  showAccountSwitcher?: boolean;
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
  


const Header: React.FC<HeaderProps> = ({ data, showAccountSwitcher = true }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [personalizationStatus, setPersonalizationStatus] = useState<string>('');
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

  const toggleAccountMenu = () => {
    setIsAccountMenuOpen(!isAccountMenuOpen);
  };

  const selectAccount = (accountName: string) => {
    setSelectedAccount(accountName);
    setIsAccountMenuOpen(false);
    
    // Log account switch for debugging
    console.log('🔄 Account switched to:', accountName);
    
    // Get family member data for personalization
    const familyMember = familyMembers.find(member => member.name === accountName);
    if (familyMember) {
      console.log('👤 Family member data:', {
        name: familyMember.name,
        age: familyMember.age,
        gender: familyMember.gender,
        role: familyMember.role,
        preferences: familyMember.preferences
      });
      
      // Trigger personalization API call
      fetchPersonalizedContent(familyMember);
      
      // Dispatch custom event for HomePage to listen to
      const event = new CustomEvent('familyMemberSelected', { detail: familyMember });
      window.dispatchEvent(event);
    }
  };

  // Function to fetch personalized content
  const fetchPersonalizedContent = async (member: {
    name: string;
    age: number;
    gender: string;
    preferences: string[];
  }) => {
    try {
      console.log('🎯 Fetching personalized content for:', member.name);
      
      const response = await fetch(`/api/personalized-content?memberId=${member.name}&age=${member.age}&gender=${member.gender}&preferences=${member.preferences.join(',')}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Personalized content received:', {
          member: member.name,
          success: data.success,
          recommendationsCount: data.recommendations?.length || 0,
          watchlistCount: data.watchlist?.length || 0,
          recentlyWatchedCount: data.recentlyWatched?.length || 0
        });
        
        // Update personalization status
        setPersonalizationStatus(`✅ Personalized for ${member.name} (${data.recommendations?.length || 0} recommendations)`);
        
        // Clear status after 3 seconds
        setTimeout(() => setPersonalizationStatus(''), 3000);
        
        // Update selected account
        setSelectedAccount(member.name);
      } else {
        console.error('❌ Failed to fetch personalized content:', response.status);
      }
    } catch (error) {
      console.error('❌ Error fetching personalized content:', error);
    }
  };

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(`.${styles.accountSwitcher}`)) {
        setIsAccountMenuOpen(false);
      }
    };

    if (isAccountMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAccountMenuOpen]);

  const familyMembers = [
    { 
      name: 'John', 
      avatar: '👨', 
      role: 'Parent',
      age: 45,
      gender: 'male',
      preferences: ['action', 'drama', 'thriller']
    },
    { 
      name: 'Sarah', 
      avatar: '👩', 
      role: 'Parent',
      age: 38,
      gender: 'female',
      preferences: ['romance', 'comedy', 'drama']
    },
    { 
      name: 'Mike', 
      avatar: '👦', 
      role: 'Child',
      age: 10,
      gender: 'male',
      preferences: ['animation', 'anime']
    },
    { 
      name: 'Emma', 
      avatar: '👧', 
      role: 'Child',
      age: 16,
      gender: 'female',
      preferences: ['romance', 'comedy', 'fantasy']
    }
  ];

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

        {showAccountSwitcher && (
          <div className={styles.accountSection}>
            <div className={styles.accountSwitcher}>
              <button 
                className={styles.accountButton}
                onClick={toggleAccountMenu}
              >
                              <span className={styles.accountAvatar}>
                {selectedAccount ? familyMembers.find(member => member.name === selectedAccount)?.avatar : '👤'}
              </span>
              <span className={styles.accountName}>
                {selectedAccount || 'Use Account'}
              </span>
                <svg 
                  className={`${styles.accountArrow} ${isAccountMenuOpen ? styles.rotated : ''}`}
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {/* Personalization Status Indicator */}
              {personalizationStatus && (
                <div className={styles.personalizationStatus}>
                  {personalizationStatus}
                </div>
              )}
              
              {isAccountMenuOpen && (
                <div className={styles.accountDropdown}>
                                  {familyMembers.map((member) => (
                  <button
                    key={member.name}
                    className={`${styles.accountOption} ${selectedAccount === member.name ? styles.selected : ''}`}
                    onClick={() => selectAccount(member.name)}
                  >
                    <span className={styles.optionAvatar}>{member.avatar}</span>
                    <div className={styles.optionInfo}>
                      <span className={styles.optionName}>{member.name}</span>
                      <span className={styles.optionRole}>{member.role}</span>
                    </div>
                    {selectedAccount === member.name && (
                      <span className={styles.selectedIndicator}>✓</span>
                    )}
                  </button>
                ))}
                </div>
              )}
            </div>
          </div>
        )}
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