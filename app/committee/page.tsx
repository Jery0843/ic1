'use client';

import { motion, useMotionValue, useTransform, Variants } from 'framer-motion';
import { Award } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const PersonCard = ({ person, index, type }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.1
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set((e.clientX - centerX) / 10);
        y.set((e.clientY - centerY) / 10);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d"
      }}
      className="relative"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 text-center overflow-hidden border border-gray-200/50 h-full flex flex-col"
      >
        {/* Animated gradient background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary-400/20 via-accent-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          animate={{
            background: [
              "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))",
              "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))",
              "linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(99, 102, 241, 0.2))"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating particles */}
        {isHovered && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary-400 rounded-full"
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{
                  x: Math.random() * 200 - 100,
                  y: Math.random() * 200 - 100,
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                style={{
                  left: '50%',
                  top: '50%'
                }}
              />
            ))}
          </>
        )}

        <div className="relative z-10 flex-1 flex flex-col" style={{ transform: "translateZ(50px)" }}>
          {/* Image container with 3D effect */}
          <motion.div
            className="relative w-40 h-40 mx-auto mb-6"
            animate={{
              y: isHovered ? [-5, 5] : 0
            }}
            transition={{
              duration: 2,
              repeat: isHovered ? Infinity : 0,
              repeatType: "reverse"
            }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-400 to-accent-400 blur-xl"
              animate={{
                scale: isHovered ? [1, 1.2, 1] : 1,
                opacity: isHovered ? [0.3, 0.6, 0.3] : 0
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Main image */}
            <motion.div
              className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src={person.image}
                alt={person.name}
                width={160}
                height={160}
                className="w-full h-full object-cover"
              />
              {/* Overlay on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-primary-600/80 to-transparent flex items-end justify-center pb-4"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <Award className="text-white" size={32} />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Name with animated underline */}
          <div className="relative inline-block">
            <h4 className="font-bold text-gray-900 mb-2 text-xl group-hover:text-primary-600 transition-colors duration-300">
              {person.name}
            </h4>
            <motion.div
              className="h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
              initial={{ width: 0 }}
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          <p className="text-sm text-gray-600 leading-relaxed mt-3 flex-1 whitespace-pre-line">{person.title}</p>
        </div>

        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-500 via-accent-500 to-purple-500"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default function CommitteePage() {
  const committee = {
    chiefPatrons: [
      { name: 'Shri R. Srinivasan', title: 'Chairman,\nKSR Educational Institutions', image: '/images/committee/srinivasan.jpg' },
      { name: 'Shri K. S. Sachin', title: 'Vice Chairman,\nKSR Educational Institutions', image: '/images/committee/sachin.jpeg' },
      { name: 'Dr. Tunku Ismail Ibni Sultan Ibrahim', title: 'Chancellor,\nUTHM', image: '/images/committee/tunku.jpeg' },
      { name: 'Sri A. Varada Reddy', title: 'Chancellor,\nSR University', image: '/images/committee/varada.jpeg' },
    ],
    patrons: [
      { name: 'Dr. M. Venkatesan', title: 'Dean,\nK.S.R. College of Engineering', image: '/images/committee/venkat.png' },
      { name: 'Dr. P. MeenakshiDevi', title: 'Principal,\nK.S.R. College of Engineering', image: '/images/committee/meena.png' },
      { name: 'Dr. Mas Fawzi bin Mohd Ali', title: 'Vice-Chancellor,\nUTHM', image: '/images/committee/fawzi.png' },
      { name: 'Dr. Shahruddin bin Mahzan', title: 'Deputy Vice-Chancellor,\nUTHM', image: '/images/committee/sharudhin.jpg' },
      { name: 'Dr. Deepak Garg', title: 'Vice-Chancellor,\nSR University', image: '/images/committee/deepak.jpg' },
    ],
    coPatrons: [
      { name: 'Dr. Veena', title: 'Director – IQAC,\nK.S.R. College of Engineering', image: '/images/committee/veena.png' },
      { name: 'Dr. R. Archana Reddy', title: 'Registrar,\nSR University', image: '/images/committee/archana.jpg' },
    ],
    conferenceChair: [
      { name: 'Dr. G. Singaravel', title: 'Head – International Relations,\nK.S.R. College of Engineering', image: '/images/committee/singaravel.png' },
    ],
    conferenceCoChair: [
      { name: 'Dr. Sheshikala Martha', title: 'Professor & Head, CSE,\nSR University', image: '/images/committee/shehikla.jpeg' },
      { name: 'Dr. Balajee Maram', title: 'Professor and Dean (Ph.D Program),\nSR University', image: '/images/committee/balajee.jpeg' },
    ],
    convenors: [
      { name: 'Dr. S. Anguraj', title: 'Associate Professor & Head, IT,\nK.S.R. College of Engineering', image: '/images/committee/anguraj.jpg' },
      { name: 'Dr. V. Sharmila', title: 'Associate Professor & Head, CSE,\nK.S.R. College of Engineering', image: '/images/committee/sharmila.png' },
      { name: 'Mrs. K. Sudha', title: 'Assistant Professor & Head, Cyber Security,\nK.S.R. College of Engineering', image: '/images/committee/sudha.png' },
      { name: 'Dr. N. Saravanan', title: 'Professor & Head, CSE (IoT),\nK.S.R. College of Engineering', image: '/images/committee/saravanan.png' },
      { name: 'Dr. S. Malatthi', title: 'Associate Professor & Head, CSD,\nK.S.R. College of Engineering', image: '/images/committee/malathi.jpg' },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-20">
      {/* Header with animated background */}
      <section className="relative py-20 bg-gradient-to-r from-primary-600 via-accent-600 to-purple-600 overflow-hidden">
        {/* Animated background pattern */}
        <motion.div 
          className="absolute inset-0 opacity-20"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-white mb-4"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Conference Committee
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Meet the distinguished leaders and organizers behind FUSION-SDG 2026
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Committee Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Chief Patrons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <motion.h3 
              className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              Chief Patrons
            </motion.h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 items-stretch">
              {committee.chiefPatrons.map((person, index) => (
                <PersonCard key={index} person={person} index={index} type="patron" />
              ))}
            </div>
          </motion.div>

          {/* Patrons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <motion.h3 
              className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              Patrons
            </motion.h3>
            {
              // keep the first three patrons layout unchanged, center any remaining ones below
            }
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch">
              {committee.patrons.slice(0, 3).map((person, index) => (
                <PersonCard key={index} person={person} index={index} type="patron" />
              ))}
            </div>

            {committee.patrons.length > 3 && (
              <div className="grid sm:grid-cols-2 gap-10 max-w-4xl mx-auto mt-8">
                {committee.patrons.slice(3).map((person, idx) => (
                  <PersonCard key={idx + 3} person={person} index={idx + 3} type="patron" />
                ))}
              </div>
            )}
          </motion.div>

          {/* Co-Patrons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <motion.h3 
              className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              Co-Patrons
            </motion.h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-10 max-w-4xl mx-auto items-stretch">
              {committee.coPatrons.map((person, index) => (
                <PersonCard key={index} person={person} index={index} type="patron" />
              ))}
            </div>
          </motion.div>

          {/* Conference Chair */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <motion.h3 
              className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              Conference Chair
            </motion.h3>
            <div className="grid sm:grid-cols-1 gap-10 max-w-lg mx-auto items-stretch">
              {committee.conferenceChair.map((person, index) => (
                <PersonCard key={index} person={person} index={index} type="chair" />
              ))}
            </div>
          </motion.div>

          {/* Conference Co-Chair */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <motion.h3 
              className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-accent-600 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              Conference Co-Chair
            </motion.h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-stretch">
              {committee.conferenceCoChair.map((person, index) => (
                <PersonCard key={index} person={person} index={index} type="chair" />
              ))}
            </div>
          </motion.div>

          {/* Convenors */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.h3 
              className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              Convenors
            </motion.h3>
            {
              // keep the first three convenors layout unchanged, center any remaining ones below
            }
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch">
              {committee.convenors.slice(0, 3).map((person, index) => (
                <PersonCard key={index} person={person} index={index} type="convenor" />
              ))}
            </div>

            {committee.convenors.length > 3 && (
              <div className="grid sm:grid-cols-2 gap-10 max-w-4xl mx-auto mt-8">
                {committee.convenors.slice(3).map((person, idx) => (
                  <PersonCard key={idx + 3} person={person} index={idx + 3} type="convenor" />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
