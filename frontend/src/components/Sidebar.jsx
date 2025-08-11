import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, BarChart3, Clock, MessageCircle } from 'lucide-react';
import { categories, interests } from '../data/mockData';

const Sidebar = () => {
  const location = useLocation();
  
  const navigationItems = [
    { id: 'home', name: 'Home', icon: Home, path: '/' },
    { id: 'top', name: 'Top', icon: TrendingUp, path: '/top' },
    { id: 'trending', name: 'Trending', icon: BarChart3, path: '/trending' },
    { id: 'fresh', name: 'Fresh', icon: Clock, path: '/fresh' },
    { id: 'ask9gag', name: 'Ask 9GAG', icon: MessageCircle, path: '/ask' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-16 overflow-y-auto">
      <div className="p-4">
        {/* Main Navigation */}
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* New to 9GAG Section */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">New to 9GAG?</h3>
          <p className="text-sm text-gray-600 mb-3">Sign up now to see more content!</p>
          <Link
            to="/signup"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Sign up
          </Link>
        </div>

        {/* Interests Section */}
        <div className="mt-8">
          <h3 className="font-semibold text-gray-900 mb-4">Interests</h3>
          <div className="space-y-2">
            {interests.map((interest) => (
              <Link
                key={interest.id}
                to={`/${interest.id}`}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <div className={`w-4 h-4 rounded ${interest.color}`}></div>
                <span>{interest.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;