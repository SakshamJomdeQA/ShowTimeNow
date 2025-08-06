"use client";
import React, { useState, useRef, useCallback } from 'react';
import { getEntry } from '../../../../lib/contentstack-utils';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Link from 'next/link';
import './movie-detail.css';

// TypeScript interfaces
interface MovieImage {
  uid: string;
  title: string;
  url: string;
}

interface MovieData {
  movie_name: string;
  movie_image: MovieImage;
  movie_trailer: {
    uid: string;
    title: string;
    url: string;
  };
  theatre_blocks: {
    theatre_blocks: {
      theatre_name: string;
      group_1: {
        timing_1: string;
        timing_2: string;
        timing_3: string;
        timing_4: string;
        timing_5: string;
        timing_6: string;
      };
    };
  }[];
}

interface MovieInfo {
  synopsis: string;
  cast: {
    role: string;
    name: string;
  }[];
  genre: string;
  duration: string;
  rating: string;
  releaseYear: string;
}

interface ShowtimeInfo {
  time: string;
  format: string;
  occupancy: number; // 0-100 percentage
  isFillingFast: boolean;
  availableSeats: number;
}

interface TheatreShowtimes {
  [theatreName: string]: ShowtimeInfo[];
}

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

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function MoviePage({ params }: PageProps) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showtimeData, setShowtimeData] = useState<TheatreShowtimes>({});
  const theatreSectionRef = useRef<HTMLDivElement>(null);

  // Function to generate dynamic showtimes for each movie
  const generateShowtimes = (movieName: string): TheatreShowtimes => {
    const baseShowtimes: { [key: string]: string[] } = {
      'F1 - Movie': [
        '09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '07:00 PM', '09:30 PM'
      ],
      'The Great Gatsby': [
        '10:00 AM', '12:30 PM', '03:00 PM', '05:30 PM', '08:00 PM', '10:30 PM'
      ],
      'Avengers : Age of Ultron': [
        '09:30 AM', '12:00 PM', '02:30 PM', '05:00 PM', '07:30 PM', '10:00 PM'
      ],
      'Dear Comrade': [
        '10:30 AM', '01:00 PM', '03:30 PM', '06:00 PM', '08:30 PM', '11:00 PM'
      ],
      'Frankie and Johnny': [
        '11:00 AM', '01:30 PM', '04:00 PM', '06:30 PM', '09:00 PM', '11:30 PM'
      ],
      'The Godfather': [
        '09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM', '07:00 PM'
      ]
    };

    const theatres = ['PVR', 'INOX', 'Cinepolis'];
    const showtimes: TheatreShowtimes = {};

    // Use a more stable seed based on movie name and current hour (not minute/second)
    const now = new Date();
    const stableSeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate() + now.getHours();

    theatres.forEach(theatre => {
      const movieShowtimes = baseShowtimes[movieName] || baseShowtimes['F1 - Movie'];
      showtimes[theatre] = movieShowtimes.map((time, index) => {
        // Use stable seed for consistent patterns
        const seed = stableSeed + theatre.charCodeAt(0) + index;
        const random = (seed * 9301 + 49297) % 233280;
        const randomValue = random / 233280;

        // Generate base occupancy based on movie popularity with more stable ranges
        let baseOccupancy = 0;
        switch (movieName) {
          case 'F1 - Movie':
            baseOccupancy = 70 + Math.floor(randomValue * 20); // 70-90%
            break;
          case 'The Great Gatsby':
            baseOccupancy = 60 + Math.floor(randomValue * 15); // 60-75%
            break;
          case 'Avengers : Age of Ultron':
            baseOccupancy = 80 + Math.floor(randomValue * 15); // 80-95%
            break;
          case 'Dear Comrade':
            baseOccupancy = 50 + Math.floor(randomValue * 20); // 50-70%
            break;
          case 'Frankie and Johnny':
            baseOccupancy = 35 + Math.floor(randomValue * 20); // 35-55%
            break;
          case 'The Godfather':
            baseOccupancy = 65 + Math.floor(randomValue * 15); // 65-80%
            break;
          default:
            baseOccupancy = 45 + Math.floor(randomValue * 20); // 45-65%
        }

        // Add time-based variation (more stable)
        const timeHour = parseInt(time.split(':')[0]);
        if (timeHour >= 18) { // Evening shows (6 PM onwards)
          baseOccupancy += 10;
        } else if (timeHour >= 12) { // Afternoon shows
          baseOccupancy += 5;
        }

        // Add theatre-specific variation
        if (theatre === 'PVR') baseOccupancy += 5;
        if (theatre === 'INOX') baseOccupancy += 3;

        const occupancy = Math.min(95, Math.max(5, baseOccupancy));
        const availableSeats = Math.floor((100 - occupancy) / 100 * 150);
        
        // More stable filling fast logic - only for specific combinations
        const isFillingFast = occupancy >= 88 && (
          (movieName === 'F1 - Movie' && timeHour >= 18) || 
          (movieName === 'Avengers : Age of Ultron' && timeHour >= 18) ||
          (movieName === 'The Great Gatsby' && timeHour >= 20)
        );

        return {
          time,
          format: index % 2 === 0 ? '2D' : '3D',
          occupancy,
          isFillingFast,
          availableSeats
        };
      });
    });

    return showtimes;
  };

  // Function to get movie-specific information
  const getMovieInfo = (movieName: string): MovieInfo => {
    const movieInfoMap: { [key: string]: MovieInfo } = {
      'F1 - Movie': {
        synopsis: 'Experience the thrill of Formula 1 racing like never before in this action-packed movie that takes you behind the scenes of the world\'s most prestigious motorsport championship. Follow the journey of drivers, teams, and the intense competition that defines F1. Witness the speed, strategy, and sheer determination that makes Formula 1 the pinnacle of motorsport.',
        cast: [
          { role: 'Director', name: 'John Smith' },
          { role: 'Lead Actor', name: 'Michael Johnson' },
          { role: 'Producer', name: 'Sarah Williams' },
          { role: 'Cinematographer', name: 'David Brown' }
        ],
        genre: 'Action, Drama, Sports',
        duration: '2h 15m',
        rating: '4.0/5',
        releaseYear: '2025'
      },
      'The Great Gatsby': {
        synopsis: 'Based on F. Scott Fitzgerald\'s classic novel, this visually stunning adaptation follows the mysterious millionaire Jay Gatsby and his obsession with the beautiful Daisy Buchanan. Set in the roaring 1920s, the film explores themes of love, wealth, and the American Dream through lavish parties and tragic romance.',
        cast: [
          { role: 'Director', name: 'Baz Luhrmann' },
          { role: 'Jay Gatsby', name: 'Leonardo DiCaprio' },
          { role: 'Daisy Buchanan', name: 'Carey Mulligan' },
          { role: 'Nick Carraway', name: 'Tobey Maguire' }
        ],
        genre: 'Drama, Romance',
        duration: '2h 23m',
        rating: '4.2/5',
        releaseYear: '2013'
      },
      'Avengers : Age of Ultron': {
        synopsis: 'When Tony Stark tries to jumpstart a dormant peacekeeping program, things go awry and Earth\'s Mightiest Heroes, including Iron Man, Captain America, Thor, The Incredible Hulk, Black Widow and Hawkeye, are put to the ultimate test as the fate of the planet hangs in the balance.',
        cast: [
          { role: 'Director', name: 'Joss Whedon' },
          { role: 'Iron Man', name: 'Robert Downey Jr.' },
          { role: 'Captain America', name: 'Chris Evans' },
          { role: 'Thor', name: 'Chris Hemsworth' }
        ],
        genre: 'Action, Adventure, Sci-Fi',
        duration: '2h 21m',
        rating: '4.1/5',
        releaseYear: '2015'
      },
      'Dear Comrade': {
        synopsis: 'A passionate student leader falls in love with a state-level athlete. When she faces harassment, he stands up for her, leading to a series of events that test their relationship and his principles. This emotional drama explores love, justice, and personal growth.',
        cast: [
          { role: 'Director', name: 'Bharat Kamma' },
          { role: 'Vijay', name: 'Vijay Deverakonda' },
          { role: 'Lilly', name: 'Rashmika Mandanna' },
          { role: 'Producer', name: 'Dil Raju' }
        ],
        genre: 'Drama, Romance',
        duration: '2h 30m',
        rating: '4.3/5',
        releaseYear: '2019'
      },
      'Frankie and Johnny': {
        synopsis: 'A romantic comedy about two lonely people who find love in unexpected circumstances. Frankie, a waitress, and Johnny, a recently paroled cook, navigate their way through life\'s challenges while discovering that sometimes the best relationships come from the most unlikely places.',
        cast: [
          { role: 'Director', name: 'Garry Marshall' },
          { role: 'Frankie', name: 'Michelle Pfeiffer' },
          { role: 'Johnny', name: 'Al Pacino' },
          { role: 'Producer', name: 'Garry Marshall' }
        ],
        genre: 'Comedy, Drama, Romance',
        duration: '1h 58m',
        rating: '4.4/5',
        releaseYear: '1991'
      },
      'The Godfather': {
        synopsis: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son, while the family faces threats from rival gangs and law enforcement. This epic crime drama explores power, family loyalty, and the American Dream.',
        cast: [
          { role: 'Director', name: 'Francis Ford Coppola' },
          { role: 'Don Vito Corleone', name: 'Marlon Brando' },
          { role: 'Michael Corleone', name: 'Al Pacino' },
          { role: 'Sonny Corleone', name: 'James Caan' }
        ],
        genre: 'Crime, Drama',
        duration: '2h 55m',
        rating: '4.8/5',
        releaseYear: '1972'
      }
    };

    return movieInfoMap[movieName] || {
      synopsis: 'A compelling story that will keep you on the edge of your seat. Experience the magic of cinema with this extraordinary film.',
      cast: [
        { role: 'Director', name: 'Unknown Director' },
        { role: 'Lead Actor', name: 'Unknown Actor' },
        { role: 'Producer', name: 'Unknown Producer' },
        { role: 'Cinematographer', name: 'Unknown Cinematographer' }
      ],
      genre: 'Drama',
      duration: '2h 0m',
      rating: '4.0/5',
      releaseYear: '2024'
    };
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { slug } = await params;
        
        // Fetch header data
        const headerEntry = await getEntry('header_page', 'bltbba189546c0058fa');
        const header = headerEntry as unknown as HeaderData;
        setHeaderData(header);
        
            // Fetch theatre data to find the movie
    const theatreEntry = await getEntry('theatres', 'blte30aa41004b9f283');
    console.log('Theatre entry:', theatreEntry);
        const theatreData = theatreEntry as unknown as {
          main_block: {
            theatre_1: {
              sub_blocks: {
                sub_theatre: MovieData;
              }[];
            };
          }[];
        };
        
        // Find the movie in theatre data
        let movie: MovieData | null = null;
        
        console.log('Looking for slug:', slug);
        console.log('Theatre data:', theatreData);
        
        // Log all available movies and their slugs
        console.log('Available movies in theatre data:');
        for (const block of theatreData.main_block) {
          for (const subBlock of block.theatre_1.sub_blocks) {
            const movieItem = subBlock.sub_theatre;
            const movieSlug = movieItem.movie_name.toLowerCase().replace(/[^a-z0-9]/g, '');
            console.log(`- "${movieItem.movie_name}" -> /movies/${movieSlug}`);
          }
        }
        
        for (const block of theatreData.main_block) {
          for (const subBlock of block.theatre_1.sub_blocks) {
            const movieItem = subBlock.sub_theatre;
            const movieSlug = movieItem.movie_name.toLowerCase().replace(/[^a-z0-9]/g, '');
            console.log('Checking movie:', movieItem.movie_name, '-> slug:', movieSlug);
            if (movieSlug === slug) {
              movie = movieItem;
              console.log('Found movie:', movieItem.movie_name);
              break;
            }
          }
          if (movie) break;
        }
        
        console.log('Final movie:', movie);
        
        // If not found in theatre data, try recommended movies
        if (!movie) {
          console.log('Movie not found in theatre data, checking recommended movies...');
          const recommendedEntry = await getEntry('movies_types', 'bltbc9d353f08052686');
          const recommendedData = recommendedEntry as unknown as {
            movies_blocks: {
              movie_1: {
                movie_name: string;
                movie_image: MovieImage;
                star_rating: { value: number };
                link_movie: { href: string };
                movie_description: string;
              };
            }[];
          };
          
          for (const block of recommendedData.movies_blocks) {
            const movieItem = block.movie_1;
            const movieSlug = movieItem.movie_name.toLowerCase().replace(/[^a-z0-9]/g, '');
            console.log('Checking recommended movie:', movieItem.movie_name, '-> slug:', movieSlug);
            if (movieSlug === slug) {
              // Convert to MovieData format
              movie = {
                movie_name: movieItem.movie_name,
                movie_image: movieItem.movie_image,
                movie_trailer: {
                  uid: '',
                  title: 'Trailer',
                  url: ''
                },
                theatre_blocks: []
              };
              console.log('Found movie in recommended data:', movieItem.movie_name);
              break;
            }
          }
        }
        
        setMovieData(movie);
        
        // Generate dynamic showtimes for this movie
        if (movie) {
          const showtimes = generateShowtimes(movie.movie_name);
          setShowtimeData(showtimes);
        }
        
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
        
      } catch (error) {
        console.error('Error loading movie page:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  const openTrailer = () => {
    setIsTrailerOpen(true);
  };

    const closeTrailer = () => {
    setIsTrailerOpen(false);
  };

  const scrollToTheatre = () => {
    theatreSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Function to get current date in readable format
  const getCurrentDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    };
    return now.toLocaleDateString('en-US', options);
  };

  // Function to simulate SSR-like behavior - updates occupancy on refresh
  const updateShowtimeOccupancy = useCallback(() => {
    if (movieData) {
      const updatedShowtimes = generateShowtimes(movieData.movie_name);
      setShowtimeData(updatedShowtimes);
    }
  }, [movieData]);

  // Update occupancy every 10 minutes to keep patterns stable
  React.useEffect(() => {
    if (movieData) {
      const interval = setInterval(() => {
        updateShowtimeOccupancy();
      }, 60000); // 1 minute

      return () => clearInterval(interval);
    }
  }, [movieData, updateShowtimeOccupancy]);

  if (loading) {
    return (
      <div>
        <Header data={headerData} />
        <main className="movie-detail-main">
          <div className="movie-detail-container">
            <div className="loading">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header data={headerData} />
      <main className="movie-detail-main">
        <div className="movie-detail-container">
          <Link href="/" className="back-button">
            ← Back to Home
          </Link>
          
          {movieData ? (
            <>
              {/* Hero Section */}
              <div className="movie-hero">
                <div className="movie-poster-large">
                  <img 
                    src={movieData.movie_image.url} 
                    alt={movieData.movie_name}
                    className="hero-poster"
                  />
                </div>
                
                <div className="movie-info-large">
                  <h1 className="movie-title-large">{movieData.movie_name}</h1>
                  
                  <div className="movie-meta">
                    <div className="movie-rating">
                      <span className="rating-label">Rating:</span>
                      <span className="rating-stars">★★★★☆</span>
                      <span className="rating-text">{getMovieInfo(movieData.movie_name).rating}</span>
                    </div>
                    <div className="movie-genre">
                      <span className="genre-label">Genre:</span>
                      <span className="genre-text">{getMovieInfo(movieData.movie_name).genre}</span>
                    </div>
                    <div className="movie-duration">
                      <span className="duration-label">Duration:</span>
                      <span className="duration-text">{getMovieInfo(movieData.movie_name).duration}</span>
                    </div>
                    <div className="movie-year">
                      <span className="year-label">Year:</span>
                      <span className="year-text">{getMovieInfo(movieData.movie_name).releaseYear}</span>
                    </div>
                  </div>
                  
                  <div className="action-buttons-large">
                    <button 
                      className="trailer-button-large"
                      onClick={openTrailer}
                    >
                      ▶ Watch Trailer
                    </button>
                    <button className="share-button">📤 Share</button>
                    <button 
                      className="scroll-to-book-button"
                      onClick={scrollToTheatre}
                    >
                      🎬 Book Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Movie Details Section */}
              <div className="movie-details-section">
                <div className="section-header">
                  <h2>About the Movie</h2>
                  <p>Discover the story behind the film</p>
                </div>
                
                <div className="movie-details-content">
                  <div className="synopsis-card">
                    <div className="synopsis-header">
                      <div className="synopsis-icon">📖</div>
                      <h3>Synopsis</h3>
                    </div>
                    <p>
                      {getMovieInfo(movieData.movie_name).synopsis}
                    </p>
                  </div>
                  
                  <div className="cast-crew-card">
                    <div className="cast-header">
                      <div className="cast-icon">🎭</div>
                      <h3>Cast & Crew</h3>
                    </div>
                    <div className="cast-grid">
                      {getMovieInfo(movieData.movie_name).cast.map((member, index) => (
                        <div key={index} className="cast-item">
                          <div className="cast-role">{member.role}</div>
                          <div className="cast-name">{member.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Theatre Section */}
              {Object.keys(showtimeData).length > 0 && (
                <div className="theatre-section-main" ref={theatreSectionRef}>
                  <div className="section-header">
                    <div className="section-header-content">
                      <div>
                        <h2>Select Showtime</h2>
                        <p>Choose your preferred theatre and timing</p>
                      </div>
                      <button 
                        className="refresh-button"
                        onClick={updateShowtimeOccupancy}
                        title="Refresh to see latest seat availability"
                      >
                        🔄 Refresh
                      </button>
                    </div>
                  </div>
                  
                  <div className="theatre-grid">
                    {Object.entries(showtimeData).map(([theatreName, showtimes], index) => (
                      <div key={index} className="theatre-card">
                        <div className="theatre-header">
                          <h3 className="theatre-name">{theatreName}</h3>
                          <div className="theatre-info">
                            <span className="theatre-type">Multiplex</span>
                            <span className="theatre-location">📍 City Center</span>
                          </div>
                        </div>
                        
                        <div className="showtimes-container">
                          <div className="showtimes-header">
                            <span className="date-label">{getCurrentDate()}</span>
                            <span className="language-label">English</span>
                          </div>
                          
                          <div className="timing-grid">
                            {showtimes.map((showtime, timingIndex) => (
                              <button 
                                key={timingIndex} 
                                className={`showtime-button ${showtime.isFillingFast ? 'filling-fast' : ''}`}
                              >
                                <span className="time">{showtime.time}</span>
                                <span className="format">{showtime.format}</span>
                                {showtime.isFillingFast && (
                                  <span className="filling-fast-badge">🔥 Filling Fast</span>
                                )}
                                <span className="seats-info">
                                  {showtime.availableSeats} seats left
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="movie-not-found">
              <h1>Movie Not Found</h1>
              <p>The movie you&apos;re looking for doesn&apos;t exist.</p>
              <Link href="/" className="back-button">Go Back Home</Link>
            </div>
          )}
        </div>
      </main>

      <Footer data={footerData} />

      {/* Trailer Modal */}
      {isTrailerOpen && movieData && movieData.movie_trailer && movieData.movie_trailer.url && (
        <div className="trailer-modal-overlay" onClick={closeTrailer}>
          <div className="trailer-modal" onClick={(e) => e.stopPropagation()}>
            <button className="trailer-close-button" onClick={closeTrailer}>
              ✕
            </button>
            <div className="trailer-modal-content">
              <h3>Watch Trailer</h3>
              <video 
                className="trailer-modal-video"
                controls
                poster={movieData.movie_image.url}
                autoPlay
              >
                <source src={movieData.movie_trailer.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 