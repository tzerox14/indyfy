import React, { useState } from 'react';
import {
  Music,
  Users,
  Calendar,
  TrendingUp,
  User,
  Headphones,
} from 'lucide-react';
import './App.css';

export default function IndyfyHome() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

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
            Découvrez les talents de demain et suivez leurs prochaines sorties
            en temps réel. Une communauté dédiée aux artistes indépendants et à
            leurs fans.
          </p>
          <button
            className="cta-button"
            onClick={() => setShowLoginModal(true)}
          >
            Rejoindre INDYFY
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-grid">
        <div className="feature-card">
          <Music size={40} />
          <h3>Publiez vos sorties</h3>
          <p>
            Créez l'anticipation avec des comptes à rebours pour vos prochains
            titres
          </p>
        </div>
        <div className="feature-card">
          <Users size={40} />
          <h3>Construisez votre communauté</h3>
          <p>Connectez-vous avec vos fans et développez votre audience</p>
        </div>
        <div className="feature-card">
          <TrendingUp size={40} />
          <h3>Montez dans le classement</h3>
          <p>Gagnez en visibilité et atteignez le top des artistes émergents</p>
        </div>
      </div>

      {/* Top 3 Artists */}
      <div className="section">
        <h2 className="section-title">Top 3 des artistes du moment</h2>
        <div className="top-artists-grid">
          {topArtists.map((artist, index) => (
            <div key={artist.id} className="artist-card">
              <div className="rank-badge">#{index + 1}</div>
              <div className="artist-avatar">{artist.image}</div>
              <h3>{artist.name}</h3>
              <p className="genre">{artist.genre}</p>
              <div className="artist-stats">
                <span className="stat">
                  <Users size={16} /> {artist.followers.toLocaleString()}
                </span>
              </div>
              <div className="next-release">
                Prochaine sortie : {artist.nextRelease}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const CalendarPage = () => {
    const [viewMode, setViewMode] = useState('upcoming');

    return (
      <div className="page-content">
        <h1 className="page-title">Calendrier des sorties</h1>

        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'upcoming' ? 'active' : ''}`}
            onClick={() => setViewMode('upcoming')}
          >
            À venir
          </button>
          <button
            className={`toggle-btn ${viewMode === 'past' ? 'active' : ''}`}
            onClick={() => setViewMode('past')}
          >
            Sorties passées
          </button>
        </div>

        {viewMode === 'upcoming' ? (
          <div className="releases-list">
            {upcomingReleases.map((release) => (
              <div key={release.id} className="release-card">
                <div className="release-info">
                  <h3>{release.title}</h3>
                  <p className="artist-name">{release.artist}</p>
                  <p className="release-date">
                    {new Date(release.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="countdown">
                  <div className="countdown-number">{release.daysLeft}</div>
                  <div className="countdown-label">
                    jour{release.daysLeft > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="releases-list">
            {pastReleases.map((release) => (
              <div key={release.id} className="release-card past">
                <div className="release-info">
                  <h3>{release.title}</h3>
                  <p className="artist-name">{release.artist}</p>
                  <p className="release-date">
                    {new Date(release.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="past-badge">
                  Sorti il y a {release.daysAgo} jour
                  {release.daysAgo > 1 ? 's' : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const ArtistsPage = () => (
    <div className="page-content">
      <h1 className="page-title">Tous les artistes</h1>

      <div className="artists-grid">
        {allArtists.map((artist) => (
          <div key={artist.id} className="profile-card">
            <div className="profile-avatar">🎵</div>
            <h3>{artist.name}</h3>
            <p className="genre">{artist.genre}</p>
            <div className="profile-stats">
              <span>
                <Users size={14} /> {artist.followers.toLocaleString()}
              </span>
              <span>
                <Music size={14} /> {artist.releases} sorties
              </span>
            </div>
            <button className="follow-btn">Suivre</button>
          </div>
        ))}
      </div>
    </div>
  );

  const LoginModal = () => (
    <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close"
          onClick={() => setShowLoginModal(false)}
        >
          ×
        </button>
        <h2>Rejoindre INDYFY</h2>
        <p className="modal-subtitle">Vous êtes...</p>

        <div className="user-type-grid">
          <div className="user-type-card">
            <User size={48} />
            <h3>Artiste</h3>
            <p>Je veux partager ma musique et créer ma communauté</p>
            <button className="select-btn">Continuer comme artiste</button>
          </div>

          <div className="user-type-card">
            <Headphones size={48} />
            <h3>Fan</h3>
            <p>Je veux découvrir et suivre mes artistes préférés</p>
            <button className="select-btn">Continuer comme fan</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app">
      {/* Navigation */}
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

        <button className="login-btn" onClick={() => setShowLoginModal(true)}>
          Se connecter
        </button>
      </nav>

      {/* Main Content */}
      <main>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'calendar' && <CalendarPage />}
        {currentPage === 'artists' && <ArtistsPage />}
      </main>

      {/* Login Modal */}
      {showLoginModal && <LoginModal />}
    </div>
  );
}
