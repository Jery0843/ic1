'use client';

import { useState, useEffect } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';

export default function TestFirebasePage() {
  const [config, setConfig] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('testpass123');

  useEffect(() => {
    // Show Firebase config (without API key for security)
    setConfig({
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      apiKeyPresent: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      apiKeyLength: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.length || 0,
    });
  }, []);

  const testGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setSuccess(`Google Sign-In successful! User: ${result.user.email}`);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setError(`Error: ${err.code} - ${err.message}`);
    }
  };

  const testEmailSignUp = async () => {
    setError('');
    setSuccess('');
    try {
      const result = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      setSuccess(`Email Sign-Up successful! User: ${result.user.email}`);
    } catch (err: any) {
      console.error('Email Sign-Up Error:', err);
      setError(`Error: ${err.code} - ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Firebase Configuration Test</h1>
        
        {/* Configuration Display */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Firebase Configuration</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <strong>Success:</strong> {success}
          </div>
        )}

        {/* Test Buttons */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Authentication</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Test Google Sign-In</h3>
              <button
                onClick={testGoogleSignIn}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Test Google Sign-In
              </button>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Test Email/Password Sign-Up</h3>
              <div className="flex gap-2 mb-2">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="px-4 py-2 border rounded"
                  placeholder="Email"
                />
                <input
                  type="password"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  className="px-4 py-2 border rounded"
                  placeholder="Password"
                />
              </div>
              <button
                onClick={testEmailSignUp}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Test Email Sign-Up
              </button>
            </div>
          </div>
        </div>

        {/* Troubleshooting Guide */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Troubleshooting Guide</h2>
          <div className="space-y-3 text-sm">
            <div>
              <strong>1. Check Firebase Console:</strong>
              <ul className="list-disc ml-6 mt-1">
                <li>Go to Firebase Console → Authentication → Sign-in method</li>
                <li>Enable "Email/Password" provider</li>
                <li>Enable "Google" provider</li>
              </ul>
            </div>
            <div>
              <strong>2. Check Authorized Domains:</strong>
              <ul className="list-disc ml-6 mt-1">
                <li>Go to Firebase Console → Authentication → Settings → Authorized domains</li>
                <li>Add: localhost</li>
                <li>Add: 127.0.0.1</li>
                <li>Add your production domain</li>
              </ul>
            </div>
            <div>
              <strong>3. Common Error Codes:</strong>
              <ul className="list-disc ml-6 mt-1">
                <li><code>auth/api-key-not-valid</code> - Check API key and Firebase project settings</li>
                <li><code>auth/unauthorized-domain</code> - Add localhost to authorized domains</li>
                <li><code>auth/popup-blocked</code> - Allow popups in browser</li>
                <li><code>auth/operation-not-allowed</code> - Enable the sign-in method in Firebase Console</li>
              </ul>
            </div>
            <div>
              <strong>4. Verify API Key Restrictions:</strong>
              <ul className="list-disc ml-6 mt-1">
                <li>Go to Google Cloud Console → APIs & Services → Credentials</li>
                <li>Find your API key (Browser key)</li>
                <li>Check Application restrictions - should allow localhost</li>
                <li>Check API restrictions - should allow required Firebase APIs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
