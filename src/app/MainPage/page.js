'use client'
import React, { useState, useEffect } from 'react';

// Mock Firebase auth for demo purposes - replace with your actual firebase config
const mockAuth = {
  currentUser: null,
  signInWithEmailAndPassword: async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === 'demo@example.com' && password === 'password') {
      return { user: { uid: '123', email, displayName: 'Demo User' } };
    }
    throw new Error('Invalid credentials');
  },
  createUserWithEmailAndPassword: async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { user: { uid: '456', email, displayName: null } };
  },
  updateProfile: async (user, profile) => {
    // Simulate profile update
    await new Promise(resolve => setTimeout(resolve, 500));
  },
  signOut: async () => {
    // Simulate sign out
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};

export default function SkillSwapWebsite() {
  const [users] = useState([
    {
      id: "1",
      name: "Alice Johnson",
      skills: [{ name: "Web Design", level: "Advanced" }],
      availability: "Online"
    },
    {
      id: "2", 
      name: "Bob Chen",
      skills: [{ name: "Photography", level: "Intermediate" }],
      availability: "Online"
    },
    {
      id: "3",
      name: "Carol Smith", 
      skills: [{ name: "Guitar", level: "Advanced" }],
      availability: "Offline"
    },
    {
      id: "4",
      name: "Emma Davis",
      skills: [{ name: "Cooking", level: "Advanced" }],
      availability: "Online"
    },
    {
      id: "5",
      name: "David Wilson",
      skills: [{ name: "Spanish", level: "Intermediate" }],
      availability: "Online"
    },
    {
      id: "6",
      name: "Sarah Parker",
      skills: [{ name: "Programming", level: "Advanced" }],
      availability: "Online"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentView, setCurrentView] = useState('main');
  const [skillFilter, setSkillFilter] = useState('');
  const [skillLevelFilter, setSkillLevelFilter] = useState('All Levels');
  const [availabilityFilter, setAvailabilityFilter] = useState('All Statuses');
  const [mySkills, setMySkills] = useState([
    { name: "Cooking", level: "Advanced" },
    { name: "Programming", level: "Intermediate" },
    { name: "Painting", level: "Beginner" }
  ]);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Beginner' });
  const [showAddSkill, setShowAddSkill] = useState(false);

  // Authentication states
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Sign up form
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });

  // Login form
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const skillLevels = ["Beginner", "Intermediate", "Advanced"];
  const availableSkills = ["Web Design", "Photography", "Guitar", "Cooking", "Spanish", "Programming", "Painting", "Marketing", "Writing", "Music Production"];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill = !skillFilter || user.skills.some(skill => 
      skill.name.toLowerCase().includes(skillFilter.toLowerCase())
    );
    const matchesLevel = skillLevelFilter === 'All Levels' || user.skills.some(skill => 
      skill.level === skillLevelFilter
    );
    const matchesAvailability = availabilityFilter === 'All Statuses' || user.availability === availabilityFilter;
    
    return matchesSearch && matchesSkill && matchesLevel && matchesAvailability;
  });

  const getSkillLevelColor = (level) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailabilityColor = (availability) => {
    return availability === "Online" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };

  // Authentication functions
  const handleSignUp = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    // Enhanced email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Basic validation
    if (!signupForm.email || !signupForm.password || !signupForm.confirmPassword || !signupForm.displayName) {
      setAuthError('All fields are required');
      return;
    }
    
    if (!emailRegex.test(signupForm.email)) {
      setAuthError('Please enter a valid email address');
      return;
    }
    
    if (signupForm.password !== signupForm.confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }
    
    if (signupForm.password.length < 6) {
      setAuthError('Password should be at least 6 characters');
      return;
    }
    
    try {
      setAuthLoading(true);
      
      // Create user with email and password
      const userCredential = await mockAuth.createUserWithEmailAndPassword(signupForm.email.trim(), signupForm.password);
      const newUser = userCredential.user;
      
      // Update user profile with display name
      await mockAuth.updateProfile(newUser, {
        displayName: signupForm.displayName
      });
      
      setUser({ ...newUser, displayName: signupForm.displayName });
      
      // Clear form and go to main page
      setSignupForm({ email: '', password: '', confirmPassword: '', displayName: '' });
      setCurrentView('main');
      
    } catch (error) {
      console.error('Error signing up:', error);
      
      if (error.message.includes('email-already-in-use')) {
        setAuthError('This email is already in use. Please try another one.');
      } else if (error.message.includes('invalid-email')) {
        setAuthError('Please enter a valid email address.');
      } else if (error.message.includes('weak-password')) {
        setAuthError('Password is too weak. Please use a stronger password.');
      } else {
        setAuthError(error.message || 'Failed to create account');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    if (!loginForm.email || !loginForm.password) {
      setAuthError('Please enter both email and password');
      return;
    }
    
    try {
      setAuthLoading(true);
      
      const userCredential = await mockAuth.signInWithEmailAndPassword(loginForm.email, loginForm.password);
      setUser(userCredential.user);
      
      // Clear form and go to main page
      setLoginForm({ email: '', password: '' });
      setCurrentView('main');
      
    } catch (error) {
      console.error('Error logging in:', error);
      setAuthError('Invalid email or password');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await mockAuth.signOut();
      setUser(null);
      setCurrentView('main');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) {
      alert('Please enter a skill name');
      return;
    }
    setMySkills([...mySkills, { ...newSkill }]);
    setNewSkill({ name: '', level: 'Beginner' });
    setShowAddSkill(false);
  };

  const removeSkill = (index) => {
    setMySkills(mySkills.filter((_, i) => i !== index));
  };

  // Sign Up Page
  if (currentView === 'signup') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-teal-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">🔄 Skill Swap</h1>
            <button 
              onClick={() => setCurrentView('main')}
              className="bg-teal-700 hover:bg-teal-800 px-4 py-2 rounded-md"
            >
              ← Back
            </button>
          </div>
        </header>

        <main className="container mx-auto py-12 px-4 max-w-md">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create an Account</h2>
            
            {authError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {authError}
              </div>
            )}

            <form onSubmit={handleSignUp}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="displayName">
                  Full Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="John Doe"
                  value={signupForm.displayName}
                  onChange={(e) => setSignupForm({...signupForm, displayName: e.target.value})}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="you@example.com"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="••••••••"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="••••••••"
                  value={signupForm.confirmPassword}
                  onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                disabled={authLoading}
              >
                {authLoading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button 
                  onClick={() => setCurrentView('login')}
                  className="text-teal-600 hover:text-teal-800 underline"
                >
                  Log In
                </button>
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Login Page
  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-teal-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">🔄 Skill Swap</h1>
            <button 
              onClick={() => setCurrentView('main')}
              className="bg-teal-700 hover:bg-teal-800 px-4 py-2 rounded-md"
            >
              ← Back
            </button>
          </div>
        </header>

        <main className="container mx-auto py-12 px-4 max-w-md">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Log In</h2>
            
            {authError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="loginEmail">
                  Email Address
                </label>
                <input
                  id="loginEmail"
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="you@example.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="loginPassword">
                  Password
                </label>
                <input
                  id="loginPassword"
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                disabled={authLoading}
              >
                {authLoading ? 'Logging in...' : 'Log In'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button 
                  onClick={() => setCurrentView('signup')}
                  className="text-teal-600 hover:text-teal-800 underline"
                >
                  Sign Up
                </button>
              </p>
              <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-700">
                <strong>Demo:</strong> Use email: demo@example.com, password: password
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Main Application
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🔄 Skill Swap</h1>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm">Welcome, {user.displayName || user.email}!</span>
                <button 
                  onClick={handleSignOut}
                  className="bg-teal-700 hover:bg-teal-800 px-4 py-2 rounded-md text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentView('login')}
                  className="bg-teal-700 hover:bg-teal-800 px-4 py-2 rounded-md"
                >
                  Log In
                </button>
                <button 
                  onClick={() => setCurrentView('signup')}
                  className="bg-teal-700 hover:bg-teal-800 px-4 py-2 rounded-md"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search and User List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Find Users ({filteredUsers.length})</h2>
          
          {/* Search Users */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
            <input
              type="text"
              className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:ring-2 focus:ring-teal-500"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter by Skills */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Skills</label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:ring-2 focus:ring-teal-500"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            >
              <option value="">Select a skill...</option>
              {availableSkills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
            <input
              type="text"
              className="w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-2 focus:ring-teal-500 mt-2"
              placeholder="Or type to search skills..."
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            />
          </div>

          {/* Skill Level Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Skill Level</label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:ring-2 focus:ring-teal-500"
              value={skillLevelFilter}
              onChange={(e) => setSkillLevelFilter(e.target.value)}
            >
              <option value="All Levels">All Levels</option>
              {skillLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:ring-2 focus:ring-teal-500"
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          {/* User List */}
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No users found</p>
            ) : (
              filteredUsers.map(user => (
                <div 
                  key={user.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-800">{user.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getAvailabilityColor(user.availability)}`}>
                      {user.availability}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, idx) => (
                      <span key={idx} className={`text-xs px-2 py-1 rounded-full ${getSkillLevelColor(skill.level)}`}>
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Skills Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Skills ({mySkills.length})</h2>
            {user && (
              <button 
                onClick={() => setShowAddSkill(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm"
              >
                + Add Skill
              </button>
            )}
          </div>

          {!user && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-blue-700 mb-2">Please log in to manage your skills</p>
              <button 
                onClick={() => setCurrentView('login')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Log In
              </button>
            </div>
          )}

          {/* Add Skill Form */}
          {showAddSkill && user && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium mb-3">Add New Skill</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                    placeholder="Enter skill name..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({...newSkill, level: e.target.value})}
                  >
                    {skillLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddSkill}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Add Skill
                  </button>
                  <button
                    onClick={() => setShowAddSkill(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* My Skills List */}
          {user && (
            <div className="space-y-3">
              {mySkills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{skill.name}</span>
                    <span className={`px-2 py-1 rounded text-sm ${getSkillLevelColor(skill.level)}`}>
                      {skill.level}
                    </span>
                  </div>
                  <button
                    onClick={() => removeSkill(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Welcome Section */}
          {!selectedUser && (
            <div className="mt-8 text-center py-8 border-t">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold mb-2">Welcome to Skill Swap!</h3>
              <p className="text-gray-600 mb-6">
                Connect with others to exchange skills and knowledge. Browse users on the left, 
                filter by skills or availability, and start meaningful skill exchanges.
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">👥</div>
                  <h4 className="font-medium">Find Users</h4>
                  <p className="text-sm text-gray-600">Browse skilled individuals</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <h4 className="font-medium">Match Skills</h4>
                  <p className="text-sm text-gray-600">Find complementary abilities</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🤝</div>
                  <h4 className="font-medium">Exchange</h4>
                  <p className="text-sm text-gray-600">Share knowledge & learn</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">🎯 Getting Started</h4>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. {!user ? 'Log in and add' : 'Add'} your skills using the "Add Skill" button above</li>
                  <li>2. Browse users in the left sidebar</li>
                  <li>3. Use filters to find people with specific skills</li>
                  <li>4. Click on a user to view their profile and start exchanging</li>
                </ol>
              </div>
            </div>
          )}

          {/* Selected User Details */}
          {selectedUser && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">User Details</h3>
              <div className="mb-6">
                <h4 className="text-2xl font-bold text-gray-800 mb-2">{selectedUser.name}</h4>
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${getAvailabilityColor(selectedUser.availability)}`}>
                  {selectedUser.availability}
                </span>
              </div>
              
              <div className="mb-6">
                <h5 className="text-lg font-semibold mb-3">Skills</h5>
                <div className="space-y-2">
                  {selectedUser.skills.map((skill, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <span className="font-medium">{skill.name}</span>
                      <span className={`px-2 py-1 rounded text-sm ${getSkillLevelColor(skill.level)}`}>
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3">
                {user ? (
                  <>
                    <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md">
                      💬 Message
                    </button>
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
                      🤝 Request Skill Swap
                    </button>
                  </>
                ) : (
                  <div className="w-full text-center p-3 bg-gray-100 rounded-md">
                    <p className="text-gray-600 mb-2">Please log in to contact users</p>
                    <button 
                      onClick={() => setCurrentView('login')}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Log In
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}