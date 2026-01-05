import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { User, Headphones, Mail, Lock, X } from 'lucide-react';
import './AuthModal.css';

export default function AuthModal({ onClose }) {
  const [step, setStep] = useState('choice'); // choice, register, login
  const [userType, setUserType] = useState(''); // artist, fan
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setStep('register');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const createUserProfile = async (userId, email, username) => {
    try {
      await setDoc(doc(db, 'users', userId), {
        email,
        username,
        userType,
        createdAt: new Date().toISOString(),
        followers: userType === 'artist' ? 0 : null,
        following: userType === 'fan' ? [] : null,
        releases: userType === 'artist' ? [] : null
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      await createUserProfile(
        userCredential.user.uid, 
        formData.email, 
        formData.username
      );

      console.log('Inscription réussie !');
      onClose();
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('Cet email est déjà utilisé');
      } else if (error.code === 'auth/invalid-email') {
        setError('Email invalide');
      } else {
        setError('Erreur lors de l\'inscription');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      console.log('Connexion réussie !');
      onClose();
    } catch (error) {
      console.error('Erreur de connexion:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError('Email ou mot de passe incorrect');
      } else {
        setError('Erreur lors de la connexion');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      
      // Créer le profil si c'est une première connexion
      await createUserProfile(
        result.user.uid,
        result.user.email,
        result.user.displayName || result.user.email.split('@')[0]
      );

      console.log('Connexion Google réussie !');
      onClose();
    } catch (error) {
      console.error('Erreur connexion Google:', error);
      setError('Erreur lors de la connexion avec Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        {/* Étape 1 : Choix du type d'utilisateur */}
        {step === 'choice' && (
          <>
            <h2>Rejoindre INDYFY</h2>
            <p className="modal-subtitle">Choisissez votre profil</p>

            <div className="user-type-grid">
              <div className="user-type-card" onClick={() => handleUserTypeSelect('artist')}>
                <User size={48} />
                <h3>Je suis Artiste</h3>
                <p>Partagez votre musique, gérez vos sorties et développez votre audience</p>
                <button className="select-btn">Continuer en tant qu'artiste</button>
              </div>

              <div className="user-type-card" onClick={() => handleUserTypeSelect('fan')}>
                <Headphones size={48} />
                <h3>Je suis Auditeur</h3>
                <p>Découvrez de nouveaux talents, suivez vos artistes préférés</p>
                <button className="select-btn">Continuer en tant qu'auditeur</button>
              </div>
            </div>
          </>
        )}

        {/* Étape 2 : Inscription */}
        {step === 'register' && (
          <>
            <h2>Créer un compte {userType === 'artist' ? 'Artiste' : 'Auditeur'}</h2>
            <p className="modal-subtitle">
              {userType === 'artist' ? '🎤' : '🎧'} Bienvenue sur INDYFY
            </p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleRegister} className="auth-form">
              <div className="form-group">
                <label>Nom d'utilisateur</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Votre nom d'utilisateur"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirmer le mot de passe</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Inscription...' : 'Créer mon compte'}
              </button>

              <div className="divider">ou</div>

              <button type="button" className="google-btn" onClick={handleGoogleSignIn} disabled={loading}>
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                  <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                  <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                  <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
                </svg>
                Continuer avec Google
              </button>

              <p className="switch-mode">
                Déjà un compte ? 
                <button type="button" onClick={() => setStep('login')} className="link-btn">
                  Se connecter
                </button>
              </p>

              <button type="button" onClick={() => setStep('choice')} className="back-btn">
                ← Retour
              </button>
            </form>
          </>
        )}

        {/* Étape 3 : Connexion */}
        {step === 'login' && (
          <>
            <h2>Se connecter</h2>
            <p className="modal-subtitle">Bon retour sur INDYFY !</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>

              <div className="divider">ou</div>

              <button type="button" className="google-btn" onClick={handleGoogleSignIn} disabled={loading}>
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                  <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                  <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                  <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
                </svg>
                Continuer avec Google
              </button>

              <p className="switch-mode">
                Pas encore de compte ? 
                <button type="button" onClick={() => setStep('choice')} className="link-btn">
                  S'inscrire
                </button>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
