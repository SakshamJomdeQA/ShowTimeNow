"use client";
import React, { useEffect, useState } from 'react';
import { getEntry } from '../../lib/contentstack-utils';
import Header from './Header';
import RecommendedMovies from './RecommendedMovies';
import Footer from './Footer';
import styles from './HomePage.module.css';

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

// Family member interface
interface FamilyMember {
  name: string;
  age: number;
  gender: string;
  preferences: string[];
}

// Personalized content interface
interface PersonalizedContent {
  movies: Array<{
    title: string;
    genre: string;
    rating: number;
    image: string;
    link: string;
    description: string;
    personalizedReason: string;
  }>;
}

// Recommended movies data interface (for backward compatibility)
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

const HomePage = () => {
  const [data, setData] = useState<HeaderData | null>(null);
  const [moviesData, setMoviesData] = useState<RecommendedMoviesData | null>(null);
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<FamilyMember | null>(null);
  const [personalizedContent, setPersonalizedContent] = useState<PersonalizedContent | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const entry = await getEntry('header_page', 'bltbba189546c0058fa');
        console.log(entry);
        // Cast the entry to HeaderData since we know the structure matches
        setData(entry as unknown as HeaderData);
      };
      fetchData();
    }, []);

    useEffect(() => {
      const fetchMovies = async () => {
        // Default to static movies data if no family member is selected
        const moviesEntry = await getEntry('movies_types', 'bltbc9d353f08052686');
        console.log('Default movies data:', moviesEntry);
        setMoviesData(moviesEntry as unknown as RecommendedMoviesData);
      };
      fetchMovies();
    }, []);

    // Listen for family member selection changes
    useEffect(() => {
      const handleFamilyMemberChange = (event: CustomEvent) => {
        const familyMember = event.detail as FamilyMember;
        console.log('👤 Family member selected in HomePage:', familyMember);
        setSelectedFamilyMember(familyMember);
        
        // Fetch personalized content for the selected family member
        fetchPersonalizedContent(familyMember);
      };

      // Add event listener for family member changes
      window.addEventListener('familyMemberSelected', handleFamilyMemberChange as EventListener);
      
      return () => {
        window.removeEventListener('familyMemberSelected', handleFamilyMemberChange as EventListener);
      };
    }, []);

    // Function to fetch personalized content
    const fetchPersonalizedContent = async (familyMember: FamilyMember) => {
      try {
        console.log('🎯 Fetching personalized content for:', familyMember.name);
        
        const response = await fetch(`/api/personalized-content?memberId=${familyMember.name}&age=${familyMember.age}&gender=${familyMember.gender}&preferences=${familyMember.preferences.join(',')}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Personalized content received:', {
            member: familyMember.name,
            success: data.success,
            movieCount: data.movieCount || 0
          });
          
          if (data.success && data.personalizedContent?.movies) {
            setPersonalizedContent(data.personalizedContent);
            console.log('🎬 Updated personalized movies:', data.personalizedContent.movies.length);
          }
        } else {
          console.error('❌ Failed to fetch personalized content:', response.status);
        }
      } catch (error) {
        console.error('❌ Error fetching personalized content:', error);
      }
    };

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

  return (
    <div className={styles.homepage}>
      <Header data={data} showAccountSwitcher={true} />
      <main className={styles.mainContent}>
        <div className={styles.homepageContainer}>
          <RecommendedMovies data={moviesData} personalizedContent={personalizedContent} />
        </div>
      </main>
      <Footer data={footerData} />
    </div>   
  );
};




export default HomePage;