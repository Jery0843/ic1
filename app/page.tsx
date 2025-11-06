'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Award, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const conferenceDate = new Date('2026-04-16T00:00:00').getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = conferenceDate - now;

      if (difference > 0) {
        const weeks = Math.floor(difference / (1000 * 60 * 60 * 24 * 7));
        const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ weeks, days, hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const features = [
    { icon: Calendar, title: 'April 16-17, 2026', desc: 'Two Days Conference' },
    { icon: MapPin, title: 'Tiruchengode, India', desc: 'K.S.R. College of Engineering' },
    { icon: Users, title: 'International Speakers', desc: 'Leading Experts' },
    { icon: Award, title: 'Scopus Indexed', desc: 'Publication Opportunities' },
  ];

  const highlights = [
    { number: '6', label: 'Conference Tracks' },
    { number: '1000+', label: 'Expected Participants' },
    { number: '3', label: 'Partner Institutions' },
    { number: '500+', label: 'Paper Presentations' },
  ];


  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-purple-600 to-accent-600 overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
          >
            <source src="https://res.cloudinary.com/dllbh1v1m/video/upload/v1754979177/vdo1_g6wq8h.mp4" type="video/mp4" />
          </video>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/70 via-purple-900/70 to-accent-900/70"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white/10 rounded-full"
              style={{
                width: Math.random() * 300 + 50,
                height: Math.random() * 300 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full mb-6"
            >
              <Sparkles className="text-yellow-300" size={20} />
              <span className="text-white font-semibold">FUSION-SDG 2026</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
            >
              International Conference<br />
              <span className="text-yellow-300">Future Tech for Sustainability</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto"
            >
              Harnessing Quantum, Supercomputing, and AI/ML Towards SDG 2030
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
            >
              <Link
                href="/submit-paper"
                className="px-8 py-4 bg-white text-primary-600 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl flex items-center space-x-2"
              >
                <span>Submit Your Paper</span>
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/agenda"
                className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-full font-semibold text-lg hover:bg-white/30 transition-all border-2 border-white/50"
              >
                View Agenda
              </Link>
            </motion.div>

            {/* Conference Countdown - Compact */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="mt-6"
            >
              <p className="text-white/90 text-xs md:text-sm mb-3 font-semibold">
                Conference Starts In
              </p>
              <div className="grid grid-cols-5 gap-2 md:gap-3 max-w-2xl mx-auto">
                {/* Weeks */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/15 backdrop-blur-md p-3 md:p-4 rounded-xl border border-white/20 text-center"
                >
                  <motion.div
                    key={timeLeft.weeks}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl md:text-3xl font-bold text-white mb-1"
                  >
                    {String(timeLeft.weeks).padStart(2, '0')}
                  </motion.div>
                  <div className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                    Weeks
                  </div>
                </motion.div>

                {/* Days */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/15 backdrop-blur-md p-3 md:p-4 rounded-xl border border-white/20 text-center"
                >
                  <motion.div
                    key={timeLeft.days}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl md:text-3xl font-bold text-white mb-1"
                  >
                    {String(timeLeft.days).padStart(2, '0')}
                  </motion.div>
                  <div className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                    Days
                  </div>
                </motion.div>

                {/* Hours */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/15 backdrop-blur-md p-3 md:p-4 rounded-xl border border-white/20 text-center"
                >
                  <motion.div
                    key={timeLeft.hours}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl md:text-3xl font-bold text-white mb-1"
                  >
                    {String(timeLeft.hours).padStart(2, '0')}
                  </motion.div>
                  <div className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                    Hours
                  </div>
                </motion.div>

                {/* Minutes */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/15 backdrop-blur-md p-3 md:p-4 rounded-xl border border-white/20 text-center"
                >
                  <motion.div
                    key={timeLeft.minutes}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl md:text-3xl font-bold text-white mb-1"
                  >
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </motion.div>
                  <div className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                    Mins
                  </div>
                </motion.div>

                {/* Seconds */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/15 backdrop-blur-md p-3 md:p-4 rounded-xl border border-white/20 text-center"
                >
                  <motion.div
                    key={timeLeft.seconds}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl md:text-3xl font-bold text-white mb-1"
                  >
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </motion.div>
                  <div className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                    Secs
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-10"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
              >
                <feature.icon className="text-yellow-300 mb-4" size={32} />
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-white/80 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-3 bg-white rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>


      {/* Collaboration Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              In Collaboration With
            </h2>
          </motion.div>

          {/* Host Institution */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-3xl p-8 md:p-12 shadow-xl">
              <div className="flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="mb-6"
                >
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <img
                      src="https://res.cloudinary.com/dllbh1v1m/image/upload/v1755753110/pcytcphmgc1irewg4suw.webp"
                      alt="K.S.R College of Engineering Logo"
                      className="h-32 w-auto object-contain"
                    />
                  </div>
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-800 mb-3">
                  Host Institution
                </h3>
                <h4 className="text-2xl font-semibold text-primary-600 mb-4">
                  K.S.R. College of Engineering
                </h4>
                <p className="text-gray-700 max-w-3xl leading-relaxed">
                  Department of Electronics and Communication, Electrical and Electronics & Biomedical Engineering,<br />
                  K.S.R. College of Engineering (Autonomous),<br />
                  Tiruchengode, Namakkal – 637215, Tamilnadu, India
                </p>
              </div>
            </div>
          </motion.div>

          {/* Co-Host Universities */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Co-Host Universities
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {/* UTHM - intentionally left empty per request */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                {/* empty container - UTHM content removed */}
              </motion.div>

              {/* SR University */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-accent-50 to-purple-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                    <img
                      src="https://d2lk14jtvqry1q.cloudfront.net/media/large_1110_ab6e859316_42431500d1.png"
                      alt="SR University Logo"
                      className="h-24 w-auto object-contain"
                    />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-3">
                    SR University
                  </h4>
                  <p className="text-gray-600">
                    Warangal, Telangana, India
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl md:text-6xl font-bold gradient-text mb-2">
                  {item.number}
                </div>
                <div className="text-gray-600 font-medium">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              About the Conference
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              FUSION-SDG 2026 brings together researchers, industry experts, and academics to explore 
              cutting-edge technologies that drive sustainable development. Focus on Quantum Computing, 
              Supercomputing, AI/ML, IoT, and Cybersecurity aligned with UN Sustainable Development Goals.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mb-6">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Networking</h3>
              <p className="text-gray-600">
                Connect with leading researchers and industry professionals from around the globe.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center mb-6">
                <Award className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Publications</h3>
              <p className="text-gray-600">
                Get your research published in Scopus-indexed journals and conference proceedings.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Innovation</h3>
              <p className="text-gray-600">
                Explore innovative solutions addressing global challenges through technology.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Join Us?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Paper submission deadline: November 30, 2025. Don't miss this opportunity!
            </p>
            <Link
              href="/submit-paper"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary-600 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
            >
              <span>Submit Your Research</span>
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
