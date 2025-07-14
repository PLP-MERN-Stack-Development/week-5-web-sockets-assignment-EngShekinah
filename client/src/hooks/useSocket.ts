import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

export interface User {
  id: string;
  username: string;
  room: string;
  isOnline: boolean;
  lastSeen: Date;
}

export interface Message {
  id: string;
  type: 'user' | 'system' | 'private';
  content: string;
  sender?: {
    id: string;
    username: string;
  };
  timestamp: Date;
  room: string;
  isPrivate?: boolean;
  targetUserId?: string;
}

export interface Room {
  id: string;
  name: string;
  users: Set<string>;
  messages: Message[];
}

export const useSocket = () => {
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [privateMessages, setPrivateMessages] = useState<Map<string, Message[]>>(new Map());

  useEffect(() => {
    socketRef.current = io('http://localhost:3001');

    socketRef.current.on('connect', () => {
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    socketRef.current.on('message', (message: Message) => {
      if (message.isPrivate) {
        setPrivateMessages(prev => {
          const newMap = new Map(prev);
          const targetId = message.sender?.id === socketRef.current?.id ? message.targetUserId : message.sender?.id;
          const key = targetId || '';
          const existing = newMap.get(key) || [];
          newMap.set(key, [...existing, message]);
          return newMap;
        });
      } else {
        setMessages(prev => [...prev, message]);
      }
    });

    socketRef.current.on('message_history', (history: Message[]) => {
      setMessages(history);
    });

    socketRef.current.on('private_message_history', ({ targetUserId, messages: privateHistory }: { targetUserId: string; messages: Message[] }) => {
      setPrivateMessages(prev => {
        const newMap = new Map(prev);
        newMap.set(targetUserId, privateHistory);
        return newMap;
      });
    });

    socketRef.current.on('users_list', (usersList: User[]) => {
      setUsers(usersList);
    });

    socketRef.current.on('rooms_list', (roomsList: Room[]) => {
      setRooms(roomsList);
    });

    socketRef.current.on('typing_update', ({ typingUsers: typing }: { typingUsers: string[] }) => {
      setTypingUsers(typing.filter((username: string) => username !== socketRef.current?.id));
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const joinRoom = (username: string, room: string) => {
    socketRef.current?.emit('join', { username, room });
  };

  const switchRoom = (room: string) => {
    socketRef.current?.emit('switch_room', { room });
    setMessages([]);
  };

  const sendMessage = (content: string, room: string, isPrivate = false, targetUserId?: string) => {
    socketRef.current?.emit('send_message', { content, room, isPrivate, targetUserId });
  };

  const setTyping = (room: string, isTyping: boolean) => {
    socketRef.current?.emit('typing', { room, isTyping });
  };

  const getPrivateMessages = (targetUserId: string) => {
    socketRef.current?.emit('get_private_messages', { targetUserId });
  };

  return {
    isConnected,
    messages,
    users,
    rooms,
    typingUsers,
    privateMessages,
    joinRoom,
    switchRoom,
    sendMessage,
    setTyping,
    getPrivateMessages
  };
};