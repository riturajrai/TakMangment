"use client";

import Link from 'next/link';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Github,
  Mail,
  Phone,
  MapPin,
  Send,
  Heart
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">TaskFlow</span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Advanced task management for modern teams. Streamline workflows, enhance collaboration, and boost productivity with our intelligent platform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors p-2 bg-slate-800 rounded-lg hover:bg-indigo-600">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors p-2 bg-slate-800 rounded-lg hover:bg-sky-500">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors p-2 bg-slate-800 rounded-lg hover:bg-pink-600">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors p-2 bg-slate-800 rounded-lg hover:bg-blue-700">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-3">
              {["features", "pricing", "integrations", "updates", "demo"].map((path) => (
                <li key={path}>
                  <Link href={`/${path}`} className="text-slate-400 hover:text-white transition-colors text-sm">
                    {path.charAt(0).toUpperCase() + path.slice(1)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-3">
              {["documentation", "blog", "webinars", "guides", "support"].map((path) => (
                <li key={path}>
                  <Link href={`/${path}`} className="text-slate-400 hover:text-white transition-colors text-sm">
                    {path.charAt(0).toUpperCase() + path.slice(1).replace("-", " ")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Stay Updated</h3>
            <p className="text-slate-400 mb-4 text-sm">
              Subscribe to our newsletter for the latest updates and features.
            </p>
            
            <form className="mb-6">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-1 px-4 py-2 rounded-l-lg bg-slate-800 border border-r-0 border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  required
                  suppressHydrationWarning
                />
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-r-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center"
                  suppressHydrationWarning
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Subscribe</span>
                </button>
              </div>
            </form>

            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-indigo-400 mr-2" />
                <span className="text-slate-400 text-sm">contact@taskflow.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-indigo-400 mr-2" />
                <span className="text-slate-400 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-indigo-400 mr-2 mt-0.5" />
                <span className="text-slate-400 text-sm">123 Innovation Drive<br />San Francisco, CA 94107</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex items-center space-x-2 text-slate-500 text-sm">
              <span suppressHydrationWarning>
                © {new Date().getFullYear()} TaskFlow, Inc. All rights reserved.
              </span>
              <span className="hidden md:inline">•</span>
              <div className="flex items-center mt-2 md:mt-0">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-500 mx-1" />
                <span>by the TaskFlow team</span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-6">
              {["privacy", "terms", "cookies"].map((path) => (
                <Link key={path} href={`/${path}`} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                  {path.charAt(0).toUpperCase() + path.slice(1)} {path === "cookies" ? "Policy" : ""}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
