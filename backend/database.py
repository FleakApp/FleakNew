from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from bson import ObjectId
from typing import Optional, List, Dict, Any
from datetime import datetime
import os

# Database connection (using existing setup)
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Collections
users_collection = db.users
posts_collection = db.posts
votes_collection = db.votes
comments_collection = db.comments

class DatabaseManager:
    """Database operations manager"""
    
    @staticmethod
    def serialize_doc(doc: Dict[str, Any]) -> Dict[str, Any]:
        """Convert MongoDB document to JSON serializable format"""
        if doc is None:
            return None
        if '_id' in doc:
            doc['id'] = str(doc['_id'])
            del doc['_id']
        return doc

    @staticmethod
    def serialize_docs(docs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Convert list of MongoDB documents to JSON serializable format"""
        return [DatabaseManager.serialize_doc(doc) for doc in docs]

    # User operations
    async def create_user(self, user_data: dict) -> dict:
        """Create a new user"""
        user_data['_id'] = ObjectId()
        user_data['joinDate'] = datetime.utcnow()
        user_data['followers'] = 0
        user_data['following'] = 0
        user_data['upvotesReceived'] = 0
        user_data['isActive'] = True
        
        result = await users_collection.insert_one(user_data)
        return await self.get_user_by_id(str(result.inserted_id))

    async def get_user_by_email(self, email: str) -> Optional[dict]:
        """Get user by email"""
        user = await users_collection.find_one({"email": email})
        return self.serialize_doc(user)

    async def get_user_by_username(self, username: str) -> Optional[dict]:
        """Get user by username"""
        user = await users_collection.find_one({"username": username})
        return self.serialize_doc(user)

    async def get_user_by_id(self, user_id: str) -> Optional[dict]:
        """Get user by ID"""
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        return self.serialize_doc(user)

    async def update_user(self, user_id: str, update_data: dict) -> Optional[dict]:
        """Update user data"""
        await users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        return await self.get_user_by_id(user_id)

    # Post operations
    async def create_post(self, post_data: dict) -> dict:
        """Create a new post"""
        post_data['_id'] = ObjectId()
        post_data['upvotes'] = 0
        post_data['downvotes'] = 0
        post_data['score'] = 0
        post_data['commentCount'] = 0
        post_data['views'] = 0
        post_data['createdAt'] = datetime.utcnow()
        
        result = await posts_collection.insert_one(post_data)
        return await self.get_post_by_id(str(result.inserted_id))

    async def get_post_by_id(self, post_id: str) -> Optional[dict]:
        """Get post by ID with author info"""
        pipeline = [
            {"$match": {"_id": ObjectId(post_id)}},
            {"$lookup": {
                "from": "users",
                "localField": "authorId",
                "foreignField": "_id",
                "as": "author"
            }},
            {"$unwind": "$author"}
        ]
        
        result = await posts_collection.aggregate(pipeline).to_list(1)
        if result:
            post = result[0]
            post = self.serialize_doc(post)
            post['author'] = self.serialize_doc(post['author'])
            return post
        return None

    async def get_posts(self, skip: int = 0, limit: int = 10, section: str = "hot", category: Optional[str] = None) -> tuple:
        """Get posts with pagination and filtering"""
        match_query = {}
        if category:
            match_query["category"] = category

        # Sort based on section
        sort_criteria = {}
        if section == "hot":
            sort_criteria = {"score": -1, "createdAt": -1}
        elif section == "trending":
            sort_criteria = {"createdAt": -1, "score": -1}  # Recent posts with good scores
        elif section == "fresh":
            sort_criteria = {"createdAt": -1}
        else:
            sort_criteria = {"score": -1, "createdAt": -1}

        pipeline = [
            {"$match": match_query},
            {"$lookup": {
                "from": "users",
                "localField": "authorId",
                "foreignField": "_id",
                "as": "author"
            }},
            {"$unwind": "$author"},
            {"$sort": sort_criteria},
            {"$skip": skip},
            {"$limit": limit + 1}  # Get one extra to check if there are more
        ]

        posts = await posts_collection.aggregate(pipeline).to_list(limit + 1)
        has_more = len(posts) > limit
        if has_more:
            posts = posts[:-1]  # Remove the extra post

        # Get total count
        total = await posts_collection.count_documents(match_query)

        serialized_posts = []
        for post in posts:
            post = self.serialize_doc(post)
            post['author'] = self.serialize_doc(post['author'])
            serialized_posts.append(post)

        return serialized_posts, has_more, total

    async def increment_post_views(self, post_id: str):
        """Increment post view count"""
        await posts_collection.update_one(
            {"_id": ObjectId(post_id)},
            {"$inc": {"views": 1}}
        )

    # Vote operations
    async def create_or_update_vote(self, user_id: str, post_id: str, vote_type: str) -> dict:
        """Create or update a vote"""
        vote_data = {
            "userId": ObjectId(user_id),
            "postId": ObjectId(post_id),
            "voteType": vote_type,
            "createdAt": datetime.utcnow()
        }

        # Check if vote already exists
        existing_vote = await votes_collection.find_one({
            "userId": ObjectId(user_id),
            "postId": ObjectId(post_id)
        })

        if existing_vote:
            # Update existing vote
            await votes_collection.update_one(
                {"_id": existing_vote["_id"]},
                {"$set": {"voteType": vote_type, "createdAt": datetime.utcnow()}}
            )
        else:
            # Create new vote
            await votes_collection.insert_one(vote_data)

        # Update post score
        await self.update_post_score(post_id)
        return {"success": True}

    async def remove_vote(self, user_id: str, post_id: str) -> dict:
        """Remove a user's vote"""
        await votes_collection.delete_one({
            "userId": ObjectId(user_id),
            "postId": ObjectId(post_id)
        })
        await self.update_post_score(post_id)
        return {"success": True}

    async def get_user_vote(self, user_id: str, post_id: str) -> Optional[dict]:
        """Get user's vote on a post"""
        vote = await votes_collection.find_one({
            "userId": ObjectId(user_id),
            "postId": ObjectId(post_id)
        })
        return self.serialize_doc(vote)

    async def update_post_score(self, post_id: str):
        """Recalculate and update post score"""
        pipeline = [
            {"$match": {"postId": ObjectId(post_id)}},
            {"$group": {
                "_id": "$postId",
                "upvotes": {"$sum": {"$cond": [{"$eq": ["$voteType", "up"]}, 1, 0]}},
                "downvotes": {"$sum": {"$cond": [{"$eq": ["$voteType", "down"]}, 1, 0]}}
            }}
        ]

        result = await votes_collection.aggregate(pipeline).to_list(1)
        if result:
            upvotes = result[0]["upvotes"]
            downvotes = result[0]["downvotes"]
            score = upvotes - downvotes
        else:
            upvotes = downvotes = score = 0

        await posts_collection.update_one(
            {"_id": ObjectId(post_id)},
            {"$set": {
                "upvotes": upvotes,
                "downvotes": downvotes,
                "score": score
            }}
        )

    # Comment operations
    async def create_comment(self, comment_data: dict) -> dict:
        """Create a new comment"""
        comment_data['_id'] = ObjectId()
        comment_data['upvotes'] = 0
        comment_data['downvotes'] = 0
        comment_data['score'] = 0
        comment_data['createdAt'] = datetime.utcnow()
        
        result = await comments_collection.insert_one(comment_data)
        
        # Increment post comment count
        await posts_collection.update_one(
            {"_id": ObjectId(comment_data['postId'])},
            {"$inc": {"commentCount": 1}}
        )
        
        return await self.get_comment_by_id(str(result.inserted_id))

    async def get_comment_by_id(self, comment_id: str) -> Optional[dict]:
        """Get comment by ID with user info"""
        pipeline = [
            {"$match": {"_id": ObjectId(comment_id)}},
            {"$lookup": {
                "from": "users",
                "localField": "userId",
                "foreignField": "_id",
                "as": "user"
            }},
            {"$unwind": "$user"}
        ]
        
        result = await comments_collection.aggregate(pipeline).to_list(1)
        if result:
            comment = result[0]
            comment = self.serialize_doc(comment)
            comment['user'] = self.serialize_doc(comment['user'])
            return comment
        return None

    async def get_comments_for_post(self, post_id: str) -> List[dict]:
        """Get all comments for a post with replies"""
        pipeline = [
            {"$match": {"postId": ObjectId(post_id)}},
            {"$lookup": {
                "from": "users",
                "localField": "userId",
                "foreignField": "_id",
                "as": "user"
            }},
            {"$unwind": "$user"},
            {"$sort": {"createdAt": -1}}
        ]

        comments = await comments_collection.aggregate(pipeline).to_list(1000)
        serialized_comments = []
        
        # Organize comments with replies
        top_level_comments = []
        replies_map = {}
        
        for comment in comments:
            comment = self.serialize_doc(comment)
            comment['user'] = self.serialize_doc(comment['user'])
            comment['replies'] = []
            
            if comment.get('parentId'):
                # This is a reply
                parent_id = comment['parentId']
                if parent_id not in replies_map:
                    replies_map[parent_id] = []
                replies_map[parent_id].append(comment)
            else:
                # This is a top-level comment
                top_level_comments.append(comment)

        # Attach replies to their parent comments
        for comment in top_level_comments:
            if comment['id'] in replies_map:
                comment['replies'] = replies_map[comment['id']]

        return top_level_comments

# Create database manager instance
db_manager = DatabaseManager()