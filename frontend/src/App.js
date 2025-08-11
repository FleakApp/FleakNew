import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import PostFeed from "./components/PostFeed";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <MainLayout>
      <PostFeed section="Hot" />
    </MainLayout>
  );
};

const TopPage = () => {
  return (
    <MainLayout>
      <PostFeed section="Top" />
    </MainLayout>
  );
};

const TrendingPage = () => {
  return (
    <MainLayout>
      <PostFeed section="Trending" />
    </MainLayout>
  );
};

const FreshPage = () => {
  return (
    <MainLayout>
      <PostFeed section="Fresh" />
    </MainLayout>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/top" element={<TopPage />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/fresh" element={<FreshPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;