'use client';

import { motion } from 'framer-motion';
import { Check, IndianRupee } from 'lucide-react';

export default function FeesPage() {
  const feeStructure = [
    { category: 'Student (with ID)', earlyBird: '₹8,000', regular: '₹10,000', onsite: '₹12,000' },
    { category: 'Academic/Researcher', earlyBird: '₹10,000', regular: '₹12,000', onsite: '₹14,000' },
    { category: 'Industry/Corporate', earlyBird: '₹10,000', regular: '₹12,000', onsite: '₹14,000' },
    { category: 'Accompanying Person', earlyBird: '₹4,000', regular: '₹5,000', onsite: '₹7,000' },
    { category: 'Workshop Only (Optional)', earlyBird: '₹2,000', regular: '₹3,000', onsite: '₹4,000' },
  ];

  const benefits = [
    'Access to all conference sessions',
    'Conference kit and materials',
    'Lunch and refreshments during conference',
    'Certificate of participation',
    'Publication opportunities in Scopus-indexed journals',
    'Networking with international experts',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Registration Fees</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Affordable registration options for all participants
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-primary-600 to-accent-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Category</th>
                    <th className="px-6 py-4 text-center">Early Bird<br/><span className="text-sm font-normal opacity-90">Before Jan 31, 2026</span></th>
                    <th className="px-6 py-4 text-center">Regular<br/><span className="text-sm font-normal opacity-90">Before Feb 20, 2026</span></th>
                    <th className="px-6 py-4 text-center">On-site<br/><span className="text-sm font-normal opacity-90">Apr 16-17, 2026</span></th>
                  </tr>
                </thead>
                <tbody>
                  {feeStructure.map((fee, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-800">{fee.category}</td>
                      <td className="px-6 py-4 text-center text-green-600 font-bold">{fee.earlyBird}</td>
                      <td className="px-6 py-4 text-center text-blue-600 font-bold">{fee.regular}</td>
                      <td className="px-6 py-4 text-center text-orange-600 font-bold">{fee.onsite}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 grid md:grid-cols-2 gap-8"
          >
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold mb-6 gradient-text">Registration Includes</h3>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="text-green-500 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Important Notes</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>APC support available for Scopus-indexed journal publications (Terms apply)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>All fees are in Indian Rupees (INR)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Early bird rates offer maximum savings</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Hostel accommodation available on campus (on request)</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
