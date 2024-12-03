import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importing the styles
import { backend } from 'declarations/backend';

const models = [
  { value: 'meta-llama/Llama-3.2-3B-Instruct', label: 'Llama-3.2-3B', description: 'Instruction-tuned for a variety of tasks with a smaller size.' },
  { value: 'Qwen/QwQ-32B-Preview', label: 'QwQ-32B-Preview', description: 'Best for general-purpose reasoning tasks.' },
  { value: 'Qwen/Qwen2.5-Coder-32B-Instruct', label: 'Qwen2.5-Coder-32B', description: 'Best for coding and math-related tasks.' },
  { value: 'Qwen/Qwen2.5-72B-Instruct', label: 'Qwen2.5-72B', description: 'Best for advanced coding and math tasks with higher knowledge.' },
  { value: 'deepseek-ai/DeepSeek-V2.5', label: 'DeepSeek-V2.5', description: 'Best for merging chat and coding capabilities.' },
  { value: 'meta-llama/Meta-Llama-3-70B-Instruct', label: 'Llama-3-70B', description: 'Highly efficient and powerful for multiple tasks.' },
  { value: 'NousResearch/Hermes-3-Llama-3.1-70B', label: 'Hermes-3-70B', description: 'Flagship model with top-tier performance across tasks.' },
  { value: 'meta-llama/Meta-Llama-3.1-405B', label: 'Llama-3.1-405B', description: 'Largest model with the best performance across most benchmarks.' },
  { value: 'meta-llama/Meta-Llama-3.1-70B-Instruct', label: 'Llama-3.1-70B', description: 'Best at its size, offering fast response times and high accuracy.' },
  { value: 'meta-llama/Meta-Llama-3.1-8B-Instruct', label: 'Llama-3.1-8B', description: 'Smallest model with the fastest response times.' }
];

const TextGeneration = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedModel, setSelectedModel] = useState(models[0].value); // Default model

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Prompt cannot be empty');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      await backend.generate_text(prompt, selectedModel).then((response) => {
        setResponse(response);
        toast.success('Text generated successfully!');
      }).catch((error) => {
        setError(error);
        toast.error('Failed to generate text');
      });
    } catch (err) {
      setError('Failed to connect to the server');
      toast.error('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  // Function to copy the code block
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Code copied to clipboard!');
    });
  };

  // Function to render response with highlighted code
  const renderResponse = (responseText) => {
    // Regex to find code blocks (enclosed in backticks) and bold text (enclosed in **)
    const codeRegex = /`{3}([^`]+)`{3}/g;
    const boldRegex = /\*\*([^*]+)\*\*/g;

    // Split the response by code blocks and bold texts
    const parts = responseText.split(codeRegex);

    return parts.map((part, index) => {
      if (index % 2 === 0) {
        return <span key={index}>{part}</span>; // Regular text
      } else {
        // Render code block with styles
        return (
          <div key={index} className="code-block-container">
            <pre className="code-block">
              <code>{part}</code>
            </pre>
            <button
              className="copy-btn"
              onClick={() => copyToClipboard(part)}
            >
              Copy
            </button>
          </div>
        );
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Text Generator</h1>

      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="model" className="block text-lg font-semibold text-gray-800">Select Model</label>
          <select
            id="model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {models.map((model) => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-gray-600">{models.find((model) => model.value === selectedModel)?.description}</p>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
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
        {response && (
          <div className="mt-6 bg-gray-50 border rounded-md p-4">
            <h2 className="text-lg font-semibold text-gray-800">Response:</h2>
            <div className="mt-2 text-gray-700 whitespace-pre-line">
              {renderResponse(response)}
            </div>
          </div>
        )}
      </div>

      {/* ToastContainer for notifications */}
      <ToastContainer />
    </div>
  );
};

export default TextGeneration;
