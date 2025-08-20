import React from 'react';
import { X as XIcon, Linkedin, Share2 } from 'lucide-react';
import { FaReddit, FaXTwitter } from 'react-icons/fa6';

interface ShareModalProps {
  onClose: () => void;
  url: string;
  valuation: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ onClose, url, valuation }) => {
  const shareText = `I just valued a SaaS business at ${valuation}! Check out this valuation tool.`;
  const shareTitle = 'SaaS Business Valuation';

  const socialPlatforms = [
    {
      name: 'X',
      icon: <FaXTwitter className="w-6 h-6" />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-6 h-6" />,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(shareTitle)}&summary=${encodeURIComponent(shareText)}`,
    },
    {
        name: 'Reddit',
        icon: <FaReddit className="w-6 h-6" />,
        url: `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(shareTitle)}`,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-sm m-4 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
        >
          <XIcon className="w-5 h-5" />
        </button>
        <div className="text-center">
          <Share2 className="w-8 h-8 mx-auto text-secondary-400 mb-2" />
          <h2 className="text-xl font-bold text-white mb-4">Share Results</h2>
        </div>
        <div className="space-y-3">
          {socialPlatforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 space-x-2"
            >
              {platform.icon}
              <span>Share on {platform.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
