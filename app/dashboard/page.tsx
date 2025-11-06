'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Tag, LogOut, Calendar, Shield, CheckCircle, Upload, FileText, Check, X, ArrowRight, Lock, Edit2, Save } from 'lucide-react';
import PaymentTab from '@/components/dashboard/PaymentTab';

interface UserProfile {
  id?: string;
  email: string;
  name: string;
  mobile: string;
  address: string;
  category: string;
  auth_provider: 'email' | 'google';
  created_at?: string;
  abstract_status?: string | null;
  abstract_submitted_at?: string;
  paper_status?: string | null;
  paper_submitted_at?: string;
  payment_status?: string | null;
  payment_amount?: number | null;
  payment_date?: string | null;
  accompanying_persons?: number | null;
  workshop_participants?: number | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isFirebaseUser, setIsFirebaseUser] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [selectedPaperFile, setSelectedPaperFile] = useState<File | null>(null);
  const [isUploadingPaper, setIsUploadingPaper] = useState(false);
  const [showPaperSuccessPopup, setShowPaperSuccessPopup] = useState(false);
  const [paperUploadError, setPaperUploadError] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [nameUpdateError, setNameUpdateError] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  
  const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds

  // Fetch user profile from D1 database
  const fetchUserProfile = useCallback(async (email: string) => {
    try {
      const response = await fetch(`/api/users/get?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUserProfile(data.user);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }, []);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.oasis.opendocument.text'];
      if (!allowedTypes.includes(file.type)) {
        setUploadError('Only PDF, DOC, DOCX, and ODT files are allowed');
        return;
      }
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setUploadError('');
    }
  };

  // Handle abstract submission
  const handleAbstractSubmit = async () => {
    if (!selectedFile || !userProfile?.email) return;
    
    setIsUploading(true);
    setUploadError('');
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('email', userProfile.email);
      
      const response = await fetch('/api/abstract/submit', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowSuccessPopup(true);
        setSelectedFile(null);
        // Refresh user profile to get updated status
        await fetchUserProfile(userProfile.email);
        
        // Hide popup after 3 seconds
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000);
      } else {
        setUploadError(data.error || 'Submission failed');
      }
    } catch (error: any) {
      setUploadError(error.message || 'Submission failed');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle paper file selection
  const handlePaperFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.oasis.opendocument.text'];
      if (!allowedTypes.includes(file.type)) {
        setPaperUploadError('Only PDF, DOC, DOCX, and ODT files are allowed');
        return;
      }
      // Validate file size (20MB for papers)
      if (file.size > 20 * 1024 * 1024) {
        setPaperUploadError('File size must be less than 20MB');
        return;
      }
      setSelectedPaperFile(file);
      setPaperUploadError('');
    }
  };

  // Handle paper submission
  const handlePaperSubmit = async () => {
    if (!selectedPaperFile || !userProfile?.email) return;
    
    setIsUploadingPaper(true);
    setPaperUploadError('');
    
    try {
      const formData = new FormData();
      formData.append('file', selectedPaperFile);
      formData.append('email', userProfile.email);
      
      const response = await fetch('/api/paper/submit', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowPaperSuccessPopup(true);
        setSelectedPaperFile(null);
        // Refresh user profile to get updated status
        await fetchUserProfile(userProfile.email);
        
        // Hide popup after 3 seconds
        setTimeout(() => {
          setShowPaperSuccessPopup(false);
        }, 3000);
      } else {
        setPaperUploadError(data.error || 'Submission failed');
      }
    } catch (error: any) {
      setPaperUploadError(error.message || 'Submission failed');
    } finally {
      setIsUploadingPaper(false);
    }
  };

  // Handle name update
  const handleNameUpdate = async () => {
    if (!newName.trim() || !userProfile?.email) return;
    
    setIsUpdatingName(true);
    setNameUpdateError('');
    
    try {
      const response = await fetch('/api/users/update-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: userProfile.email, 
          name: newName.trim() 
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setUserProfile(data.user);
        setIsEditingName(false);
        setNewName('');
      } else {
        setNameUpdateError(data.error || 'Failed to update name');
      }
    } catch (error: any) {
      setNameUpdateError(error.message || 'Failed to update name');
    } finally {
      setIsUpdatingName(false);
    }
  };
  
  // Logout function
  const handleLogout = useCallback(async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('authenticated_user');
      localStorage.removeItem('lastActivity');
      
      // Sign out from Firebase if it's a Firebase user
      if (isFirebaseUser) {
        await signOut(auth);
      }
      
      // Redirect to submit-paper page
      router.push('/submit-paper');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [isFirebaseUser, router]);
  
  // Auto-logout on inactivity
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    
    const resetTimer = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        handleLogout();
      }, INACTIVITY_TIMEOUT);
    };
    
    // Check for inactivity on mount
    const lastActivity = localStorage.getItem('lastActivity');
    if (lastActivity) {
      const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
      if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
        handleLogout();
        return;
      }
    }
    
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
  }, [handleLogout, INACTIVITY_TIMEOUT]);

  useEffect(() => {
    // Check if user is authenticated
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        // Check localStorage for custom auth (email/password users)
        const customUser = localStorage.getItem('authenticated_user');
        if (!customUser) {
          // Not authenticated, redirect to submit-paper page
          router.push('/submit-paper');
        } else {
          const parsedUser = JSON.parse(customUser);
          setUser(parsedUser);
          setIsFirebaseUser(false);
          
          // Check if this is the first login
          const loginKey = `login_count_${parsedUser.email}`;
          const loginCount = localStorage.getItem(loginKey);
          
          if (!loginCount || loginCount === '0') {
            setIsFirstLogin(true);
            localStorage.setItem(loginKey, '1');
          } else {
            setIsFirstLogin(false);
          }
          
          // Fetch profile from D1 database
          await fetchUserProfile(parsedUser.email);
          setLoading(false);
        }
      } else {
        // Firebase user (Google sign-in)
        setUser(currentUser);
        setIsFirebaseUser(true);
        
        // Check if this is the first login
        const loginKey = `login_count_${currentUser.email}`;
        const loginCount = localStorage.getItem(loginKey);
        
        if (!loginCount || loginCount === '0') {
          setIsFirstLogin(true);
          localStorage.setItem(loginKey, '1');
        } else {
          setIsFirstLogin(false);
        }
        
        // Fetch profile from D1 database
        await fetchUserProfile(currentUser.email!);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, fetchUserProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl top-20 left-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl bottom-20 right-20 animate-pulse delay-1000"></div>
        </div>
        
        <div className="text-center relative z-10">
          <motion.div 
            className="relative w-20 h-20 mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/30"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 border-r-purple-500"></div>
          </motion.div>
          <motion.p 
            className="text-white text-xl font-semibold"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading Dashboard...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-16 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl top-20 left-20 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl bottom-20 right-20 animate-pulse delay-1000"></div>
        <div className="absolute w-64 h-64 bg-pink-500/10 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              {/* Animated Zap/Star Element */}
              <motion.div
                className="relative w-16 h-16 md:w-20 md:h-20"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                {/* Star/Zap shape */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.svg
                    viewBox="0 0 24 24"
                    className="w-10 h-10 md:w-12 md:h-12"
                    animate={{ 
                      rotate: -360
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <defs>
                      <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
                        <stop offset="50%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      fill="url(#starGradient)"
                      animate={{ 
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.svg>
                </div>
                
                {/* Sparkle particles */}
                <motion.div 
                  className="absolute top-0 right-0 w-2 h-2 bg-yellow-300 rounded-full"
                  animate={{ 
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div 
                  className="absolute bottom-0 left-0 w-2 h-2 bg-pink-300 rounded-full"
                  animate={{ 
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
                <motion.div 
                  className="absolute top-1/2 left-0 w-2 h-2 bg-orange-300 rounded-full"
                  animate={{ 
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                />
              </motion.div>
              
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  {isFirstLogin ? 'Welcome!' : 'Welcome Back!'}
                </h1>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-red-500/50 transition-all duration-300"
            >
              <LogOut size={20} />
              Logout
            </motion.button>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 inline-flex gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('abstract')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'abstract'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              Submit Abstract
            </button>
            <button
              onClick={() => setActiveTab('paper')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'paper'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              Submit Paper
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'payment'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              Payment
            </button>
          </div>
        </motion.div>

        {/* Content Sections */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-1"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
                  <div className="text-center">
                    {/* Avatar */}
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="relative w-32 h-32 mx-auto mb-6"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
                      <div className="absolute inset-2 bg-slate-800 rounded-full flex items-center justify-center">
                        <User size={48} className="text-purple-400" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-slate-800 flex items-center justify-center">
                        <CheckCircle size={16} className="text-white" />
                      </div>
                    </motion.div>

                    {!isEditingName ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-3">
                          <h2 className="text-2xl font-bold text-white">
                            {userProfile?.name || user?.displayName || 'User'}
                          </h2>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setIsEditingName(true);
                              setNewName(userProfile?.name || '');
                              setNameUpdateError('');
                            }}
                            className="p-2 bg-purple-500/20 hover:bg-purple-500/40 rounded-lg transition-colors"
                            title="Edit name"
                          >
                            <Edit2 size={16} className="text-purple-400" />
                          </motion.button>
                        </div>
                        <p className="text-purple-300">
                          {userProfile?.category || 'Participant'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-center font-bold text-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter your name"
                          autoFocus
                        />
                        <div className="flex items-center gap-2 justify-center">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleNameUpdate}
                            disabled={isUpdatingName || !newName.trim()}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white rounded-lg flex items-center gap-2 transition-colors"
                          >
                            {isUpdatingName ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              >
                                <Save size={16} />
                              </motion.div>
                            ) : (
                              <Save size={16} />
                            )}
                            Save
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setIsEditingName(false);
                              setNewName('');
                              setNameUpdateError('');
                            }}
                            disabled={isUpdatingName}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-500 text-white rounded-lg flex items-center gap-2 transition-colors"
                          >
                            <X size={16} />
                            Cancel
                          </motion.button>
                        </div>
                        {nameUpdateError && (
                          <p className="text-red-400 text-sm">{nameUpdateError}</p>
                        )}
                        <p className="text-purple-300 text-sm">
                          {userProfile?.category || 'Participant'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-white/80">
                        <Shield className="text-purple-400" size={20} />
                        <div>
                          <p className="text-sm text-white/60">Auth Provider</p>
                          <p className="font-semibold capitalize">
                            {userProfile?.auth_provider || 'N/A'}
                          </p>
                        </div>
                      </div>
                      {userProfile?.created_at && (
                        <div className="flex items-center gap-3 text-white/80">
                          <Calendar className="text-blue-400" size={20} />
                          <div>
                            <p className="text-sm text-white/60">Member Since</p>
                            <p className="font-semibold">
                              {new Date(userProfile.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Details Section */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="lg:col-span-2"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <User className="text-purple-400" size={28} />
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-xl">
                          <Mail className="text-purple-400" size={24} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-white/60 mb-1">Email Address</p>
                          <p className="text-white font-semibold break-all">
                            {userProfile?.email || user?.email || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Mobile */}
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl">
                          <Phone className="text-blue-400" size={24} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-white/60 mb-1">Mobile Number</p>
                          <p className="text-white font-semibold">
                            {userProfile?.mobile || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Address */}
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-green-500/50 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-green-500/20 rounded-xl">
                          <MapPin className="text-green-400" size={24} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-white/60 mb-1">Address</p>
                          <p className="text-white font-semibold">
                            {userProfile?.address || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Category */}
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-pink-500/50 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-pink-500/20 rounded-xl">
                          <Tag className="text-pink-400" size={24} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-white/60 mb-1">Category</p>
                          <p className="text-white font-semibold">
                            {userProfile?.category || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Activity Notice */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center justify-center gap-3"
                  >
                    <motion.div
                      animate={{ 
                        rotate: 360
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="text-2xl"
                    >
                      ⏱️
                    </motion.div>
                    <p className="text-yellow-200 text-sm">
                      You will be automatically logged out after 10 minutes of inactivity
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Abstract Submission Section */}
        {activeTab === 'abstract' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Progress Map */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 mb-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Submission Progress</h3>
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                {/* Step 1: Submit Abstract */}
                <div className="flex flex-col items-center flex-1">
                  <motion.div 
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                      userProfile?.abstract_status === 'submitted' || userProfile?.abstract_status === 'accepted'
                        ? 'bg-green-500'
                        : userProfile?.abstract_status === 'rejected'
                        ? 'bg-red-500'
                        : 'bg-purple-500'
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {userProfile?.abstract_status === 'submitted' || userProfile?.abstract_status === 'accepted' ? (
                      <Check className="text-white" size={32} />
                    ) : userProfile?.abstract_status === 'rejected' ? (
                      <X className="text-white" size={32} />
                    ) : (
                      <FileText className="text-white" size={32} />
                    )}
                  </motion.div>
                  <p className="text-white font-semibold text-sm text-center">Submit<br/>Abstract</p>
                </div>

                <div className={`flex-1 h-1 ${
                  userProfile?.abstract_status === 'accepted' ? 'bg-green-500' : 'bg-white/20'
                }`}></div>

                {/* Step 2: Abstract Accepted */}
                <div className="flex flex-col items-center flex-1">
                  <motion.div 
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                      userProfile?.abstract_status === 'accepted'
                        ? 'bg-green-500'
                        : userProfile?.abstract_status === 'submitted'
                        ? 'bg-yellow-500'
                        : userProfile?.abstract_status === 'rejected'
                        ? 'bg-red-500'
                        : 'bg-gray-500'
                    }`}
                    whileHover={{ scale: userProfile?.abstract_status ? 1.1 : 1 }}
                  >
                    {userProfile?.abstract_status === 'accepted' ? (
                      <Check className="text-white" size={32} />
                    ) : userProfile?.abstract_status === 'submitted' ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        ⏳
                      </motion.div>
                    ) : userProfile?.abstract_status === 'rejected' ? (
                      <X className="text-white" size={32} />
                    ) : (
                      <Lock className="text-white" size={32} />
                    )}
                  </motion.div>
                  <p className="text-white font-semibold text-sm text-center">Abstract<br/>Accepted</p>
                </div>

                <div className={`flex-1 h-1 ${
                  userProfile?.payment_status === 'completed' ? 'bg-green-500' : 'bg-white/20'
                }`}></div>

                {/* Step 3: Pay Fee */}
                <div className="flex flex-col items-center flex-1">
                  <motion.div 
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                      userProfile?.payment_status === 'completed'
                        ? 'bg-green-500'
                        : userProfile?.abstract_status === 'accepted'
                        ? 'bg-purple-500'
                        : 'bg-gray-500'
                    }`}
                    whileHover={{ scale: userProfile?.abstract_status === 'accepted' ? 1.1 : 1 }}
                  >
                    {userProfile?.payment_status === 'completed' ? (
                      <Check className="text-white" size={32} />
                    ) : userProfile?.abstract_status === 'accepted' ? (
                      <span className="text-2xl">💳</span>
                    ) : (
                      <Lock className="text-white" size={32} />
                    )}
                  </motion.div>
                  <p className="text-white font-semibold text-sm text-center">Pay<br/>Fee</p>
                </div>

                <div className={`flex-1 h-1 ${
                  userProfile?.paper_status === 'submitted' ? 'bg-green-500' : 'bg-white/20'
                }`}></div>

                {/* Step 4: Submit Paper */}
                <div className="flex flex-col items-center flex-1">
                  <motion.div 
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                      userProfile?.paper_status === 'submitted'
                        ? 'bg-green-500'
                        : userProfile?.payment_status === 'completed'
                        ? 'bg-purple-500'
                        : 'bg-gray-500'
                    }`}
                    whileHover={{ scale: userProfile?.payment_status === 'completed' ? 1.1 : 1 }}
                  >
                    {userProfile?.paper_status === 'submitted' ? (
                      <Check className="text-white" size={32} />
                    ) : userProfile?.payment_status === 'completed' ? (
                      <FileText className="text-white" size={32} />
                    ) : (
                      <Lock className="text-white" size={32} />
                    )}
                  </motion.div>
                  <p className="text-white font-semibold text-sm text-center">Submit<br/>Paper</p>
                </div>
              </div>
            </div>

            {/* Upload Section or Status Display */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20">
              {!userProfile?.abstract_status ? (
                // Upload Form
                <>
                  <div className="text-center mb-8">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center"
                    >
                      <Upload size={48} className="text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-white mb-3">Upload Your Abstract</h2>
                    <p className="text-purple-200 text-lg">Submit your conference abstract for review</p>
                  </div>

                  <div className="max-w-2xl mx-auto">
                    <div className="mb-6">
                      <label className="block text-white font-semibold mb-3 text-lg">Select File</label>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.odt"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="abstract-file"
                          disabled={isUploading}
                        />
                        <label
                          htmlFor="abstract-file"
                          className="block w-full px-6 py-4 bg-white/10 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:bg-white/20 hover:border-purple-400 transition-all duration-300 text-center"
                        >
                          {selectedFile ? (
                            <div className="flex items-center justify-center gap-3">
                              <FileText className="text-green-400" size={24} />
                              <span className="text-white font-semibold">{selectedFile.name}</span>
                              <span className="text-purple-300 text-sm">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-3">
                              <Upload className="text-purple-400" size={24} />
                              <span className="text-white">Click to choose file or drag and drop</span>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    {uploadError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3"
                      >
                        <X className="text-red-400" size={20} />
                        <p className="text-red-200">{uploadError}</p>
                      </motion.div>
                    )}

                    <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                      <p className="text-blue-200 text-sm">
                        <strong>Accepted formats:</strong> PDF, DOC, DOCX, ODT<br/>
                        <strong>Maximum file size:</strong> 10 MB
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAbstractSubmit}
                      disabled={!selectedFile || isUploading}
                      className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {isUploading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                          />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={24} />
                          Submit Abstract
                        </>
                      )}
                    </motion.button>
                  </div>
                </>
              ) : (
                // Status Display
                <div className="text-center">
                  {userProfile.abstract_status === 'submitted' && (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center"
                      >
                        <Check size={48} className="text-white" />
                      </motion.div>
                      <h2 className="text-3xl font-bold text-white mb-3">Abstract Submitted Successfully!</h2>
                      <p className="text-purple-200 text-lg mb-4">
                        Submitted on: {new Date(userProfile.abstract_submitted_at!).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-500/20 border border-yellow-500/50 rounded-xl">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          ⏳
                        </motion.div>
                        <span className="text-yellow-200 font-semibold">Waiting for acceptance...</span>
                      </div>
                    </>
                  )}
                  {userProfile.abstract_status === 'accepted' && (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center"
                      >
                        <Check size={48} className="text-white" />
                      </motion.div>
                      <h2 className="text-3xl font-bold text-white mb-3">🎉 Abstract Accepted!</h2>
                      <p className="text-purple-200 text-lg mb-6">
                        Congratulations! Your abstract has been accepted for the conference.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab('payment')}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300"
                      >
                        Proceed to Payment
                        <ArrowRight size={24} />
                      </motion.button>
                    </>
                  )}
                  {userProfile.abstract_status === 'rejected' && (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center"
                      >
                        <X size={48} className="text-white" />
                      </motion.div>
                      <h2 className="text-3xl font-bold text-white mb-3">Abstract Not Accepted</h2>
                      <p className="text-purple-200 text-lg mb-6">
                        Unfortunately, your abstract was not accepted for the conference.
                        Please contact the organizers for more information.
                      </p>
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-500/20 border border-red-500/50 rounded-xl">
                        <X className="text-red-400" size={24} />
                        <span className="text-red-200 font-semibold">Status: Rejected</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'paper' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20"
          >
            {/* Check workflow: Abstract submitted → Abstract accepted → Payment completed */}
            {!userProfile?.abstract_status ? (
              // No abstract submitted
              <div className="text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center"
                >
                  <Lock size={48} className="text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-3">Submit Abstract First</h2>
                <p className="text-purple-200 text-lg mb-6">
                  You need to submit your abstract before submitting the full paper.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('abstract')}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300"
                >
                  Go to Submit Abstract
                  <ArrowRight size={24} />
                </motion.button>
              </div>
            ) : userProfile.abstract_status === 'rejected' ? (
              // Abstract rejected
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center"
                >
                  <X size={48} className="text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-3">Abstract Not Accepted</h2>
                <p className="text-purple-200 text-lg mb-6">
                  Your abstract was not accepted. You cannot submit a paper at this time.
                  Please contact the conference organizers for more information.
                </p>
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-500/20 border border-red-500/50 rounded-xl">
                  <X className="text-red-400" size={24} />
                  <span className="text-red-200 font-semibold">Paper submission not available</span>
                </div>
              </div>
            ) : userProfile.abstract_status === 'submitted' ? (
              // Abstract submitted but not accepted yet
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 mx-auto mb-6 text-6xl"
                >
                  ⏳
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-3">Waiting for Abstract Acceptance</h2>
                <p className="text-purple-200 text-lg mb-6">
                  Your abstract is under review. You can submit your paper once it's accepted.
                </p>
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-500/20 border border-yellow-500/50 rounded-xl">
                  <span className="text-yellow-200 font-semibold">Status: Pending Review</span>
                </div>
              </div>
            ) : userProfile.payment_status !== 'completed' ? (
              // Abstract accepted but payment not completed
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-5xl">💳</span>
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-3">Complete Payment First</h2>
                <p className="text-purple-200 text-lg mb-6">
                  Your abstract has been accepted! Please complete the registration payment before submitting your paper.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('payment')}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300"
                >
                  Proceed to Payment
                  <ArrowRight size={24} />
                </motion.button>
              </div>
            ) : !userProfile?.paper_status ? (
              // Upload Form
              <>
                <div className="text-center mb-8">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
                  >
                    <FileText size={48} className="text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-3">Upload Your Paper</h2>
                  <p className="text-purple-200 text-lg">Submit your full conference paper</p>
                </div>

                <div className="max-w-2xl mx-auto">
                  <div className="mb-6">
                    <label className="block text-white font-semibold mb-3 text-lg">Select File</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.odt"
                        onChange={handlePaperFileSelect}
                        className="hidden"
                        id="paper-file"
                        disabled={isUploadingPaper}
                      />
                      <label
                        htmlFor="paper-file"
                        className="block w-full px-6 py-4 bg-white/10 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:bg-white/20 hover:border-blue-400 transition-all duration-300 text-center"
                      >
                        {selectedPaperFile ? (
                          <div className="flex items-center justify-center gap-3">
                            <FileText className="text-green-400" size={24} />
                            <span className="text-white font-semibold">{selectedPaperFile.name}</span>
                            <span className="text-purple-300 text-sm">({(selectedPaperFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-3">
                            <Upload className="text-blue-400" size={24} />
                            <span className="text-white">Click to choose file or drag and drop</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {paperUploadError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3"
                    >
                      <X className="text-red-400" size={20} />
                      <p className="text-red-200">{paperUploadError}</p>
                    </motion.div>
                  )}

                  <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <p className="text-blue-200 text-sm">
                      <strong>Accepted formats:</strong> PDF, DOC, DOCX, ODT<br/>
                      <strong>Maximum file size:</strong> 20 MB
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePaperSubmit}
                    disabled={!selectedPaperFile || isUploadingPaper}
                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isUploadingPaper ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                        />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={24} />
                        Submit Paper
                      </>
                    )}
                  </motion.button>
                </div>
              </>
            ) : (
              // Status Display
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center"
                >
                  <Check size={48} className="text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-3">Paper Submitted Successfully!</h2>
                <p className="text-purple-200 text-lg mb-4">
                  Submitted on: {new Date(userProfile.paper_submitted_at!).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-500/20 border border-green-500/50 rounded-xl">
                  <Check className="text-green-400" size={24} />
                  <span className="text-green-200 font-semibold">Your paper has been submitted!</span>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'payment' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20"
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">💳</span>
              Registration Payment
            </h2>
            {userProfile && userProfile.abstract_status === 'accepted' ? (
              <PaymentTab user={{
                email: userProfile.email,
                category: userProfile.category,
                payment_status: userProfile.payment_status,
                payment_amount: userProfile.payment_amount,
                payment_date: userProfile.payment_date,
                accompanying_persons: userProfile.accompanying_persons ?? 0,
                workshop_participants: userProfile.workshop_participants ?? 0,
              }} />
            ) : !userProfile?.abstract_status ? (
              // No abstract submitted
              <div className="text-center py-8">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center"
                >
                  <Lock size={48} className="text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-3">Submit Abstract First</h2>
                <p className="text-purple-200 mb-6">
                  Please submit your abstract before proceeding with payment.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('abstract')}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
                >
                  Go to Submit Abstract
                  <ArrowRight size={20} />
                </motion.button>
              </div>
            ) : userProfile.abstract_status === 'rejected' ? (
              // Abstract rejected
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center"
                >
                  <X size={48} className="text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-3">Abstract Not Accepted</h2>
                <p className="text-purple-200 mb-6">
                  Your abstract was not accepted. Payment is not available at this time.
                  Please contact the conference organizers for more information.
                </p>
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-500/20 border border-red-500/50 rounded-xl">
                  <X className="text-red-400" size={24} />
                  <span className="text-red-200 font-semibold">Payment not available</span>
                </div>
              </div>
            ) : (
              // Abstract submitted but not accepted
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 mx-auto mb-6 text-6xl"
                >
                  ⏳
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-3">Waiting for Abstract Acceptance</h2>
                <p className="text-purple-200 mb-6">
                  Your abstract is under review. Payment will be available once it's accepted.
                </p>
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-500/20 border border-yellow-500/50 rounded-xl">
                  <span className="text-yellow-200 font-semibold">Status: Pending Review</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Abstract Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl p-12 max-w-md w-full text-center border border-green-500/50"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center"
              >
                <Check size={48} className="text-white" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white mb-4"
              >
                Abstract Submitted!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 text-lg"
              >
                Your abstract has been successfully submitted and an email has been sent to the conference organizers.
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paper Success Popup */}
      <AnimatePresence>
        {showPaperSuccessPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl p-12 max-w-md w-full text-center border border-green-500/50"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center"
              >
                <Check size={48} className="text-white" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white mb-4"
              >
                Paper Submitted!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 text-lg"
              >
                Your paper has been successfully submitted and an email has been sent to the conference organizers.
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
