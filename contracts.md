# 9GAG Clone API Contracts & Integration Plan

## Mock Data to Replace

**Currently in `/app/frontend/src/data/mockData.js`:**
- `mockUsers`: User profiles with avatar, bio, followers, etc.
- `mockPosts`: Posts with media, voting scores, comments count
- `mockComments`: Comments with replies and voting
- `categories`: Navigation categories
- `interests`: Category interests with colors

## API Endpoints to Implement

### Authentication (`/api/auth`)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Posts (`/api/posts`)
- `GET /api/posts` - Get posts with pagination & filters (section: hot/trending/fresh, category)
- `GET /api/posts/:id` - Get single post with details
- `POST /api/posts` - Create new post (authenticated)
- `DELETE /api/posts/:id` - Delete post (owner only)

### Voting (`/api/votes`)
- `POST /api/votes` - Upvote/downvote post (body: {postId, voteType: 'up'/'down'})
- `DELETE /api/votes/:postId` - Remove vote

### Comments (`/api/comments`)
- `GET /api/comments/:postId` - Get comments for post
- `POST /api/comments` - Add comment (body: {postId, text, parentId?})
- `POST /api/comments/:id/vote` - Vote on comment

### Users (`/api/users`)
- `GET /api/users/:username` - Get user profile
- `GET /api/users/:username/posts` - Get user's posts
- `PUT /api/users/profile` - Update profile (authenticated)

### Upload (`/api/upload`)
- `POST /api/upload/media` - Upload media files (images/GIFs/videos)

### Search (`/api/search`)
- `GET /api/search?q=query&type=posts/users` - Search posts and users

## Database Schema (MongoDB)

### Users Collection
```js
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique), 
  passwordHash: String,
  avatar: String (URL),
  bio: String,
  followers: Number,
  following: Number,
  upvotesReceived: Number,
  joinDate: Date,
  isActive: Boolean
}
```

### Posts Collection
```js
{
  _id: ObjectId,
  title: String,
  mediaType: String ('image'/'gif'/'video'),
  mediaUrl: String,
  category: String,
  tags: [String],
  authorId: ObjectId (ref Users),
  upvotes: Number,
  downvotes: Number,
  score: Number,
  commentCount: Number,
  views: Number,
  nsfw: Boolean,
  createdAt: Date
}
```

### Votes Collection
```js
{
  _id: ObjectId,
  userId: ObjectId (ref Users),
  postId: ObjectId (ref Posts),
  voteType: String ('up'/'down'),
  createdAt: Date
}
```

### Comments Collection
```js
{
  _id: ObjectId,
  postId: ObjectId (ref Posts),
  userId: ObjectId (ref Users),
  text: String,
  parentId: ObjectId (ref Comments, null for top-level),
  upvotes: Number,
  downvotes: Number,
  score: Number,
  createdAt: Date
}
```

## Frontend Integration Changes

### Replace Mock Data:
1. **PostFeed.jsx**: Replace `mockPosts` with API call to `/api/posts`
2. **PostCard.jsx**: Replace vote simulation with API calls to `/api/votes`
3. **PostDetail.jsx**: Replace `mockComments` with API call to `/api/comments/:postId`
4. **UserProfile.jsx**: Replace `mockUsers` with API call to `/api/users/:username`
5. **UploadPage.jsx**: Replace simulation with actual upload to `/api/upload/media` then `/api/posts`
6. **AuthPage.jsx**: Replace simulation with actual API calls to `/api/auth/login|register`

### Add Auth Context:
- Create `AuthContext` for managing user state
- Add protected routes for upload, profile editing
- Store JWT token in localStorage
- Add axios interceptors for auth headers

### Environment Variables:
- Use existing `REACT_APP_BACKEND_URL` for all API calls
- Backend will use existing `MONGO_URL` for database connection

## Implementation Priority:
1. Auth system (register, login, JWT)
2. Posts CRUD with media upload
3. Voting system
4. Comments system
5. User profiles
6. Search functionality
7. Real-time features (optional)

## File Upload Strategy:
- Use Cloudinary for media storage (images, GIFs, videos)
- Upload process: Frontend -> Backend -> Cloudinary -> Save URL to MongoDB
- File size limits: Images 5MB, Videos/GIFs 10MB