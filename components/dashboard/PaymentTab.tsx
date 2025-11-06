'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Users, BookOpen, Plus, Minus, IndianRupee, Loader2, CheckCircle, X } from 'lucide-react';

interface PaymentTabProps {
  user: {
    email: string;
    category: string;
    payment_status?: string | null;
    payment_amount?: number | null;
    payment_date?: string | null;
    accompanying_persons?: number;
    workshop_participants?: number;
  };
}

// Fee structure based on conference pricing
const FEES = {
  early_bird: {
    student: 8000,
    faculty: 10000,
    academic: 10000,
    researcher: 10000,
    industry: 10000,
    corporate: 10000,
  },
  regular: {
    student: 10000,
    faculty: 12000,
    academic: 12000,
    researcher: 12000,
    industry: 12000,
    corporate: 12000,
  },
};

const ACCOMPANYING_PERSON_FEE = {
  early_bird: 4000,
  regular: 5000,
};

const WORKSHOP_FEE = {
  early_bird: 2000,
  regular: 3000,
};

export default function PaymentTab({ user }: PaymentTabProps) {
  const [accompanyingPersons, setAccompanyingPersons] = useState(0);
  const [workshopParticipants, setWorkshopParticipants] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTier, setCurrentTier] = useState<'early_bird' | 'regular'>('regular');

  // Determine current pricing tier based on date
  useEffect(() => {
    const now = new Date();
    const earlyBirdEnd = new Date('2026-01-31');

    if (now <= earlyBirdEnd) {
      setCurrentTier('early_bird');
    } else {
      setCurrentTier('regular');
    }
  }, []);

  // Calculate base registration fee
  const getBaseFee = () => {
    const category = user.category.toLowerCase();
    // Map category to fee structure
    if (category.includes('student')) {
      return FEES[currentTier].student;
    } else if (category.includes('academic') || category.includes('researcher') || category.includes('faculty')) {
      return FEES[currentTier].academic;
    } else if (category.includes('industry') || category.includes('corporate')) {
      return FEES[currentTier].industry;
    }
    return FEES[currentTier].faculty;
  };

  const baseFee = getBaseFee();
  const accompanyingFee = accompanyingPersons * ACCOMPANYING_PERSON_FEE[currentTier];
  const workshopFee = workshopParticipants * WORKSHOP_FEE[currentTier];
  const totalFee = baseFee + accompanyingFee + workshopFee;
  
  // Get tier display name
  const getTierName = () => {
    return currentTier === 'early_bird' ? 'Early Bird' : 'Regular';
  };

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          amount: totalFee,
          accompanyingPersons,
          workshopParticipants,
        }),
      });

      const data = await response.json();

      if (data.success && data.paymentUrl) {
        // Redirect to PhonePe payment page
        window.location.href = data.paymentUrl;
      } else {
        alert('Payment initiation failed: ' + (data.error || 'Unknown error'));
        setIsLoading(false);
      }
    } catch (error) {
      alert('An error occurred while initiating payment');
      setIsLoading(false);
    }
  };

  const isPaid = user.payment_status === 'completed';
  const isFailed = user.payment_status === 'failed';
  const isPending = user.payment_status === 'pending';

  return (
    <div className="space-y-6">
      {/* Payment Status Banner */}
      {isPaid && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="text-green-400" size={24} />
          <div>
            <h3 className="text-green-400 font-semibold">Payment Completed</h3>
            <p className="text-green-300 text-sm">
              Paid on {user.payment_date ? new Date(user.payment_date).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'N/A'}
            </p>
          </div>
        </motion.div>
      )}

      {/* Failed Payment Banner */}
      {isFailed && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-center gap-3">
          <X className="text-red-400" size={24} />
          <div>
            <h3 className="text-red-400 font-semibold">Payment Failed</h3>
            <p className="text-red-300 text-sm">
              Your previous payment attempt was unsuccessful. Please try again.
            </p>
          </div>
        </motion.div>
      )}

      {/* Pending Payment Banner */}
      {isPending && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="text-yellow-400" size={24} />
          </motion.div>
          <div>
            <h3 className="text-yellow-400 font-semibold">Payment Pending</h3>
            <p className="text-yellow-300 text-sm">
              Your payment is being processed. This may take a few minutes. Please refresh the page to check the status.
            </p>
          </div>
        </motion.div>
      )}

      {/* Show payment summary if paid, otherwise show form */}
      {isPaid ? (
        <>
          {/* Payment Summary */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-white text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-400" size={24} />
              Payment Summary
            </h3>
            
            <div className="space-y-4">
              {/* Registration Fee */}
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <div>
                  <p className="text-white font-semibold">Registration Fee</p>
                  <p className="text-purple-300 text-sm">Category: {user.category}</p>
                </div>
                <div className="flex items-center gap-1 text-white font-semibold">
                  <IndianRupee size={18} />
                  <span>{baseFee.toLocaleString()}</span>
                </div>
              </div>

              {/* Accompanying Persons */}
              {user.accompanying_persons && user.accompanying_persons > 0 ? (
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <div>
                    <p className="text-white font-semibold">Accompanying Persons</p>
                    <p className="text-purple-300 text-sm">{user.accompanying_persons} × ₹{ACCOMPANYING_PERSON_FEE[currentTier].toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1 text-white font-semibold">
                    <IndianRupee size={18} />
                    <span>{(user.accompanying_persons * ACCOMPANYING_PERSON_FEE[currentTier]).toLocaleString()}</span>
                  </div>
                </div>
              ) : null}

              {/* Workshop Participants */}
              {user.workshop_participants && user.workshop_participants > 0 ? (
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <div>
                    <p className="text-white font-semibold">Workshop Participants</p>
                    <p className="text-purple-300 text-sm">{user.workshop_participants} × ₹{WORKSHOP_FEE[currentTier].toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1 text-white font-semibold">
                    <IndianRupee size={18} />
                    <span>{(user.workshop_participants * WORKSHOP_FEE[currentTier]).toLocaleString()}</span>
                  </div>
                </div>
              ) : null}

              {/* Total Amount */}
              <div className="flex justify-between items-center pt-3">
                <p className="text-white font-bold text-lg">Total Paid</p>
                <div className="flex items-center gap-1 text-green-400 font-bold text-2xl">
                  <IndianRupee size={24} />
                  <span>{user.payment_amount?.toLocaleString() || '0'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <p className="text-blue-300 text-sm">
              <strong>Note:</strong> Your payment has been confirmed. You can now proceed to submit your paper if you haven't already.
            </p>
          </div>
        </>
      ) : (
        <>


      {/* Base Registration Fee */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CreditCard className="text-purple-400" size={24} />
            <h3 className="text-white text-lg font-semibold">Registration Fee</h3>
          </div>
          <div className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
            <span className="text-white font-bold text-sm">{getTierName()}</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-purple-300">Category: {user.category}</span>
              <p className="text-purple-400 text-xs mt-1">
                {currentTier === 'early_bird' ? 'Before Jan 31, 2026' : 'Before Feb 20, 2026'}
              </p>
            </div>
            <div className="flex items-center gap-1 text-white font-semibold text-xl">
              <IndianRupee size={20} />
              <span>{baseFee.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accompanying Persons */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <Users className="text-purple-400" size={24} />
          <h3 className="text-white text-lg font-semibold">Accompanying Persons (Optional)</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-purple-300 text-sm">₹{ACCOMPANYING_PERSON_FEE[currentTier].toLocaleString()} per person</p>
            <span className="text-purple-400 text-xs">{getTierName()}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAccompanyingPersons(Math.max(0, accompanyingPersons - 1))}
                disabled={accompanyingPersons === 0 || isPaid || isPending}
                className="w-10 h-10 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
              >
                <Minus size={20} className="text-white" />
              </button>
              <span className="text-white text-xl font-semibold w-12 text-center">{accompanyingPersons}</span>
              <button
                onClick={() => setAccompanyingPersons(accompanyingPersons + 1)}
                disabled={isPaid || isPending}
                className="w-10 h-10 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
              >
                <Plus size={20} className="text-white" />
              </button>
            </div>
            <div className="flex items-center gap-1 text-white font-semibold text-xl">
              <IndianRupee size={20} />
              <span>{accompanyingFee.toLocaleString()}</span>
            </div>
          </div>
          </div>
      </div>

      {/* Workshop Participants */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="text-purple-400" size={24} />
          <h3 className="text-white text-lg font-semibold">Workshop Participants (Optional)</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-purple-300 text-sm">₹{WORKSHOP_FEE[currentTier].toLocaleString()} per participant</p>
            <span className="text-purple-400 text-xs">{getTierName()}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setWorkshopParticipants(Math.max(0, workshopParticipants - 1))}
                disabled={workshopParticipants === 0 || isPaid || isPending}
                className="w-10 h-10 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
              >
                <Minus size={20} className="text-white" />
              </button>
              <span className="text-white text-xl font-semibold w-12 text-center">{workshopParticipants}</span>
              <button
                onClick={() => setWorkshopParticipants(workshopParticipants + 1)}
                disabled={isPaid || isPending}
                className="w-10 h-10 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
              >
                <Plus size={20} className="text-white" />
              </button>
            </div>
            <div className="flex items-center gap-1 text-white font-semibold text-xl">
              <IndianRupee size={20} />
              <span>{workshopFee.toLocaleString()}</span>
            </div>
          </div>
          </div>
      </div>

      {/* Total and Pay Button */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/50">
        <div className="flex items-center justify-between mb-6">
          <span className="text-purple-300 text-lg">Total Amount</span>
          <div className="flex items-center gap-1 text-white font-bold text-3xl">
            <IndianRupee size={28} />
            <span>{totalFee.toLocaleString()}</span>
          </div>
        </div>

        {!isPaid && !isPending ? (
          <button
            onClick={handlePayment}
            disabled={isLoading || isPending}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl text-white font-semibold text-lg flex items-center justify-center gap-2 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard size={24} />
                <span>Pay Now</span>
              </>
            )}
          </button>
        ) : isPending ? (
          <div className="text-center text-yellow-400 font-semibold flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={20} />
            Payment Processing...
          </div>
        ) : (
          <div className="text-center text-green-400 font-semibold">
            ✓ Payment completed successfully
          </div>
        )}
      </div>

      {/* Payment Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <p className="text-blue-300 text-sm">
          <strong>Note:</strong> You will be redirected to PhonePe's secure payment gateway. After successful payment, 
          your payment status will be updated automatically.
        </p>
      </div>
        </>
      )}
    </div>
  );
}
