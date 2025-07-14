import { useState, useEffect, useRef } from 'react';
import { Send, Users, Hash, MessageSquare, Volume2, VolumeX } from 'lucide-react';
import { useSocket, User } from '../hooks/useSocket';
import { MessageList } from './MessageList';
import { UserList } from './UserList';
import { RoomList } from './Roomlist';
import { PrivateChat } from './PrivateChat';

interface ChatRoomProps {
  username: string;
  currentRoom: string;
  onRoomChange: (room: string) => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ username, currentRoom, onRoomChange }) => {
  const {
    isConnected,
    messages,
    users,
    rooms,
    typingUsers,
    privateMessages,
    sendMessage,
    setTyping,
    getPrivateMessages
  } = useSocket();

  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showRooms, setShowRooms] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activePrivateChat, setActivePrivateChat] = useState<string | null>(null);
  const [privateChatUser, setPrivateChatUser] = useState<User | null>(null);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio('/notification.mp3');
    audioRef.current.volume = 0.5;
  }, []);

  useEffect(() => {
    // Play sound for new messages
    if (messages.length > 0 && soundEnabled) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.type === 'user' && lastMessage.sender?.username !== username) {
        audioRef.current?.play().catch(() => {});
      }
    }
  }, [messages, soundEnabled, username]);

  useEffect(() => {
    // Browser notification for new messages
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.type === 'user' && lastMessage.sender?.username !== username) {
        if (Notification.permission === 'granted') {
          new Notification(`New message from ${lastMessage.sender?.username}`, {
            body: lastMessage.content,
            icon: '/favicon.ico'
          });
        }
      }
    }
  }, [messages, username]);

  useEffect(() => {
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleSendMessage = () => {
    if (messageInput.trim() && isConnected) {
      if (activePrivateChat) {
        sendMessage(messageInput, currentRoom, true, activePrivateChat);
      } else {
        sendMessage(messageInput, currentRoom);
      }
      setMessageInput('');
      handleStopTyping();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
      setTyping(currentRoom, true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 1000);
  };

  const handleStopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      setTyping(currentRoom, false);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const startPrivateChat = (user: User) => {
    setActivePrivateChat(user.id);
    setPrivateChatUser(user);
    setShowUsers(false);
    getPrivateMessages(user.id);
  };

  const closePrivateChat = () => {
    setActivePrivateChat(null);
    setPrivateChatUser(null);
  };

  const currentRoomName = rooms.find(room => room.id === currentRoom)?.name || currentRoom;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`w-64 bg-white border-r border-gray-200 flex flex-col ${showRooms || showUsers ? 'block' : 'hidden'} lg:block`}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Chat App</h2>
          <p className="text-sm text-gray-600">
            {isConnected ? (
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Connected
              </span>
            ) : (
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Disconnected
              </span>
            )}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <RoomList
            rooms={rooms}
            currentRoom={currentRoom}
            onRoomChange={onRoomChange}
          />
          <UserList
            users={users}
            currentUser={username}
            onPrivateChat={startPrivateChat}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setShowRooms(!showRooms)}
                className="lg:hidden mr-3 p-2 rounded-md hover:bg-gray-100"
              >
                <Hash className="w-5 h-5" />
              </button>
              <div className="flex items-center">
                {activePrivateChat ? (
                  <>
                    <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
                    <span className="font-medium">Private chat with {privateChatUser?.username}</span>
                  </>
                ) : (
                  <>
                    <Hash className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="font-medium">{currentRoomName}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-gray-600" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-600" />
                )}
              </button>
              <button
                onClick={() => setShowUsers(!showUsers)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <Users className="w-5 h-5" />
              </button>
              {activePrivateChat && (
                <button
                  onClick={closePrivateChat}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Back to room
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {activePrivateChat ? (
            <PrivateChat
              messages={privateMessages.get(activePrivateChat) || []}
              currentUser={username}
              targetUser={privateChatUser}
            />
          ) : (
            <MessageList
              messages={messages}
              currentUser={username}
              typingUsers={typingUsers}
            />
          )}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={messageInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={activePrivateChat ? `Message ${privateChatUser?.username}...` : `Message #${currentRoomName}...`}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isConnected}
            />
            <button
              onClick={handleSendMessage}
              disabled={!isConnected || !messageInput.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};