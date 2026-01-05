import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import AuthModal from './components/AuthModal';
import {
  Music,
  Users,
  Calendar,
  TrendingUp,
  User,
  Headphones,
  LogOut
} from 'lucide-react';
import './App.css';

export default function IndyfyHome() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Gestion de l'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Récupérer le profil utilisateur depuis Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Déconnexion réussie');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  // Données de démonstration pour le top 3
  const topArtists = [
    {
      id: 1,
      name: 'Luna Waves',
      genre: 'R&B/Soul',
      followers: 12500,
      nextRelease: 'Dans 3 jours',
      image: '🎤',
    },
    {
      id: 2,
      name: 'Nexus',
      genre: 'Hip-Hop',
      followers: 9800,
      nextRelease: 'Dans 5 jours',
      image: '🎵',
    },
    {
      id: 3,
      name: 'Echo Dreams',
      genre: 'Électro',
      followers: 8300,
      nextRelease: 'Dans 1 semaine',
      image: '🎧',
    },
  ];

  // Données pour le calendrier
  const upcomingReleases = [
    {
      id: 1,
      artist: 'Luna Waves',
      title: 'Midnight Colors',
      date: '2026-01-08',
      daysLeft: 3,
    },
    {
      id: 2,
      artist: 'Nexus',
      title: 'Urban Stories',
      date: '2026-01-10',
      daysLeft: 5,
    },
    {
      id: 3,
      artist: 'Echo Dreams',
      title: 'Digital Horizon',
      date: '2026-01-12',
      daysLeft: 7,
    },
    {
      id: 4,
      artist: 'Star Child',
      title: 'Cosmic Vibes',
      date: '2026-01-15',
      daysLeft: 10,
    },
  ];

  const pastReleases = [
    {
      id: 5,
      artist: 'Wave Maker',
      title: 'Ocean Beats',
      date: '2026-01-02',
      daysAgo: 3,
    },
    {
      id: 6,
      artist: 'Night Owl',
      title: 'After Hours',
      date: '2025-12-28',
      daysAgo: 8,
    },
  ];

  // Données pour les profils d'artistes
  const allArtists = [
    {
      id: 1,
      name: 'Luna Waves',
      genre: 'R&B/Soul',
      followers: 12500,
      releases: 4,
    },
    { id: 2, name: 'Nexus', genre: 'Hip-Hop', followers: 9800, releases: 6 },
    {
      id: 3,
      name: 'Echo Dreams',
      genre: 'Électro',
      followers: 8300,
      releases: 3,
    },
    { id: 4, name: 'Star Child', genre: 'Pop', followers: 7100, releases: 5 },
    { id: 5, name: 'Wave Maker', genre: 'House', followers: 6500, releases: 8 },
    { id: 6, name: 'Night Owl', genre: 'Lo-fi', followers: 5900, releases: 12 },
  ];

  const HomePage = () => (
    <div className="page-content">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">INDYFY</h1>
          <p className="hero-subtitle">
            La plateforme des artistes indépendants
          </p>
          <p className="hero-description">
            Découvrez les talents de demain, suivez leurs sorties et soutenez
            la musique indépendante
          </p>
          {!currentUser && (
            <button className="cta-button" onClick={() => setShowLoginModal(true)}>
              Rejoindre la communauté
            </button>
          )}
        </div>
      </div>

      {/* Top 3 Section */}
      <section className="section">
        <div className="section-header">
          <h2>
            <TrendingUp size={28} /> Top 3 de la semaine
          </h2>
        </div>
        <div className="top-artists-grid">
          {topArtists.map((artist, index) => (
            <div key={artist.id} className="top-artist-card">
              <div className="rank-badge">#{index + 1}</div>
              <div className="artist-avatar-large">{artist.image}</div>
              <h3>{artist.name}</h3>
              <p className="genre-tag">{artist.genre}</p>
              <div className="artist-stats">
                <div className="stat">
                  <Users size={18} />
                  <span>{artist.followers.toLocaleString()}</span>
                </div>
                <div className="stat">
                  <Calendar size={18} />
                  <span>{artist.nextRelease}</span>
                </div>
              </div>
              <button className="follow-btn">Suivre</button>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Preview Section */}
      <section className="section">
        <div className="preview-grid">
          <div className="preview-card">
            <Calendar size={32} />
            <h3>Prochaines sorties</h3>
            <p>Ne manquez aucune nouvelle track</p>
            <button
              className="preview-btn"
              onClick={() => setCurrentPage('calendar')}
            >
              Voir le calendrier
            </button>
          </div>
          <div className="preview-card">
            <Users size={32} />
            <h3>Découvrir des artistes</h3>
            <p>Explorez les talents indépendants</p>
            <button
              className="preview-btn"
              onClick={() => setCurrentPage('artists')}
            >
              Explorer
            </button>
          </div>
        </div>
      </section>
    </div>
  );

  const CalendarPage = () => (
    <div className="page-content">
      <h1 className="page-title">
        <Calendar size={32} /> Calendrier des sorties
      </h1>

      {/* Prochaines sorties */}
      <section className="section">
        <h2 className="section-title">À venir</h2>
        <div className="releases-list">
          {upcomingReleases.map((release) => (
            <div key={release.id} className="release-card upcoming">
              <div className="release-date">
                <div className="days-count">{release.daysLeft}</div>
                <div className="days-label">jours</div>
              </div>
              <div className="release-info">
                <h3>{release.title}</h3>
                <p className="artist-name">{release.artist}</p>
                <p className="release-full-date">Sortie le {release.date}</p>
              </div>
              <button className="notify-btn">🔔 Me notifier</button>
            </div>
          ))}
        </div>
      </section>

      {/* Sorties passées */}
      <section className="section">
        <h2 className="section-title">Sorties récentes</h2>
        <div className="releases-list">
          {pastReleases.map((release) => (
            <div key={release.id} className="release-card past">
              <div className="release-date past-date">
                <div className="days-count">{release.daysAgo}</div>
                <div className="days-label">jours</div>
              </div>
              <div className="release-info">
                <h3>{release.title}</h3>
                <p className="artist-name">{release.artist}</p>
                <p className="release-full-date">Sorti le {release.date}</p>
              </div>
              <button className="listen-btn">🎧 Écouter</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const ArtistsPage = () => (
    <div className="page-content">
      <h1 className="page-title">
        <Users size={32} /> Tous les artistes
      </h1>

      <div className="artists-grid">
        {allArtists.map((artist) => (
          <div key={artist.id} className="profile-card">
            <div className="profile-avatar">🎵</div>
            <h3>{artist.name}</h3>
            <p className="genre-tag">{artist.genre}</p>
            <div className="profile-stats">
              <span>
                <Users size={16} /> {artist.followers.toLocaleString()}
              </span>
              <span>
                <Music size={16} /> {artist.releases} sorties
              </span>
            </div>
            <button className="follow-btn">Suivre</button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-brand" onClick={() => setCurrentPage('home')}>
          <Music size={28} />
          <span>INDYFY</span>
        </div>

        <div className="nav-links">
          <button
            className={currentPage === 'home' ? 'active' : ''}
            onClick={() => setCurrentPage('home')}
          >
            Accueil
          </button>
          <button
            className={currentPage === 'calendar' ? 'active' : ''}
            onClick={() => setCurrentPage('calendar')}
          >
            <Calendar size={18} /> Calendrier
          </button>
          <button
            className={currentPage === 'artists' ? 'active' : ''}
            onClick={() => setCurrentPage('artists')}
          >
            <Users size={18} /> Artistes
          </button>
        </div>

        {currentUser ? (
          <div className="user-menu">
            <span className="user-badge">
              {userProfile?.userType === 'artist' ? '🎤' : '🎧'}
            </span>
            <span className="user-name">
              {userProfile?.username || currentUser.email}
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={18} /> Déconnexion
            </button>
          </div>
        ) : (
          <button className="login-btn" onClick={() => setShowLoginModal(true)}>
            Se connecter
          </button>
        )}
      </nav>

      {/* Main Content */}
      <main>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'calendar' && <CalendarPage />}
        {currentPage === 'artists' && <ArtistsPage />}
      </main>

      {/* Modal d'authentification */}
      {showLoginModal && (
        <AuthModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
}
