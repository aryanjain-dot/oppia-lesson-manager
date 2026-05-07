import { useState, useEffect, useCallback, useRef } from "react";
import {
  BookOpen, Plus, Edit3, Trash2, ChevronRight, CheckCircle, XCircle,
  BarChart2, Users, Award, TrendingUp, LogOut, Eye, Home, Settings,
  Play, FileText, HelpCircle, AlignLeft, Video, Star, Clock, Target,
  AlertTriangle, Lightbulb, ArrowLeft, ArrowRight, Save, X, PlusCircle,
  Layers, Activity, Zap, Brain, RotateCcw, ChevronDown, ChevronUp,
  Search, Bell, User, Lock, Mail, BookMarked, GraduationCap, Flame,
  TrendingDown, BarChart, PieChart, Filter
} from "lucide-react";

import {
  BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart as RePieChart, Pie,
  Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_LESSONS = [
  {
    id: "l1", title: "Introduction to Algebra", description: "Learn the fundamentals of algebraic expressions, equations, and problem-solving techniques.", author: "Dr. Priya Sharma", category: "Mathematics", difficulty: "Beginner", duration: 25, thumbnail: "📐",
    blocks: [
      { id: "b1", type: "text", content: "Algebra is the branch of mathematics that uses letters and symbols to represent numbers and quantities in formulas and equations. The word 'algebra' comes from the Arabic word 'al-jabr'.", },
      { id: "b2", type: "video", url: "https://www.youtube.com/embed/NybHckSEQBI", title: "Introduction to Algebra - Khan Academy" },
      { id: "b3", type: "mcq", question: "What does the variable 'x' represent in algebra?", options: ["A fixed number", "An unknown value", "The number 10", "A letter only"], correct: 1, feedback: { correct: "Exactly right! Variables like 'x' represent unknown or changeable values that we solve for.", wrong: { 0: "Not quite — 'x' is not fixed. It can represent different values depending on the equation.", 2: "'x' is not specifically the number 10. It's a placeholder for an unknown value.", 3: "While 'x' is a letter, its purpose in algebra is to represent an unknown number, not just serve as a letter." } }, hint: "Think about why we use letters instead of numbers in equations — what are we trying to find?" },
      { id: "b4", type: "fill", question: "In the equation 2x + 3 = 7, the value of x is ___.", answer: "2", hint: "Subtract 3 from both sides, then divide by 2.", feedback: { correct: "Perfect! 2(2) + 3 = 7 ✓", wrong: "Remember: isolate x by doing the same operation on both sides of the equation." } },
      { id: "b5", type: "mcq", question: "Which of the following is an algebraic expression?", options: ["15 + 30", "3x² - 2x + 1", "100 ÷ 5", "π × 4"], correct: 1, feedback: { correct: "Correct! An algebraic expression contains variables (like x) combined with numbers and operations.", wrong: { 0: "This is just arithmetic — there are no variables.", 2: "This is pure division — no variables present.", 3: "π is a constant, not a variable. This is an arithmetic expression." } }, hint: "Look for the expression that contains letters (variables) mixed with numbers." }
    ],
    stats: { attempts: 234, avgScore: 78, completionRate: 82, questionFails: { b3: 45, b4: 62, b5: 28 } }
  },
  {
    id: "l2", title: "Photosynthesis Deep Dive", description: "Explore how plants convert sunlight into energy through the process of photosynthesis.", author: "Prof. Arjun Mehta", category: "Biology", difficulty: "Intermediate", duration: 35, thumbnail: "🌿",
    blocks: [
      { id: "b6", type: "text", content: "Photosynthesis is the process used by plants, algae, and some bacteria to convert light energy into chemical energy stored in glucose. This process is fundamental to life on Earth." },
      { id: "b7", type: "video", url: "https://www.youtube.com/embed/sQK3Yr4Sc_k", title: "Photosynthesis Explained" },
      { id: "b8", type: "mcq", question: "Where does photosynthesis primarily occur in plant cells?", options: ["Mitochondria", "Nucleus", "Chloroplasts", "Cell membrane"], correct: 2, feedback: { correct: "Brilliant! Chloroplasts contain chlorophyll, the green pigment that captures light energy.", wrong: { 0: "Mitochondria are the powerhouses for cellular respiration, not photosynthesis.", 1: "The nucleus contains genetic information, not photosynthetic machinery.", 3: "The cell membrane controls what enters/exits the cell, but doesn't perform photosynthesis." } }, hint: "Think about what makes plants green — which organelle contains that green pigment?" },
      { id: "b9", type: "fill", question: "The chemical formula for glucose produced in photosynthesis is C___H12O6.", answer: "6", hint: "Glucose has 6 carbon atoms, 12 hydrogen atoms, and 6 oxygen atoms.", feedback: { correct: "Excellent! C6H12O6 is glucose — the energy-rich sugar plants produce.", wrong: "The formula for glucose is C6H12O6. There are 6 carbon atoms in a glucose molecule." } }
    ],
    stats: { attempts: 189, avgScore: 71, completionRate: 74, questionFails: { b8: 38, b9: 55 } }
  },
  {
    id: "l3", title: "World War II: Key Events", description: "A comprehensive timeline of the major events, turning points, and consequences of World War II.", author: "Dr. Kavya Reddy", category: "History", difficulty: "Intermediate", duration: 40, thumbnail: "🌍",
    blocks: [
      { id: "b10", type: "text", content: "World War II (1939–1945) was the deadliest conflict in human history, involving more than 30 countries and resulting in 70–85 million deaths. It reshaped the political map and social structure of the world." },
      { id: "b11", type: "mcq", question: "In which year did World War II begin?", options: ["1935", "1937", "1939", "1941"], correct: 2, feedback: { correct: "Correct! WWII began on September 1, 1939, when Germany invaded Poland.", wrong: { 0: "1935 saw the Nuremberg Laws enacted in Germany, but the war had not yet begun.", 1: "1937 saw Japan invade China, but the formal start of WWII is generally dated to 1939.", 3: "1941 was when the US entered the war after Pearl Harbor, but the war began earlier." } }, hint: "Think about when Germany invaded Poland — that's the event that triggered declarations of war." },
      { id: "b12", type: "fill", question: "The D-Day invasion took place on June 6, ____.", answer: "1944", hint: "D-Day was in the final year of the war in Europe.", feedback: { correct: "Perfect! June 6, 1944 — Operation Overlord began the liberation of Western Europe.", wrong: "D-Day (Operation Overlord) occurred on June 6, 1944, when Allied forces landed in Normandy, France." } }
    ],
    stats: { attempts: 156, avgScore: 68, completionRate: 79, questionFails: { b11: 42, b12: 48 } }
  }
];

const MOCK_STUDENT_STATS = {
  totalLessons: 3, completed: 2, streak: 7, xp: 1240,
  weakTopics: ["Fill-in-the-blank questions", "Chemical Formulas", "Dates & Timelines"],
  strongTopics: ["Conceptual Understanding", "Visual Learning", "Multiple Choice"],
  recentActivity: [
    { date: "Mon", score: 65 }, { date: "Tue", score: 72 }, { date: "Wed", score: 68 },
    { date: "Thu", score: 80 }, { date: "Fri", score: 85 }, { date: "Sat", score: 78 }, { date: "Sun", score: 90 }
  ],
  categoryScores: [
    { category: "Math", score: 78 }, { category: "Biology", score: 65 }, { category: "History", score: 55 },
    { category: "Physics", score: 82 }, { category: "Chemistry", score: 60 }
  ]
};

const COLORS = ["#6366f1", "#22d3ee", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

// ─── UTILITIES ────────────────────────────────────────────────────────────────
const generateId = () => Math.random().toString(36).substr(2, 9);
const difficultyColor = { Beginner: "text-emerald-400 bg-emerald-400/10", Intermediate: "text-amber-400 bg-amber-400/10", Advanced: "text-rose-400 bg-rose-400/10" };
const categoryColor = { Mathematics: "#6366f1", Biology: "#10b981", History: "#f59e0b", Physics: "#3b82f6", Chemistry: "#8b5cf6" };

// ─── PERSISTENT STORAGE HELPERS ───────────────────────────────────────────────
const LS_LESSONS_KEY = "oppia_lessons";
const LS_USERS_KEY   = "oppia_users";

function loadLessons() {
  try {
    const raw = localStorage.getItem(LS_LESSONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  // First boot — seed with mock data and persist immediately
  localStorage.setItem(LS_LESSONS_KEY, JSON.stringify(MOCK_LESSONS));
  return MOCK_LESSONS;
}

function saveLessons(lessons) {
  localStorage.setItem(LS_LESSONS_KEY, JSON.stringify(lessons));
}

function loadUsers() {
  try {
    const raw = localStorage.getItem(LS_USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return {};
}

function saveUsers(users) {
  localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));
}

// ─── MOCK API (localStorage-backed) ──────────────────────────────────────────
const mockAPI = {
  getLessons: async () => {
    await new Promise(r => setTimeout(r, 200));
    return loadLessons();
  },
  createLesson: async (lesson) => {
    await new Promise(r => setTimeout(r, 300));
    const created = { ...lesson, id: generateId(), stats: { attempts: 0, avgScore: 0, completionRate: 0, questionFails: {} } };
    const lessons = loadLessons();
    lessons.push(created);
    saveLessons(lessons);
    return created;
  },
  updateLesson: async (lesson) => {
    await new Promise(r => setTimeout(r, 200));
    const lessons = loadLessons().map(l => l.id === lesson.id ? lesson : l);
    saveLessons(lessons);
    return lesson;
  },
  deleteLesson: async (id) => {
    await new Promise(r => setTimeout(r, 150));
    saveLessons(loadLessons().filter(l => l.id !== id));
    return { success: true };
  },
};

// ─── AUTH SCREEN ──────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const email = form.email.trim().toLowerCase();
    if (!email || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);

    const users = loadUsers();

    if (mode === "signup") {
      if (!form.name.trim()) { setError("Please enter your full name."); return; }
      if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
      if (users[email]) { setError("An account with this email already exists. Please sign in."); return; }
      const newUser = { name: form.name.trim(), email, password: form.password, role };
      users[email] = newUser;
      saveUsers(users);
      onLogin({ name: newUser.name, email, role });
    } else {
      const existing = users[email];
      if (!existing) { setError("No account found with this email. Please sign up first."); return; }
      if (existing.password !== form.password) { setError("Incorrect password. Please try again."); return; }
      if (existing.role !== role) {
        setError('This account is registered as "' + existing.role + '" — please select that role to sign in.');
        return;
      }
      onLogin({ name: existing.name, email, role: existing.role });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-3xl" />
      </div>
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <GraduationCap size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Oppia Learn</span>
          </div>
          <p className="text-slate-400 text-sm">Interactive learning for curious minds</p>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex bg-slate-800/50 rounded-2xl p-1 mb-6">
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === m ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}>
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>
          <div className="mb-5">
            <p className="text-slate-400 text-xs mb-2 font-medium">I am a:</p>
            <div className="flex gap-2">
              {[{ v: "student", icon: BookOpen, label: "Student" }, { v: "creator", icon: Edit3, label: "Creator" }, { v: "admin", icon: BarChart2, label: "Admin" }].map(({ v, icon: Icon, label }) => (
                <button key={v} onClick={() => setRole(v)}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-semibold transition-all ${role === v ? "border-indigo-500 bg-indigo-500/10 text-indigo-400" : "border-slate-700 text-slate-500 hover:border-slate-600"}`}>
                  <Icon size={16} />  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {mode === "signup" && (
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
            )}
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="email" placeholder="Email address" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="password" placeholder="Password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
          </div>
          {error && <p className="mt-3 text-rose-400 text-xs flex items-center gap-1"><AlertTriangle size={12} />{error}</p>}
          <button onClick={handleSubmit} disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2">
            {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Authenticating...</> : (mode === "login" ? "Sign In" : "Create Account")}
          </button>
          <p className="text-center text-slate-600 text-xs mt-4">Demo: any email + password works</p>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE MODAL ────────────────────────────────────────────────────────────
function ProfileModal({ user, onClose, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, email: user.email, bio: user.bio || "", location: user.location || "", password: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const roleColors = { student: "from-indigo-500 to-cyan-500", creator: "from-violet-500 to-purple-600", admin: "from-rose-500 to-orange-500" };
  const roleLabels = { student: "Student", creator: "Content Creator", admin: "Administrator" };
  const joinDate = "January 2025";
  const stats = user.role === "student"
    ? [{ label: "Lessons Done", val: "3" }, { label: "Avg Score", val: "74%" }, { label: "Day Streak", val: "7" }, { label: "XP", val: "1,240" }]
    : user.role === "creator"
    ? [{ label: "Lessons Made", val: "3" }, { label: "Total Learners", val: "579" }, { label: "Avg Score", val: "72%" }, { label: "Completion", val: "78%" }]
    : [{ label: "Total Users", val: "1,248" }, { label: "Active Lessons", val: "3" }, { label: "Daily Active", val: "324" }, { label: "Avg Score", val: "72%" }];

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Name cannot be empty."); return; }
    if (form.password && form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (form.password && form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    setSaving(true); setError(""); setSuccess("");
    await new Promise(r => setTimeout(r, 600));

    // Persist to localStorage user registry
    const users = loadUsers();
    const key = user.email.toLowerCase();
    if (users[key]) {
      users[key].name = form.name.trim();
      users[key].bio = form.bio;
      users[key].location = form.location;
      if (form.password) users[key].password = form.password;
      saveUsers(users);
    }

    setSaving(false);
    setSuccess("Profile updated successfully!");
    setEditing(false);
    onUpdate({ ...user, name: form.name.trim(), bio: form.bio, location: form.location });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header banner */}
        <div className={`h-24 bg-gradient-to-br ${roleColors[user.role]} relative`}>
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition-all">
            <X size={16} />
          </button>
        </div>
        {/* Avatar */}
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${roleColors[user.role]} flex items-center justify-center text-white text-3xl font-black border-4 border-slate-900 shadow-xl`}>
              {user.name[0].toUpperCase()}
            </div>
            <button onClick={() => { setEditing(!editing); setError(""); setSuccess(""); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${editing ? "bg-slate-700 text-slate-300" : "bg-indigo-600 hover:bg-indigo-500 text-white"}`}>
              {editing ? <><X size={14} />Cancel</> : <><Edit3 size={14} />Edit Profile</>}
            </button>
          </div>

          {!editing ? (
            <>
              <div className="mb-4">
                <h2 className="text-white text-xl font-bold">{user.name}</h2>
                <p className="text-indigo-400 text-sm font-medium capitalize">{roleLabels[user.role]}</p>
                <p className="text-slate-500 text-xs mt-1">{user.email}</p>
                {user.bio && <p className="text-slate-400 text-sm mt-2 leading-relaxed">{user.bio}</p>}
                {user.location && (
                  <p className="text-slate-500 text-xs mt-1.5 flex items-center gap-1.5">
                    <span>📍</span>{user.location}
                  </p>
                )}
                <p className="text-slate-600 text-xs mt-1.5 flex items-center gap-1.5">
                  <span>📅</span>Joined {joinDate}
                </p>
              </div>
              {/* Stats grid */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {stats.map(({ label, val }) => (
                  <div key={label} className="bg-slate-800/60 rounded-xl p-2.5 text-center">
                    <p className="text-white text-sm font-bold">{val}</p>
                    <p className="text-slate-500 text-xs leading-tight mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
              {/* Role badge */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r ${roleColors[user.role]} bg-opacity-10`}>
                <GraduationCap size={14} className="text-white" />
                <span className="text-white text-xs font-semibold">{roleLabels[user.role]} Account</span>
                <span className="ml-auto text-white/60 text-xs">✓ Verified</span>
              </div>
              {success && <p className="mt-3 text-emerald-400 text-xs flex items-center gap-1.5"><CheckCircle size={12} />{success}</p>}
            </>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Full Name</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Email <span className="text-slate-600">(read-only)</span></label>
                <input value={form.email} disabled
                  className="w-full bg-slate-800/40 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-500 text-sm cursor-not-allowed" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Bio</label>
                <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={2} placeholder="Tell us about yourself..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Location</label>
                <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="City, Country"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">New Password <span className="text-slate-600">(leave blank to keep current)</span></label>
                <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Min 6 characters"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
              {form.password && (
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Confirm Password</label>
                  <input type="password" value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} placeholder="Repeat new password"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
              )}
              {error && <p className="text-rose-400 text-xs flex items-center gap-1.5"><AlertTriangle size={12} />{error}</p>}
              <button onClick={handleSave} disabled={saving}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : <><Save size={15} />Save Changes</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ user, view, setView, onLogout, onOpenProfile }) {
  const studentNav = [
    { id: "home", icon: Home, label: "Dashboard" },
    { id: "lessons", icon: BookOpen, label: "Lessons" },
    { id: "my-progress", icon: TrendingUp, label: "My Progress" },
  ];
  const creatorNav = [
    { id: "creator-dashboard", icon: BarChart2, label: "Overview" },
    { id: "my-lessons", icon: Layers, label: "My Lessons" },
    { id: "lesson-editor", icon: Edit3, label: "Create Lesson" },
    { id: "creator-analytics", icon: Activity, label: "Analytics" },
  ];
  const adminNav = [
    { id: "admin-dashboard", icon: BarChart2, label: "Admin Panel" },
    { id: "all-lessons", icon: BookOpen, label: "All Lessons" },
    { id: "users", icon: Users, label: "Users" },
  ];

  const navItems = user.role === "creator" ? creatorNav : user.role === "admin" ? adminNav : studentNav;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <GraduationCap size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Oppia Learn</p>
            <p className="text-slate-500 text-xs capitalize">{user.role} Portal</p>
          </div>
        </div>
      </div>
      <div className="p-4 border-b border-slate-800">
        <button onClick={onOpenProfile} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 hover:border hover:border-indigo-500/40 transition-all group text-left">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user.name[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-semibold truncate group-hover:text-indigo-300 transition-colors">{user.name}</p>
            <p className="text-slate-500 text-xs capitalize">{user.role}</p>
          </div>
          <ChevronRight size={13} className="text-slate-600 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setView(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${view === id ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}>
            <Icon size={18} />
            {label}
            {view === id && <ChevronRight size={14} className="ml-auto" />}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 text-sm font-medium transition-all">
          <LogOut size={18} />Logout
        </button>
      </div>
    </aside>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color = "indigo", trend }) {
  const colors = { indigo: "from-indigo-500 to-indigo-600", cyan: "from-cyan-500 to-cyan-600", emerald: "from-emerald-500 to-emerald-600", amber: "from-amber-500 to-amber-600", violet: "from-violet-500 to-violet-600", rose: "from-rose-500 to-rose-600" };
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-lg`}>
          <Icon size={18} className="text-white" />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold flex items-center gap-1 ${trend >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-slate-400 text-sm">{label}</p>
      {sub && <p className="text-slate-600 text-xs mt-1">{sub}</p>}
    </div>
  );
}

// ─── LESSON CARD ──────────────────────────────────────────────────────────────
function LessonCard({ lesson, onStart, onEdit, onDelete, showActions }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all group">
      <div className="h-2 bg-gradient-to-r from-indigo-600 to-cyan-500" style={{ background: `linear-gradient(90deg, ${categoryColor[lesson.category] || "#6366f1"}, #22d3ee)` }} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl">{lesson.thumbnail}</span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${difficultyColor[lesson.difficulty]}`}>{lesson.difficulty}</span>
        </div>
        <h3 className="text-white font-bold text-base mb-1.5 line-clamp-1 group-hover:text-indigo-300 transition-colors">{lesson.title}</h3>
        <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed">{lesson.description}</p>
        <div className="flex items-center gap-3 mb-4 text-slate-600 text-xs">
          <span className="flex items-center gap-1"><Clock size={11} />{lesson.duration}m</span>
          <span className="flex items-center gap-1"><User size={11} />{lesson.author}</span>
          <span className="flex items-center gap-1"><Layers size={11} />{lesson.blocks.length} blocks</span>
        </div>
        {lesson.stats && (
          <div className="flex gap-3 mb-4">
            <div className="flex-1 bg-slate-800/50 rounded-lg p-2 text-center">
              <p className="text-white text-sm font-bold">{lesson.stats.avgScore}%</p>
              <p className="text-slate-600 text-xs">Avg Score</p>
            </div>
            <div className="flex-1 bg-slate-800/50 rounded-lg p-2 text-center">
              <p className="text-white text-sm font-bold">{lesson.stats.attempts}</p>
              <p className="text-slate-600 text-xs">Attempts</p>
            </div>
            <div className="flex-1 bg-slate-800/50 rounded-lg p-2 text-center">
              <p className="text-white text-sm font-bold">{lesson.stats.completionRate}%</p>
              <p className="text-slate-600 text-xs">Complete</p>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          {onStart && <button onClick={() => onStart(lesson)} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all"><Play size={13} />Start Lesson</button>}
          {showActions && <>
            <button onClick={() => onEdit(lesson)} className="p-2.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-xl transition-all"><Edit3 size={15} /></button>
            <button onClick={() => onDelete(lesson.id)} className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all"><Trash2 size={15} /></button>
          </>}
        </div>
      </div>
    </div>
  );
}

// ─── INTERACTIVE LESSON PLAYER ────────────────────────────────────────────────
function LessonPlayer({ lesson, onComplete, onBack }) {
  const [blockIdx, setBlockIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState({});
  const [showHint, setShowHint] = useState({});
  const [fillInput, setFillInput] = useState({});
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const block = lesson.blocks[blockIdx];
  const questions = lesson.blocks.filter(b => b.type === "mcq" || b.type === "fill");
  const attempted = Object.keys(answers).length;
  const progress = ((blockIdx + 1) / lesson.blocks.length) * 100;

  const handleMCQ = (blockId, optIdx, block) => {
    if (answers[blockId] !== undefined) return;
    const correct = optIdx === block.correct;
    setAnswers(p => ({ ...p, [blockId]: optIdx }));
    setShowFeedback(p => ({ ...p, [blockId]: true }));
    if (correct) setScore(s => s + 1);
  };

  const handleFill = (blockId, block) => {
    if (answers[blockId] !== undefined) return;
    const val = (fillInput[blockId] || "").trim().toLowerCase();
    const correct = val === block.answer.toLowerCase();
    setAnswers(p => ({ ...p, [blockId]: fillInput[blockId] || "" }));
    setShowFeedback(p => ({ ...p, [blockId]: true }));
    if (correct) setScore(s => s + 1);
  };

  const handleFinish = () => {
    setCompleted(true);
    onComplete?.({ score, total: questions.length, lesson });
  };

  if (completed) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 100;
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/30">
            <Award size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Lesson Complete!</h2>
          <p className="text-slate-400 mb-8">{lesson.title}</p>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">{pct}%</div>
            <p className="text-slate-400 text-sm">{score} of {questions.length} questions correct</p>
            <div className="mt-4 bg-slate-800 rounded-full h-2">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-1000" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={onBack} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl transition-all">Back to Lessons</button>
            <button onClick={() => { setCompleted(false); setBlockIdx(0); setAnswers({}); setShowFeedback({}); setScore(0); }}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
              <RotateCcw size={16} />Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={16} />Back
          </button>
          <div className="text-center">
            <p className="text-white text-sm font-semibold">{lesson.title}</p>
            <p className="text-slate-500 text-xs">Block {blockIdx + 1} of {lesson.blocks.length}</p>
          </div>
          <div className="text-right">
            <p className="text-indigo-400 text-sm font-bold">{score}/{questions.length}</p>
            <p className="text-slate-600 text-xs">Score</p>
          </div>
        </div>
        <div className="bg-slate-800 rounded-full h-1.5">
          <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          {/* Block type indicator */}
          <div className="px-6 pt-5 pb-3 flex items-center gap-2">
            {block.type === "text" && <><AlignLeft size={14} className="text-cyan-400" /><span className="text-cyan-400 text-xs font-semibold uppercase tracking-wider">Reading</span></>}
            {block.type === "video" && <><Video size={14} className="text-violet-400" /><span className="text-violet-400 text-xs font-semibold uppercase tracking-wider">Video</span></>}
            {block.type === "mcq" && <><HelpCircle size={14} className="text-amber-400" /><span className="text-amber-400 text-xs font-semibold uppercase tracking-wider">Multiple Choice</span></>}
            {block.type === "fill" && <><FileText size={14} className="text-emerald-400" /><span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Fill in the Blank</span></>}
          </div>
          <div className="px-6 pb-6">
            {/* TEXT BLOCK */}
            {block.type === "text" && (
              <p className="text-slate-300 leading-relaxed text-sm">{block.content}</p>
            )}
            {/* VIDEO BLOCK */}
            {block.type === "video" && (
              <div>
                <p className="text-white font-semibold mb-3">{block.title}</p>
                <div className="rounded-xl overflow-hidden bg-slate-800 aspect-video">
                  <iframe src={block.url} title={block.title} className="w-full h-full" frameBorder="0" allowFullScreen />
                </div>
              </div>
            )}
            {/* MCQ BLOCK */}
            {block.type === "mcq" && (
              <div>
                <p className="text-white font-semibold mb-5 text-base leading-snug">{block.question}</p>
                <div className="space-y-3">
                  {block.options.map((opt, i) => {
                    const answered = answers[block.id] !== undefined;
                    const isSelected = answers[block.id] === i;
                    const isCorrect = i === block.correct;
                    let cls = "w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all flex items-center gap-3 ";
                    if (!answered) cls += "border-slate-700 text-slate-300 hover:border-indigo-500 hover:bg-indigo-500/5 cursor-pointer";
                    else if (isCorrect) cls += "border-emerald-500 bg-emerald-500/10 text-emerald-300";
                    else if (isSelected && !isCorrect) cls += "border-rose-500 bg-rose-500/10 text-rose-300";
                    else cls += "border-slate-800 text-slate-600 cursor-default";
                    return (
                      <button key={i} onClick={() => handleMCQ(block.id, i, block)} className={cls} disabled={answered}>
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${answered && isCorrect ? "bg-emerald-500" : answered && isSelected ? "bg-rose-500" : "bg-slate-700"} text-white`}>
                          {answered && isCorrect ? <CheckCircle size={14} /> : answered && isSelected ? <XCircle size={14} /> : String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {/* Feedback */}
                {showFeedback[block.id] && (
                  <div className={`mt-4 p-4 rounded-xl ${answers[block.id] === block.correct ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-rose-500/10 border border-rose-500/30"}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {answers[block.id] === block.correct ? <CheckCircle size={16} className="text-emerald-400" /> : <XCircle size={16} className="text-rose-400" />}
                      <span className={`font-semibold text-sm ${answers[block.id] === block.correct ? "text-emerald-400" : "text-rose-400"}`}>
                        {answers[block.id] === block.correct ? "Correct!" : "Not quite!"}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      {answers[block.id] === block.correct ? block.feedback.correct : (block.feedback.wrong[answers[block.id]] || `The correct answer is: ${block.options[block.correct]}`)}
                    </p>
                  </div>
                )}
                {/* Hint */}
                {!showFeedback[block.id] && block.hint && (
                  <button onClick={() => setShowHint(p => ({ ...p, [block.id]: !p[block.id] }))} className="mt-3 flex items-center gap-2 text-amber-400 text-xs hover:text-amber-300 transition-colors">
                    <Lightbulb size={13} />{showHint[block.id] ? "Hide hint" : "Show hint"}
                  </button>
                )}
                {showHint[block.id] && <div className="mt-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs">{block.hint}</div>}
              </div>
            )}
            {/* FILL BLOCK */}
            {block.type === "fill" && (
              <div>
                <p className="text-white font-semibold mb-5 text-base">{block.question}</p>
                <div className="flex gap-3">
                  <input type="text" placeholder="Your answer..." value={fillInput[block.id] || ""} onChange={e => setFillInput(p => ({ ...p, [block.id]: e.target.value }))}
                    disabled={answers[block.id] !== undefined}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50 transition-colors" />
                  <button onClick={() => handleFill(block.id, block)} disabled={answers[block.id] !== undefined || !fillInput[block.id]}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-all">Check</button>
                </div>
                {showFeedback[block.id] && (
                  <div className={`mt-4 p-4 rounded-xl ${(fillInput[block.id] || "").toLowerCase() === block.answer.toLowerCase() ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-rose-500/10 border border-rose-500/30"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {(fillInput[block.id] || "").toLowerCase() === block.answer.toLowerCase() ? <CheckCircle size={16} className="text-emerald-400" /> : <XCircle size={16} className="text-rose-400" />}
                      <span className={`font-semibold text-sm ${(fillInput[block.id] || "").toLowerCase() === block.answer.toLowerCase() ? "text-emerald-400" : "text-rose-400"}`}>
                        {(fillInput[block.id] || "").toLowerCase() === block.answer.toLowerCase() ? "Correct!" : "Incorrect"}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      {(fillInput[block.id] || "").toLowerCase() === block.answer.toLowerCase() ? block.feedback.correct : `${block.feedback.wrong} Correct answer: "${block.answer}"`}
                    </p>
                  </div>
                )}
                {!showFeedback[block.id] && block.hint && (
                  <button onClick={() => setShowHint(p => ({ ...p, [block.id]: !p[block.id] }))} className="mt-3 flex items-center gap-2 text-amber-400 text-xs hover:text-amber-300 transition-colors">
                    <Lightbulb size={13} />{showHint[block.id] ? "Hide hint" : "Show hint"}
                  </button>
                )}
                {showHint[block.id] && <div className="mt-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs">{block.hint}</div>}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setBlockIdx(i => Math.max(0, i - 1))} disabled={blockIdx === 0}
            className="flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded-xl text-sm font-medium transition-all">
            <ArrowLeft size={15} />Previous
          </button>
          {blockIdx < lesson.blocks.length - 1 ? (
            <button onClick={() => setBlockIdx(i => i + 1)}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all py-3">
              Next Block<ArrowRight size={15} />
            </button>
          ) : (
            <button onClick={handleFinish}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl text-sm font-semibold transition-all py-3 shadow-lg shadow-indigo-500/25">
              <Award size={15} />Complete Lesson
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── LESSON EDITOR ────────────────────────────────────────────────────────────
function LessonEditor({ lesson, onSave, onCancel }) {
  const [form, setForm] = useState(lesson || {
    title: "", description: "", author: "", category: "Mathematics", difficulty: "Beginner", duration: 20, thumbnail: "📚", blocks: []
  });
  const [saving, setSaving] = useState(false);
  const [activeBlock, setActiveBlock] = useState(null);

  const addBlock = (type) => {
    const newBlock = type === "mcq"
      ? { id: generateId(), type: "mcq", question: "", options: ["", "", "", ""], correct: 0, feedback: { correct: "", wrong: {} }, hint: "" }
      : type === "fill"
      ? { id: generateId(), type: "fill", question: "", answer: "", feedback: { correct: "", wrong: "" }, hint: "" }
      : type === "video"
      ? { id: generateId(), type: "video", url: "", title: "" }
      : { id: generateId(), type: "text", content: "" };
    setForm(p => ({ ...p, blocks: [...p.blocks, newBlock] }));
    setActiveBlock(newBlock.id);
  };

  const updateBlock = (id, updates) => {
    setForm(p => ({ ...p, blocks: p.blocks.map(b => b.id === id ? { ...b, ...updates } : b) }));
  };

  const deleteBlock = (id) => {
    setForm(p => ({ ...p, blocks: p.blocks.filter(b => b.id !== id) }));
    if (activeBlock === id) setActiveBlock(null);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    onSave(form);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={onCancel} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"><ArrowLeft size={18} /></button>
            <div>
              <h1 className="text-white font-bold text-xl">{lesson ? "Edit Lesson" : "Create New Lesson"}</h1>
              <p className="text-slate-500 text-sm">{form.blocks.length} content blocks</p>
            </div>
          </div>
          <button onClick={handleSave} disabled={saving || !form.title}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl transition-all">
            {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : <><Save size={15} />Save Lesson</>}
          </button>
        </div>
        {/* Lesson Meta */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-5">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2"><FileText size={16} className="text-indigo-400" />Lesson Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-slate-400 text-xs mb-1.5 block">Title *</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Lesson title..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div className="col-span-2">
              <label className="text-slate-400 text-xs mb-1.5 block">Description</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="What will students learn?" rows={3}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none" />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1.5 block">Author</label>
              <input value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} placeholder="Author name"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1.5 block">Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors">
                {["Mathematics", "Biology", "History", "Physics", "Chemistry", "Computer Science", "Literature"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1.5 block">Difficulty</label>
              <select value={form.difficulty} onChange={e => setForm(p => ({ ...p, difficulty: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors">
                {["Beginner", "Intermediate", "Advanced"].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1.5 block">Duration (minutes)</label>
              <input type="number" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: parseInt(e.target.value) || 0 }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
          </div>
        </div>
        {/* Blocks */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-5">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2"><Layers size={16} className="text-indigo-400" />Content Blocks</h2>
          {form.blocks.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-slate-700 rounded-xl mb-4">
              <Layers size={32} className="text-slate-700 mx-auto mb-2" />
              <p className="text-slate-600 text-sm">No blocks yet. Add your first content block below.</p>
            </div>
          )}
          <div className="space-y-3">
            {form.blocks.map((block, idx) => (
              <div key={block.id} className={`border rounded-xl overflow-hidden transition-all ${activeBlock === block.id ? "border-indigo-500" : "border-slate-700"}`}>
                <button onClick={() => setActiveBlock(activeBlock === block.id ? null : block.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800/50 text-left">
                  <span className="w-6 h-6 rounded-lg bg-slate-700 flex items-center justify-center text-slate-400 text-xs font-bold">{idx + 1}</span>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 py-0.5 rounded-lg bg-slate-700">
                    {block.type === "mcq" ? "MCQ" : block.type === "fill" ? "Fill" : block.type === "video" ? "Video" : "Text"}
                  </span>
                  <span className="text-slate-300 text-sm flex-1 truncate">
                    {block.type === "text" ? block.content.slice(0, 60) || "Empty text block" : block.type === "video" ? block.title || "Video block" : block.question?.slice(0, 60) || "Question..."}
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }} className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"><Trash2 size={13} /></button>
                    {activeBlock === block.id ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
                  </div>
                </button>
                {activeBlock === block.id && (
                  <div className="p-4 bg-slate-900/50 space-y-3">
                    {block.type === "text" && (
                      <textarea value={block.content} onChange={e => updateBlock(block.id, { content: e.target.value })} placeholder="Enter text content..." rows={4}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none" />
                    )}
                    {block.type === "video" && (
                      <>
                        <input value={block.title} onChange={e => updateBlock(block.id, { title: e.target.value })} placeholder="Video title"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" />
                        <input value={block.url} onChange={e => updateBlock(block.id, { url: e.target.value })} placeholder="YouTube embed URL (https://www.youtube.com/embed/...)"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" />
                      </>
                    )}
                    {block.type === "mcq" && (
                      <>
                        <input value={block.question} onChange={e => updateBlock(block.id, { question: e.target.value })} placeholder="Question text"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" />
                        <div className="space-y-2">
                          {block.options.map((opt, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <input type="radio" checked={block.correct === i} onChange={() => updateBlock(block.id, { correct: i })} className="accent-indigo-500" />
                              <input value={opt} onChange={e => { const opts = [...block.options]; opts[i] = e.target.value; updateBlock(block.id, { options: opts }); }} placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" />
                            </div>
                          ))}
                        </div>
                        <input value={block.feedback?.correct || ""} onChange={e => updateBlock(block.id, { feedback: { ...block.feedback, correct: e.target.value } })} placeholder="Feedback for correct answer"
                          className="w-full bg-slate-800 border border-emerald-700/50 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors" />
                        <input value={block.hint || ""} onChange={e => updateBlock(block.id, { hint: e.target.value })} placeholder="Hint (shown on request)"
                          className="w-full bg-slate-800 border border-amber-700/50 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors" />
                      </>
                    )}
                    {block.type === "fill" && (
                      <>
                        <input value={block.question} onChange={e => updateBlock(block.id, { question: e.target.value })} placeholder="Question (use ___ for blank)"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" />
                        <input value={block.answer} onChange={e => updateBlock(block.id, { answer: e.target.value })} placeholder="Correct answer"
                          className="w-full bg-slate-800 border border-emerald-700/50 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors" />
                        <input value={block.hint || ""} onChange={e => updateBlock(block.id, { hint: e.target.value })} placeholder="Hint for students"
                          className="w-full bg-slate-800 border border-amber-700/50 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors" />
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {[{ type: "text", icon: AlignLeft, label: "Add Text" }, { type: "video", icon: Video, label: "Add Video" }, { type: "mcq", icon: HelpCircle, label: "Add MCQ" }, { type: "fill", icon: FileText, label: "Add Fill-in" }].map(({ type, icon: Icon, label }) => (
              <button key={type} onClick={() => addBlock(type)}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-300 rounded-xl text-sm font-medium transition-all">
                <Icon size={14} />{label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STUDENT DASHBOARD ────────────────────────────────────────────────────────
function StudentDashboard({ lessons, user, onStartLesson }) {
  const stats = MOCK_STUDENT_STATS;
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Welcome back, {user.name}! 👋</h1>
        <p className="text-slate-400 text-sm mt-1">Continue your learning journey</p>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={Flame} label="Day Streak" value={`${stats.streak} days`} color="amber" trend={12} />
        <StatCard icon={Star} label="XP Earned" value={stats.xp.toLocaleString()} color="violet" trend={8} />
        <StatCard icon={BookMarked} label="Completed" value={`${stats.completed}/${stats.totalLessons}`} color="emerald" />
        <StatCard icon={Target} label="Avg Score" value="74%" color="cyan" trend={5} />
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2"><BookOpen size={16} className="text-indigo-400" />Available Lessons</h2>
          <div className="space-y-3">
            {lessons.map(l => (
              <div key={l.id} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all group">
                <span className="text-2xl">{l.thumbnail}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate group-hover:text-indigo-300 transition-colors">{l.title}</p>
                  <p className="text-slate-500 text-xs">{l.category} · {l.duration}min · {l.difficulty}</p>
                </div>
                <button onClick={() => onStartLesson(l)} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all flex-shrink-0">
                  <Play size={12} />Start
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-3 text-sm flex items-center gap-2"><TrendingUp size={14} className="text-cyan-400" />Weekly Progress</h3>
            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={stats.recentActivity}>
                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={false} />
                <XAxis dataKey="date" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", color: "#fff" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-3 text-sm flex items-center gap-2"><AlertTriangle size={14} className="text-amber-400" />Areas to Improve</h3>
            <div className="space-y-2">
              {stats.weakTopics.map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  <span className="text-slate-400">{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-3 text-sm flex items-center gap-2"><CheckCircle size={14} className="text-emerald-400" />Strengths</h3>
            <div className="space-y-2">
              {stats.strongTopics.map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span className="text-slate-400">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STUDENT PROGRESS ─────────────────────────────────────────────────────────
function StudentProgress() {
  const stats = MOCK_STUDENT_STATS;
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">My Learning Analytics</h1>
      <div className="grid grid-cols-2 gap-5 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><BarChart size={16} className="text-indigo-400" />Score by Category</h3>
          <ResponsiveContainer width="100%" height={180}>
            <ReBarChart data={stats.categoryScores} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="category" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", color: "#fff" }} />
              <Bar dataKey="score" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </ReBarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Activity size={16} className="text-cyan-400" />Daily Activity</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={stats.recentActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", color: "#fff" }} />
              <Line type="monotone" dataKey="score" stroke="#22d3ee" strokeWidth={2.5} dot={{ fill: "#22d3ee", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3"><TrendingDown size={16} className="text-rose-400" /><h3 className="text-white font-semibold text-sm">Weak Areas</h3></div>
          <div className="space-y-3">
            {stats.weakTopics.map((t, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-xs">{t}</span>
                  <span className="text-rose-400 text-xs font-bold">{[45, 52, 38][i]}%</span>
                </div>
                <div className="bg-slate-800 rounded-full h-1.5">
                  <div className="h-full rounded-full bg-rose-500" style={{ width: `${[45, 52, 38][i]}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3"><TrendingUp size={16} className="text-emerald-400" /><h3 className="text-white font-semibold text-sm">Strong Areas</h3></div>
          <div className="space-y-3">
            {stats.strongTopics.map((t, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-xs">{t}</span>
                  <span className="text-emerald-400 text-xs font-bold">{[88, 82, 91][i]}%</span>
                </div>
                <div className="bg-slate-800 rounded-full h-1.5">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${[88, 82, 91][i]}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3"><Brain size={16} className="text-violet-400" /><h3 className="text-white font-semibold text-sm">Recommendations</h3></div>
          <div className="space-y-2">
            {["Review Fill-in-the-blank strategies", "Practice Chemical Formulas daily", "Use hints strategically", "Review historical timelines"].map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                <Zap size={11} className="text-violet-400 mt-0.5 flex-shrink-0" />{r}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CREATOR ANALYTICS ────────────────────────────────────────────────────────
function CreatorAnalytics({ lessons }) {
  const failData = lessons.flatMap(l =>
    Object.entries(l.stats.questionFails || {}).map(([blockId, fails]) => {
      const block = l.blocks.find(b => b.id === blockId);
      return { name: (block?.question || block?.title || "Block").slice(0, 25) + "...", fails, lesson: l.title.split(" ").slice(0, 2).join(" ") };
    })
  ).sort((a, b) => b.fails - a.fails).slice(0, 8);

  const completionData = lessons.map(l => ({ name: l.title.split(" ").slice(0, 2).join(" "), completion: l.stats.completionRate, attempts: l.stats.attempts }));

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Creator Analytics</h1>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Total Learners" value="579" color="indigo" trend={14} />
        <StatCard icon={Target} label="Avg Score" value="72%" color="cyan" trend={3} />
        <StatCard icon={CheckCircle} label="Completion Rate" value="78%" color="emerald" trend={7} />
        <StatCard icon={BookOpen} label="Total Lessons" value={lessons.length} color="amber" />
      </div>
      <div className="grid grid-cols-2 gap-5 mb-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-1 flex items-center gap-2"><AlertTriangle size={16} className="text-rose-400" />Most Failed Questions</h3>
          <p className="text-slate-600 text-xs mb-4">Questions students struggle with most</p>
          <ResponsiveContainer width="100%" height={220}>
            <ReBarChart data={failData} layout="vertical" barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 9 }} width={100} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", color: "#fff" }} formatter={(v) => [`${v} failures`]} />
              <Bar dataKey="fails" fill="#ef4444" radius={[0, 6, 6, 0]} />
            </ReBarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-1 flex items-center gap-2"><Activity size={16} className="text-indigo-400" />Lesson Performance</h3>
          <p className="text-slate-600 text-xs mb-4">Completion rate & attempts per lesson</p>
          <ResponsiveContainer width="100%" height={220}>
            <ReBarChart data={completionData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", color: "#fff" }} />
              <Bar yAxisId="left" dataKey="completion" fill="#6366f1" radius={[6, 6, 0, 0]} name="Completion %" />
              <Bar yAxisId="right" dataKey="attempts" fill="#22d3ee" radius={[6, 6, 0, 0]} name="Attempts" />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#64748b" }} />
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-white font-semibold mb-4">Lesson Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                {["Lesson", "Category", "Attempts", "Avg Score", "Completion", "Top Fail Point"].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-slate-500 text-xs font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lessons.map(l => {
                const topFail = Object.entries(l.stats.questionFails || {}).sort((a, b) => b[1] - a[1])[0];
                const topBlock = topFail ? l.blocks.find(b => b.id === topFail[0]) : null;
                return (
                  <tr key={l.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4"><div className="flex items-center gap-2"><span>{l.thumbnail}</span><span className="text-white text-xs font-medium">{l.title}</span></div></td>
                    <td className="py-3 px-4 text-slate-400 text-xs">{l.category}</td>
                    <td className="py-3 px-4 text-slate-300 text-xs">{l.stats.attempts}</td>
                    <td className="py-3 px-4"><span className={`text-xs font-semibold ${l.stats.avgScore >= 75 ? "text-emerald-400" : l.stats.avgScore >= 60 ? "text-amber-400" : "text-rose-400"}`}>{l.stats.avgScore}%</span></td>
                    <td className="py-3 px-4"><span className="text-xs text-slate-300">{l.stats.completionRate}%</span></td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{topBlock ? (topBlock.question || topBlock.title || "Block").slice(0, 30) + "..." : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashboard({ lessons }) {
  const pieData = [
    { name: "Mathematics", value: 35 }, { name: "Biology", value: 25 },
    { name: "History", value: 20 }, { name: "Physics", value: 12 }, { name: "Other", value: 8 }
  ];
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Total Users" value="1,248" color="indigo" trend={18} />
        <StatCard icon={BookOpen} label="Active Lessons" value={lessons.length} color="cyan" trend={5} />
        <StatCard icon={Award} label="Platform Avg Score" value="72%" color="emerald" trend={4} />
        <StatCard icon={Activity} label="Daily Active" value="324" color="amber" trend={-2} />
      </div>
      <div className="grid grid-cols-3 gap-5 mb-5">
        <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4">All Lessons — Statistics</h3>
          <div className="space-y-3">
            {lessons.map(l => (
              <div key={l.id} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl">
                <span className="text-xl">{l.thumbnail}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{l.title}</p>
                  <p className="text-slate-500 text-xs">{l.author} · {l.category}</p>
                </div>
                <div className="flex gap-4 text-center">
                  <div>
                    <p className="text-white text-sm font-bold">{l.stats.attempts}</p>
                    <p className="text-slate-600 text-xs">Attempts</p>
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${l.stats.avgScore >= 75 ? "text-emerald-400" : "text-amber-400"}`}>{l.stats.avgScore}%</p>
                    <p className="text-slate-600 text-xs">Avg Score</p>
                  </div>
                  <div>
                    <p className="text-cyan-400 text-sm font-bold">{l.stats.completionRate}%</p>
                    <p className="text-slate-600 text-xs">Complete</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-3 text-sm">Content by Category</h3>
            <ResponsiveContainer width="100%" height={160}>
              <RePieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", color: "#fff" }} />
                <Legend wrapperStyle={{ fontSize: "11px", color: "#64748b" }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-3 text-sm">Recent Activity</h3>
            <div className="space-y-2">
              {[{ u: "Rahul S.", a: "Completed Algebra", t: "2m ago" }, { u: "Priya K.", a: "Started Photosynthesis", t: "5m ago" }, { u: "Amit R.", a: "Scored 92% on WWII", t: "12m ago" }, { u: "Neha M.", a: "Signed up", t: "1h ago" }].map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{a.u[0]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{a.u}</p>
                    <p className="text-slate-500 text-xs truncate">{a.a}</p>
                  </div>
                  <p className="text-slate-600 text-xs flex-shrink-0">{a.t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("home");
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [editLesson, setEditLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playingLesson, setPlayingLesson] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      mockAPI.getLessons().then(data => { setLessons(data); setLoading(false); });
      setView(user.role === "creator" ? "creator-dashboard" : user.role === "admin" ? "admin-dashboard" : "home");
    }
  }, [user]);

  const handleLogin = (u) => setUser(u);
  const handleLogout = () => { setUser(null); setView("home"); setPlayingLesson(null); };

  const refreshLessons = async () => {
    const data = await mockAPI.getLessons();
    setLessons(data);
  };

  const handleSaveLesson = async (lesson) => {
    if (lesson.id && lessons.find(l => l.id === lesson.id)) {
      await mockAPI.updateLesson(lesson);
    } else {
      await mockAPI.createLesson(lesson);
    }
    await refreshLessons();   // re-read from localStorage so changes always reflect
    setEditLesson(null);
    setView(user.role === "creator" ? "my-lessons" : "lessons");
  };

  const handleDeleteLesson = async (id) => {
    if (!confirm("Delete this lesson?")) return;
    await mockAPI.deleteLesson(id);
    await refreshLessons();   // re-read from localStorage
  };

  if (!user) return <AuthScreen onLogin={handleLogin} />;
  if (playingLesson) return <LessonPlayer lesson={playingLesson} onBack={() => setPlayingLesson(null)} onComplete={() => {}} />;
  if (editLesson !== null) return <LessonEditor lesson={editLesson === "new" ? null : editLesson} onSave={handleSaveLesson} onCancel={() => setEditLesson(null)} />;

  const renderView = () => {
    if (loading) return <div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" /></div>;
    switch (view) {
      case "home": return <StudentDashboard lessons={lessons} user={user} onStartLesson={setPlayingLesson} />;
      case "lessons": return (
        <div className="p-6 max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6">Browse Lessons</h1>
          <div className="grid grid-cols-3 gap-4">
            {lessons.map(l => <LessonCard key={l.id} lesson={l} onStart={setPlayingLesson} />)}
          </div>
        </div>
      );
      case "my-progress": return <StudentProgress />;
      case "creator-dashboard": return (
        <div className="p-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Creator Portal</h1>
            <button onClick={() => setEditLesson("new")} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all">
              <Plus size={16} />New Lesson
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard icon={BookOpen} label="My Lessons" value={lessons.length} color="indigo" />
            <StatCard icon={Users} label="Total Learners" value="579" color="cyan" trend={14} />
            <StatCard icon={Target} label="Avg Score" value="72%" color="emerald" trend={5} />
            <StatCard icon={Activity} label="Completion" value="78%" color="amber" trend={3} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {lessons.map(l => <LessonCard key={l.id} lesson={l} showActions onEdit={(lesson) => setEditLesson(lesson)} onDelete={handleDeleteLesson} />)}
          </div>
        </div>
      );
      case "my-lessons": return (
        <div className="p-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">My Lessons</h1>
            <button onClick={() => setEditLesson("new")} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all"><Plus size={16} />Create Lesson</button>
          </div>
          {lessons.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl">
              <BookOpen size={48} className="text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">No lessons yet. Create your first one!</p>
              <button onClick={() => setEditLesson("new")} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all"><Plus size={16} className="inline mr-2" />Create Lesson</button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {lessons.map(l => <LessonCard key={l.id} lesson={l} showActions onEdit={setEditLesson} onDelete={handleDeleteLesson} />)}
            </div>
          )}
        </div>
      );
      case "lesson-editor": return <LessonEditor onSave={handleSaveLesson} onCancel={() => setView("my-lessons")} />;
      case "creator-analytics": return <CreatorAnalytics lessons={lessons} />;
      case "admin-dashboard": return <AdminDashboard lessons={lessons} />;
      case "all-lessons": return (
        <div className="p-6 max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6">All Lessons</h1>
          <div className="grid grid-cols-3 gap-4">
            {lessons.map(l => <LessonCard key={l.id} lesson={l} showActions onEdit={setEditLesson} onDelete={handleDeleteLesson} />)}
          </div>
        </div>
      );
      case "users": return (
        <div className="p-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6">User Management</h1>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-800">{["Name", "Email", "Role", "Lessons", "Avg Score", "Joined"].map(h => <th key={h} className="text-left py-4 px-5 text-slate-500 text-xs font-semibold">{h}</th>)}</tr></thead>
              <tbody>
                {[["Rahul Sharma", "rahul@ex.com", "Student", 3, "82%", "Jan 2025"], ["Priya Kumar", "priya@ex.com", "Student", 2, "74%", "Feb 2025"], ["Amit Roy", "amit@ex.com", "Creator", 5, "—", "Dec 2024"], ["Neha Mehta", "neha@ex.com", "Student", 1, "61%", "Mar 2025"]].map((row, i) => (
                  <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-5"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">{row[0][0]}</div><span className="text-white text-sm">{row[0]}</span></div></td>
                    {row.slice(1).map((v, j) => <td key={j} className="py-4 px-5 text-slate-400 text-xs">{j === 1 ? <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${v === "Creator" ? "bg-violet-500/10 text-violet-400" : "bg-indigo-500/10 text-indigo-400"}`}>{v}</span> : v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar user={user} view={view} setView={setView} onLogout={handleLogout} onOpenProfile={() => setProfileOpen(true)} />
      {profileOpen && <ProfileModal user={user} onClose={() => setProfileOpen(false)} onUpdate={(updated) => { setUser(updated); setProfileOpen(false); }} />}
      <main className="flex-1 overflow-y-auto">{renderView()}</main>
    </div>
  );
}
