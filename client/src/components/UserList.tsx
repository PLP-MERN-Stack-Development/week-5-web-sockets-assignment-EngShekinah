import React from 'react';
import { User } from '../hooks/useSocket';
import { MessageSquare } from 'lucide-react';

interface UserListProps {
  users: User[];
  currentUser: string;
  onPrivateChat: (user: User) => void;
}

export const UserList: React.FC<UserListProps> = ({ users, currentUser, onPrivateChat }) => {
  return (
    <div className="p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Online Users ({users.length})</h3>
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50"
          >
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className={`text-sm ${user.username === currentUser ? 'font-medium text-blue-600' : 'text-gray-700'}`}>
                {user.username}
                {user.username === currentUser && ' (you)'}
              </span>
            </div>
            {user.username !== currentUser && (
              <button
                onClick={() => onPrivateChat(user)}
                className="p-1 text-gray-400 hover:text-blue-500"
                title="Send private message"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};