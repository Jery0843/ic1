'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Globe, Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Logo Section - Left Side */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative inline-block">
                <Image
                  src="/ksrlogonew-nobg.png"
                  alt="K.S.R College Logo"
                  width={160}
                  height={160}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Footer Content Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About K.S.R College */}
          <div>
            <h3 className="text-xl font-bold mb-4 gradient-text">K.S.R College of Engineering</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Empowering students with advanced tools to improve their skills and career outcomes.
            </p>
            <div className="flex space-x-4">
              <a href="https://x.com/ksrceofficial" target="_blank" rel="noopener noreferrer" 
                className="text-gray-300 hover:text-primary-400 transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://in.linkedin.com/school/ksrce-official/" target="_blank" rel="noopener noreferrer" 
                className="text-gray-300 hover:text-primary-400 transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="https://www.facebook.com/share/12LqWyZxAuD/" target="_blank" rel="noopener noreferrer" 
                className="text-gray-300 hover:text-primary-400 transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/ksrce_official" target="_blank" rel="noopener noreferrer" 
                className="text-gray-300 hover:text-primary-400 transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link href="/agenda" className="text-gray-300 hover:text-primary-400 transition-colors">Agenda</Link></li>
              <li><Link href="/speakers" className="text-gray-300 hover:text-primary-400 transition-colors">Speakers</Link></li>
              <li><Link href="/tracks" className="text-gray-300 hover:text-primary-400 transition-colors">Tracks</Link></li>
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Important</h3>
            <ul className="space-y-2">
              <li><Link href="/journal" className="text-gray-300 hover:text-primary-400 transition-colors">Publications</Link></li>
              <li><Link href="/fees" className="text-gray-300 hover:text-primary-400 transition-colors">Registration Fees</Link></li>
              <li><Link href="/venue" className="text-gray-300 hover:text-primary-400 transition-colors">Venue</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-primary-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin size={18} className="text-primary-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300">K.S.R. College of Engineering, Tiruchengode – 637 215, Tamil Nadu, India</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={18} className="text-primary-400 flex-shrink-0" />
                <span className="text-gray-300">+91 4288 274213</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={18} className="text-primary-400 flex-shrink-0" />
                <span className="text-gray-300">principal@ksrce.ac.in</span>
              </li>
              <li className="flex items-center space-x-2">
                <Globe size={18} className="text-primary-400 flex-shrink-0" />
                <a href="https://ksrce.ac.in" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary-400 transition-colors">
                  ksrce.ac.in
                </a>
              </li>
            </ul>
          </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2026 FUSION-SDG Conference. All rights reserved.</p>
          <p className="mt-2">
            Organized by K.S.R. College of Engineering in collaboration with UTHM Malaysia and SR University India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
