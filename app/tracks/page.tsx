'use client';

import { motion } from 'framer-motion';
import { Cpu, Server, Brain, Shield, Wifi, Globe } from 'lucide-react';

export default function TracksPage() {
  const tracks = [
    {
      icon: Cpu,
      number: 1,
      title: 'Quantum Computing & Next-Gen Algorithms',
      color: 'from-blue-500 to-cyan-500',
      topics: [
        'Quantum-inspired algorithms for optimization, finance, and healthcare (SDG 3, 8)',
        'Quantum cryptography and post-quantum security (SDG 16)',
        'Quantum applications in data analytics and cloud services',
        'Quantum software frameworks and simulators for IT/CSE research'
      ]
    },
    {
      icon: Server,
      number: 2,
      title: 'Supercomputing & High-Performance Systems',
      color: 'from-purple-500 to-pink-500',
      topics: [
        'HPC applications for large-scale data analytics & AI (SDG 9)',
        'Energy-efficient architectures and green supercomputing (SDG 12, 13)',
        'HPC in modelling climate change, disaster management, and sustainability (SDG 13)',
        'Supercomputing for scientific simulations in IoT & cyber-physical systems'
      ]
    },
    {
      icon: Brain,
      number: 3,
      title: 'AI/ML for Sustainable Intelligence',
      color: 'from-green-500 to-teal-500',
      topics: [
        'AI/ML for smart agriculture, healthcare, and education (SDG 2, 3, 4)',
        'AI-driven IoT for smart cities and energy management (SDG 7, 11)',
        'Responsible & ethical AI frameworks for social good (SDG 16)',
        'Generative AI & edge intelligence for sustainable applications'
      ]
    },
    {
      icon: Shield,
      number: 4,
      title: 'Cyber Security & Privacy in the FutureTech Era',
      color: 'from-red-500 to-orange-500',
      topics: [
        'Post-quantum cryptography and secure communication (SDG 16)',
        'AI for threat detection, fraud prevention & resilience (SDG 9, 16)',
        'IoT security: vulnerabilities, attacks, and countermeasures (SDG 11)',
        'Blockchain, digital trust, and privacy-preserving AI'
      ]
    },
    {
      icon: Wifi,
      number: 5,
      title: 'IoT & Edge Computing for SDG Applications',
      color: 'from-indigo-500 to-purple-500',
      topics: [
        'IoT for smart healthcare, transportation, and agriculture (SDG 2, 3, 11)',
        'Edge computing architectures for low-power sustainable IoT (SDG 7, 12)',
        'Industrial IoT for predictive maintenance and green manufacturing (SDG 9)',
        'IoT-driven disaster management and climate monitoring (SDG 13)'
      ]
    },
    {
      icon: Globe,
      number: 6,
      title: 'Policy, Education, and Innovation Ecosystem',
      color: 'from-yellow-500 to-amber-500',
      topics: [
        'Building digital capacity and skill development for SDG 4 (Quality Education)',
        'Global collaborations & policy frameworks for SDG 17 (Partnerships)',
        'Tech transfer and entrepreneurship in IT, CSE, IoT, and Cyber Security',
        'Ethical, social, and environmental implications of disruptive computing'
      ]
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
              Conference Tracks
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Six specialized tracks covering the latest in FutureTech for Sustainability
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tracks Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {tracks.map((track, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:scale-[1.02]"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${track.color} p-6 text-white`}>
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl">
                      <track.icon size={40} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold opacity-90">Track {track.number}</div>
                      <h3 className="text-2xl font-bold">{track.title}</h3>
                    </div>
                  </div>
                </div>

                {/* Topics */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Key Topics:</h4>
                  <ul className="space-y-3">
                    {track.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700 text-sm leading-relaxed">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <h2 className="text-4xl font-bold mb-4">Submit Your Research</h2>
            <p className="text-xl mb-8 opacity-90">
              Choose your track and contribute to advancing sustainable technology solutions
            </p>
            <a
              href="/submit-paper"
              className="inline-block px-8 py-4 bg-white text-primary-600 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
            >
              Submit Paper
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
