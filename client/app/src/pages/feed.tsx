import React, { useEffect, useState } from 'react';
import logo from '../assets/img/logo.png';


interface Post {
  id: number;
  user_id: number;
  content: string;
  created_at: string;
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/posts');
      if (!res.ok) {
        console.error('Failed to fetch posts, status:', res.status);
        return;
      }
      
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await res.json();
          setPosts(data.posts || data);
      } else {
          const text = await res.text();
          console.error("Received non-JSON response:", text);
      }
    } catch (err: any) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <img src={logo} alt="logo" className="h-10 absolute left-5 top-[15px] z-20" />
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Travel Feed</h1>
        <div>
          <h2 className="text-xl font-semibold mb-2">Recent Posts</h2>
          {loading && <div>Loading posts...</div>}
          <ul>
            {posts.map(post => (
              <li key={post.id} className="mb-4 p-3 border rounded bg-white shadow">
                <div className="text-gray-800">{post.content}</div>
                <div className="text-xs text-gray-500 mt-1">{new Date(post.created_at).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-16 bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://plus.unsplash.com/premium_photo-1661962677749-b9f7d43878e3?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Modern building" 
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>
            <div>
              <h2 className="text-sm uppercase text-gray-500 tracking-widest">Guidance</h2>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">Writing a Great Travel Post</h3>
              <p className="mt-4 text-gray-600">
                Your posts help other travelers discover new places and make the most of their journey. Here are a few tips to make your posts engaging and helpful.
              </p>
              <div className="mt-8 space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-800">Be Specific & Authentic</h4>
                    <p className="text-gray-600 mt-1">Share your genuine experiences. Mention specific places, what you liked, and any tips you have for fellow travelers.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1-1m6-3l-2-2" /></svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-800">Add a Photo</h4>
                    <p className="text-gray-600 mt-1">A picture is worth a thousand words. Visually engaging posts get more attention and help tell your story.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-800">Be Helpful & Respectful</h4>
                    <p className="text-gray-600 mt-1">Offer advice that could help others. Be mindful of local culture and write with a respectful tone.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Feed; 