import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronUp, ChevronDown, MessageCircle, Share2, Eye, Heart, Reply } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { mockPosts, mockComments } from '../data/mockData';

const PostDetail = () => {
  const { postId } = useParams();
  const post = mockPosts.find(p => p.id === postId) || mockPosts[0];
  
  const [userVote, setUserVote] = useState(null);
  const [currentScore, setCurrentScore] = useState(post.score);
  const [comments, setComments] = useState(mockComments.filter(c => c.postId === post.id));
  const [newComment, setNewComment] = useState('');

  const handleVote = (voteType) => {
    if (userVote === voteType) {
      setUserVote(null);
      setCurrentScore(post.score);
    } else {
      setUserVote(voteType);
      setCurrentScore(voteType === 'up' ? post.score + 1 : post.score - 1);
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        postId: post.id,
        userId: '1',
        author: { username: 'currentUser', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
        text: newComment,
        upvotes: 0,
        downvotes: 0,
        score: 0,
        replies: [],
        createdAt: new Date().toISOString()
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Post Content */}
        <div className="lg:col-span-2">
          <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Post Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <Link
                    to={`/u/${post.author.username}`}
                    className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {post.author.username}
                  </Link>
                  <div className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Post Title */}
            <div className="p-4">
              <h1 className="text-xl font-bold text-gray-900 leading-tight">
                {post.title}
              </h1>
            </div>

            {/* Media */}
            <div className="relative">
              <img
                src={post.mediaUrl}
                alt={post.title}
                className="w-full h-auto max-h-screen object-cover"
              />
              {post.mediaType === 'gif' && (
                <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-medium">
                  GIF
                </div>
              )}
            </div>

            {/* Post Actions */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
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

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{formatNumber(comments.length)}</span>
                </div>
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

          {/* Comments Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Comments ({comments.length})
              </h2>
            </div>

            {/* Add Comment */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                  alt="Current user"
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <Button 
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      size="sm"
                    >
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="divide-y divide-gray-100">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4">
                  <div className="flex items-start space-x-3">
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Link
                          to={`/u/${comment.author.username}`}
                          className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-sm"
                        >
                          {comment.author.username}
                        </Link>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-800 mb-2">{comment.text}</p>
                      
                      {/* Comment Actions */}
                      <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm" className="p-1 h-auto">
                            <ChevronUp className="h-3 w-3" />
                          </Button>
                          <span className="text-gray-600">{comment.score}</span>
                          <Button variant="ghost" size="sm" className="p-1 h-auto">
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm" className="p-1 h-auto text-gray-500 hover:text-gray-700">
                          <Reply className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                      </div>

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 ml-4 space-y-3">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex items-start space-x-3">
                              <img
                                src={reply.author.avatar}
                                alt={reply.author.username}
                                className="w-6 h-6 rounded-full"
                              />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Link
                                    to={`/u/${reply.author.username}`}
                                    className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-xs"
                                  >
                                    {reply.author.username}
                                  </Link>
                                  <span className="text-xs text-gray-500">
                                    {new Date(reply.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-gray-800 text-sm">{reply.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Related Posts</h3>
            <div className="space-y-3">
              {mockPosts.filter(p => p.id !== post.id).slice(0, 3).map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/gag/${relatedPost.id}`}
                  className="block hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <div className="flex space-x-3">
                    <img
                      src={relatedPost.mediaUrl}
                      alt={relatedPost.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatNumber(relatedPost.score)} points
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;