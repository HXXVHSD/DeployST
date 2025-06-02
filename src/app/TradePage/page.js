'use client'
import React, { useState, useEffect } from 'react';

export default function SkillSwapTradingPage() {
  const [activeTab, setActiveTab] = useState('incoming');
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [showCreateTrade, setShowCreateTrade] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [offeredSkill, setOfferedSkill] = useState('');
  const [requestedSkill, setRequestedSkill] = useState('');
  const [tradeMessage, setTradeMessage] = useState('');
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const [currentUser] = useState({
    id: "user123",
    name: "Current User",
    skills: [
      { name: "Cooking", level: "Advanced" },
      { name: "Programming", level: "Intermediate" },
      { name: "Painting", level: "Beginner" },
      { name: "Guitar", level: "Intermediate" }
    ]
  });

  // Mock trade data
  const [trades, setTrades] = useState({
    incoming: [
      {
        id: "trade1",
        fromUser: { id: "user1", name: "Alice Johnson", avatar: "👩‍💼" },
        toUser: currentUser,
        offeredSkill: { name: "Web Design", level: "Advanced" },
        requestedSkill: { name: "Programming", level: "Intermediate" },
        status: "pending",
        message: "Hi! I'd love to learn programming from you. I can teach you advanced web design techniques in return. I have 5 years of experience with modern frameworks.",
        createdAt: "2024-01-20T10:30:00Z",
        estimatedDuration: "4 weeks",
        sessionType: "Video calls + hands-on projects"
      },
      {
        id: "trade2",
        fromUser: { id: "user2", name: "Bob Chen", avatar: "👨‍🎨" },
        toUser: currentUser,
        offeredSkill: { name: "Photography", level: "Expert" },
        requestedSkill: { name: "Cooking", level: "Advanced" },
        status: "pending",
        message: "I'm a professional photographer and would love to learn advanced cooking techniques! I can teach you everything from basic composition to advanced editing.",
        createdAt: "2024-01-19T15:45:00Z",
        estimatedDuration: "6 weeks",
        sessionType: "Mixed: In-person cooking + online photo sessions"
      }
    ],
    outgoing: [
      {
        id: "trade3",
        fromUser: currentUser,
        toUser: { id: "user3", name: "Carol Smith", avatar: "👩‍🎤" },
        offeredSkill: { name: "Guitar", level: "Intermediate" },
        requestedSkill: { name: "Singing", level: "Advanced" },
        status: "pending",
        message: "I'd love to improve my singing skills! I can teach you intermediate guitar techniques and music theory in exchange.",
        createdAt: "2024-01-18T09:15:00Z",
        estimatedDuration: "8 weeks",
        sessionType: "Weekly video sessions + practice recordings"
      }
    ],
    active: [
      {
        id: "trade4",
        fromUser: { id: "user4", name: "David Wilson", avatar: "👨‍🏫" },
        toUser: currentUser,
        offeredSkill: { name: "Spanish", level: "Native" },
        requestedSkill: { name: "Programming", level: "Beginner" },
        status: "active",
        message: "Great! Let's start our exchange. I'm excited to learn programming basics while helping you with Spanish.",
        createdAt: "2024-01-15T14:20:00Z",
        acceptedAt: "2024-01-16T10:00:00Z",
        progress: 65,
        nextSession: "2024-01-25T16:00:00Z",
        completedSessions: 8,
        totalSessions: 12,
        estimatedDuration: "6 weeks",
        sessionType: "Bi-weekly video calls"
      }
    ],
    completed: [
      {
        id: "trade5",
        fromUser: currentUser,
        toUser: { id: "user5", name: "Emma Davis", avatar: "👩‍🍳" },
        offeredSkill: { name: "Painting", level: "Beginner" },
        requestedSkill: { name: "Advanced Cooking", level: "Expert" },
        status: "completed",
        message: "This was an amazing exchange! Emma taught me incredible cooking techniques.",
        createdAt: "2023-12-01T11:30:00Z",
        completedAt: "2024-01-10T18:00:00Z",
        rating: 5,
        review: "Emma was an fantastic teacher! Her cooking expertise helped me master several advanced techniques. Highly recommend trading with her.",
        estimatedDuration: "5 weeks",
        sessionType: "Weekly in-person cooking sessions"
      },
      {
        id: "trade6",
        fromUser: { id: "user6", name: "Frank Miller", avatar: "👨‍💻" },
        toUser: currentUser,
        offeredSkill: { name: "Advanced Programming", level: "Expert" },
        requestedSkill: { name: "Guitar", level: "Intermediate" },
        status: "completed",
        message: "Thanks for the great guitar lessons! Really enjoyed our sessions.",
        createdAt: "2023-11-15T08:45:00Z",
        completedAt: "2023-12-20T20:30:00Z",
        rating: 4,
        review: "Great guitar instruction! Very patient and knowledgeable. Would definitely trade again.",
        estimatedDuration: "4 weeks",
        sessionType: "Weekly video calls with practice assignments"
      }
    ]
  });

  // Mock users for creating new trades
  const mockUsers = [
    { id: "user7", name: "Grace Kim", skills: ["Yoga", "Meditation", "Nutrition"], avatar: "👩‍⚕️" },
    { id: "user8", name: "Henry Martinez", skills: ["Carpentry", "Home Repair", "Gardening"], avatar: "👨‍🔧" },
    { id: "user9", name: "Ivy Chen", skills: ["Digital Marketing", "Social Media", "Content Creation"], avatar: "👩‍💼" },
    { id: "user10", name: "Jack Thompson", skills: ["Photography", "Video Editing", "Graphic Design"], avatar: "👨‍🎨" }
  ];

  useEffect(() => {
    setUsers(mockUsers);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getSkillLevelColor = (level) => {
    switch (level) {
      case "Beginner": return "bg-green-50 text-green-700 border-green-200";
      case "Intermediate": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Advanced": return "bg-orange-50 text-orange-700 border-orange-200";
      case "Expert": return "bg-red-50 text-red-700 border-red-200";
      case "Native": return "bg-purple-50 text-purple-700 border-purple-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAcceptTrade = (tradeId) => {
    setTrades(prevTrades => {
      const trade = prevTrades.incoming.find(t => t.id === tradeId);
      if (trade) {
        const updatedTrade = {
          ...trade,
          status: 'active',
          acceptedAt: new Date().toISOString(),
          progress: 0,
          completedSessions: 0,
          totalSessions: 10,
          nextSession: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        };
        
        return {
          ...prevTrades,
          incoming: prevTrades.incoming.filter(t => t.id !== tradeId),
          active: [...prevTrades.active, updatedTrade]
        };
      }
      return prevTrades;
    });
    setSelectedTrade(null);
  };

  const handleDeclineTrade = (tradeId) => {
    setTrades(prevTrades => ({
      ...prevTrades,
      incoming: prevTrades.incoming.filter(t => t.id !== tradeId)
    }));
    setSelectedTrade(null);
  };

  const handleCreateTrade = () => {
    if (!selectedUser || !offeredSkill || !requestedSkill || !tradeMessage.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const user = users.find(u => u.id === selectedUser);
    if (!user) {
      alert('Please select a valid user');
      return;
    }

    const newTrade = {
      id: `trade_${Date.now()}`,
      fromUser: currentUser,
      toUser: user,
      offeredSkill: { name: offeredSkill, level: "Intermediate" },
      requestedSkill: { name: requestedSkill, level: "Intermediate" },
      status: 'pending',
      message: tradeMessage,
      createdAt: new Date().toISOString(),
      estimatedDuration: "4-6 weeks",
      sessionType: "Video calls + practice sessions"
    };

    setTrades(prevTrades => ({
      ...prevTrades,
      outgoing: [...prevTrades.outgoing, newTrade]
    }));

    // Reset form
    setSelectedUser('');
    setOfferedSkill('');
    setRequestedSkill('');
    setTradeMessage('');
    setSearchTerm('');
    setShowCreateTrade(false);
    
    alert('Trade request sent successfully!');
  };

  const handleSubmitRating = () => {
    if (rating === 0 || !review.trim()) {
      alert('Please provide both a rating and review');
      return;
    }

    setTrades(prevTrades => ({
      ...prevTrades,
      completed: prevTrades.completed.map(trade => 
        trade.id === selectedTrade.id 
          ? { ...trade, rating, review, hasRated: true }
          : trade
      )
    }));

    setSelectedTrade(prev => ({ ...prev, rating, review, hasRated: true }));
    setShowRating(false);
    setRating(0);
    setReview('');
    alert('Rating submitted successfully!');
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderStarRating = (currentRating, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span 
        key={i} 
        className={`text-lg cursor-pointer ${i < currentRating ? 'text-yellow-500' : 'text-gray-300'} ${interactive ? 'hover:text-yellow-400' : ''}`}
        onClick={interactive ? () => setRating(i + 1) : undefined}
      >
        ⭐
      </span>
    ));
  };

  const renderTradeCard = (trade) => (
    <div
      key={trade.id}
      className={`bg-white border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
        selectedTrade?.id === trade.id ? 'ring-2 ring-teal-500 shadow-md' : ''
      }`}
      onClick={() => setSelectedTrade(trade)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{trade.fromUser.id === currentUser.id ? trade.toUser.avatar : trade.fromUser.avatar}</div>
          <div>
            <h3 className="font-medium text-gray-900">
              {trade.fromUser.id === currentUser.id ? trade.toUser.name : trade.fromUser.name}
            </h3>
            <p className="text-sm text-gray-500">{formatDate(trade.createdAt)}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(trade.status)}`}>
          {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-xs font-medium text-gray-600 mb-1">
            {trade.fromUser.id === currentUser.id ? 'You Offer' : 'They Offer'}
          </p>
          <div className={`px-2 py-1 rounded text-xs border ${getSkillLevelColor(trade.offeredSkill.level)}`}>
            {trade.offeredSkill.name} ({trade.offeredSkill.level})
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-600 mb-1">
            {trade.fromUser.id === currentUser.id ? 'You Want' : 'They Want'}
          </p>
          <div className={`px-2 py-1 rounded text-xs border ${getSkillLevelColor(trade.requestedSkill.level)}`}>
            {trade.requestedSkill.name} ({trade.requestedSkill.level})
          </div>
        </div>
      </div>

      {trade.status === 'active' && trade.progress !== undefined && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{trade.completedSessions}/{trade.totalSessions} sessions</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-teal-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${trade.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {trade.rating && (
        <div className="flex items-center space-x-2 mb-2">
          <div className="flex">{renderStarRating(trade.rating)}</div>
          <span className="text-sm text-gray-600">({trade.rating}/5)</span>
        </div>
      )}

      <p className="text-sm text-gray-700 line-clamp-2">
        {trade.message}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-teal-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🔄 Skill Trading Hub</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCreateTrade(true)}
              className="bg-teal-500 hover:bg-teal-400 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
            >
              + New Trade
            </button>
            <span className="font-medium">{currentUser.name}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Trade Lists */}
          <div className="lg:col-span-1 space-y-4">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex">
                {[
                  { key: 'incoming', label: 'Incoming', count: trades.incoming.length },
                  { key: 'outgoing', label: 'Outgoing', count: trades.outgoing.length }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                      activeTab === tab.key
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
              <div className="flex">
                {[
                  { key: 'active', label: 'Active', count: trades.active.length },
                  { key: 'completed', label: 'History', count: trades.completed.length }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                      activeTab === tab.key
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Trade List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {trades[activeTab].length > 0 ? (
                trades[activeTab].map(renderTradeCard)
              ) : (
                <div className="bg-white rounded-lg p-6 text-center">
                  <div className="text-4xl mb-3">
                    {activeTab === 'incoming' && '📥'}
                    {activeTab === 'outgoing' && '📤'}
                    {activeTab === 'active' && '🤝'}
                    {activeTab === 'completed' && '✅'}
                  </div>
                  <p className="text-gray-500 mb-2">
                    No {activeTab} trades
                  </p>
                  <p className="text-sm text-gray-400">
                    {activeTab === 'incoming' && 'Incoming trade requests will appear here'}
                    {activeTab === 'outgoing' && 'Your sent trade requests will appear here'}
                    {activeTab === 'active' && 'Active skill exchanges will appear here'}
                    {activeTab === 'completed' && 'Completed trades will appear here'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {selectedTrade ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">
                      {selectedTrade.fromUser.id === currentUser.id ? selectedTrade.toUser.avatar : selectedTrade.fromUser.avatar}
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-800">
                        Trade with {selectedTrade.fromUser.id === currentUser.id ? selectedTrade.toUser.name : selectedTrade.fromUser.name}
                      </h2>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(selectedTrade.status)}`}>
                          {selectedTrade.status.charAt(0).toUpperCase() + selectedTrade.status.slice(1)}
                        </span>
                        <span className="text-gray-500 text-sm">
                          Created {formatDate(selectedTrade.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTrade(null)}
                    className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                  >
                    ×
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">Skill Exchange</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm font-medium text-green-800 mb-1">
                            {selectedTrade.fromUser.id === currentUser.id ? 'You Offer' : 'They Offer'}
                          </p>
                          <div className={`inline-block px-3 py-1 rounded text-sm border ${getSkillLevelColor(selectedTrade.offeredSkill.level)}`}>
                            {selectedTrade.offeredSkill.name} ({selectedTrade.offeredSkill.level})
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <div className="text-2xl">⇄</div>
                        </div>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm font-medium text-blue-800 mb-1">
                            {selectedTrade.fromUser.id === currentUser.id ? 'You Want' : 'They Want'}
                          </p>
                          <div className={`inline-block px-3 py-1 rounded text-sm border ${getSkillLevelColor(selectedTrade.requestedSkill.level)}`}>
                            {selectedTrade.requestedSkill.name} ({selectedTrade.requestedSkill.level})
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">Trade Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">{selectedTrade.estimatedDuration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Format:</span>
                          <span className="font-medium">{selectedTrade.sessionType}</span>
                        </div>
                        {selectedTrade.nextSession && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Next Session:</span>
                            <span className="font-medium text-teal-600">
                              {formatDate(selectedTrade.nextSession)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {selectedTrade.status === 'active' && selectedTrade.progress !== undefined && (
                      <div>
                        <h3 className="font-medium text-gray-800 mb-2">Progress</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Sessions Completed</span>
                            <span>{selectedTrade.completedSessions}/{selectedTrade.totalSessions}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-teal-600 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${selectedTrade.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-600">{selectedTrade.progress}% Complete</p>
                        </div>
                      </div>
                    )}

                    {selectedTrade.rating && (
                      <div>
                        <h3 className="font-medium text-gray-800 mb-2">Rating & Review</h3>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex">{renderStarRating(selectedTrade.rating)}</div>
                            <span className="font-medium">({selectedTrade.rating}/5)</span>
                          </div>
                          <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-lg">
                            {selectedTrade.review}
                          </p>
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">Message</h3>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <p className="text-sm text-gray-700">{selectedTrade.message}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 pt-4 border-t">
                  {selectedTrade.status === 'pending' && activeTab === 'incoming' && (
                    <>
                      <button
                        onClick={() => handleAcceptTrade(selectedTrade.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                      >
                        ✓ Accept Trade
                      </button>
                      <button
                        onClick={() => handleDeclineTrade(selectedTrade.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                      >
                        ✗ Decline
                      </button>
                    </>
                  )}
                  {selectedTrade.status === 'active' && (
                    <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                      💬 Message Partner
                    </button>
                  )}
                  {selectedTrade.status === 'completed' && !selectedTrade.rating && (
                    <button 
                      onClick={() => setShowRating(true)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      ⭐ Rate & Review
                    </button>
                  )}
                </div>
              </div>
            ) : showCreateTrade ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Create New Trade</h2>
                  <button
                    onClick={() => setShowCreateTrade(false)}
                    className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Find User</label>
                    <input
                      type="text"
                      className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    {searchTerm && (
                      <div className="mt-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md">
                        {filteredUsers.map(user => (
                          <div
                            key={user.id}
                            className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-200 last:border-b-0 ${
                              selectedUser === user.id ? 'bg-teal-50' : ''
                            }`}
                            onClick={() => {
                              setSelectedUser(user.id);
                              setSearchTerm(user.name);
                            }}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="text-xl">{user.avatar}</div>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-600">
                                  Skills: {user.skills.join(', ')}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Skill You Offer</label>
                      <select
                        className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        value={offeredSkill}
                        onChange={(e) => setOfferedSkill(e.target.value)}
                      >
                        <option value="">Select your skill...</option>
                        {currentUser.skills.map(skill => (
                          <option key={skill.name} value={skill.name}>
                            {skill.name} ({skill.level})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Skill You Want</label>
                      <input
                        type="text"
                        className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="e.g., Photography, Spanish, etc."
                        value={requestedSkill}
                        onChange={(e) => setRequestedSkill(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trade Message</label>
                    <textarea
                      className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      rows="4"
                      placeholder="Introduce yourself and explain what you'd like to learn and teach..."
                      value={tradeMessage}
                      onChange={(e) => setTradeMessage(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setShowCreateTrade(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateTrade}
                      className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                      Send Trade Request
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-6xl mb-4">🤝</div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to Skill Trading Hub</h2>
                <p className="text-gray-600 mb-6">
                  Select a trade from the sidebar to view details, or create a new trade to start learning something new!
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{trades.incoming.length}</div>
                    <div className="text-sm text-gray-600">Incoming</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{trades.outgoing.length}</div>
                    <div className="text-sm text-gray-600">Outgoing</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{trades.active.length}</div>
                    <div className="text-sm text-gray-600">Active</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{trades.completed.length}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Rating Modal */}
      {showRating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Rate Your Experience</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex justify-center space-x-1">
                  {renderStarRating(rating, true)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                <textarea
                  className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  rows="4"
                  placeholder="Share your experience with this trade..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRating(false);
                    setRating(0);
                    setReview('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRating}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Submit Rating
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}