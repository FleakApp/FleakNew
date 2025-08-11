import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Header = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left section */}
        <div className="flex items-center space-x-6">
          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">9GAG</span>
          </Link>
          
          {/* Navigation items - hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-4 text-sm">
            <Link to="/shuffle" className="text-gray-600 hover:text-gray-900 transition-colors">
              🔀 Shuffle
            </Link>
            <Link to="/app" className="text-gray-600 hover:text-gray-900 transition-colors">
              📱 Get App
            </Link>
            <Link to="/memeland" className="text-gray-600 hover:text-gray-900 transition-colors">
              🎭 Memeland
            </Link>
            <Link to="/moonit" className="text-gray-600 hover:text-gray-900 transition-colors">
              🌙 Moonit
            </Link>
            <Link to="/local" className="text-gray-600 hover:text-gray-900 transition-colors">
              📍 Local
            </Link>
            <Link to="/nsfw" className="text-gray-600 hover:text-gray-900 transition-colors">
              🔞 NSFW
            </Link>
          </nav>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search..."
              className={`pl-10 w-48 transition-all duration-200 ${
                isSearchFocused ? 'w-64' : ''
              }`}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
          
          {/* Search icon for mobile */}
          <Button variant="ghost" size="sm" className="sm:hidden">
            <Search className="h-5 w-5" />
          </Button>
          
          {/* Auth buttons */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-gray-600">
              Sign Up/Log In
            </Button>
            <Button variant="ghost" size="sm">
              <User className="h-5 w-5" />
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Post
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;