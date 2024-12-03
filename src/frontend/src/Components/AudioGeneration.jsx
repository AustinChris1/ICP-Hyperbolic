import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importing the styles
import { backend } from 'declarations/backend';

const AudioGeneration = () => {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!text) {
      setError('Text cannot be empty');
      toast.error('Text cannot be empty');
      return;
    }

    setLoading(true);
    setError('');
    setAudioUrl(null); // Reset previous audio URL

    try {
      const res = await backend.generate_audio(text);
      setAudioUrl(res);
      toast.success('Audio generated successfully!');
    } catch (err) {
      setError('Failed to generate audio');
      toast.error('Failed to generate audio');
    } finally {
      setLoading(false);
    }
  }

  
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Audio Generator</h1>

      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to generate speech..."
          className="w-full h-32 p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`mt-4 w-full py-2 text-white rounded-md ${loading
            ? 'bg-purple-300 cursor-not-allowed'
            : 'bg-purple-500 hover:bg-purple-600'
            }`}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
        {error && <p className="mt-2 text-red-500">{error}</p>}
        {audioUrl && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800">Generated Audio:</h2>
            <audio controls className="mt-4">
              <source src={audioUrl} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
      {/* ToastContainer for notifications */}
      <ToastContainer />
    </div>
  );
};

export default AudioGeneration;
