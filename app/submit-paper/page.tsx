'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Check, LogIn, UserPlus } from 'lucide-react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut, User, onAuthStateChanged } from 'firebase/auth';

export default function SubmitPaperPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'userdetails' | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds
  const [authData, setAuthData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '',
    name: '',
    mobile: '',
    address: '',
    category: ''
  });
  const [userDetails, setUserDetails] = useState({
    name: '',
    mobile: '',
    address: '',
    category: ''
  });
  const [needsUserDetails, setNeedsUserDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  const categories = [
    'Student (with ID)',
    'Academic/Researcher',
    'Industry/Corporate',
    'Accompanying Person',
  ];
  
  // Logout function for inactivity timeout
  const handleAutoLogout = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem('authenticated_user');
    localStorage.removeItem('lastActivity');
    
    // Sign out from Firebase if there's a Firebase user
    if (auth.currentUser) {
      signOut(auth);
    }
    
    // Reset state
    setUser(null);
    setAuthMode(null);
  }, []);
  
  // Check for existing authentication on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Firebase user (Google sign-in) - check if user data exists in D1
        try {
          const checkResponse = await fetch(`/api/users/get?email=${encodeURIComponent(firebaseUser.email || '')}`);
          const checkData = await checkResponse.json();
          
          if (!checkData.success) {
            // New user - need to collect additional details, stay on page
            setNeedsUserDetails(true);
            setAuthMode('userdetails');
            setUserDetails({
              name: firebaseUser.displayName || '',
              mobile: '',
              address: '',
              category: ''
            });
            setCheckingAuth(false);
          } else {
            // Existing user with complete data - redirect to dashboard
            localStorage.setItem('lastActivity', Date.now().toString());
            router.push('/dashboard');
          }
        } catch (error) {
          console.error('Error checking user:', error);
          setCheckingAuth(false);
        }
      } else {
        // Check localStorage for custom auth (email/password users)
        const customUser = localStorage.getItem('authenticated_user');
        const lastActivity = localStorage.getItem('lastActivity');
        
        if (customUser && lastActivity) {
          const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
          
          if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
            // Session expired - auto logout
            handleAutoLogout();
            setCheckingAuth(false);
          } else {
            // Valid session - redirect to dashboard
            router.push('/dashboard');
          }
        } else {
          // Not authenticated - stay on page
          setCheckingAuth(false);
        }
      }
    });

    return () => unsubscribe();
  }, [router, handleAutoLogout, INACTIVITY_TIMEOUT]);
  
  // Auto-logout on inactivity (for when user stays on submit-paper page)
  useEffect(() => {
    if (checkingAuth) return;
    
    let inactivityTimer: NodeJS.Timeout;
    
    const resetTimer = () => {
      if (user) {
        localStorage.setItem('lastActivity', Date.now().toString());
      }
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        if (user) {
          handleAutoLogout();
        }
      }, INACTIVITY_TIMEOUT);
    };
    
    // Set up activity listeners
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });
    
    resetTimer(); // Initialize timer
    
    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user, checkingAuth, handleAutoLogout, INACTIVITY_TIMEOUT]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setCheckingAuth(false); // Stop auth checking since user is actively signing in
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      if (!result.user || !result.user.email) {
        throw new Error('Failed to get user information from Google');
      }
      
      // Check if user exists in database
      try {
        const checkResponse = await fetch(`/api/users/get?email=${encodeURIComponent(result.user.email)}`);
        const checkData = await checkResponse.json();
        
        if (!checkData.success) {
          // New user - need to collect additional details
          setNeedsUserDetails(true);
          setAuthMode('userdetails');
          setUserDetails({
            name: result.user.displayName || '',
            mobile: '',
            address: '',
            category: ''
          });
          setIsLoading(false);
        } else {
          // Existing user with complete data - sign in directly
          setUser(result.user);
          setAuthMode(null);
          setCheckingAuth(false);
          
          // Store last activity for session management
          localStorage.setItem('lastActivity', Date.now().toString());
          
          // Show success popup
          setSuccessMessage('Successfully signed in!');
          setShowSuccessPopup(true);
          setIsRedirecting(true);
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            setShowSuccessPopup(false);
            router.push('/dashboard');
          }, 2000);
        }
      } catch (dbError) {
        // Error checking database - but Firebase auth succeeded, so show profile form
        console.error('Error checking database:', dbError);
        setNeedsUserDetails(true);
        setAuthMode('userdetails');
        setUserDetails({
          name: result.user.displayName || '',
          mobile: '',
          address: '',
          category: ''
        });
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      // Check if user cancelled the popup
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        // User cancelled, just reset loading state
        setIsLoading(false);
      } else {
        alert(`Sign in failed: ${error.message || 'Please try again.'}`);
        setIsLoading(false);
      }
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Sign in using custom API (NO Firebase)
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: authData.email,
          password: authData.password,
        }),
      });
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Sign in failed');
      }
      
      // Create a mock user object for UI
      const mockUser = {
        email: data.user.email,
        displayName: data.user.name,
        photoURL: null,
        uid: data.user.id,
      };
      
      setUser(mockUser as any);
      setAuthMode(null);
      setAuthData({ email: '', password: '', confirmPassword: '', name: '', mobile: '', address: '', category: '' });
      
      // Store user in localStorage for authentication persistence
      localStorage.setItem('authenticated_user', JSON.stringify(mockUser));
      localStorage.setItem('lastActivity', Date.now().toString());
      
      // Show success popup
      setSuccessMessage('Successfully signed in!');
      setShowSuccessPopup(true);
      setIsRedirecting(true);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
        router.push('/dashboard');
      }, 2000);
    } catch (error: any) {
      console.error('Error signing in:', error);
      alert(error.message || 'Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authData.password !== authData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (authData.password.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    if (!authData.name || !authData.mobile || !authData.address || !authData.category) {
      alert('Please fill in all required fields!');
      return;
    }
    
    setIsLoading(true);
    try {
      // Create user account in Cloudflare D1 database (NO Firebase)
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: authData.email,
          password: authData.password,
          name: authData.name,
          mobile: authData.mobile,
          address: authData.address,
          category: authData.category,
        }),
      });
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to create account');
      }
      
      // Create a mock user object for UI
      const mockUser = {
        email: data.user.email,
        displayName: data.user.name,
        photoURL: null,
        uid: data.user.id,
      };
      
      setUser(mockUser as any);
      setAuthMode(null);
      setAuthData({ email: '', password: '', confirmPassword: '', name: '', mobile: '', address: '', category: '' });
      
      // Store user in localStorage for authentication persistence
      localStorage.setItem('authenticated_user', JSON.stringify(mockUser));
      localStorage.setItem('lastActivity', Date.now().toString());
      
      // Show success popup
      setSuccessMessage('Account created successfully!');
      setShowSuccessPopup(true);
      setIsRedirecting(true);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
        router.push('/dashboard');
      }, 2000);
    } catch (error: any) {
      console.error('Error signing up:', error);
      alert(error.message || 'Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        throw new Error('No authenticated user found');
      }
      
      // Save user details to database
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          name: userDetails.name,
          mobile: userDetails.mobile,
          address: userDetails.address,
          category: userDetails.category,
          auth_provider: 'google',
        }),
      });
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to save user details');
      }
      
      setUser(currentUser);
      setNeedsUserDetails(false);
      setAuthMode(null);
      setUserDetails({ name: '', mobile: '', address: '', category: '' });
      
      // Show success popup
      setSuccessMessage('Profile completed successfully!');
      setShowSuccessPopup(true);
      setIsRedirecting(true);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
        router.push('/dashboard');
      }, 2000);
    } catch (error: any) {
      console.error('Error saving user details:', error);
      alert(error.message || 'Failed to save user details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setAuthMode(null);
      setNeedsUserDetails(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Show loading screen while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  // Show only success popup when redirecting (hide content behind it)
  if (isRedirecting && showSuccessPopup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <Check size={48} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">{successMessage}</h2>
              <p className="text-gray-600 mb-6">Redirecting to dashboard...</p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Submit Your Paper</h1>
            <p className="text-xl text-white/90">Share your research with the global community</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          {!isRedirecting && !user && !needsUserDetails ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-12 rounded-2xl shadow-2xl"
            >
              {authMode === 'userdetails' ? (
                <>
                  <h2 className="text-3xl font-bold mb-6 gradient-text text-center">Complete Your Profile</h2>
                  <p className="text-gray-600 mb-8 text-center">Please provide additional details to complete your registration</p>
                  <form onSubmit={handleUserDetailsSubmit} className="space-y-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Email</label>
                      <input
                        type="email"
                        value={auth.currentUser?.email || ''}
                        disabled
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-600 outline-none cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">From your Google account</p>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={userDetails.name}
                        onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Mobile Number *</label>
                      <input
                        type="tel"
                        value={userDetails.mobile}
                        onChange={(e) => setUserDetails({...userDetails, mobile: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Address *</label>
                      <textarea
                        value={userDetails.address}
                        onChange={(e) => setUserDetails({...userDetails, address: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Category *</label>
                      <select
                        value={userDetails.category}
                        onChange={(e) => setUserDetails({...userDetails, category: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map((category, index) => (
                          <option key={index} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Saving...' : 'Complete Profile'}
                    </button>
                  </form>
                </>
              ) : authMode === 'signin' ? (
                <>
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                    <LogIn size={48} className="text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4 gradient-text text-center">Sign In</h2>
                  <form onSubmit={handleEmailSignIn} className="space-y-6 mb-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                      <input
                        type="email"
                        value={authData.email}
                        onChange={(e) => setAuthData({...authData, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Password *</label>
                      <input
                        type="password"
                        value={authData.password}
                        onChange={(e) => setAuthData({...authData, password: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-gray-900"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                  </form>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>
                  <button
                    onClick={handleGoogleSignIn}
                    className="w-full inline-flex items-center justify-center space-x-3 px-8 py-4 bg-white border-2 border-gray-300 rounded-full font-semibold text-gray-700 hover:border-primary-500 hover:text-primary-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 mb-6"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Sign in with Google</span>
                  </button>
                  <p className="text-center text-gray-600">
                    Don't have an account?{' '}
                    <button
                      onClick={() => setAuthMode('signup')}
                      className="text-primary-600 font-semibold hover:text-primary-700"
                    >
                      Sign Up
                    </button>
                  </p>
                </>
              ) : authMode === 'signup' ? (
                <>
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                    <LogIn size={48} className="text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4 gradient-text text-center">Sign Up</h2>
                  <form onSubmit={handleEmailSignUp} className="space-y-6 mb-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={authData.name}
                        onChange={(e) => setAuthData({...authData, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                      <input
                        type="email"
                        value={authData.email}
                        onChange={(e) => setAuthData({...authData, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Mobile Number *</label>
                      <input
                        type="tel"
                        value={authData.mobile}
                        onChange={(e) => setAuthData({...authData, mobile: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Address *</label>
                      <textarea
                        value={authData.address}
                        onChange={(e) => setAuthData({...authData, address: e.target.value})}
                        rows={2}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Category *</label>
                      <select
                        value={authData.category}
                        onChange={(e) => setAuthData({...authData, category: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-gray-900"
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map((category, index) => (
                          <option key={index} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Password *</label>
                      <input
                        type="password"
                        value={authData.password}
                        onChange={(e) => setAuthData({...authData, password: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Confirm Password *</label>
                      <input
                        type="password"
                        value={authData.confirmPassword}
                        onChange={(e) => setAuthData({...authData, confirmPassword: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-gray-900"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                  </form>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>
                  <button
                    onClick={handleGoogleSignIn}
                    className="w-full inline-flex items-center justify-center space-x-3 px-8 py-4 bg-white border-2 border-gray-300 rounded-full font-semibold text-gray-700 hover:border-primary-500 hover:text-primary-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 mb-6"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Sign up with Google</span>
                  </button>
                  <p className="text-center text-gray-600">
                    Already have an account?{' '}
                    <button
                      onClick={() => setAuthMode('signin')}
                      className="text-primary-600 font-semibold hover:text-primary-700"
                    >
                      Sign In
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                    <LogIn size={48} className="text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4 gradient-text text-center">Welcome</h2>
                  <p className="text-gray-600 mb-8 text-center text-lg">
                    Sign in or create an account to submit your paper
                  </p>
                  <div className="space-y-4">
                    <button
                      onClick={() => setAuthMode('signin')}
                      className="w-full px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setAuthMode('signup')}
                      className="w-full px-8 py-4 bg-white border-2 border-primary-600 text-primary-600 rounded-full font-semibold text-lg hover:bg-primary-50 transition-all transform hover:scale-105"
                    >
                      Sign Up
                    </button>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500">Or continue with</span>
                      </div>
                    </div>
                    <button
                      onClick={handleGoogleSignIn}
                      className="w-full inline-flex items-center justify-center space-x-3 px-8 py-4 bg-white border-2 border-gray-300 rounded-full font-semibold text-gray-700 hover:border-primary-500 hover:text-primary-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Continue with Google</span>
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ) : !isRedirecting && needsUserDetails ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-12 rounded-2xl shadow-2xl"
            >
              <h2 className="text-3xl font-bold mb-6 gradient-text text-center">Complete Your Profile</h2>
              <p className="text-gray-600 mb-8 text-center">Please provide additional details to complete your registration</p>
              <form onSubmit={handleUserDetailsSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={userDetails.name}
                    onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Mobile Number *</label>
                  <input
                    type="tel"
                    value={userDetails.mobile}
                    onChange={(e) => setUserDetails({...userDetails, mobile: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Address *</label>
                  <textarea
                    value={userDetails.address}
                    onChange={(e) => setUserDetails({...userDetails, address: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Category *</label>
                  <select
                    value={userDetails.category}
                    onChange={(e) => setUserDetails({...userDetails, category: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-gray-900"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Complete Profile
                </button>
              </form>
            </motion.div>
          ) : null}
        </div>
      </section>
      
      {/* Success Popup Modal */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <Check size={48} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">{successMessage}</h2>
              <p className="text-gray-600 mb-6">Redirecting to dashboard...</p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
