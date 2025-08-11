// Mock data for 9GAG clone

export const mockUsers = [
  {
    id: '1',
    username: 'memeLord42',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    bio: 'Professional meme connoisseur',
    followers: 1234,
    following: 567,
    upvotesReceived: 5432,
    joinDate: '2022-01-15'
  },
  {
    id: '2',
    username: 'funnyGal2024',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612c44b?w=100&h=100&fit=crop&crop=face',
    bio: 'Spreading joy one meme at a time',
    followers: 892,
    following: 234,
    upvotesReceived: 3210,
    joinDate: '2023-03-20'
  },
  {
    id: '3',
    username: 'catLover99',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    bio: 'Cats are my spirit animal',
    followers: 2341,
    following: 123,
    upvotesReceived: 7890,
    joinDate: '2021-08-10'
  }
];

export const mockPosts = [
  {
    id: '1',
    title: 'When you finally understand a math problem after staring at it for 2 hours',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    category: 'funny',
    tags: ['math', 'student', 'relatable'],
    author: mockUsers[0],
    upvotes: 1523,
    downvotes: 45,
    score: 1478,
    comments: 127,
    views: 15234,
    createdAt: '2025-01-10T10:30:00Z',
    nsfw: false
  },
  {
    id: '2',
    title: 'My cat when I try to work from home',
    mediaType: 'gif',
    mediaUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop',
    category: 'animals',
    tags: ['cat', 'work', 'home', 'funny'],
    author: mockUsers[2],
    upvotes: 2341,
    downvotes: 23,
    score: 2318,
    comments: 89,
    views: 23451,
    createdAt: '2025-01-10T08:15:00Z',
    nsfw: false
  },
  {
    id: '3',
    title: 'Gaming setup evolution over the years',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=400&fit=crop',
    category: 'gaming',
    tags: ['gaming', 'setup', 'evolution', 'nostalgia'],
    author: mockUsers[1],
    upvotes: 987,
    downvotes: 67,
    score: 920,
    comments: 203,
    views: 12987,
    createdAt: '2025-01-10T06:45:00Z',
    nsfw: false
  },
  {
    id: '4',
    title: 'When someone asks if you want food',
    mediaType: 'gif',
    mediaUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop',
    category: 'food',
    tags: ['food', 'hungry', 'relatable'],
    author: mockUsers[0],
    upvotes: 3421,
    downvotes: 34,
    score: 3387,
    comments: 156,
    views: 34210,
    createdAt: '2025-01-09T20:20:00Z',
    nsfw: false
  },
  {
    id: '5',
    title: 'Monday morning motivation',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
    category: 'awesome',
    tags: ['motivation', 'monday', 'inspiration'],
    author: mockUsers[1],
    upvotes: 876,
    downvotes: 91,
    score: 785,
    comments: 67,
    views: 8760,
    createdAt: '2025-01-09T18:10:00Z',
    nsfw: false
  }
];

export const mockComments = [
  {
    id: '1',
    postId: '1',
    userId: '2',
    author: mockUsers[1],
    text: 'This is so relatable! 😂',
    upvotes: 45,
    downvotes: 2,
    score: 43,
    replies: [],
    createdAt: '2025-01-10T11:00:00Z'
  },
  {
    id: '2',
    postId: '1',
    userId: '3',
    author: mockUsers[2],
    text: 'Math was never my strong suit lol',
    upvotes: 23,
    downvotes: 1,
    score: 22,
    replies: [
      {
        id: '2a',
        userId: '1',
        author: mockUsers[0],
        text: 'Same here! But we get there eventually',
        upvotes: 12,
        downvotes: 0,
        score: 12,
        createdAt: '2025-01-10T11:15:00Z'
      }
    ],
    createdAt: '2025-01-10T10:45:00Z'
  }
];

export const categories = [
  { id: 'home', name: 'Home', icon: 'Home' },
  { id: 'hot', name: 'Hot', icon: 'TrendingUp' },
  { id: 'trending', name: 'Trending', icon: 'BarChart3' },
  { id: 'fresh', name: 'Fresh', icon: 'Clock' },
  { id: 'ask9gag', name: 'Ask 9GAG', icon: 'MessageCircle' }
];

export const interests = [
  { id: 'usa', name: 'USA', color: 'bg-blue-500' },
  { id: 'oldmeme', name: 'Old Meme', color: 'bg-gray-600' },
  { id: 'anime', name: 'Anime & Manga', color: 'bg-red-500' },
  { id: 'news', name: 'Latest News', color: 'bg-green-500' },
  { id: 'humor', name: 'Humor', color: 'bg-purple-500' },
  { id: 'memes', name: 'Memes', color: 'bg-purple-600' },
  { id: 'politics', name: 'Politics', color: 'bg-blue-600' },
  { id: 'gaming', name: 'Gaming', color: 'bg-orange-500' },
  { id: 'wtf', name: 'WTF', color: 'bg-pink-500' },
  { id: 'relationship', name: 'Relationship & Dating', color: 'bg-red-400' },
  { id: 'music', name: 'Music', color: 'bg-blue-400' }
];

export const feedSections = [
  'Hot',
  'Trending', 
  'Fresh'
];