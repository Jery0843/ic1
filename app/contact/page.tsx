'use client';

import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const committee = [
    { role: 'Conference Chair', name: 'Dr.G. Singaravel', title: 'Head – International Relations,\nK.S.R. College of Engineering', image: '/images/committee/singaravel.png' },
    { role: 'Co-Chair', name: 'Dr. Sheshikala Martha', title: 'Professor & Head, CSE,\nSR University', image: '/images/committee/shehikla.jpeg' },
    { role: 'Co-Chair', name: 'Dr. Balajee Maram', title: 'Professor and Dean (Ph.D Program),\nSR University', image: '/images/committee/balajee.jpeg' },
    { role: 'Convenor', name: 'Dr.S. Anguraj', title: 'Associate Professor & Head, IT,\nKSRCE', image: '/images/committee/anguraj.png' },
    { role: 'Convenor', name: 'Dr.V. Sharmila', title: 'Associate Professor & Head, CSE,\nKSRCE', image: '/images/committee/sharmila.png' },
    { role: 'Convenor', name: 'Mrs.K. Sudha', title: 'Assistant Professor & Head, Cyber Security,\nKSRCE', image: '/images/committee/sudha.jpg' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({ type: 'success', message: data.message || 'Thank you! Your message has been sent successfully.' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus({ type: 'error', message: data.error || 'Failed to send message. Please try again.' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({ type: 'error', message: 'An unexpected error occurred. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-xl text-white/90">Get in touch with the conference organizers</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}>
              <h2 className="text-3xl font-bold mb-8 gradient-text">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-lg">
                  <MapPin className="text-primary-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Address</h3>
                    <p className="text-gray-600">K.S.R. College of Engineering, K.S.R. Kalvi Nagar</p>
                    <p className="text-gray-600">Tiruchengode – 637 215, Tamil Nadu, India</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-lg">
                  <Phone className="text-primary-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Phone</h3>
                    <p className="text-gray-600">+91 4288 274213</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-lg">
                  <Mail className="text-primary-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Email</h3>
                    <p className="text-gray-600">principal@ksrce.ac.in</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}>
              <h2 className="text-3xl font-bold mb-8 gradient-text">Send us a Message</h2>
              
              {submitStatus && (
                <div className={`p-4 rounded-lg mb-6 ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  <p className="font-semibold">{submitStatus.message}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-gray-900 bg-white"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-gray-900 bg-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-gray-900 bg-white"
                  required
                />
                <textarea
                  placeholder="Your Message"
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-gray-900 bg-white"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl font-bold mb-8 text-center gradient-text">Organizing Committee</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {committee.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all text-center"
                >
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-2 ring-primary-300 shadow">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                        <User size={36} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-primary-600 mb-2">{member.role}</div>
                  <h3 className="font-bold text-gray-800 mb-2">{member.name}</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{member.title}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
