'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Info, Clock, Utensils, X, Hotel, Mountain, Plane, Train, Bus, Building2 } from 'lucide-react';
import { useState } from 'react';

export default function VenuePage() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedHostel, setSelectedHostel] = useState<any>(null);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [selectedLocationIndex, setSelectedLocationIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'attractions' | 'hillstations'>('attractions');

  const events = [
    {
      name: 'Inauguration Ceremony',
      venue: 'Platinum Hall',
      time: '09:30 AM',
      description: 'Official opening ceremony of FUSION-SDG 2026 conference with distinguished guests and keynote address.',
      location: 'Main Campus Building, Ground Floor',
      mapUrl: 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=K.S.R.+College+of+Engineering+Tiruchengode&zoom=17'
    },
    {
      name: 'Keynote by Dr. Malathy Batumalay',
      venue: 'Platinum Hall',
      time: '11:00 AM',
      description: 'Expert keynote presentation on cutting-edge technologies and sustainable development.',
      location: 'Main Campus Building, Ground Floor',
      mapUrl: 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=K.S.R.+College+of+Engineering+Tiruchengode&zoom=17'
    }
  ];

  const hostels = [
    {
      name: 'Marina Hostel',
      gender: 'Men',
      breakfast: '7:30 - 8:30 AM',
      lunch: '12:30 - 1:30 PM',
      dinner: '7:30 - 8:30 PM',
      facilities: ['WiFi', 'Hot Water', 'Laundry', 'Security'],
      location: 'North Campus, Near Sports Complex',
      contact: '+91 4288 274213',
      mapUrl: 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=K.S.R.+College+of+Engineering+Tiruchengode&zoom=17'
    },
    {
      name: 'Tiruchy Hostel',
      gender: 'Women',
      breakfast: '7:30 - 8:30 AM',
      lunch: '12:30 - 1:30 PM',
      dinner: '7:30 - 8:30 PM',
      facilities: ['WiFi', 'Hot Water', 'Laundry', '24/7 Security', 'Recreation Room'],
      location: 'South Campus, Near Library',
      contact: '+91 4288 274213',
      mapUrl: 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=K.S.R.+College+of+Engineering+Tiruchengode&zoom=17'
    }
  ];

  const transport = [
    { icon: Plane, name: 'Coimbatore Airport (CJB)', distance: '~80 km', time: '2-2.5 hrs by road' },
    { icon: Train, name: 'Erode Junction', distance: '~20 km', time: 'Major railway junction' },
    { icon: Bus, name: 'Erode Bus Stand', distance: '~20 km', time: 'Frequent buses available' },
  ];

  const hillStations = [
    { 
      name: 'Kolli Hills', 
      distance: '~40 km', 
      time: '1.5-2 hrs',
      description: 'Scenic hill station known for waterfalls and coffee plantations.',
      mapUrl: 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Kolli+Hills+Tamil+Nadu&zoom=12'
    },
    { 
      name: 'Yercaud', 
      distance: '~95 km', 
      time: '2.5-3 hrs',
      description: 'Charming hill station with coffee estates and Yercaud Lake.',
      mapUrl: 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Yercaud+Tamil+Nadu&zoom=12'
    },
    { 
      name: 'Kodaikanal', 
      distance: '~120 km', 
      time: '3.5-4 hrs',
      description: 'Popular hill station with stunning valleys, lakes and viewpoints.',
      mapUrl: 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Kodaikanal+Tamil+Nadu&zoom=12'
    },
    { 
      name: 'Ooty', 
      distance: '~160 km', 
      time: '4.5-5 hrs',
      description: 'Famous hill station known as the Queen of Hill Stations with tea gardens.',
      mapUrl: 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Ooty+Tamil+Nadu&zoom=12'
    },
  ];

  const placesToVisit = [
    {
      icon: '🏛',
      name: 'Ardhanareeswarar Temple',
      description: 'A historic Hindu temple located atop a hill.',
      distance: '~5 km',
      mapUrl: 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Ardhanareeswarar+Temple+Tiruchengode&zoom=15'
    },
    {
      icon: '🏛',
      name: 'Kailasanathar Temple',
      description: 'An ancient temple known for its Dravidian architecture.',
      distance: '~3 km',
      mapUrl: 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Kailasanathar+Temple+Tiruchengode&zoom=15'
    },
    {
      icon: '🏛',
      name: 'Sankagiri Fort',
      description: 'A historical fort with panoramic views.',
      distance: '~25 km',
      mapUrl: 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Sankagiri+Fort&zoom=15'
    },
    {
      icon: '🏛',
      name: 'Mettur Dam',
      description: 'An engineering marvel & scenic dam over the Cauvery, surrounded by hills and reservoir.',
      distance: '~45 km',
      mapUrl: 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Mettur+Dam&zoom=14'
    },
    {
      icon: '🏛',
      name: 'Kurumbapatti Zoological Park',
      description: 'Zoo and park in natural surroundings, good for wildlife & nature walk, ~10 km from Salem.',
      distance: '~35 km',
      mapUrl: 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Kurumbapatti+Zoological+Park+Salem&zoom=15'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Venue & Location</h1>
            <p className="text-xl text-white/90">K.S.R. College of Engineering, Tamil Nadu, India</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Venue Information */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-2xl shadow-xl mb-12">
            <div className="flex items-start space-x-4">
              <Info className="text-primary-600 flex-shrink-0" size={32} />
              <div>
                <h2 className="text-3xl font-bold mb-3 gradient-text">Venue Information</h2>
                <p className="text-xl text-gray-800 font-semibold mb-2">K.S.R. College of Engineering</p>
                <p className="text-gray-600">K.S.R. Kalvi Nagar, Tiruchengode – 637 215</p>
                <p className="text-gray-600">Namakkal District, Tamil Nadu, India</p>
                <p className="text-primary-600 mt-4">Phone: +91 4288 274213</p>
                <p className="text-primary-600">Email: principal@ksrce.ac.in</p>
              </div>
            </div>
          </motion.div>

          {/* Google Maps Section */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-2xl shadow-xl mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <MapPin className="text-primary-600" size={32} />
              <h2 className="text-3xl font-bold gradient-text">Location on Map</h2>
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-lg mb-6">
              <iframe 
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=K.S.R.+College+of+Engineering+Tiruchengode&zoom=15"
                width="100%" 
                height="450" 
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="K.S.R. College of Engineering Location"
              />
            </div>
            
            <div className="flex justify-center">
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=K.S.R.+College+of+Engineering,+Tiruchengode" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all"
              >
                <Navigation size={20} />
                <span className="font-semibold">Get Directions</span>
              </a>
            </div>
          </motion.div>

          {/* Event Schedule */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-2xl shadow-xl mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Clock className="text-primary-600" size={32} />
              <h2 className="text-3xl font-bold gradient-text">Event Schedule</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-primary-50 to-accent-50">
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Event Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Venue</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Time</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-800 font-medium">{event.name}</td>
                      <td className="px-6 py-4 text-gray-600">{event.venue}</td>
                      <td className="px-6 py-4 text-gray-600">{event.time}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="text-primary-600 hover:text-primary-700 font-semibold underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Hostel & Dining */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-2xl shadow-xl mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Utensils className="text-accent-600" size={32} />
              <h2 className="text-3xl font-bold gradient-text">Hostel & Dining</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-accent-50 to-purple-50">
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Hostel Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Breakfast</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Lunch</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Dinner</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {hostels.map((hostel, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800">{hostel.name}</div>
                        <div className="text-sm text-gray-500">({hostel.gender})</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{hostel.breakfast}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{hostel.lunch}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{hostel.dinner}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedHostel(hostel)}
                          className="text-accent-600 hover:text-accent-700 font-semibold underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* How to Get There */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-primary-50 to-accent-50 p-8 rounded-2xl shadow-xl mb-12">
            <h2 className="text-3xl font-bold mb-6 gradient-text text-center">How to Get There</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {transport.map((item, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }} className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
                  <item.icon className="mx-auto text-primary-600 mb-4" size={48} />
                  <h3 className="font-bold text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.distance}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Accommodation */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl shadow-xl mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <Hotel className="text-accent-600" size={40} />
              <h3 className="text-2xl font-bold text-gray-800">Accommodation</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Recommended hotels available in Erode and Tiruchengode. Hostel accommodation also available on campus (based on request).
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://www.makemytrip.com/hotels/erode-hotels.html" target="_blank" rel="noopener noreferrer"
                className="px-6 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors">
                Hotels in Erode
              </a>
              <a href="https://www.makemytrip.com/hotels/tiruchengode-hotels.html" target="_blank" rel="noopener noreferrer"
                className="px-6 py-3 bg-accent-600 text-white rounded-full hover:bg-accent-700 transition-colors">
                Hotels in Tiruchengode
              </a>
            </div>
          </motion.div>

          {/* Places to Visit */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-2xl shadow-xl mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Mountain className="text-green-600" size={40} />
              <h3 className="text-2xl font-bold text-gray-800">Places to Visit</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Explore historical temples, forts, scenic spots, and beautiful hill stations near Tiruchengode. Click on any place to view its location on the map.
            </p>
            
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => { setActiveTab('attractions'); setSelectedLocationIndex(0); }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'attractions'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Nearby Attractions
              </button>
              <button
                onClick={() => { setActiveTab('hillstations'); setSelectedLocationIndex(0); }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'hillstations'
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Hill Stations
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Map on Left */}
              <div className="lg:w-1/2">
                <div className="sticky top-24">
                  <div className={`rounded-xl overflow-hidden shadow-lg border-4 ${
                    activeTab === 'attractions' ? 'border-purple-100' : 'border-green-100'
                  }`}>
                    <iframe 
                      src={activeTab === 'attractions' ? placesToVisit[selectedLocationIndex].mapUrl : hillStations[selectedLocationIndex].mapUrl}
                      width="100%" 
                      height="500" 
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${activeTab === 'attractions' ? placesToVisit[selectedLocationIndex].name : hillStations[selectedLocationIndex].name} Location`}
                      key={`${activeTab}-${selectedLocationIndex}`}
                    />
                  </div>
                  {activeTab === 'attractions' ? (
                    <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <div className="text-3xl">{placesToVisit[selectedLocationIndex].icon}</div>
                        <div>
                          <h5 className="font-bold text-gray-800 text-lg">{placesToVisit[selectedLocationIndex].name}</h5>
                          <p className="text-sm text-gray-600 mt-1">{placesToVisit[selectedLocationIndex].description}</p>
                          <p className="text-sm text-purple-600 font-semibold mt-2">{placesToVisit[selectedLocationIndex].distance}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Mountain className="text-white" size={24} />
                        </div>
                        <div>
                          <h5 className="font-bold text-gray-800 text-lg">{hillStations[selectedLocationIndex].name}</h5>
                          <p className="text-sm text-gray-600 mt-1">{hillStations[selectedLocationIndex].description}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <p className="text-sm text-green-600 font-semibold">{hillStations[selectedLocationIndex].distance}</p>
                            <p className="text-sm text-blue-600 font-semibold">{hillStations[selectedLocationIndex].time}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* List on Right */}
              <div className="lg:w-1/2 space-y-3">
                {activeTab === 'attractions' ? (
                  placesToVisit.map((place, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedLocationIndex(index)}
                      className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                        selectedLocationIndex === index
                          ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-400 shadow-lg transform scale-105'
                          : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl flex-shrink-0">{place.icon}</div>
                        <div className="flex-1">
                          <h5 className={`font-bold mb-1 ${
                            selectedLocationIndex === index ? 'text-purple-900' : 'text-gray-800'
                          }`}>{place.name}</h5>
                          <p className="text-xs text-gray-600 line-clamp-2">{place.description}</p>
                          <p className="text-xs font-semibold mt-1 ${
                            selectedLocationIndex === index ? 'text-purple-600' : 'text-gray-500'
                          }">{place.distance}</p>
                        </div>
                        {selectedLocationIndex === index && (
                          <div className="flex-shrink-0">
                            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  hillStations.map((station, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedLocationIndex(index)}
                      className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                        selectedLocationIndex === index
                          ? 'bg-gradient-to-r from-green-100 to-blue-100 border-green-400 shadow-lg transform scale-105'
                          : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Mountain className="text-white" size={20} />
                        </div>
                        <div className="flex-1">
                          <h5 className={`font-bold mb-1 ${
                            selectedLocationIndex === index ? 'text-green-900' : 'text-gray-800'
                          }`}>{station.name}</h5>
                          <p className="text-xs text-gray-600 line-clamp-1">{station.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs font-semibold ${
                              selectedLocationIndex === index ? 'text-green-600' : 'text-gray-500'
                            }">{station.distance}</p>
                            <span className="text-xs text-gray-400">•</span>
                            <p className="text-xs font-semibold ${
                              selectedLocationIndex === index ? 'text-blue-600' : 'text-gray-500'
                            }">{station.time}</p>
                          </div>
                        </div>
                        {selectedLocationIndex === index && (
                          <div className="flex-shrink-0">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl">
              <p className="text-sm text-gray-700 text-center">
                <strong>Note:</strong> Tours arranged based on participant willingness. Minimum number of participants required. Contact organizers for more details.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{selectedEvent.name}</h3>
                  <p className="text-gray-600 mt-1">{selectedEvent.venue} • {selectedEvent.time}</p>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">{selectedEvent.description}</p>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Location:</strong> {selectedEvent.location}
                </p>
                <div className="rounded-xl overflow-hidden shadow-lg mb-4">
                  <iframe 
                    src={selectedEvent.mapUrl}
                    width="100%" 
                    height="300" 
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${selectedEvent.name} Location`}
                  />
                </div>
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=K.S.R.+College+of+Engineering,+Tiruchengode`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-full hover:shadow-lg transition-all"
                >
                  <Navigation size={20} />
                  <span>Get Directions</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hostel Details Modal */}
      <AnimatePresence>
        {selectedHostel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedHostel(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{selectedHostel.name}</h3>
                  <p className="text-gray-600 mt-1">{selectedHostel.gender} Hostel</p>
                </div>
                <button
                  onClick={() => setSelectedHostel(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Breakfast</p>
                    <p className="font-semibold text-gray-800">{selectedHostel.breakfast}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Lunch</p>
                    <p className="font-semibold text-gray-800">{selectedHostel.lunch}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Dinner</p>
                    <p className="font-semibold text-gray-800">{selectedHostel.dinner}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="font-bold text-gray-800 mb-2">Facilities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedHostel.facilities.map((facility: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm">
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Location:</strong> {selectedHostel.location}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Contact:</strong> {selectedHostel.contact}
                </p>
                <div className="rounded-xl overflow-hidden shadow-lg mb-4">
                  <iframe 
                    src={selectedHostel.mapUrl}
                    width="100%" 
                    height="300" 
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${selectedHostel.name} Location`}
                  />
                </div>
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=K.S.R.+College+of+Engineering,+Tiruchengode`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-accent-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all"
                >
                  <Navigation size={20} />
                  <span>Get Directions</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
