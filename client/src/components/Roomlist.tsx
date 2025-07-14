import React from 'react';
import { Hash } from 'lucide-react';
import { Room } from '../hooks/useSocket';

interface RoomListProps {
  rooms: Room[];
  currentRoom: string;
  onRoomChange: (room: string) => void;
}

export const RoomList: React.FC<RoomListProps> = ({ rooms, currentRoom, onRoomChange }) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Rooms</h3>
      <div className="space-y-1">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onRoomChange(room.id)}
            className={`w-full flex items-center p-2 rounded-md text-left hover:bg-gray-50 ${
              currentRoom === room.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
            }`}
          >
            <Hash className="w-4 h-4 mr-2" />
            <span className="text-sm">{room.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};