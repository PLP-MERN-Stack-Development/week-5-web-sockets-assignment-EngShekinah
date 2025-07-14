import { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { ChatRoom } from './components/chatroom';
import { useSocket } from './hooks/useSocket';

function App() {
  const [username, setUsername] = useState('');
  const [currentRoom, setCurrentRoom] = useState('general');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { joinRoom, switchRoom } = useSocket();

  const handleLogin = (user: string, room: string) => {
    setUsername(user);
    setCurrentRoom(room);
    setIsLoggedIn(true);
    joinRoom(user, room);
  };

  const handleRoomChange = (room: string) => {
    setCurrentRoom(room);
    switchRoom(room);
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <ChatRoom
      username={username}
      currentRoom={currentRoom}
      onRoomChange={handleRoomChange}
    />
  );
}

export default App;