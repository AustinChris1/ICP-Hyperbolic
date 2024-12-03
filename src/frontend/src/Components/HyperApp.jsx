import React, { useState } from 'react';
import TextGeneration from './TextGeneration';
import ImageGeneration from './ImageGeneration';
import AudioGeneration from './AudioGeneration';
import { Link } from 'react-router-dom';

const HyperbolicPromptGenerator = () => {
  const [activeTab, setActiveTab] = useState('text'); // State to manage active tab

  // Tab content rendering logic
  const renderTabContent = () => {
    switch (activeTab) {
      case 'text':
        return <TextGeneration />;
      case 'image':
        return <ImageGeneration />;
      case 'audio':
        return <AudioGeneration />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-purple-900 text-white py-2">
        <img src="/hyperbolicLabs.png" alt="Hyperbolic Logo" className="mx-auto w-16 md:w-20" />
        <h1 className="text-center text-xl md:text-2xl font-bold mt-4">Hyperbolic Prompt Generator</h1>
      </header>
      <div className="container mx-auto mt-6 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row justify-center space-x-0 sm:space-x-4 mb-6">
          {/* Tab Buttons */}
          <button
            onClick={() => setActiveTab('text')}
            className={`w-full sm:w-auto px-6 py-2 mb-2 sm:mb-0 rounded-lg transition duration-300 ${
              activeTab === 'text' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Text Generation
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`w-full sm:w-auto px-6 py-2 mb-2 sm:mb-0 rounded-lg transition duration-300 ${
              activeTab === 'image' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Image Generation
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`w-full sm:w-auto px-6 py-2 mb-2 sm:mb-0 rounded-lg transition duration-300 ${
              activeTab === 'audio' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Audio Generation
          </button>
        </div>
        {/* Tab Content */}
        <div className="bg-white p-6 shadow-lg rounded-lg">{renderTabContent()}</div>
      </div>
      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto text-center px-4">
          <p className="text-lg font-semibold">Developed by{' '}
            <Link
              to="https://github.com/AustinChris1/Hyperbolic-AI-Prompter"
              className="text-gray-400 hover:text-gray-600"
            >
              Austin-Chris
            </Link> </p>
          <p className="text-sm">
            Powered by{' '}
            <Link
              to="https://docs.hyperbolic.xyz/docs/getting-started"
              className="text-purple-400 hover:text-purple-600"
            >
              Hyperbolic Labs
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HyperbolicPromptGenerator;
