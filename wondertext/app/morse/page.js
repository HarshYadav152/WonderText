'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Home, Copy, Check, Volume2, 
  Radio, ChevronLeft, ChevronRight,
  Search, Info
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function MorseTablePage() {
  const [copiedChar, setCopiedChar] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Comprehensive Morse code data
  const morseData = {
    letters: [
      { char: 'A', morse: '.-', pronunciation: 'Alfa' },
      { char: 'B', morse: '-...', pronunciation: 'Bravo' },
      { char: 'C', morse: '-.-.', pronunciation: 'Charlie' },
      { char: 'D', morse: '-..', pronunciation: 'Delta' },
      { char: 'E', morse: '.', pronunciation: 'Echo' },
      { char: 'F', morse: '..-.', pronunciation: 'Foxtrot' },
      { char: 'G', morse: '--.', pronunciation: 'Golf' },
      { char: 'H', morse: '....', pronunciation: 'Hotel' },
      { char: 'I', morse: '..', pronunciation: 'India' },
      { char: 'J', morse: '.---', pronunciation: 'Juliett' },
      { char: 'K', morse: '-.-', pronunciation: 'Kilo' },
      { char: 'L', morse: '.-..', pronunciation: 'Lima' },
      { char: 'M', morse: '--', pronunciation: 'Mike' },
      { char: 'N', morse: '-.', pronunciation: 'November' },
      { char: 'O', morse: '---', pronunciation: 'Oscar' },
      { char: 'P', morse: '.--.', pronunciation: 'Papa' },
      { char: 'Q', morse: '--.-', pronunciation: 'Quebec' },
      { char: 'R', morse: '.-.', pronunciation: 'Romeo' },
      { char: 'S', morse: '...', pronunciation: 'Sierra' },
      { char: 'T', morse: '-', pronunciation: 'Tango' },
      { char: 'U', morse: '..-', pronunciation: 'Uniform' },
      { char: 'V', morse: '...-', pronunciation: 'Victor' },
      { char: 'W', morse: '.--', pronunciation: 'Whiskey' },
      { char: 'X', morse: '-..-', pronunciation: 'X-ray' },
      { char: 'Y', morse: '-.--', pronunciation: 'Yankee' },
      { char: 'Z', morse: '--..', pronunciation: 'Zulu' },
    ],
    numbers: [
      { char: '1', morse: '.----', pronunciation: 'One' },
      { char: '2', morse: '..---', pronunciation: 'Two' },
      { char: '3', morse: '...--', pronunciation: 'Three' },
      { char: '4', morse: '....-', pronunciation: 'Four' },
      { char: '5', morse: '.....', pronunciation: 'Five' },
      { char: '6', morse: '-....', pronunciation: 'Six' },
      { char: '7', morse: '--...', pronunciation: 'Seven' },
      { char: '8', morse: '---..', pronunciation: 'Eight' },
      { char: '9', morse: '----.', pronunciation: 'Nine' },
      { char: '0', morse: '-----', pronunciation: 'Zero' },
    ],
    punctuation: [
      { char: '.', morse: '.-.-.-', pronunciation: 'Period' },
      { char: ',', morse: '--..--', pronunciation: 'Comma' },
      { char: '?', morse: '..--..', pronunciation: 'Question Mark' },
      { char: '!', morse: '-.-.--', pronunciation: 'Exclamation' },
      { char: "'", morse: '.----.', pronunciation: 'Apostrophe' },
      { char: '"', morse: '.-..-.', pronunciation: 'Quotation Mark' },
      { char: '(', morse: '-.--.', pronunciation: 'Left Parenthesis' },
      { char: ')', morse: '-.--.-', pronunciation: 'Right Parenthesis' },
      { char: '&', morse: '.-...', pronunciation: 'Ampersand' },
      { char: ':', morse: '---...', pronunciation: 'Colon' },
      { char: ';', morse: '-.-.-.', pronunciation: 'Semicolon' },
      { char: '/', morse: '-..-.', pronunciation: 'Slash' },
      { char: '_', morse: '..--.-', pronunciation: 'Underscore' },
      { char: '@', morse: '.--.-.', pronunciation: 'At Sign' },
      { char: '=', morse: '-...-', pronunciation: 'Equals' },
      { char: '+', morse: '.-.-.', pronunciation: 'Plus' },
      { char: '-', morse: '-....-', pronunciation: 'Hyphen' },
      { char: '$', morse: '...-..-', pronunciation: 'Dollar' },
    ],
    prosigns: [
      { char: 'AR', morse: '.-.-.', description: 'End of message' },
      { char: 'AS', morse: '.-...', description: 'Wait' },
      { char: 'BT', morse: '-...-', description: 'Break' },
      { char: 'CT', morse: '-.-.-', description: 'Start transmission' },
      { char: 'SK', morse: '...-.-', description: 'End of contact' },
      { char: 'SOS', morse: '...---...', description: 'Distress signal' },
    ],
  };

  // International Morse code timing
  const timingRules = [
    { unit: 'Dot duration', value: '1 unit' },
    { unit: 'Dash duration', value: '3 units' },
    { unit: 'Space between dots/dashes', value: '1 unit' },
    { unit: 'Space between letters', value: '3 units' },
    { unit: 'Space between words', value: '7 units' },
  ];

  const categories = [
    { id: 'all', label: 'All Characters', count: morseData.letters.length + morseData.numbers.length + morseData.punctuation.length + morseData.prosigns.length },
    { id: 'letters', label: 'Alphabet', count: morseData.letters.length },
    { id: 'numbers', label: 'Numbers', count: morseData.numbers.length },
    { id: 'punctuation', label: 'Punctuation', count: morseData.punctuation.length },
    { id: 'prosigns', label: 'Prosigns', count: morseData.prosigns.length },
  ];

  // Filter data based on search and category
  const filteredData = {
    letters: morseData.letters.filter(item => 
      (activeCategory === 'all' || activeCategory === 'letters') &&
      (searchTerm === '' || 
        item.char.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.morse.includes(searchTerm) ||
        item.pronunciation.toLowerCase().includes(searchTerm.toLowerCase()))
    ),
    numbers: morseData.numbers.filter(item => 
      (activeCategory === 'all' || activeCategory === 'numbers') &&
      (searchTerm === '' || 
        item.char.includes(searchTerm) ||
        item.morse.includes(searchTerm))
    ),
    punctuation: morseData.punctuation.filter(item => 
      (activeCategory === 'all' || activeCategory === 'punctuation') &&
      (searchTerm === '' || 
        item.char.includes(searchTerm) ||
        item.morse.includes(searchTerm) ||
        item.pronunciation.toLowerCase().includes(searchTerm.toLowerCase()))
    ),
    prosigns: morseData.prosigns.filter(item => 
      (activeCategory === 'all' || activeCategory === 'prosigns') &&
      (searchTerm === '' || 
        item.char.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.morse.includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    ),
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedChar(type);
    toast.success(`Copied ${type === 'char' ? 'character' : 'morse code'}: ${text}`);
    setTimeout(() => setCopiedChar(null), 2000);
  };

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = 'en-US';
      speech.rate = 0.8;
      window.speechSynthesis.speak(speech);
      toast.success(`Pronouncing: ${text}`);
    } else {
      toast.error('Speech synthesis not available');
    }
  };

  const playMorseSound = (morse) => {
    toast.success("To be added");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          },
        }}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Radio className="text-blue-600 dark:text-blue-400" size={32} />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Morse Code Reference
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Complete International Morse Code alphabet with pronunciation and timing rules
              </p>
            </div>
          </div>

          {/* Search and Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search characters, Morse code, or pronunciation..."
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {category.label}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activeCategory === category.id
                      ? 'bg-white/20'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Morse Code Table - Main Section */}
          <div className="lg:col-span-2">
            {/* Letters */}
            {filteredData.letters.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 p-2 rounded-lg">
                    A-Z
                  </span>
                  Alphabet
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredData.letters.map((item) => (
                    <div
                      key={item.char}
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="text-center mb-3">
                        <div className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                          {item.char}
                        </div>
                        <div className="text-2xl font-mono text-blue-600 dark:text-blue-400 mb-2">
                          {item.morse}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {item.pronunciation}
                        </div>
                      </div>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleCopy(item.char, 'char')}
                          className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          title="Copy character"
                        >
                          {copiedChar === `char-${item.char}` ? (
                            <Check size={16} className="text-green-500" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => handleCopy(item.morse, 'morse')}
                          className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          title="Copy Morse code"
                        >
                          {copiedChar === `morse-${item.char}` ? (
                            <Check size={16} className="text-green-500" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => handleSpeak(item.pronunciation)}
                          className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          title="Pronounce"
                        >
                          <Volume2 size={16} />
                        </button>
                        <button
                          onClick={() => playMorseSound(item.morse)}
                          className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                          title="Play Morse sound"
                        >
                          <Radio size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Numbers */}
            {filteredData.numbers.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                  <span className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 p-2 rounded-lg">
                    0-9
                  </span>
                  Numbers
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {filteredData.numbers.map((item) => (
                    <div
                      key={item.char}
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                    >
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                          {item.char}
                        </div>
                        <div className="text-xl font-mono text-green-600 dark:text-green-400">
                          {item.morse}
                        </div>
                      </div>
                      <div className="flex justify-center gap-2 mt-3">
                        <button
                          onClick={() => handleCopy(item.char, 'char')}
                          className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => playMorseSound(item.morse)}
                          className="p-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                        >
                          <Radio size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Punctuation */}
            {filteredData.punctuation.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                  <span className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 p-2 rounded-lg">
                    !?#&
                  </span>
                  Punctuation & Symbols
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredData.punctuation.map((item) => (
                    <div
                      key={item.char}
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                          {item.char}
                        </div>
                        <div className="text-lg font-mono text-purple-600 dark:text-purple-400 mb-2">
                          {item.morse}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {item.pronunciation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prosigns */}
            {filteredData.prosigns.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                  <span className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 p-2 rounded-lg">
                    ⚡
                  </span>
                  Prosigns & Special Signals
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredData.prosigns.map((item) => (
                    <div
                      key={item.char}
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-red-200 dark:border-red-900"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-xl font-bold text-gray-800 dark:text-white">
                            {item.char}
                          </div>
                          <div className="text-lg font-mono text-red-600 dark:text-red-400 my-2">
                            {item.morse}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {item.description}
                          </div>
                        </div>
                        <button
                          onClick={() => playMorseSound(item.morse)}
                          className="p-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                        >
                          <Radio size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar with Info and Timing */}
          <div className="space-y-8">
            {/* Morse Code Info Card */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Info size={24} />
                <h3 className="text-xl font-bold">About Morse Code</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Invented by Samuel Morse in 1836</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Used worldwide for over 100 years</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Still used in aviation and by radio amateurs</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>SOS (...---...) is the international distress signal</span>
                </li>
              </ul>
            </div>

            {/* Timing Rules */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                International Timing Rules
              </h3>
              <div className="space-y-4">
                {timingRules.map((rule, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">{rule.unit}</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{rule.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Note:</strong> 1 unit = duration of one dot. Timing is relative, not absolute.
                </p>
              </div>
            </div>

            {/* Quick Guide */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                Quick Guide
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                  <div className="font-bold text-gray-800 dark:text-white">Dot (.)</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Short signal or "dit"</div>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                  <div className="font-bold text-gray-800 dark:text-white">Dash (-)</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Long signal or "dah" (3x dot duration)</div>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                  <div className="font-bold text-gray-800 dark:text-white">Space</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Between letters: 3 units • Between words: 7 units</div>
                </div>
              </div>
            </div>

            {/* Practice Morse */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-4">Practice Morse</h3>
              <p className="mb-4 opacity-90">Try decoding these common words:</p>
              <div className="space-y-3">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <div className="font-mono">.... . .-.. .-.. ---</div>
                  <div className="text-sm opacity-75 mt-1">(HELLO)</div>
                </div>
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <div className="font-mono">... --- ...</div>
                  <div className="text-sm opacity-75 mt-1">(SOS - Distress Signal)</div>
                </div>
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <div className="font-mono">-.-- . ...</div>
                  <div className="text-sm opacity-75 mt-1">(YES)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              International Morse Code Reference • Updated 2025
            </div>
            <div className="flex gap-4">
              <Link
                href="/"
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft size={16} />
                Back to Text Tools
              </Link>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg flex items-center gap-2 hover:from-blue-600 hover:to-purple-600 transition-all"
              >
                Scroll to Top
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}