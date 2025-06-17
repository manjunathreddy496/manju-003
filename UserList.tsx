import React from 'react';
import { User } from '../types';
import { Users } from 'lucide-react';

interface UserListProps {
  users: User[];
  currentUserId: string;
}

export const UserList: React.FC<UserListProps> = ({ users, currentUserId }) => {
  return (
    <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm border px-3 py-2">
      <Users size={16} className="text-gray-500" />
      <span className="text-sm text-gray-600 font-medium">
        {users.length} user{users.length !== 1 ? 's' : ''}
      </span>
      <div className="flex space-x-1">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center space-x-1 bg-gray-50 rounded-full px-2 py-1"
            title={user.name}
          >
            <div
              className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: user.color }}
            />
            <span className="text-xs text-gray-700 max-w-20 truncate">
              {user.id === currentUserId ? 'You' : user.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};