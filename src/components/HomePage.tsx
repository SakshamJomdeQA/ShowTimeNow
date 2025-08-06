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

const HomePage = () => {
  const [data, setData] = useState<HeaderData | null>(null);
  const [moviesData, setMoviesData] = useState<RecommendedMoviesData | null>(null);
  const [footerData, setFooterData] = useState<FooterData | null>(null);

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
        const moviesEntry = await getEntry('movies_types', 'bltbc9d353f08052686');
        console.log('Movies data:', moviesEntry);
        setMoviesData(moviesEntry as unknown as RecommendedMoviesData);
      };
      fetchMovies();
    }, []);

    useEffect(() => {
      const fetchFooter = async () => {
        const footerEntry = await getEntry('footer', 'bltd292fbdfd37f5bcb');
        console.log('Footer data:', footerEntry);
        setFooterData(footerEntry as unknown as FooterData);
      };
      fetchFooter();
    }, []);

  return (
    <div className={styles.homepage}>
      <Header data={data} />
      <main className={styles.mainContent}>
        <div className={styles.homepageContainer}>
          <RecommendedMovies data={moviesData} />
        </div>
      </main>
      <Footer data={footerData} />
    </div>
  );
};




export default HomePage;