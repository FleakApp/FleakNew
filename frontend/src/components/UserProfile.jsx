import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Users, Heart, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import PostCard from './PostCard';
import { mockUsers, mockPosts } from '../data/mockData';

const UserProfile = () => {
  const { username } = useParams();
  const user = mockUsers.find(u => u.username === username) || mockUsers[0];
  const userPosts = mockPosts.filter(p => p.author.username === user.username);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <img
            src={user.avatar}
            alt={user.username}
            className="w-24 h-24 rounded-full"
          />
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
            {user.bio && (
              <p className="text-gray-600 mt-1">{user.bio}</p>
            )}
            
            <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{user.followers} followers</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>{user.upvotesReceived} upvotes received</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={handleFollow}
              className={isFollowing ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-blue-600 hover:bg-blue-700 text-white'}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
            <Button variant="outline">
              Message
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">Posts ({userPosts.length})</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="upvoted">Upvoted</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="space-y-6 mt-6">
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No posts yet</p>
              <p className="text-sm mt-1">Start sharing some awesome content!</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="comments" className="mt-6">
          <div className="text-center py-12 text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No comments to show</p>
          </div>
        </TabsContent>
        
        <TabsContent value="upvoted" className="mt-6">
          <div className="text-center py-12 text-gray-500">
            <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No upvoted posts to show</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;