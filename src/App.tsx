import React, { useState, useEffect } from 'react';
import { Instagram, Plus, Settings, Eye, ExternalLink, Calendar, CheckCircle, AlertCircle, Trash2, Building2, Download, RefreshCw, User } from 'lucide-react';

interface TrackedAccount {
  id: string;
  companyName: string;
  username: string;
  lastChecked: Date;
  lastPostDate: Date;
  lastPostUrl: string;
  status: 'posted_24h' | 'no_post_24h' | 'error' | 'pending';
  hasNewPost: boolean;
  storyCount: number;
  postCount: number;
  profileUrl: string;
}

interface NotionConfig {
  apiKey: string;
  databaseId: string;
  isConfigured: boolean;
}

const DUBAI_REAL_ESTATE_COMPANIES = {
  "Deca Properties": "deca.properties",
  "HS Property": "hs_property",
};

function App() {
  const [trackedAccounts, setTrackedAccounts] = useState<TrackedAccount[]>([]);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [notionConfig, setNotionConfig] = useState<NotionConfig>({
    apiKey: '',
    databaseId: '',
    isConfigured: false
  });
  const [isTracking, setIsTracking] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date>(new Date());
  const [showNotification, setShowNotification] = useState(true);

  // Other companies (moved down from top)
  const OTHER_COMPANIES = {
    "Emaar Properties": "emaardubai",
    "DAMAC Properties": "damacofficial",
    "Nakheel Properties": "nakheelofficial",
    "Meraas": "meraas",
    "Sobha Realty": "sobharealty",
    "Ellington Properties": "ellingtonproperties",
    "Azizi Developments": "azizidevelopments",
    "Danube Properties": "danubeproperties",
    "Binghatti Developers": "binghatti",
    "11Prop": "11prop",
    "Metropolitan Premium": "metropolitan.realestate",
    "Fäm Properties": "famproperties",
    "Driven Properties": "drivenproperties",
    "haus & haus": "hausandhaus",
    "Allsopp & Allsopp": "allsoppandallsopp",
    "Betterhomes": "betterhomesuae",
    "Espace Real Estate": "espace.realestate",
    "Aqua Properties": "aqua.properties",
    "Azco Real Estate": "azcorealestate",
    "D&B Properties": "dandbproperties"
  };

  // Track mouse position for gradient effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Initialize with Dubai real estate companies
  useEffect(() => {
    // Combine DECA & HS first, then other companies
    const allCompanies = { ...DUBAI_REAL_ESTATE_COMPANIES, ...OTHER_COMPANIES };
    const initialAccounts: TrackedAccount[] = Object.entries(allCompanies).map(([company, username], index) => ({
      id: (index + 1).toString(),
      companyName: company,
      username: username,
      lastChecked: new Date(Date.now() - Math.random() * 60 * 60 * 1000), // Random last check within last hour
      lastPostDate: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000), // Random post within last 48 hours
      lastPostUrl: `https://instagram.com/p/${Math.random().toString(36).substr(2, 9)}`,
      status: Math.random() > 0.3 ? 'posted_24h' : 'no_post_24h',
      hasNewPost: Math.random() > 0.5,
      storyCount: Math.floor(Math.random() * 5), // Random story count 0-4
      postCount: Math.floor(Math.random() * 50) + 10, // Random post count 10-59
      profileUrl: `https://instagram.com/${username}`
    }));
    setTrackedAccounts(initialAccounts);
  }, []);

  const addAccount = () => {
    if (newCompanyName.trim() && newUsername.trim() && !trackedAccounts.find(acc => acc.username === newUsername.trim())) {
      const newAccount: TrackedAccount = {
        id: Date.now().toString(),
        companyName: newCompanyName.trim(),
        username: newUsername.trim(),
        lastChecked: new Date(),
        lastPostDate: new Date(),
        lastPostUrl: '',
        status: 'pending',
        hasNewPost: false,
        storyCount: 0,
        postCount: 0,
        profileUrl: `https://instagram.com/${newUsername.trim()}`
      };
      setTrackedAccounts([...trackedAccounts, newAccount]);
      setNewCompanyName('');
      setNewUsername('');
      setShowAddForm(false);
    }
  };

  const removeAccount = (id: string) => {
    setTrackedAccounts(trackedAccounts.filter(acc => acc.id !== id));
  };

  const startTracking = () => {
    setIsTracking(true);
    setLastCheckTime(new Date());
    
    // Simulate tracking process with realistic timing
    setTimeout(() => {
      setIsTracking(false);
      setTrackedAccounts(accounts => 
        accounts.map(acc => {
          const randomDelay = Math.random() * 24 * 60 * 60 * 1000; // Random time within 24h
          const lastPostTime = new Date(Date.now() - randomDelay);
          const hasRecentPost = randomDelay < 24 * 60 * 60 * 1000; // Posted within 24h
          
          return {
            ...acc,
            lastChecked: new Date(),
            lastPostDate: lastPostTime,
            status: Math.random() > 0.1 ? (hasRecentPost ? 'posted_24h' : 'no_post_24h') : 'error',
            hasNewPost: hasRecentPost && Math.random() > 0.3,
            lastPostUrl: hasRecentPost ? `https://instagram.com/p/${Math.random().toString(36).substr(2, 9)}` : acc.lastPostUrl,
            storyCount: Math.floor(Math.random() * 5), // Update story count
            postCount: acc.postCount + (hasRecentPost ? 1 : 0) // Increment post count if new post
          };
        })
      );
    }, 4000);
  };

  const exportLog = () => {
    const now = new Date();
    const since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    let logContent = `📊 Instagram Feed Post Check – ${now.toLocaleString()}\n`;
    logContent += `🕒 Checking for new posts in the last 24 hours (since ${since.toLocaleString()})\n`;
    logContent += '-'.repeat(80) + '\n\n';

    trackedAccounts.forEach(account => {
      if (account.status === 'posted_24h') {
        logContent += `✅ ${account.companyName} (@${account.username}) posted on ${account.lastPostDate.toLocaleString()}\n`;
        if (account.lastPostUrl) {
          logContent += `   → ${account.lastPostUrl}\n`;
        }
      } else if (account.status === 'no_post_24h') {
        logContent += `❌ ${account.companyName} (@${account.username}) has NOT posted in the last 24h. Last post: ${account.lastPostDate.toLocaleString()}\n`;
      } else if (account.status === 'error') {
        logContent += `⚠️ Error checking ${account.companyName} (@${account.username})\n`;
      }
      logContent += '\n';
    });

    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ig_post_log_${now.toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted_24h': return 'text-green-500';
      case 'no_post_24h': return 'text-orange-500';
      case 'error': return 'text-red-500';
      case 'pending': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'posted_24h': return <CheckCircle className="w-4 h-4 text-white" />;
      case 'no_post_24h': return <Calendar className="w-4 h-4 text-white" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-white" />;
      case 'pending': return <Eye className="w-4 h-4 text-white" />;
      default: return <Eye className="w-4 h-4 text-white" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'posted_24h': return 'Posted (24h)';
      case 'no_post_24h': return 'No post (24h)';
      case 'error': return 'Error';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const postedCount = trackedAccounts.filter(acc => acc.status === 'posted_24h').length;
  const noPostCount = trackedAccounts.filter(acc => acc.status === 'no_post_24h').length;
  const errorCount = trackedAccounts.filter(acc => acc.status === 'error').length;

  return (
    <div 
      className="min-h-screen bg-black relative overflow-hidden"
      style={{
        background: `black radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15), black 40%)`
      }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="w-16"></div> {/* Spacer for balance */}
          <div className="flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-white mr-3" />
            <h1 className="text-4xl font-bold text-white">Dubai Real Estate Instagram Tracker</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center border-4 border-white/20">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-bold text-white">Riaz</h2>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-white text-sm">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-black border border-white/30 rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold text-white mb-6">Notion Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Notion API Key</label>
                  <input
                    type="password"
                    value={notionConfig.apiKey}
                    onChange={(e) => setNotionConfig({...notionConfig, apiKey: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white bg-black"
                    placeholder="secret_..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Database ID</label>
                  <input
                    type="text"
                    value={notionConfig.databaseId}
                    onChange={(e) => setNotionConfig({...notionConfig, databaseId: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white bg-black"
                    placeholder="Database ID from Notion"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setNotionConfig({...notionConfig, isConfigured: !!(notionConfig.apiKey && notionConfig.databaseId)});
                      setShowSettings(false);
                    }}
                    className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Save Configuration
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Account Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-black border border-white/30 rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold text-white mb-6">Add New Account</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Company Name</label>
                  <input
                    type="text"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white bg-black"
                    placeholder="e.g., Emaar Properties"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Instagram Username</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white bg-black"
                    placeholder="e.g., emaardubai"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={addAccount}
                    className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add Account
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instagram Notification Popup */}
        {showNotification && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-3 border border-white/30 shadow-2xl shadow-purple-500/50 max-w-xs animate-pulse">
            <div className="flex items-center gap-2 justify-center">
              <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Instagram className="w-3 h-3 text-white" />
              </div>
              <div className="text-center">
                <h4 className="text-white font-semibold text-xs">Instagram</h4>
                <p className="text-white/90 text-xs">
                  <strong>deca.properties</strong> posted
                </p>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="text-white/70 hover:text-white text-xs ml-2"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center justify-center gap-1 mt-2 text-xs text-white/80">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <span>2 min ago</span>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-transparent backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:bg-white/5 transition-all duration-300 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-400/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Accounts</p>
                <p className="text-2xl font-bold text-white">{trackedAccounts.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="bg-transparent backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:bg-white/5 transition-all duration-300 hover:border-white/50 hover:shadow-lg hover:shadow-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Posted (24h)</p>
                <p className="text-2xl font-bold text-white">{postedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="bg-transparent backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:bg-white/5 transition-all duration-300 hover:border-white/50 hover:shadow-lg hover:shadow-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">No Posts (24h)</p>
                <p className="text-2xl font-bold text-white">{noPostCount}</p>
              </div>
              <Calendar className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="bg-transparent backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:bg-white/5 transition-all duration-300 hover:border-white/50 hover:shadow-lg hover:shadow-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Errors</p>
                <p className="text-2xl font-bold text-white">{errorCount}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-transparent backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/30 hover:bg-white/5 transition-all duration-300 hover:border-white/50 hover:shadow-lg hover:shadow-white/10">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Account
              </button>
              <button
                onClick={exportLog}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Log
              </button>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowSettings(true)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button
                onClick={startTracking}
                disabled={isTracking || trackedAccounts.length === 0}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-medium"
              >
                {isTracking ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Checking Posts...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Check All Posts
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${notionConfig.isConfigured ? 'bg-green-400' : 'bg-red-400'}`}></div>
                Notion: {notionConfig.isConfigured ? 'Connected' : 'Not configured'}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                Last check: {formatTimeAgo(lastCheckTime)}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                Tracking: 24-hour window
              </div>
            </div>
          </div>
        </div>

        {/* Tracked Accounts */}
        <div className="space-y-8">
          {/* Top Priority Companies - DECA and HS */}
          <div>
            <div className="grid gap-6 md:grid-cols-2">
              {trackedAccounts.slice(0, 2).map((account) => (
                <div key={account.id} className="bg-transparent backdrop-blur-lg rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/30 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-400/50 hover:scale-105 hover:shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                        <Instagram className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm">{account.companyName}</h3>
                        <a 
                          href={account.profileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-white hover:text-white/80 text-xs transition-colors flex items-center gap-1"
                        >
                          @{account.username}
                          <ExternalLink className="w-3 h-3 text-white" />
                        </a>
                        <div className="flex items-center gap-1 text-xs text-white">
                          {getStatusIcon(account.status)}
                          {getStatusText(account.status)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeAccount(account.id)}
                      className="text-white hover:text-white/80 p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Story and Post Counts */}
                  <div className="grid grid-cols-1 gap-3 mb-4">
                    <div className="bg-white/5 rounded-lg p-3 text-center border border-white/20">
                      <div className="text-lg font-bold text-white">{account.storyCount}</div>
                      <div className="text-xs text-white">Stories (24h)</div>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-white">
                    <div className="flex items-center justify-between">
                      <span>Last checked:</span>
                      <span>{formatTimeAgo(account.lastChecked)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Last post:</span>
                      <span>{formatTimeAgo(account.lastPostDate)}</span>
                    </div>
                    {account.hasNewPost && (
                      <div className="bg-white/20 text-white px-3 py-2 rounded-lg text-xs border border-white/30">
                        {account.companyName === 'Deca Properties' ? '📝 Note updated' : '🎉 New post detected!'}
                      </div>
                    )}
                    <div className="pt-2 border-t border-white/30">
                      <a
                        href={account.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white hover:text-white/80 transition-colors text-xs font-medium"
                      >
                        <Instagram className="w-3 h-3 text-white" />
                        Visit Instagram Profile
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider Line */}
          <div className="flex items-center justify-center">
            <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent w-full max-w-2xl"></div>
          </div>

          {/* Other Companies - 5 per row */}
          <div>
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
              {trackedAccounts.slice(2).map((account) => (
                <div key={account.id} className="bg-transparent backdrop-blur-lg rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/30 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-400/50 hover:scale-105 hover:shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                        <Instagram className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm">{account.companyName}</h3>
                        <a 
                          href={account.profileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-white hover:text-white/80 text-xs transition-colors flex items-center gap-1"
                        >
                          @{account.username}
                          <ExternalLink className="w-3 h-3 text-white" />
                        </a>
                        <div className="flex items-center gap-1 text-xs text-white">
                          {getStatusIcon(account.status)}
                          {getStatusText(account.status)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeAccount(account.id)}
                      className="text-white hover:text-white/80 p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Story and Post Counts */}
                  <div className="grid grid-cols-1 gap-3 mb-4">
                    <div className="bg-white/5 rounded-lg p-3 text-center border border-white/20">
                      <div className="text-lg font-bold text-white">{account.storyCount}</div>
                      <div className="text-xs text-white">Stories (24h)</div>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-white">
                    <div className="flex items-center justify-between">
                      <span>Last checked:</span>
                      <span>{formatTimeAgo(account.lastChecked)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Last post:</span>
                      <span>{formatTimeAgo(account.lastPostDate)}</span>
                    </div>
                    {account.hasNewPost && (
                      <div className="bg-white/20 text-white px-3 py-2 rounded-lg text-xs border border-white/30">
                        {account.companyName === 'Deca Properties' ? '📝 Note updated' : '🎉 New post detected!'}
                      </div>
                    )}
                    <div className="pt-2 border-t border-white/30">
                      <a
                        href={account.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white hover:text-white/80 transition-colors text-xs font-medium"
                      >
                        <Instagram className="w-3 h-3 text-white" />
                        Visit Instagram Profile
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Integration Code Example */}
        <div className="mt-12 bg-transparent backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:bg-white/5 transition-all duration-300 hover:border-white/50 hover:shadow-lg hover:shadow-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Python Integration Code</h3>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto border border-white/30">
            <pre className="text-green-300 text-sm">
{`import instaloader
import schedule
import time
from datetime import datetime, timedelta

# Initialize Instaloader instance
L = instaloader.Instaloader()

# Dubai Real Estate Companies
instagram_users = {
${Object.entries({ ...DUBAI_REAL_ESTATE_COMPANIES, ...OTHER_COMPANIES }).map(([company, username]) => 
    `    "${company}": "${username}"`
).join(',\n')}
}

def job():
    print("Running Instagram check...")
    # Time range setup (24 hours)
    now = datetime.now()
    since = now - timedelta(hours=24)

    for company, username in instagram_users.items():
        try:
            profile = instaloader.Profile.from_username(L.context, username)
            posts = profile.get_posts()
            latest_post = next(posts)
            post_time = latest_post.date.replace(tzinfo=None)

            if post_time >= since:
                print(f"✅ {company} (@{username}) posted on {post_time}")
                post_link = f"https://www.instagram.com/p/{latest_post.shortcode}/"
            else:
                print(f"❌ {company} (@{username}) has NOT posted in the last 24h")
                
        except Exception as e:
            print(f"⚠️ Error checking {company} (@{username}): {str(e)}")

# Schedule the job to run daily at 8:00 AM
schedule.every().day.at("08:00").do(job)

# Keep the script running
while True:
    schedule.run_pending()
    time.sleep(1)`}
            </pre>
          </div>
          <p className="text-white text-sm mt-3">
            This code checks all Dubai real estate companies for posts within the last 24 hours and runs automatically every day at 8:00 AM using the schedule library.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;