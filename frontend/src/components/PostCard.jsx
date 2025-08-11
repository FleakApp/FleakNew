import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown, MessageCircle, Share2, Eye, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';

const PostCard = ({ post }) => {
  const [userVote, setUserVote] = useState(null); // null, 'up', or 'down'
  const [currentScore, setCurrentScore] = useState(post.score);

  const handleVote = (voteType) => {
    if (userVote === voteType) {
      // Remove vote
      setUserVote(null);
      setCurrentScore(post.score);
    } else {
      // Add vote
      setUserVote(voteType);
      if (voteType === 'up') {
        setCurrentScore(post.score + 1);
      } else {
        setCurrentScore(post.score - 1);
      }
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <img
            src={post.author.avatar}
            alt={post.author.username}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <Link
              to={`/u/${post.author.username}`}
              className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
            >
              {post.author.username}
            </Link>
            <div className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Post Content */}
      <Link to={`/gag/${post.id}`} className="block">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 leading-tight">
            {post.title}
          </h2>
        </div>
        
        {/* Media */}
        <div className="relative">
          <img
            src={post.mediaUrl}
            alt={post.title}
            className="w-full h-auto max-h-96 object-cover"
            loading="lazy"
          />
          {post.mediaType === 'gif' && (
            <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-medium">
              GIF
            </div>
          )}
        </div>
      </Link>

      {/* Post Actions */}
      <div className="flex items-center justify-between p-4">
        {/* Vote buttons */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVote('up')}
            className={`p-2 ${
              userVote === 'up' ? 'text-green-600 bg-green-50' : 'text-gray-500 hover:text-green-600'
            }`}
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
          <span className={`font-medium px-2 ${
            currentScore > 0 ? 'text-green-600' : currentScore < 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
            {formatNumber(currentScore)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVote('down')}
            className={`p-2 ${
              userVote === 'down' ? 'text-red-600 bg-red-50' : 'text-gray-500 hover:text-red-600'
            }`}
          >
            <ChevronDown className="h-5 w-5" />
          </Button>
        </div>

        {/* Other actions */}
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <Link
            to={`/gag/${post.id}#comments`}
            className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{formatNumber(post.comments)}</span>
          </Link>
          <Button variant="ghost" size="sm" className="p-1 hover:text-gray-700">
            <Share2 className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span>{formatNumber(post.views)}</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Link
                key={index}
                to={`/tag/${tag}`}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default PostCard;