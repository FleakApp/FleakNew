import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import PostFeed from "./components/PostFeed";
import PostDetail from "./components/PostDetail";
import UserProfile from "./components/UserProfile";
import UploadPage from "./components/UploadPage";
import AuthPage from "./components/AuthPage";
import { Toaster } from "./components/ui/toaster";

const MainLayout = ({ children, hideSidebar = false }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        {!hideSidebar && (
          <div className="hidden md:block">
            <Sidebar />
          </div>
        )}
        <main className={`flex-1 min-h-screen ${hideSidebar ? '' : 'md:ml-0'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

const HomePage = () => (
  <MainLayout>
    <PostFeed section="Hot" />
  </MainLayout>
);

const TopPage = () => (
  <MainLayout>
    <PostFeed section="Top" />
  </MainLayout>
);

const TrendingPage = () => (
  <MainLayout>
    <PostFeed section="Trending" />
  </MainLayout>
);

const FreshPage = () => (
  <MainLayout>
    <PostFeed section="Fresh" />
  </MainLayout>
);

const CategoryPage = ({ category }) => (
  <MainLayout>
    <PostFeed section={category} />
  </MainLayout>
);

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/top" element={<TopPage />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/fresh" element={<FreshPage />} />
          
          {/* Category routes */}
          <Route path="/funny" element={<CategoryPage category="Funny" />} />
          <Route path="/gaming" element={<CategoryPage category="Gaming" />} />
          <Route path="/animals" element={<CategoryPage category="Animals" />} />
          <Route path="/awesome" element={<CategoryPage category="Awesome" />} />
          <Route path="/food" element={<CategoryPage category="Food" />} />
          <Route path="/wtf" element={<CategoryPage category="WTF" />} />
          
          {/* Post detail */}
          <Route 
            path="/gag/:postId" 
            element={
              <MainLayout>
                <PostDetail />
              </MainLayout>
            } 
          />
          
          {/* User profile */}
          <Route 
            path="/u/:username" 
            element={
              <MainLayout>
                <UserProfile />
              </MainLayout>
            } 
          />
          
          {/* Upload page */}
          <Route 
            path="/upload" 
            element={
              <MainLayout>
                <UploadPage />
              </MainLayout>
            } 
          />
          
          {/* Auth pages */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;