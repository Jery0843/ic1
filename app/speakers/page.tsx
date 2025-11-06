'use client';

import { motion } from 'framer-motion';
import { User, Briefcase, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function SpeakersPage() {
  const keynoteSpeakers = [
    {
      name: 'Dr Javid Iqbal',
      title: 'Senior Lecturer, Programme Leader',
      affiliation: 'Department of Data Science and Artificial Intelligence',
      university: 'Sunway University, Malaysia',
      expertise: 'Data Science, AI, Machine Learning'
    },
    {
      name: 'Dr Manimuthu Arunmozhi',
      title: 'Lecturer (Assistant Professor)',
      affiliation: 'Cybersecurity and Business Analytics',
      university: 'Aston University, UK',
      expertise: 'Cybersecurity, Business Analytics'
    },
    {
      name: 'Dr. Parikshit N. Mahalle',
      title: 'Dean (Research and Development), Professor and Head',
      affiliation: 'Department of Artificial Intelligence and Data Science',
      university: 'Vishwakarma Institute of Information Technology (VITT), Pune',
      expertise: 'AI, Data Science, IoT'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Keynote Speakers
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Meet our distinguished keynote speakers and leading experts
            </p>
          </motion.div>
        </div>
      </section>

      {/* Keynote Speakers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {keynoteSpeakers.map((speaker, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:scale-105"
              >
                {/* Photo Placeholder */}
                <div className="h-64 bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                  <User size={80} className="text-white/50" />
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{speaker.name}</h3>
                  <p className="text-primary-600 font-semibold mb-3">{speaker.title}</p>
                  <div className="space-y-2 text-gray-600 text-sm">
                    <div className="flex items-start space-x-2">
                      <Briefcase size={16} className="mt-1 flex-shrink-0" />
                      <span>{speaker.affiliation}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin size={16} className="mt-1 flex-shrink-0" />
                      <span>{speaker.university}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-xs text-gray-500 font-semibold uppercase">Expertise</span>
                    <p className="text-sm text-gray-700 mt-1">{speaker.expertise}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mt-16"
          >
            <p className="text-lg text-gray-600 mb-6">
              More speakers to be announced soon!
            </p>
            <p className="text-gray-500">
              For conference committee and organizers, visit our{' '}
              <Link href="/committee" className="text-primary-600 hover:text-primary-700 font-semibold underline">
                committee page
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
