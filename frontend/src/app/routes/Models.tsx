import React from 'react';

interface ModelsProps {
  onLogout: () => void;
  username: string | null;
}

const Models: React.FC<ModelsProps> = ({ onLogout, username }) => {
  return (
    <div>
      <p><strong>Username:</strong> {username}</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default Models;