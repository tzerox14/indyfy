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
    
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    setError('');

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

      console.log('Inscription réussie!');
      onClose();
    } catch (error) {
      console.error('Error:', error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('Cet email est déjà utilisé');
          break;
        case 'auth/invalid-email':
          setError('Email invalide');
          break;
        case 'auth/weak-password':
          setError('Mot de passe trop faible');
          break;
        default:
          setError('Une erreur est survenue. Réessayez.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      console.log('Connexion réussie!');
      onClose();
    } catch (error) {
      console.error('Error:', error);
      switch (error.code) {
        case 'auth/user-not-found':
          setError('Aucun compte avec cet email');
          break;
        case 'auth/wrong-password':
          setError('Mot de passe incorrect');
          break;
        case 'auth/invalid-email':
          setError('Email invalide');
          break;
        default:
          setError('Erreur de connexion. Réessayez.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!userType) {
      setError('Veuillez d\'abord choisir votre type de compte');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      await createUserProfile(
        result.user.uid,
        result.user.email,
        result.user.displayName || 'Utilisateur'
      );

      console.log('Connexion Google réussie!');
      onClose();
    } catch (error) {
      console.error('Error:', error);
      setError('Erreur avec Google. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  // Étape 1 : Choix du type d'utilisateur
  const ChoiceStep = () => (
    <>
      <h2>Rejoindre INDYFY</h2>
      <p className="modal-subtitle">Vous êtes...</p>
      
      <div className="user-type-grid">
        <div 
          className="user-type-card"
          onClick={() => handleUserTypeSelect('artist')}
        >
          <User size={48} />
          <h3>Artiste</h3>
          <p>Je veux partager ma musique et créer ma communauté</p>
          <button className="select-btn">Continuer comme artiste</button>
        </div>

        <div 
          className="user-type-card"
          onClick={() => handleUserTypeSelect('fan')}
        >
          <Headphones size={48} />
          <h3>Fan</h3>
          <p>Je veux découvrir et suivre mes artistes préférés</p>
          <button className="select-btn">Continuer comme fan</button>
        </div>
      </div>
    </>
  );

  // Étape 2 : Inscription
  const RegisterStep = () => (
    <>
      <h2>Créer un compte {userType === 'artist' ? 'Artiste' : 'Fan'}</h2>
      <p className="modal-subtitle">Rejoignez la communauté INDYFY</p>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleRegister} className="auth-form">
        <div className="form-group">
          <label>Nom d'utilisateur</label>
          <div className="input-with-icon">
            <User size={20} />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Votre nom d'utilisateur"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Email</label>
          <div className="input-with-icon">
            <Mail size={20} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="votre@email.com"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Mot de passe</label>
          <div className="input-with-icon">
            <Lock size={20} />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Confirmer le mot de passe</label>
          <div className="input-with-icon">
            <Lock size={20} />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Création...' : 'Créer mon compte'}
        </button>

        <div className="divider">ou</div>

        <button 
          type="button"
          className="google-btn"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          Continuer avec Google
        </button>

        <p className="switch-mode">
          Déjà un compte ?{' '}
          <button type="button" onClick={() => setStep('login')}>
            Se connecter
          </button>
        </p>
      </form>
    </>
  );

  // Étape 3 : Connexion
  const LoginStep = () => (
    <>
      <h2>Connexion</h2>
      <p className="modal-subtitle">Bon retour sur INDYFY !</p>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleLogin} className="auth-form">
        <div className="form-group">
          <label>Email</label>
          <div className="input-with-icon">
            <Mail size={20} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="votre@email.com"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Mot de passe</label>
          <div className="input-with-icon">
            <Lock size={20} />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>

        <p className="switch-mode">
          Pas encore de compte ?{' '}
          <button type="button" onClick={() => setStep('choice')}>
            S'inscrire
          </button>
        </p>
      </form>
    </>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        {step === 'choice' && <ChoiceStep />}
        {step === 'register' && <RegisterStep />}
        {step === 'login' && <LoginStep />}
      </div>
    </div>
  );
}
