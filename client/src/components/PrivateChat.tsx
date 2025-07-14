import React from 'react';
import { Message, User } from '../hooks/useSocket';

interface PrivateChatProps {
  messages: Message[];
  currentUser: string;
  targetUser: User | null;
}

export const PrivateChat: React.FC<PrivateChatProps> = ({ messages, currentUser }) => {
  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((message) => {
          const isOwnMessage = message.sender?.username === currentUser;

          return (
            <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                isOwnMessage 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}>
                <div className="text-sm">{message.content}</div>
                <div className={`text-xs mt-1 ${
                  isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};