import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

interface LoginFormProps {
  onLogin: (username: string, room: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('general');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim(), room);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <MessageCircle className="w-12 h-12 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Join Chat</h1>
          <p className="text-gray-600">Enter your username to start chatting</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div>
            <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-1">
              Room
            </label>
            <select
              id="room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="general">General</option>
              <option value="random">Random</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
};