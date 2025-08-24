"use client";
import React, { useState, useEffect } from 'react';
import styles from './styles/FamilyAccount.module.css';

interface FamilyMember {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  role: 'parent' | 'child';
  preferences: string[];
  avatar: string;
}

interface PersonalizedContent {
  memberId: string;
  recommendations: MovieRecommendation[];
  watchlist: MovieRecommendation[];
  recentlyWatched: MovieRecommendation[];
}

interface MovieRecommendation {
  id: string;
  title: string;
  genre: string;
  rating: number;
  ageGroup: string;
  description: string;
  image: string;
  personalizedReason: string;
}

const FamilyAccount: React.FC = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'John',
      age: 45,
      gender: 'male',
      role: 'parent',
      preferences: ['action', 'drama', 'thriller'],
      avatar: '👨'
    },
    {
      id: '2',
      name: 'Sarah',
      age: 38,
      gender: 'female',
      role: 'parent',
      preferences: ['romance', 'comedy', 'drama'],
      avatar: '👩'
    },
    {
      id: '3',
      name: 'Mike',
      age: 20,
      gender: 'male',
      role: 'child',
      preferences: ['action', 'sci-fi', 'adventure'],
      avatar: '👦'
    },
    {
      id: '4',
      name: 'Emma',
      age: 16,
      gender: 'female',
      role: 'child',
      preferences: ['romance', 'comedy', 'fantasy'],
      avatar: '👧'
    }
  ]);

  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [personalizedContent, setPersonalizedContent] = useState<PersonalizedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedMember) {
      fetchPersonalizedContent(selectedMember);
    }
  }, [selectedMember]);

  const fetchPersonalizedContent = async (member: FamilyMember) => {
    setIsLoading(true);
    try {
      console.log('🎯 Fetching personalized content for:', member.name);
      
      // Call Contentstack API for personalized content
      const response = await fetch(`/api/personalized-content?memberId=${member.id}&age=${member.age}&gender=${member.gender}&preferences=${member.preferences.join(',')}`);
      
      if (response.ok) {
        const content = await response.json();
        console.log('✅ Personalized content received:', {
          member: member.name,
          success: content.success,
          recommendationsCount: content.recommendations?.length || 0,
          movies: content.recommendations?.map((m: any) => m.title) || []
        });
        setPersonalizedContent(content);
      } else {
        console.error('❌ API failed, using fallback data');
        setPersonalizedContent(generateMockPersonalizedContent(member));
      }
    } catch (error) {
      console.error('❌ Error fetching personalized content:', error);
      setPersonalizedContent(generateMockPersonalizedContent(member));
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockPersonalizedContent = (member: FamilyMember): PersonalizedContent => {
    const mockMovies = [
      {
        id: '1',
        title: 'The Adventure Begins',
        genre: 'action',
        rating: 4.5,
        ageGroup: 'all',
        description: 'An exciting adventure movie perfect for the whole family.',
        image: '/api/placeholder/300/200',
        personalizedReason: `Recommended for ${member.name} based on ${member.preferences[0]} preferences`
      },
      {
        id: '2',
        title: 'Love in the City',
        genre: 'romance',
        rating: 4.2,
        ageGroup: 'adult',
        description: 'A beautiful love story set in a bustling city.',
        image: '/api/placeholder/300/200',
        personalizedReason: `Perfect for ${member.name}'s romance preferences`
      },
      {
        id: '3',
        title: 'Sci-Fi Odyssey',
        genre: 'sci-fi',
        rating: 4.7,
        ageGroup: 'teen',
        description: 'A thrilling science fiction adventure.',
        image: '/api/placeholder/300/200',
        personalizedReason: `Matches ${member.name}'s sci-fi interests`
      }
    ];

    return {
      memberId: member.id,
      recommendations: mockMovies.filter(movie => 
        member.preferences.includes(movie.genre) || 
        (member.age >= 18 && movie.ageGroup === 'adult') ||
        (member.age < 18 && movie.ageGroup === 'teen')
      ),
      watchlist: mockMovies.slice(0, 2),
      recentlyWatched: mockMovies.slice(1, 3)
    };
  };

  const getAgeGroup = (age: number): string => {
    if (age < 13) return 'child';
    if (age < 18) return 'teen';
    return 'adult';
  };

  return (
    <div className={styles.familyAccount}>
      <div className={styles.header}>
        <h1>🏠 Family Account</h1>
        <p>Personalized content for each family member</p>
      </div>

      <div className={styles.familyMembers}>
        <h2>Family Members</h2>
        <div className={styles.memberGrid}>
          {familyMembers.map((member) => (
            <div
              key={member.id}
              className={`${styles.memberCard} ${selectedMember?.id === member.id ? styles.selected : ''}`}
              onClick={() => setSelectedMember(member)}
            >
              <div className={styles.memberAvatar}>{member.avatar}</div>
              <div className={styles.memberInfo}>
                <h3>{member.name}</h3>
                <p>{member.age} years old • {member.gender}</p>
                <p className={styles.memberRole}>{member.role}</p>
                <div className={styles.preferences}>
                  {member.preferences.map((pref, index) => (
                    <span key={index} className={styles.preferenceTag}>{pref}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedMember && (
        <div className={styles.personalizedSection}>
          <div className={styles.memberHeader}>
            <h2>Personalized for {selectedMember.name}</h2>
            <div className={styles.memberDetails}>
              <span className={styles.ageGroup}>{getAgeGroup(selectedMember.age)}</span>
              <span className={styles.gender}>{selectedMember.gender}</span>
            </div>
          </div>

          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading personalized content...</p>
            </div>
          ) : personalizedContent ? (
            <div className={styles.contentSections}>
              <div className={styles.contentSection}>
                <h3>🎯 Recommended for You</h3>
                <div className={styles.movieGrid}>
                  {personalizedContent.recommendations.map((movie) => (
                    <div key={movie.id} className={styles.movieCard}>
                      <div className={styles.movieImage}>
                        <img src={movie.image} alt={movie.title} />
                        <div className={styles.movieRating}>⭐ {movie.rating}</div>
                      </div>
                      <div className={styles.movieInfo}>
                        <h4>{movie.title}</h4>
                        <p className={styles.movieGenre}>{movie.genre}</p>
                        <p className={styles.movieDescription}>{movie.description}</p>
                        <p className={styles.personalizedReason}>{movie.personalizedReason}</p>
                        <button className={styles.watchButton}>Watch Now</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.contentSection}>
                <h3>📋 Your Watchlist</h3>
                <div className={styles.movieGrid}>
                  {personalizedContent.watchlist.map((movie) => (
                    <div key={movie.id} className={styles.movieCard}>
                      <div className={styles.movieImage}>
                        <img src={movie.image} alt={movie.title} />
                        <div className={styles.movieRating}>⭐ {movie.rating}</div>
                      </div>
                      <div className={styles.movieInfo}>
                        <h4>{movie.title}</h4>
                        <p className={styles.movieGenre}>{movie.genre}</p>
                        <button className={styles.watchButton}>Watch Now</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.contentSection}>
                <h3>🕐 Recently Watched</h3>
                <div className={styles.movieGrid}>
                  {personalizedContent.recentlyWatched.map((movie) => (
                    <div key={movie.id} className={styles.movieCard}>
                      <div className={styles.movieImage}>
                        <img src={movie.image} alt={movie.title} />
                        <div className={styles.movieRating}>⭐ {movie.rating}</div>
                      </div>
                      <div className={styles.movieInfo}>
                        <h4>{movie.title}</h4>
                        <p className={styles.movieGenre}>{movie.genre}</p>
                        <button className={styles.watchButton}>Watch Again</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.noContent}>
              <p>No personalized content available for {selectedMember.name}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FamilyAccount; 