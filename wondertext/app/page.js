'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowUp, ArrowDown, Copy, Clipboard, Volume2, VolumeX,
  Trash2, Save, Download, Zap, Type, AlignLeft,
  X, Space, Clock, FileText, Radio, Check,
  Hash, BookOpen, Wifi, WifiOff, Database
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import ReactMarkdown from "react-markdown"
import Markdown from 'react-markdown';

export default function Textarea() {
  const [text, setText] = useState("");
  const [activeTool, setActiveTool] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  // Morse code mapping
  const morseCodeMap = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',
    'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
    'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
    'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
    'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--',
    'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', '0': '-----', ' ': '/'
  };

  // Reverse morse code mapping
  const reverseMorseCodeMap = Object.fromEntries(
    Object.entries(morseCodeMap).map(([key, value]) => [value, key])
  );

  // Calculate statistics
  const stats = useMemo(() => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const characters = text.length;
    const readingTime = Math.round((words.length / 200) * 60); // 200 wpm

    return {
      words: words.length,
      characters,
      readingTime
    };
  }, [text]);

  // Update stats on text change
  useEffect(() => {
    setCharacterCount(text.length);
    setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length);
  }, [text]);

  // Text transformation functions
  const handleUpperCase = () => {
    setText(prev => prev.toUpperCase());
    setActiveTool('uppercase');
    toast.success('Converted to uppercase!');
  };

  const handleLowerCase = () => {
    setText(prev => prev.toLowerCase());
    setActiveTool('lowercase');
    toast.success('Converted to lowercase!');
  };

  const handleClearText = () => {
    setText("");
    setActiveTool('clear');
    toast.success('Text cleared!');
  };

  const handleRemoveExtraSpaces = () => {
    const newText = text.replace(/\s+/g, ' ').trim();
    setText(newText);
    setActiveTool('spaces');
    toast.success('Extra spaces removed!');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy text');
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(prev => prev + clipboardText);
      setActiveTool('paste');
      toast.success('Pasted from clipboard!');
    } catch (err) {
      toast.error('Failed to paste from clipboard');
    }
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        toast.success('Speech stopped');
      } else {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'en-US';
        speech.rate = 1;
        speech.pitch = 1;
        speech.volume = 1;

        speech.onend = () => setIsSpeaking(false);
        speech.onerror = () => {
          setIsSpeaking(false);
          toast.error('Speech synthesis failed');
        };

        window.speechSynthesis.speak(speech);
        setIsSpeaking(true);
        setActiveTool('speak');
        toast.success('Speaking...');
      }
    } else {
      toast.error('Speech synthesis not supported');
    }
  };

  const handleConvertToMorse = () => {
    const morseText = text.toUpperCase().split('').map(char =>
      morseCodeMap[char] || char
    ).join(' ');

    setText(morseText);
    setActiveTool('morse');
    toast.success('Converted to Morse code!');
  };

  const handleConvertFromMorse = () => {
    const normalText = text.split(' ').map(code =>
      reverseMorseCodeMap[code] || code
    ).join('');

    setText(normalText);
    setActiveTool('unmorse');
    toast.success('Converted from Morse code!');
  };

  const handleLocalStorageSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('savedText', text);
      toast.success('Saved to local storage!');
    }
  };

  const handleLocalStorageLoad = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('savedText') || '';
      setText(saved);
      toast.success('Loaded from local storage!');
    }
  };

  const handleLocalStorageClear = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('savedText');
      toast.success('Cleared local storage!');
    }
  };

  // Tool categories for better organization
  const toolCategories = [
    {
      name: "Basic",
      tools: [
        {
          icon: <ArrowUp size={18} />,
          label: "Uppercase",
          onClick: handleUpperCase,
          active: activeTool === 'uppercase'
        },
        {
          icon: <ArrowDown size={18} />,
          label: "Lowercase",
          onClick: handleLowerCase,
          active: activeTool === 'lowercase'
        },
        {
          icon: <AlignLeft size={18} />,
          label: "Trim Spaces",
          onClick: handleRemoveExtraSpaces,
          active: activeTool === 'spaces'
        },
      ]
    },
    {
      name: "Clipboard",
      tools: [
        {
          icon: copied ? <Check size={18} /> : <Copy size={18} />,
          label: copied ? "Copied!" : "Copy",
          onClick: handleCopy,
          active: copied
        },
        {
          icon: <Clipboard size={18} />,
          label: "Paste",
          onClick: handlePaste,
          active: activeTool === 'paste'
        },
      ]
    },
    {
      name: "Speech",
      tools: [
        {
          icon: isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />,
          label: isSpeaking ? "Stop" : "Speak",
          onClick: handleSpeak,
          active: isSpeaking
        },
      ]
    },
    {
      name: "Morse Code",
      tools: [
        {
          icon: <Radio size={18} />,
          label: "To Morse",
          onClick: handleConvertToMorse,
          active: activeTool === 'morse'
        },
        {
          icon: <Radio size={18} className="rotate-180" />,
          label: "From Morse",
          onClick: handleConvertFromMorse,
          active: activeTool === 'unmorse'
        },
      ]
    },
    {
      name: "Storage",
      tools: [
        {
          icon: <Save size={18} />,
          label: "Save",
          onClick: handleLocalStorageSave,
          active: activeTool === 'save'
        },
        {
          icon: <Download size={18} />,
          label: "Load",
          onClick: handleLocalStorageLoad,
          active: activeTool === 'load'
        },
        {
          icon: <Trash2 size={18} />,
          label: "Clear Storage",
          onClick: handleLocalStorageClear,
          active: activeTool === 'clearStorage'
        },
      ]
    },
  ];

  return (
    <div className="min-h-screen transition-colors duration-200 bg-gray-900 text-white">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000
        }}
      />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <p className="mt-2 text-gray-400">
                Transform and analyze your text with powerful utilities
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-gray-800 border border-gray-700 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-900 rounded-lg">
                  <FileText className="text-blue-400" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Words</p>
                  <p className="text-2xl font-semibold">{stats.words}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-800 border border-gray-700 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-900 rounded-lg">
                  <Hash className="text-green-400" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Characters</p>
                  <p className="text-2xl font-semibold">{stats.characters}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-800 border border-gray-700 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-900 rounded-lg">
                  <Clock className="text-purple-400" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Reading Time</p>
                  <p className="text-2xl font-semibold">{stats.readingTime}s</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Text Area */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-700 bg-gray-800 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h2 className="font-semibold flex items-center gap-2">
                  <Type size={20} />
                  Text Editor
                </h2>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-4 min-h-[300px] focus:outline-none resize-none bg-gray-800 text-white"
                placeholder="Start typing or paste your text here..."
              />
              <div className="p-4 border-t border-gray-700 flex justify-between items-center">
                <span className="text-sm text-gray-400">
                  {characterCount} characters • {wordCount} words
                </span>
                <button
                  onClick={handleClearText}
                  className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  Clear
                </button>
              </div>
            </div>

            {/* Preview Section */}
            <div className="mt-6 rounded-xl border border-gray-700 bg-gray-800 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="font-semibold flex items-center gap-2">
                  <BookOpen size={20} />
                  Preview
                </h3>
                <div className="flex items-center gap-2 text-gray-400">
                  <Markdown size={18} />
                  <span className="text-sm">Markdown Supported</span>
                </div>
              </div>
              <div className="p-4">
                {text ? (
                  <div className="prose prose-invert max-w-none text-gray-300">
                    <ReactMarkdown>
                      {text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    Your text preview will appear here...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Tools */}
          <div>
            <div className="rounded-xl border border-gray-700 bg-gray-800 shadow-sm overflow-hidden sticky top-8">
              <div className="p-4 border-b border-gray-700">
                <h2 className="font-semibold flex items-center gap-2">
                  <Zap size={20} />
                  Text Tools
                </h2>
              </div>

              <div className="p-4 space-y-6">
                {toolCategories.map((category) => (
                  <div key={category.name}>
                    <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
                      {category.name}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {category.tools.map((tool, index) => (
                        <button
                          key={index}
                          onClick={tool.onClick}
                          disabled={!text && tool.label !== 'Paste' && tool.label !== 'Load'}
                          className={`p-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${tool.active
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {tool.icon}
                          <span className="text-sm font-medium">{tool.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Morse Code Table Link */}
                <div className="pt-4 border-t border-gray-700">
                  <Link
                    href="/morse"
                    className="w-full p-3 rounded-lg flex items-center justify-center gap-2 transition-all bg-gray-700 hover:bg-gray-600 text-gray-300"
                  >
                    <Radio size={18} />
                    <span className="font-medium">Morse Code Table</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="mt-6 rounded-xl border border-gray-700 bg-gray-800 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h3 className="font-semibold text-sm">💡 Quick Tips</h3>
              </div>
              <ul className="p-4 space-y-2">
                <li className="text-sm text-gray-400">
                  • Use Ctrl+A to select all text
                </li>
                <li className="text-sm text-gray-400">
                  • Click any tool twice to revert changes
                </li>
                <li className="text-sm text-gray-400">
                  • Text is automatically saved in browser
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}