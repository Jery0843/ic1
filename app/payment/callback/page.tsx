'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, X, Loader2 } from 'lucide-react';

function PaymentCallbackContent() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'pending'>('loading');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get transaction ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const merchantTransactionId = urlParams.get('merchantTransactionId') || urlParams.get('transactionId');
        
        if (!merchantTransactionId) {
          setStatus('failed');
          setMessage('Transaction ID not found in URL');
          return;
        }

        // Verify payment with backend
        const response = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ merchantTransactionId }),
        });

        const data = await response.json();

        if (data.success && data.status === 'PAYMENT_SUCCESS') {
          setStatus('success');
          setMessage('Payment completed successfully!');
          
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
        } else if (data.status === 'PAYMENT_PENDING' || data.status === 'PENDING') {
          setStatus('pending');
          setMessage('Payment is still being processed. Please check your dashboard in a few minutes.');
          
          // Redirect to dashboard after 5 seconds for pending
          setTimeout(() => {
            router.push('/dashboard');
          }, 5000);
        } else {
          setStatus('failed');
          setMessage(data.error || 'Payment verification failed');
        }
      } catch (error) {
        setStatus('failed');
        setMessage('An error occurred while verifying payment');
      }
    };

    verifyPayment();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-md rounded-3xl p-12 max-w-md w-full text-center border border-white/20"
      >
        {status === 'loading' && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 mx-auto mb-6"
            >
              <Loader2 size={80} className="text-purple-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-4">Processing Payment</h2>
            <p className="text-purple-200">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center"
            >
              <Check size={48} className="text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-4">Payment Successful!</h2>
            <p className="text-green-200 mb-6">{message}</p>
            <p className="text-purple-300 text-sm">Redirecting to dashboard...</p>
          </>
        )}

        {status === 'pending' && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 mx-auto mb-6"
            >
              <Loader2 size={80} className="text-yellow-400" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-4">Payment Pending</h2>
            <p className="text-yellow-200 mb-6">{message}</p>
            <p className="text-purple-300 text-sm">Redirecting to dashboard...</p>
          </>
        )}

        {status === 'failed' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center"
            >
              <X size={48} className="text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-4">Payment Failed</h2>
            <p className="text-red-200 mb-6">{message}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return <PaymentCallbackContent />;
}
