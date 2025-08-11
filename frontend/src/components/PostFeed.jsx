import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';
import { mockPosts } from '../data/mockData';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

const PostFeed = ({ section = 'Hot' }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Simulate initial load
    setLoading(true);
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 500);
  }, [section]);

  const loadMorePosts = () => {
    if (loading) return;
    
    setLoading(true);
    setTimeout(() => {
      // Simulate loading more posts by duplicating with new IDs
      const newPosts = mockPosts.map((post, index) => ({
        ...post,
        id: `${post.id}_${Date.now()}_${index}`,
        createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString()
      }));
      setPosts(prev => [...prev, ...newPosts]);
      setLoading(false);
      
      // Simulate ending after 3 loads
      if (posts.length > 20) {
        setHasMore(false);
      }
    }, 1000);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) {
        return;
      }
      if (hasMore) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, posts.length]);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Section Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 p-4">
        <h1 className="text-2xl font-bold text-gray-900">{section}</h1>
        <p className="text-sm text-gray-600 mt-1">
          {section === 'Hot' && 'Most upvoted posts'}
          {section === 'Trending' && 'Recently popular content'}
          {section === 'Fresh' && 'Newest uploads'}
        </p>
      </div>

      {/* Posts */}
      <div className="space-y-6 p-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        
        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}
        
        {/* Load more button for mobile */}
        {!loading && hasMore && (
          <div className="flex justify-center py-4">
            <Button 
              onClick={loadMorePosts}
              variant="outline"
              className="w-full max-w-sm"
            >
              Load More Posts
            </Button>
          </div>
        )}
        
        {/* End of feed */}
        {!hasMore && (
          <div className="text-center py-8 text-gray-500">
            <p>You've reached the end! 🎉</p>
            <p className="text-sm mt-2">Check back later for more content</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostFeed;