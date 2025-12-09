import { useState, useEffect } from 'react';
import Logo from '../../assets/xdrive.png';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storeUrl, setStoreUrl] = useState('#download');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const getStoreUrl = () => {
      const userAgent =
        navigator.userAgent || navigator.vendor || (window as any).opera;

      if (/android/i.test(userAgent)) {
        return 'https://play.google.com/store/apps/details?id=com.xdrive.app';
      }
      if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
        return 'https://apps.apple.com/us/app/xdrive/id123456789';
      }
      return '#download';
    };

    setStoreUrl(getStoreUrl());
  }, []);

  const handleDownloadClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (storeUrl === '#download') {
      e.preventDefault();
      const element = document.getElementById('download');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-(--color-primary)/95 backdrop-blur-md shadow-md py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="XDRIVE" className="h-8 md:h-10 w-auto" />
            <span className="text-xl md:text-2xl font-extrabold tracking-tight">
              XDRIVE
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Services
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Features
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              About
            </a>
            <a
              href={storeUrl}
              onClick={handleDownloadClick}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer"
            >
              Download App
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-8 w-8" />
            ) : (
              <Bars3Icon className="h-8 w-8" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#0A2647] border-t border-white/10 shadow-xl py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
            <a
              href="#"
              className="text-gray-300 hover:text-white py-2 border-b border-white/5"
            >
              Services
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white py-2 border-b border-white/5"
            >
              Features
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white py-2 border-b border-white/5"
            >
              About
            </a>
            <a
              href={storeUrl}
              onClick={handleDownloadClick}
              className="bg-blue-600 text-white py-3 rounded-xl text-center font-medium mt-2"
            >
              Download App
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
