import React from 'react';
import { Message } from '../hooks/useSocket';

interface MessageListProps {
  messages: Message[];
  currentUser: string;
  typingUsers: string[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages, currentUser, typingUsers }) => {
  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isOwnMessage = message.sender?.username === currentUser;
        const isSystem = message.type === 'system';

        if (isSystem) {
          return (
            <div key={message.id} className="text-center">
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {message.content}
              </span>
            </div>
          );
        }

        return (
          <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              isOwnMessage 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-800 border border-gray-200'
            }`}>
              {!isOwnMessage && (
                <div className="text-sm font-medium mb-1 text-blue-600">
                  {message.sender?.username}
                </div>
              )}
              <div className="text-sm">{message.content}</div>
              <div className={`text-xs mt-1 ${
                isOwnMessage ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        );
      })}
      
      {typingUsers.length > 0 && (
        <div className="flex justify-start">
          <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg">
            <div className="text-sm">
              {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};