'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={` sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg text-blue-900' : 'bg-gradient-to-r from-blue-600 to-blue-800 text-white'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span className="text-xl font-bold">DocConnect</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-6">
            <div className="flex space-x-4">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`px-2 py-1 text-sm font-medium rounded-md transition whitespace-nowrap ${pathname === item.path ? 'font-semibold underline underline-offset-4' : 'hover:opacity-80'}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            <div className="ml-4 flex items-center space-x-2">
              <Link 
                href="/login" 
                className="px-3 py-1.5 text-sm font-medium rounded-md hover:bg-blue-700 hover:bg-opacity-20 transition whitespace-nowrap"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="px-3 py-1.5 text-sm font-medium bg-white text-blue-600 rounded-md hover:bg-blue-50 transition whitespace-nowrap"
              >
                Sign Up
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === item.path ? 'bg-blue-700 text-white' : 'hover:bg-blue-50 hover:text-blue-800'}`}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-200">
            <Link 
              href="/login" 
              className="block w-full px-4 py-2 text-center rounded-md text-base font-medium hover:bg-blue-50 hover:text-blue-800 mb-2"
            >
              Login
            </Link>
            <Link 
              href="/register" 
              className="block w-full px-4 py-2 text-center bg-blue-600 text-white rounded-md hover:bg-blue-700 text-base font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}