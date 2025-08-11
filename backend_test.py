#!/usr/bin/env python3
"""
Backend API Testing Suite for 9GAG Clone
Tests all backend endpoints with proper authentication flow
"""

import requests
import json
import time
import os
from typing import Dict, Any, Optional

# Configuration
BACKEND_URL = "https://df4c6117-7360-4f22-b1b4-f48568afe70b.preview.emergentagent.com/api"
TEST_USER_DATA = {
    "username": "testuser_9gag",
    "email": "testuser@9gag.test",
    "password": "testpass123"
}

class BackendTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = requests.Session()
        self.auth_token = None
        self.test_user_id = None
        self.test_post_id = None
        self.results = []
        
    def log_result(self, test_name: str, success: bool, message: str, details: Any = None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        self.results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_health_check(self):
        """Test API health check endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "9GAG Clone API" in data["message"]:
                    self.log_result("Health Check", True, "API is running and responding correctly")
                    return True
                else:
                    self.log_result("Health Check", False, "Unexpected response format", data)
                    return False
            else:
                self.log_result("Health Check", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_result("Health Check", False, f"Connection error: {str(e)}")
            return False
    
    def test_user_registration(self):
        """Test user registration endpoint"""
        try:
            response = self.session.post(
                f"{self.base_url}/auth/register",
                json=TEST_USER_DATA
            )
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "username" in data and data["username"] == TEST_USER_DATA["username"]:
                    self.test_user_id = data["id"]
                    self.log_result("User Registration", True, "User registered successfully", 
                                  {"user_id": self.test_user_id, "username": data["username"]})
                    return True
                else:
                    self.log_result("User Registration", False, "Invalid response format", data)
                    return False
            elif response.status_code == 400:
                # User might already exist, try to continue with login
                error_data = response.json()
                if "already" in error_data.get("detail", "").lower():
                    self.log_result("User Registration", True, "User already exists (continuing with login)", error_data)
                    return True
                else:
                    self.log_result("User Registration", False, f"Registration failed: {error_data.get('detail')}", error_data)
                    return False
            else:
                self.log_result("User Registration", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_result("User Registration", False, f"Request error: {str(e)}")
            return False
    
    def test_user_login(self):
        """Test user login endpoint"""
        try:
            login_data = {
                "email": TEST_USER_DATA["email"],
                "password": TEST_USER_DATA["password"]
            }
            
            response = self.session.post(
                f"{self.base_url}/auth/login",
                json=login_data
            )
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.auth_token = data["access_token"]
                    self.test_user_id = data["user"]["id"]
                    # Set authorization header for future requests
                    self.session.headers.update({"Authorization": f"Bearer {self.auth_token}"})
                    self.log_result("User Login", True, "Login successful", 
                                  {"token_type": data.get("token_type"), "user_id": self.test_user_id})
                    return True
                else:
                    self.log_result("User Login", False, "Invalid response format", data)
                    return False
            else:
                error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
                self.log_result("User Login", False, f"HTTP {response.status_code}", error_data)
                return False
        except Exception as e:
            self.log_result("User Login", False, f"Request error: {str(e)}")
            return False
    
    def test_get_current_user(self):
        """Test get current user endpoint"""
        if not self.auth_token:
            self.log_result("Get Current User", False, "No auth token available")
            return False
            
        try:
            response = self.session.get(f"{self.base_url}/auth/me")
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "username" in data:
                    self.log_result("Get Current User", True, "User info retrieved successfully", 
                                  {"username": data["username"], "email": data.get("email")})
                    return True
                else:
                    self.log_result("Get Current User", False, "Invalid response format", data)
                    return False
            else:
                error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
                self.log_result("Get Current User", False, f"HTTP {response.status_code}", error_data)
                return False
        except Exception as e:
            self.log_result("Get Current User", False, f"Request error: {str(e)}")
            return False
    
    def test_get_posts_feed(self):
        """Test get posts feed endpoint"""
        try:
            # Test default feed
            response = self.session.get(f"{self.base_url}/posts")
            
            if response.status_code == 200:
                data = response.json()
                if "posts" in data and "hasMore" in data and "total" in data:
                    self.log_result("Get Posts Feed", True, f"Posts feed retrieved successfully", 
                                  {"posts_count": len(data["posts"]), "total": data["total"]})
                    return True
                else:
                    self.log_result("Get Posts Feed", False, "Invalid response format", data)
                    return False
            else:
                error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
                self.log_result("Get Posts Feed", False, f"HTTP {response.status_code}", error_data)
                return False
        except Exception as e:
            self.log_result("Get Posts Feed", False, f"Request error: {str(e)}")
            return False
    
    def test_get_posts_sections(self):
        """Test get posts with different sections"""
        sections = ["hot", "trending", "fresh"]
        all_success = True
        
        for section in sections:
            try:
                response = self.session.get(f"{self.base_url}/posts?section={section}")
                
                if response.status_code == 200:
                    data = response.json()
                    if "posts" in data:
                        self.log_result(f"Get Posts - {section.title()}", True, 
                                      f"Posts retrieved for {section} section", 
                                      {"posts_count": len(data["posts"])})
                    else:
                        self.log_result(f"Get Posts - {section.title()}", False, "Invalid response format", data)
                        all_success = False
                else:
                    error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
                    self.log_result(f"Get Posts - {section.title()}", False, f"HTTP {response.status_code}", error_data)
                    all_success = False
            except Exception as e:
                self.log_result(f"Get Posts - {section.title()}", False, f"Request error: {str(e)}")
                all_success = False
        
        return all_success
    
    def test_create_post(self):
        """Test create post endpoint"""
        if not self.auth_token:
            self.log_result("Create Post", False, "No auth token available")
            return False
            
        try:
            post_data = {
                "title": "Test Post from Backend Testing",
                "mediaType": "image",
                "mediaUrl": "https://images.unsplash.com/photo-1500000000?w=600&h=400&fit=crop",
                "category": "funny",
                "tags": ["test", "backend", "api"],
                "nsfw": False
            }
            
            response = self.session.post(
                f"{self.base_url}/posts",
                json=post_data
            )
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "title" in data and data["title"] == post_data["title"]:
                    self.test_post_id = data["id"]
                    self.log_result("Create Post", True, "Post created successfully", 
                                  {"post_id": self.test_post_id, "title": data["title"]})
                    return True
                else:
                    self.log_result("Create Post", False, "Invalid response format", data)
                    return False
            else:
                error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
                self.log_result("Create Post", False, f"HTTP {response.status_code}", error_data)
                return False
        except Exception as e:
            self.log_result("Create Post", False, f"Request error: {str(e)}")
            return False
    
    def test_upload_media(self):
        """Test upload media endpoint"""
        if not self.auth_token:
            self.log_result("Upload Media", False, "No auth token available")
            return False
            
        try:
            # Create a simple test file
            test_content = b"fake image content for testing"
            files = {
                'file': ('test_image.jpg', test_content, 'image/jpeg')
            }
            
            response = self.session.post(
                f"{self.base_url}/upload/media",
                files=files
            )
            
            if response.status_code == 200:
                data = response.json()
                if "url" in data and "publicId" in data and "mediaType" in data:
                    self.log_result("Upload Media", True, "Media uploaded successfully", 
                                  {"media_type": data["mediaType"], "url": data["url"][:50] + "..."})
                    return True
                else:
                    self.log_result("Upload Media", False, "Invalid response format", data)
                    return False
            else:
                error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
                self.log_result("Upload Media", False, f"HTTP {response.status_code}", error_data)
                return False
        except Exception as e:
            self.log_result("Upload Media", False, f"Request error: {str(e)}")
            return False
    
    def test_get_user_profile(self):
        """Test get user profile endpoint"""
        try:
            username = TEST_USER_DATA["username"]
            response = self.session.get(f"{self.base_url}/users/{username}")
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "username" in data and data["username"] == username:
                    self.log_result("Get User Profile", True, "User profile retrieved successfully", 
                                  {"username": data["username"], "followers": data.get("followers", 0)})
                    return True
                else:
                    self.log_result("Get User Profile", False, "Invalid response format", data)
                    return False
            else:
                error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
                self.log_result("Get User Profile", False, f"HTTP {response.status_code}", error_data)
                return False
        except Exception as e:
            self.log_result("Get User Profile", False, f"Request error: {str(e)}")
            return False
    
    def test_authentication_required_endpoints(self):
        """Test that protected endpoints require authentication"""
        # Remove auth header temporarily
        original_auth = self.session.headers.get("Authorization")
        if "Authorization" in self.session.headers:
            del self.session.headers["Authorization"]
        
        try:
            # Test protected endpoint without auth
            response = self.session.get(f"{self.base_url}/auth/me")
            
            if response.status_code == 401:
                self.log_result("Auth Required Test", True, "Protected endpoint correctly requires authentication")
                success = True
            else:
                self.log_result("Auth Required Test", False, f"Expected 401, got {response.status_code}")
                success = False
        except Exception as e:
            self.log_result("Auth Required Test", False, f"Request error: {str(e)}")
            success = False
        finally:
            # Restore auth header
            if original_auth:
                self.session.headers["Authorization"] = original_auth
        
        return success
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Backend API Tests for 9GAG Clone")
        print("=" * 60)
        
        # Test sequence
        tests = [
            ("API Health Check", self.test_health_check),
            ("User Registration", self.test_user_registration),
            ("User Login", self.test_user_login),
            ("Get Current User", self.test_get_current_user),
            ("Get Posts Feed", self.test_get_posts_feed),
            ("Get Posts Sections", self.test_get_posts_sections),
            ("Create Post", self.test_create_post),
            ("Upload Media", self.test_upload_media),
            ("Get User Profile", self.test_get_user_profile),
            ("Authentication Required", self.test_authentication_required_endpoints),
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            print(f"\n🧪 Running: {test_name}")
            try:
                if test_func():
                    passed += 1
            except Exception as e:
                self.log_result(test_name, False, f"Test execution error: {str(e)}")
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        # Detailed results
        print("\n📋 DETAILED RESULTS:")
        for result in self.results:
            status = "✅" if result["success"] else "❌"
            print(f"{status} {result['test']}: {result['message']}")
        
        return passed, total, self.results

def main():
    """Main test execution"""
    tester = BackendTester()
    passed, total, results = tester.run_all_tests()
    
    # Return exit code based on results
    if passed == total:
        print("\n🎉 All tests passed!")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed!")
        return 1

if __name__ == "__main__":
    exit(main())