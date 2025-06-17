import React, { useState } from 'react';
import { FileText, Plus, Users, Zap } from 'lucide-react';

interface WelcomeScreenProps {
  onJoinDocument: (documentId: string, userName: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onJoinDocument }) => {
  const [documentId, setDocumentId] = useState('');
  const [userName, setUserName] = useState('');

  const handleCreateNew = () => {
    const newDocId = `doc-${Date.now()}`;
    const name = userName.trim() || `User${Math.floor(Math.random() * 1000)}`;
    onJoinDocument(newDocId, name);
  };

  const handleJoinExisting = () => {
    if (documentId.trim()) {
      const name = userName.trim() || `User${Math.floor(Math.random() * 1000)}`;
      onJoinDocument(documentId.trim(), name);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <FileText className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Collaborative Editor
          </h1>
          <p className="text-gray-600">
            Real-time coding and note-taking with your team
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name (Optional)
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="space-y-4">
            <button
              onClick={handleCreateNew}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus size={20} />
              <span>Create New Document</span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={documentId}
                onChange={(e) => setDocumentId(e.target.value)}
                placeholder="Enter document ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              <button
                onClick={handleJoinExisting}
                disabled={!documentId.trim()}
                className="w-full flex items-center justify-center space-x-2 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <Users size={20} />
                <span>Join Existing Document</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <Zap className="mx-auto text-blue-600 mb-2" size={24} />
              <p className="text-xs text-gray-600">Real-time Sync</p>
            </div>
            <div>
              <Users className="mx-auto text-green-600 mb-2" size={24} />
              <p className="text-xs text-gray-600">Multi-user</p>
            </div>
            <div>
              <FileText className="mx-auto text-purple-600 mb-2" size={24} />
              <p className="text-xs text-gray-600">Code & Notes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};