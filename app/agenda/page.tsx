'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

export default function AgendaPage() {
  const timeline = [
    { date: 'January, 2026', event: 'Conference Announcement / Call for Papers', status: 'upcoming' },
    { date: 'January 15, 2026', event: 'Full Paper Submission Deadline', status: 'important' },
    { date: 'January 30, 2026', event: 'Late Submission / Extended Deadline', status: 'important' },
    { date: 'February, 2026', event: 'Review Period', status: 'upcoming' },
    { date: 'February 15, 2026', event: 'Acceptance Notification', status: 'important' },
    { date: 'February 28, 2026', event: 'Camera-Ready Paper Submission', status: 'important' },
    { date: 'March, 2026', event: 'Author Registration Deadline', status: 'important' },
    { date: 'March 1, 2026', event: 'Program Schedule Release', status: 'upcoming' },
    { date: 'March 5, 2026', event: 'Early-Bird Registration Deadline', status: 'important' },
    { date: 'March 10, 2026', event: 'Final Registration Deadline', status: 'important' },
    { date: 'April 16-17, 2026', event: 'Conference Days', status: 'conference' },
  ];

  const schedule = [
    {
      day: 'Day 1 - April 16, 2026',
      sessions: [
        { time: '08:00 - 09:00', title: 'Registration & Welcome Coffee' },
        { time: '09:00 - 09:30', title: 'Opening Ceremony' },
        { time: '09:30 - 10:30', title: 'Keynote Speech 1', speaker: 'Dr Javid Iqbal, Sunway University, Malaysia' },
  { time: '10:30 - 11:00', title: 'IT Tea Break & Networking' },
        { time: '11:00 - 13:00', title: 'Track Sessions (Parallel)', track: 'Tracks 1, 2, 3' },
        { time: '13:00 - 14:00', title: 'Lunch Break' },
        { time: '14:00 - 15:30', title: 'Track Sessions (Parallel)', track: 'Tracks 4, 5, 6' },
        { time: '15:30 - 16:00', title: 'Coffee Break' },
        { time: '16:00 - 17:30', title: 'Panel Discussion: AI & Sustainability' },
        { time: '17:30 - 18:00', title: 'Day 1 Closing Remarks' },
      ]
    },
    {
      day: 'Day 2 - April 17, 2026',
      sessions: [
        { time: '09:00 - 09:30', title: 'Day 2 Opening' },
        { time: '09:30 - 10:30', title: 'Keynote Speech 2', speaker: 'Dr Manimuthu Arunmozhi, Aston University, UK' },
  { time: '10:30 - 11:00', title: 'IT Tea Break' },
        { time: '11:00 - 12:30', title: 'Keynote Speech 3', speaker: 'Dr. Parikshit N. Mahalle, VITT Pune' },
        { time: '12:30 - 13:30', title: 'Lunch Break' },
        { time: '13:30 - 15:00', title: 'Track Sessions (Parallel)', track: 'All Tracks' },
        { time: '15:00 - 15:30', title: 'Coffee Break' },
        { time: '15:30 - 16:30', title: 'Best Paper Awards & Recognition' },
        { time: '16:30 - 17:00', title: 'Closing Ceremony' },
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
              Conference Agenda
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Important dates and conference schedule for FUSION-SDG 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Important Dates Timeline */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12 gradient-text"
          >
            Important Dates
          </motion.h2>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-accent-500" />

            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-20 pb-10"
              >
                {/* Timeline Dot */}
                <div className={`absolute left-5 w-7 h-7 rounded-full border-4 border-white shadow-lg ${
                  item.status === 'conference' ? 'bg-red-500' :
                  item.status === 'important' ? 'bg-yellow-500' :
                  'bg-primary-500'
                }`} />

                {/* Content */}
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="text-primary-600" size={20} />
                        <span className="text-lg font-bold text-gray-800">{item.date}</span>
                      </div>
                      <p className="text-gray-700 text-lg">{item.event}</p>
                    </div>
                    {item.status === 'conference' && (
                      <span className="px-4 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                        Conference
                      </span>
                    )}
                    {item.status === 'important' && (
                      <span className="px-4 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                        Important
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Conference Schedule */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12 gradient-text"
          >
            Conference Schedule
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {schedule.map((day, dayIndex) => (
              <motion.div
                key={dayIndex}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: dayIndex * 0.2 }}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-xl"
              >
                <h3 className="text-2xl font-bold mb-6 text-gray-800">{day.day}</h3>

                <div className="space-y-4">
                  {day.sessions.map((session, sessionIndex) => (
                    <div
                      key={sessionIndex}
                      className="flex items-start space-x-4 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-center w-24 flex-shrink-0">
                        <Clock className="text-primary-600 mr-2" size={16} />
                        <span className="text-sm font-semibold text-gray-600">{session.time}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{session.title}</p>
                        {session.speaker && (
                          <p className="text-sm text-gray-600 mt-1">{session.speaker}</p>
                        )}
                        {session.track && (
                          <p className="text-sm text-primary-600 mt-1">{session.track}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Note Section */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-2xl shadow-lg"
          >
            <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Stay Updated</h3>
            <p className="text-gray-600">
              The detailed program schedule with session rooms and paper presentations will be released on March 1, 2026. 
              Please check the conference website regularly for updates.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
