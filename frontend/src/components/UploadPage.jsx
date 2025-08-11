import React, { useState } from 'react';
import { Upload, Image, Video, Smile } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '../hooks/use-toast';
import { interests } from '../data/mockData';

const UploadPage = () => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please add a title and select a file to upload.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      toast({
        title: "Post uploaded successfully!",
        description: "Your post will be reviewed and published soon.",
      });
      
      // Reset form
      setTitle('');
      setTags('');
      setCategory('');
      setFile(null);
      setUploading(false);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Create a Post</h1>
          <p className="text-gray-600 mt-1">Share something awesome with the world!</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Media
            </label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-400 bg-blue-50'
                  : file
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                onChange={handleFileSelect}
                accept="image/*,video/*,.gif"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {file ? (
                <div className="space-y-3">
                  <div className="flex justify-center">
                    {file.type.startsWith('image/') ? (
                      <Image className="h-12 w-12 text-green-600" />
                    ) : (
                      <Video className="h-12 w-12 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-green-600 font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-gray-600">
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Images, GIFs, or Videos (max 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a catchy title..."
              className="w-full"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {interests.map((interest) => (
                  <SelectItem key={interest.id} value={interest.id}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded ${interest.color}`}></div>
                      <span>{interest.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <Input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="funny, relatable, weekend (separate with commas)"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Help people find your post by adding relevant tags
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline">
              Save Draft
            </Button>
            <Button 
              type="submit" 
              disabled={uploading || !file || !title.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {uploading ? 'Uploading...' : 'Post'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;