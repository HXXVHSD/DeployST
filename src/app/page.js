'use client'
import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD7rIF6QxS6g7LSHMQZm9QJPn3C1Eu3DTU",
  authDomain: "swaptrade-database.firebaseapp.com",
  projectId: "swaptrade-database",
  storageBucket: "swaptrade-database.firebasestorage.app",
  messagingSenderId: "149234096731",
  appId: "1:149234096731:web:81e6fe3912626e4e41fd7e",
  measurementId: "G-0ZN8JC5ZG2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


export default function SkillSwapWebsite() {
  const [users] = useState([
    { id: "1", name: "Alice Johnson", skills: [{ name: "Web Design", level: "Advanced", videos: 8 }], availability: "Online" },
    { id: "2", name: "Bob Chen", skills: [{ name: "Photography", level: "Intermediate", videos: 5 }], availability: "Online" },
    { id: "3", name: "Carol Smith", skills: [{ name: "Guitar", level: "Advanced", videos: 12 }], availability: "Offline" },
    { id: "4", name: "Emma Davis", skills: [{ name: "Cooking", level: "Advanced", videos: 15 }], availability: "Online" },
    { id: "5", name: "David Wilson", skills: [{ name: "Spanish", level: "Intermediate", videos: 7 }], availability: "Online" },
    { id: "6", name: "Sarah Parker", skills: [{ name: "Programming", level: "Advanced", videos: 20 }], availability: "Online" }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentView, setCurrentView] = useState('main');
  const [skillFilter, setSkillFilter] = useState('');
  const [skillLevelFilter, setSkillLevelFilter] = useState('All Levels');
  const [availabilityFilter, setAvailabilityFilter] = useState('All Statuses');
  const [mySkills, setMySkills] = useState([
    { name: "Cooking", level: "Advanced", videos: 10 },
    { name: "Programming", level: "Intermediate", videos: 6 },
    { name: "Painting", level: "Beginner", videos: 3 }
  ]);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Beginner' });
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [signupForm, setSignupForm] = useState({ email: '', password: '', confirmPassword: '', displayName: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [tradingPartner, setTradingPartner] = useState(null);
  const [tradeOffers, setTradeOffers] = useState([]);

  const skillLevels = ["Beginner", "Intermediate", "Advanced"];
  const availableSkills = ["Web Design", "Photography", "Guitar", "Cooking", "Spanish", "Programming", "Painting", "Marketing", "Writing", "Music Production"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setInitialLoading(false);
    });
    return () => unsubscribe();
  }, []);

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

  const getSkillLevelColor = (level) => ({
    "Beginner": "bg-green-100 text-green-800",
    "Intermediate": "bg-yellow-100 text-yellow-800",
    "Advanced": "bg-red-100 text-red-800"
  }[level] || "bg-gray-100 text-gray-800");

  const getAvailabilityColor = (availability) => 
    availability === "Online" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";

  const handleSignUp = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    const { email, password, confirmPassword, displayName } = signupForm;
    
    if (!email || !password || !confirmPassword || !displayName) {
      setAuthError('All fields are required');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setAuthError('Please enter a valid email address');
      return;
    }
    
    if (password !== confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setAuthError('Password should be at least 6 characters');
      return;
    }
    
    try {
      setAuthLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(userCredential.user, { displayName });
      setSignupForm({ email: '', password: '', confirmPassword: '', displayName: '' });
      setCurrentView('main');
    } catch (error) {
      const errorMessages = {
        'auth/email-already-in-use': 'This email is already in use. Please try another one.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password is too weak. Please use a stronger password.'
      };
      setAuthError(errorMessages[error.code] || error.message || 'Failed to create account');
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
      await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
      setLoginForm({ email: '', password: '' });
      setCurrentView('main');
    } catch (error) {
      const errorMessages = {
        'auth/user-not-found': 'No account found with this email address',
        'auth/wrong-password': 'Incorrect password',
        'auth/invalid-email': 'Invalid email address',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.'
      };
      setAuthError(errorMessages[error.code] || 'Invalid email or password');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
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
    setMySkills([...mySkills, { ...newSkill, videos: 0 }]);
    setNewSkill({ name: '', level: 'Beginner' });
    setShowAddSkill(false);
  };

  const removeSkill = (index) => {
    setMySkills(mySkills.filter((_, i) => i !== index));
  };

  const startTrade = (partner) => {
    setTradingPartner(partner);
    setCurrentView('trading');
  };

  const createTradeOffer = (mySkillIndex, partnerSkillIndex, myVideos, partnerVideos) => {
    const newOffer = {
      id: Date.now(),
      mySkill: mySkills[mySkillIndex],
      partnerSkill: tradingPartner.skills[partnerSkillIndex],
      myVideos: parseInt(myVideos),
      partnerVideos: parseInt(partnerVideos),
      status: 'pending',
      timestamp: new Date().toLocaleString()
    };
    setTradeOffers([...tradeOffers, newOffer]);
  };

  const executeTradeOffer = (offerId) => {
    setTradeOffers(tradeOffers.map(offer => 
      offer.id === offerId 
        ? { ...offer, status: 'completed' }
        : offer
    ));
    
    // Update skill videos after trade
    const completedOffer = tradeOffers.find(offer => offer.id === offerId);
    if (completedOffer) {
      setMySkills(mySkills.map(skill => 
        skill.name === completedOffer.mySkill.name 
          ? { ...skill, videos: Math.max(0, skill.videos - completedOffer.myVideos + completedOffer.partnerVideos) }
          : skill
      ));
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const AuthForm = ({ isSignup = false }) => (
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
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            {isSignup ? 'Create an Account' : 'Log In'}
          </h2>
          
          {authError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {authError}
            </div>
          )}

          <div>
            {isSignup && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="John Doe"
                  value={signupForm.displayName}
                  onChange={(e) => setSignupForm({...signupForm, displayName: e.target.value})}
                />
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="you@example.com"
                value={isSignup ? signupForm.email : loginForm.email}
                onChange={(e) => isSignup 
                  ? setSignupForm({...signupForm, email: e.target.value})
                  : setLoginForm({...loginForm, email: e.target.value})
                }
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="••••••••"
                value={isSignup ? signupForm.password : loginForm.password}
                onChange={(e) => isSignup 
                  ? setSignupForm({...signupForm, password: e.target.value})
                  : setLoginForm({...loginForm, password: e.target.value})
                }
              />
            </div>
            
            {isSignup && (
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="••••••••"
                  value={signupForm.confirmPassword}
                  onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                />
              </div>
            )}
            
            <div className="mb-6">
              <button
                onClick={isSignup ? handleSignUp : handleLogin}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                disabled={authLoading}
              >
                {authLoading 
                  ? (isSignup ? 'Creating Account...' : 'Logging in...') 
                  : (isSignup ? 'Sign Up' : 'Log In')
                }
              </button>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                onClick={() => setCurrentView(isSignup ? 'login' : 'signup')}
                className="text-teal-600 hover:text-teal-800 underline"
              >
                {isSignup ? 'Log In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );

  const UserProfile = ({ user: profileUser, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{profileUser.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
        </div>
        
        <div className="mb-4">
          <span className={`px-2 py-1 rounded text-sm ${getAvailabilityColor(profileUser.availability)}`}>
            {profileUser.availability}
          </span>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2">Skills:</h4>
          <div className="space-y-2">
            {profileUser.skills.map((skill, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded text-sm ${getSkillLevelColor(skill.level)}`}>
                  {skill.name} - {skill.level}
                </span>
                <span className="text-sm text-gray-600 flex items-center">
                  📹 {skill.videos} videos
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-gray-600 mb-3">Ready to start trading skills?</p>
          <button 
            onClick={() => {
              startTrade(profileUser);
              onClose();
            }}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md"
          >
            Start Trade
          </button>
        </div>
      </div>
    </div>
  );

  const TradingInterface = () => {
    const [selectedMySkill, setSelectedMySkill] = useState(0);
    const [selectedPartnerSkill, setSelectedPartnerSkill] = useState(0);
    const [myVideoOffer, setMyVideoOffer] = useState(1);
    const [partnerVideoRequest, setPartnerVideoRequest] = useState(1);

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-teal-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">🔄 Skill Trading</h1>
            <button 
              onClick={() => setCurrentView('main')}
              className="bg-teal-700 hover:bg-teal-800 px-4 py-2 rounded-md"
            >
              ← Back to Main
            </button>
          </div>
        </header>

        <main className="container mx-auto py-6 px-4">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Trading with {tradingPartner.name}</h2>
            <p className="text-gray-600">Exchange skill videos without messaging</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Your Skills Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Your Skills</h3>
              <div className="space-y-3">
                {mySkills.map((skill, index) => (
                  <div 
                    key={index} 
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedMySkill === index ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedMySkill(index)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{skill.name}</span>
                        <span className={`ml-2 px-2 py-1 rounded text-sm ${getSkillLevelColor(skill.level)}`}>
                          {skill.level}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 flex items-center">
                        📹 {skill.videos} videos
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Partner's Skills Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-green-600">{tradingPartner.name}'s Skills</h3>
              <div className="space-y-3">
                {tradingPartner.skills.map((skill, index) => (
                  <div 
                    key={index} 
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedPartnerSkill === index ? 'border-green-500 bg-green-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedPartnerSkill(index)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{skill.name}</span>
                        <span className={`ml-2 px-2 py-1 rounded text-sm ${getSkillLevelColor(skill.level)}`}>
                          {skill.level}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 flex items-center">
                        📹 {skill.videos} videos
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trade Proposal Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Create Trade Offer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <h4 className="font-medium mb-3 text-blue-600">You Give</h4>
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <p className="font-medium">{mySkills[selectedMySkill]?.name}</p>
                  <div className="mt-3">
                    <label className="block text-sm text-gray-600 mb-2">Videos to offer:</label>
                    <input
                      type="number"
                      min="1"
                      max={mySkills[selectedMySkill]?.videos || 0}
                      value={myVideoOffer}
                      onChange={(e) => setMyVideoOffer(e.target.value)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded text-center"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Max: {mySkills[selectedMySkill]?.videos || 0} videos
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h4 className="font-medium mb-3 text-green-600">You Get</h4>
                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <p className="font-medium">{tradingPartner.skills[selectedPartnerSkill]?.name}</p>
                  <div className="mt-3">
                    <label className="block text-sm text-gray-600 mb-2">Videos to request:</label>
                    <input
                      type="number"
                      min="1"
                      max={tradingPartner.skills[selectedPartnerSkill]?.videos || 0}
                      value={partnerVideoRequest}
                      onChange={(e) => setPartnerVideoRequest(e.target.value)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded text-center"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Max: {tradingPartner.skills[selectedPartnerSkill]?.videos || 0} videos
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => createTradeOffer(selectedMySkill, selectedPartnerSkill, myVideoOffer, partnerVideoRequest)}
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-md font-medium"
                disabled={!mySkills[selectedMySkill] || !tradingPartner.skills[selectedPartnerSkill]}
              >
                Create Trade Offer
              </button>
            </div>
          </div>

          {/* Trade Offers Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Trade Offers</h3>
            {tradeOffers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No trade offers yet</p>
            ) : (
              <div className="space-y-4">
                {tradeOffers.map((offer) => (
                  <div key={offer.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500">{offer.timestamp}</span>
                          <span className={`px-2 py-1 rounded text-sm ${
                            offer.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {offer.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                          <div className="text-center">
                            <p className="font-medium text-blue-600">You Give</p>
                            <p>{offer.mySkill.name}</p>
                            <p className="text-sm text-gray-600">📹 {offer.myVideos} videos</p>
                          </div>
                          <div className="text-center">
                            <span className="text-2xl">↔️</span>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-green-600">You Get</p>
                            <p>{offer.partnerSkill.name}</p>
                            <p className="text-sm text-gray-600">📹 {offer.partnerVideos} videos</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {offer.status === 'pending' && (
                      <div className="text-center">
                        <button
                          onClick={() => executeTradeOffer(offer.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                        >
                          Execute Trade
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  };

  if (currentView === 'signup') return <AuthForm isSignup={true} />;
  if (currentView === 'login') return <AuthForm isSignup={false} />;
  if (currentView === 'trading') return <TradingInterface />;

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
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Find Users ({filteredUsers.length})</h2>
          
          <div className="space-y-4 mb-6">
            <input
              type="text"
              className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:ring-2 focus:ring-teal-500"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <select
              className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:ring-2 focus:ring-teal-500"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            >
              <option value="">All Skills</option>
              {availableSkills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
            
            <div className="grid grid-cols-2 gap-2">
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
          </div>

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
                  <div className="space-y-2">
                    {user.skills.map((skill, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${getSkillLevelColor(skill.level)}`}>
                          {skill.name}
                        </span>
                        <span className="text-xs text-gray-600">📹 {skill.videos}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

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

          {showAddSkill && user && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium mb-3">Add New Skill</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                  placeholder="Enter skill name..."
                />
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({...newSkill, level: e.target.value})}
                >
                  {skillLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
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

          {user ? (
            <div className="space-y-3">
              {mySkills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{skill.name}</span>
                    <span className={`px-2 py-1 rounded text-sm ${getSkillLevelColor(skill.level)}`}>
                      {skill.level}
                    </span>
                    <span className="text-sm text-gray-600">📹 {skill.videos}</span>
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
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold mb-2">Welcome to Skill Swap!</h3>
              <p className="text-gray-600 mb-6">
                Connect with others to exchange skills and knowledge. Browse users, 
                filter by skills or availability, and start meaningful exchanges.
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
                <p className="text-sm text-blue-700">
                  1. Sign up and add your skills • 2. Browse users • 3. Use filters to find specific skills • 4. Click users to view profiles and start trading
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {selectedUser && (
        <UserProfile user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}