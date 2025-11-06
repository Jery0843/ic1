'use client';
import { motion } from 'framer-motion';
import { BookOpen, Award, ExternalLink } from 'lucide-react';

export default function JournalPage() {
  const journals = [
    { name: 'Journal of Data Science', issn: 'eISSN: 2805-5160', publisher: 'iPublishing Network, INTI International University' },
    { name: 'Journal of Innovation and Technology', issn: 'eISSN: 2805-5179', publisher: 'iPublishing Network, INTI International University' },
    { name: 'Journal of Business and Social Science', issn: 'eISSN: 2805-5187', publisher: 'iPublishing Network, INTI International University' },
    { name: 'INTI Journal', issn: 'eISSN: 2600-7320', publisher: 'iPublishing Network, INTI International University' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Publications & Journals</h1>
            <p className="text-xl text-white/90">Scopus-indexed publication opportunities</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-2xl shadow-xl mb-8">
            <BookOpen className="text-primary-600 mb-4" size={48} />
            <h2 className="text-3xl font-bold mb-4 gradient-text">Conference Proceedings</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Outstanding papers presented at FUSION-SDG 2026 will be considered for publication in a special issue of reputable journals or indexed conference proceedings.
            </p>
            <p className="text-lg font-semibold text-gray-800">
              Book Chapter Title: "Integrated Sustainable Engineering Solutions: An Intelligent Multidisciplinary Approach"
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {journals.map((journal, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                <Award className="text-yellow-500 mb-3" size={36} />
                <h3 className="text-xl font-bold text-gray-800 mb-2">{journal.name}</h3>
                <p className="text-sm text-primary-600 font-semibold mb-2">{journal.issn}</p>
                <p className="text-sm text-gray-600">{journal.publisher}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            className="mt-12 bg-gradient-to-br from-primary-50 to-accent-50 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Publication Process</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start space-x-3">
                <span className="text-primary-600 font-bold">1.</span>
                <span>Submit and present your paper at the conference</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-primary-600 font-bold">2.</span>
                <span>Outstanding papers will be invited for journal submission</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-primary-600 font-bold">3.</span>
                <span>Undergo rigorous peer-review process</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-primary-600 font-bold">4.</span>
                <span>Get published in Scopus-indexed journals with wide visibility</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-primary-600 font-bold">5.</span>
                <span>APC support available for co-authors from INTI IU & KSRCE (Terms apply)</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
