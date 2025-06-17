import React from 'react';
import { FileText, Share2, Download } from 'lucide-react';
import { UserList } from './UserList';
import { LanguageSelector } from './LanguageSelector';
import { User } from '../types';

interface DocumentHeaderProps {
  documentId: string;
  users: User[];
  currentUserId: string;
  language: string;
  onLanguageChange: (language: string) => void;
  onDownload: () => void;
  onShare: () => void;
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  documentId,
  users,
  currentUserId,
  language,
  onLanguageChange,
  onDownload,
  onShare,
}) => {
  return (
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FileText className="text-blue-600" size={24} />
            <h1 className="text-xl font-semibold text-gray-800">
              Collaborative Editor
            </h1>
          </div>
          <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            Document: {documentId}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <LanguageSelector
            currentLanguage={language}
            onLanguageChange={onLanguageChange}
          />
          <UserList users={users} currentUserId={currentUserId} />
          <div className="flex space-x-2">
            <button
              onClick={onShare}
              className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>
            <button
              onClick={onDownload}
              className="flex items-center space-x-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};