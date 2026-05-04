import { useState, useEffect, useCallback, useRef } from "react";

// ─── Mock Data & API ───────────────────────────────────────────────────────────

const MOCK_USERS = [
  { id: "u1", email: "creator@oppia.org", password: "pass123", role: "creator", name: "Aria Singh" },
  { id: "u2", email: "learner@oppia.org", password: "pass123", role: "learner", name: "Ben Carter" },
  { id: "u3", email: "admin@oppia.org", password: "pass123", role: "admin", name: "Priya Mehta" },
];

// In-memory store (no localStorage — sandbox blocks it)
let memoryLessons = null;

const INITIAL_LESSONS = [
  {
    id: "l1",
    title: "Introduction to Fractions",
    description: "Learn the basics of fractions, numerators, and denominators through interactive examples.",
    author: "Aria Singh",
    authorId: "u1",
    category: "Mathematics",
    createdAt: "2025-04-10",
    blocks: [
      { id: "b1", type: "text", content: "A fraction represents a part of a whole. It consists of two numbers separated by a line — the numerator (top) and the denominator (bottom). For example, in ¾, the numerator is 3 and the denominator is 4." },
      { id: "b2", type: "mcq", question: "What does the denominator in a fraction represent?", options: ["The top number", "The total number of equal parts", "The number of parts taken", "None of the above"], correct: 1, feedback: ["Incorrect — that's the numerator.", "Correct! The denominator shows how many equal parts the whole is divided into.", "Incorrect — that's the numerator's job.", "Try again — one of these is right!"] },
      { id: "b3", type: "text", content: "When two fractions have the same denominator, they are called like fractions. Adding like fractions is simple — just add the numerators and keep the denominator the same." },
      { id: "b4", type: "fitb", question: "In the fraction ⅗, the numerator is ___ and the denominator is ___.", blanks: ["3", "5"], hint: "Look at the top and bottom numbers of the fraction." },
    ],
    stats: { attempts: 47, avgScore: 82, completions: 38 },
  },
  {
    id: "l2",
    title: "The Water Cycle",
    description: "Explore evaporation, condensation, and precipitation through engaging content blocks.",
    author: "Aria Singh",
    authorId: "u1",
    category: "Science",
    createdAt: "2025-04-15",
    blocks: [
      { id: "b5", type: "text", content: "The water cycle, also known as the hydrological cycle, describes the continuous movement of water within Earth and its atmosphere. It is driven primarily by solar energy and gravity." },
      { id: "b6", type: "mcq", question: "Which process converts liquid water into water vapor?", options: ["Condensation", "Precipitation", "Evaporation", "Transpiration"], correct: 2, feedback: ["Incorrect — condensation is the reverse process (vapor → liquid).", "Incorrect — precipitation is when water falls from clouds.", "Correct! Evaporation is the process where liquid water absorbs heat energy and becomes water vapor.", "Transpiration is water released by plants, not liquid-to-vapor conversion."] },
      { id: "b7", type: "fitb", question: "Water vapor rises and cools to form clouds through a process called ___.", blanks: ["condensation"], hint: "Think about what happens when warm air meets a cold surface." },
    ],
    stats: { attempts: 63, avgScore: 75, completions: 51 },
  },
  {
    id: "l3",
    title: "World War II: Key Events",
    description: "A timeline-based lesson covering the major turning points of the Second World War.",
    author: "Aria Singh",
    authorId: "u1",
    category: "History",
    createdAt: "2025-04-20",
    blocks: [
      { id: "b8", type: "text", content: "World War II (1939–1945) was the deadliest conflict in human history, involving more than 30 countries. It was triggered by Germany's invasion of Poland on September 1, 1939." },
      { id: "b9", type: "mcq", question: "Which event directly caused the United States to enter World War II?", options: ["The invasion of Poland", "The fall of France", "The attack on Pearl Harbor", "The Battle of Britain"], correct: 2, feedback: ["Incorrect — the invasion of Poland triggered the war in Europe, not U.S. involvement.", "Incorrect — the fall of France increased U.S. concern but did not directly draw them in.", "Correct! Japan's surprise attack on Pearl Harbor on December 7, 1941 led the U.S. to declare war.", "Incorrect — the Battle of Britain was fought between Germany and Britain."] },
    ],
    stats: { attempts: 29, avgScore: 68, completions: 19 },
  },
];

// In-memory mock API (localStorage is blocked in sandbox)
const mockAPI = {
  getLessons: () => {
    if (!memoryLessons) memoryLessons = JSON.parse(JSON.stringify(INITIAL_LESSONS));
    return Promise.resolve([...memoryLessons]);
  },
  createLesson: (lesson) => {
    if (!memoryLessons) memoryLessons = JSON.parse(JSON.stringify(INITIAL_LESSONS));
    const newLesson = { ...lesson, id: `l${Date.now()}`, createdAt: new Date().toISOString().split("T")[0], stats: { attempts: 0, avgScore: 0, completions: 0 } };
    memoryLessons = [...memoryLessons, newLesson];
    return Promise.resolve(newLesson);
  },
  updateLesson: (id, updates) => {
    if (!memoryLessons) memoryLessons = JSON.parse(JSON.stringify(INITIAL_LESSONS));
    memoryLessons = memoryLessons.map(l => l.id === id ? { ...l, ...updates } : l);
    return Promise.resolve(memoryLessons.find(l => l.id === id));
  },
  deleteLesson: (id) => {
    if (!memoryLessons) memoryLessons = JSON.parse(JSON.stringify(INITIAL_LESSONS));
    memoryLessons = memoryLessons.filter(l => l.id !== id);
    return Promise.resolve();
  },
};

// ─── Icons (Lucide-style SVG) ─────────────────────────────────────────────────
const Icon = ({ name, size = 18, className = "" }) => {
  const paths = {
    home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
    book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
    plus: "M12 5v14 M5 12h14",
    edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
    trash: "M3 6h18 M8 6V4h8v2 M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6",
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
    logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
    chart: "M18 20V10 M12 20V4 M6 20v-6",
    check: "M20 6L9 17l-5-5",
    x: "M18 6L6 18 M6 6l12 12",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    menu: "M3 12h18 M3 6h18 M3 18h18",
    chevronRight: "M9 18l6-6-6-6",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    award: "M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M8.21 13.89L7 23l5-3 5 3-1.21-9.12",
    layers: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
    grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
    arrowLeft: "M19 12H5 M12 19l-7-7 7-7",
    checkCircle: "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3",
    alertCircle: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 8v4 M12 16h.01",
    type: "M4 7V4h16v3 M9 20h6 M12 4v16",
    helpCircle: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3 M12 17h.01",
    penTool: "M12 19l7-7 3 3-7 7-3-3z M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z M2 2l7.586 7.586 M11 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {(paths[name] || "").split(" M").map((d, i) => <path key={i} d={i === 0 ? d : "M" + d} />)}
    </svg>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  Mathematics: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  Science: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  History: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  Language: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  default: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" },
};

// ─── Auth Page ─────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "learner" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    if (mode === "login") {
      const found = MOCK_USERS.find(u => u.email === form.email.trim() && u.password === form.password);
      if (found) { onLogin(found); return; }
      setError("Invalid email or password. Use a demo account below.");
    } else {
      if (!form.name.trim() || !form.email.trim() || !form.password) {
        setError("All fields are required."); setLoading(false); return;
      }
      onLogin({ id: `u${Date.now()}`, name: form.name.trim(), email: form.email.trim(), password: form.password, role: form.role });
      return;
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 shadow-lg mb-4">
            <Icon name="layers" size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>Oppia</h1>
          <p className="text-gray-500 mt-1 text-sm">Free, interactive lessons for everyone</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 py-4 text-sm font-semibold transition-all ${mode === m ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50" : "text-gray-400 hover:text-gray-600"}`}>
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm">
                <Icon name="alertCircle" size={16} /> {error}
              </div>
            )}

            <div className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Full Name</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition text-gray-900 text-sm"
                    placeholder="Your full name" />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email</label>
                <input type="text" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition text-gray-900 text-sm"
                  placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Password</label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition text-gray-900 text-sm"
                  placeholder="••••••••" />
              </div>
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">I am a</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["learner", "creator", "admin"].map(r => (
                      <button type="button" key={r} onClick={() => setForm({ ...form, role: r })}
                        className={`py-2.5 rounded-xl border text-sm font-medium capitalize transition-all ${form.role === r ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-500 hover:border-indigo-300"}`}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <button type="button" onClick={handle} disabled={loading}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all shadow-sm shadow-indigo-200 disabled:opacity-60 mt-2">
                {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
              </button>
            </div>

            {mode === "login" && (
              <div className="mt-5 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Demo Accounts</p>
                <div className="space-y-1.5">
                  {[["creator@oppia.org", "Creator"], ["learner@oppia.org", "Learner"], ["admin@oppia.org", "Admin"]].map(([email, role]) => (
                    <button key={email} type="button" onClick={() => { const u = MOCK_USERS.find(x => x.email === email); if (u) onLogin(u); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white text-xs text-gray-600 transition-all flex items-center justify-between group">
                      <span>{email}</span>
                      <span className="text-indigo-500 font-medium opacity-0 group-hover:opacity-100">{role} →</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ user, view, setView, onLogout }) {
  const navItems = {
    creator: [
      { id: "dashboard", label: "Dashboard", icon: "home" },
      { id: "lessons", label: "My Lessons", icon: "book" },
      { id: "create", label: "New Lesson", icon: "plus" },
    ],
    learner: [
      { id: "explore", label: "Explore", icon: "grid" },
      { id: "progress", label: "My Progress", icon: "chart" },
    ],
    admin: [
      { id: "adminDash", label: "Overview", icon: "chart" },
      { id: "allLessons", label: "All Lessons", icon: "layers" },
    ],
  };

  const items = navItems[user.role] || navItems.learner;

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Icon name="layers" size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-base leading-none">Oppia</p>
            <p className="text-xs text-gray-400 mt-0.5 capitalize">{user.role} Portal</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map(item => (
          <button key={item.id} onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${view === item.id ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
            <Icon name={item.icon} size={16} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
            {user.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-400 capitalize truncate">{user.role}</p>
          </div>
          <button onClick={onLogout} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
            <Icon name="logout" size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}

// ─── Block Editor ──────────────────────────────────────────────────────────────
function BlockEditor({ block, onChange, onDelete }) {
  return (
    <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden mb-3">
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${block.type === "text" ? "bg-blue-100 text-blue-700" : block.type === "mcq" ? "bg-purple-100 text-purple-700" : "bg-amber-100 text-amber-700"}`}>
          <Icon name={block.type === "text" ? "type" : block.type === "mcq" ? "helpCircle" : "penTool"} size={13} />
        </div>
        <span className="text-sm font-semibold text-gray-700 capitalize">
          {block.type === "fitb" ? "Fill in the Blank" : block.type === "mcq" ? "Multiple Choice" : "Text Block"}
        </span>
        <button onClick={onDelete} className="ml-auto p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
          <Icon name="trash" size={14} />
        </button>
      </div>
      <div className="p-4 space-y-3">
        {block.type === "text" && (
          <textarea value={block.content || ""} onChange={e => onChange({ ...block, content: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm text-gray-800 resize-none"
            rows={3} placeholder="Enter lesson text…" />
        )}
        {block.type === "mcq" && (
          <>
            <input value={block.question || ""} onChange={e => onChange({ ...block, question: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm text-gray-800"
              placeholder="Enter your question…" />
            <div className="space-y-2">
              {(block.options || ["", "", "", ""]).map((opt, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <button type="button" onClick={() => onChange({ ...block, correct: i })}
                    className={`w-6 h-6 rounded-full border-2 flex-shrink-0 transition-all ${block.correct === i ? "border-emerald-500 bg-emerald-500" : "border-gray-300 hover:border-emerald-400"}`}>
                    {block.correct === i && <Icon name="check" size={12} className="text-white mx-auto" />}
                  </button>
                  <input value={opt} onChange={e => { const ops = [...(block.options || ["","","",""])]; ops[i] = e.target.value; onChange({ ...block, options: ops }); }}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-400 outline-none text-sm text-gray-800"
                    placeholder={`Option ${i + 1}`} />
                  <input value={(block.feedback || [])[i] || ""} onChange={e => { const fb = [...(block.feedback || ["","","",""])]; fb[i] = e.target.value; onChange({ ...block, feedback: fb }); }}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-400 outline-none text-sm text-gray-500"
                    placeholder="Feedback…" />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400">Click the circle to mark the correct answer</p>
          </>
        )}
        {block.type === "fitb" && (
          <>
            <input value={block.question || ""} onChange={e => onChange({ ...block, question: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm text-gray-800"
              placeholder="Question with ___ for blanks" />
            <div className="flex gap-2 flex-wrap">
              {(block.blanks || [""]).map((b, i) => (
                <input key={i} value={b} onChange={e => { const bl = [...(block.blanks || [""])]; bl[i] = e.target.value; onChange({ ...block, blanks: bl }); }}
                  className="px-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-400 outline-none text-sm w-36"
                  placeholder={`Answer ${i + 1}`} />
              ))}
              <button type="button" onClick={() => onChange({ ...block, blanks: [...(block.blanks || [""]), ""] })}
                className="px-3 py-2 rounded-lg border border-dashed border-gray-300 text-xs text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-all">
                + Add blank
              </button>
            </div>
            <input value={block.hint || ""} onChange={e => onChange({ ...block, hint: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-400 outline-none text-sm text-gray-500"
              placeholder="Hint (optional)…" />
          </>
        )}
      </div>
    </div>
  );
}

// ─── Lesson Form ───────────────────────────────────────────────────────────────
function LessonForm({ user, lesson, onSave, onCancel }) {
  const [form, setForm] = useState(lesson || { title: "", description: "", category: "Mathematics", blocks: [] });
  const [saving, setSaving] = useState(false);

  const addBlock = (type) => {
    const base = { id: `b${Date.now()}`, type };
    if (type === "mcq") { base.question = ""; base.options = ["", "", "", ""]; base.correct = 0; base.feedback = ["", "", "", ""]; }
    if (type === "fitb") { base.question = ""; base.blanks = [""]; base.hint = ""; }
    if (type === "text") { base.content = ""; }
    setForm({ ...form, blocks: [...form.blocks, base] });
  };

  const save = async () => {
    if (!form.title) return;
    setSaving(true);
    await onSave({ ...form, author: user.name, authorId: user.id });
    setSaving(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onCancel} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <Icon name="arrowLeft" size={16} /> Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">{lesson ? "Edit Lesson" : "Create New Lesson"}</h1>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Lesson Title *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-gray-900"
                placeholder="e.g. Introduction to Algebra" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-gray-900 resize-none"
                rows={2} placeholder="Brief description of what students will learn…" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 outline-none text-sm text-gray-800 bg-white">
                {["Mathematics", "Science", "History", "Language", "Technology"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <h2 className="text-sm font-bold text-gray-700 mb-3">Content Blocks ({form.blocks.length})</h2>
          {form.blocks.map((block, i) => (
            <BlockEditor key={block.id} block={block}
              onChange={updated => setForm({ ...form, blocks: form.blocks.map((b, j) => j === i ? updated : b) })}
              onDelete={() => setForm({ ...form, blocks: form.blocks.filter((_, j) => j !== i) })} />
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {[["text", "Text Block"], ["mcq", "Multiple Choice"], ["fitb", "Fill in Blank"]].map(([type, label]) => (
            <button key={type} onClick={() => addBlock(type)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 text-sm text-gray-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
              <Icon name="plus" size={14} /> {label}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={save} disabled={saving || !form.title}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all shadow-sm disabled:opacity-50">
            {saving ? "Saving…" : lesson ? "Save Changes" : "Publish Lesson"}
          </button>
          <button onClick={onCancel} className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium text-sm hover:bg-gray-50 transition-all">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Lesson Card ───────────────────────────────────────────────────────────────
function LessonCard({ lesson, onEdit, onDelete, onView, showActions = false }) {
  const colors = CATEGORY_COLORS[lesson.category] || CATEGORY_COLORS.default;
  const questionCount = lesson.blocks.filter(b => b.type === "mcq" || b.type === "fitb").length;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md hover:shadow-gray-100 hover:-translate-y-0.5 transition-all duration-200">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}>
            {lesson.category}
          </span>
          {showActions && (
            <div className="flex gap-1">
              <button onClick={() => onEdit(lesson)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Icon name="edit" size={14} /></button>
              <button onClick={() => onDelete(lesson.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Icon name="trash" size={14} /></button>
            </div>
          )}
        </div>
        <h3 className="font-bold text-gray-900 text-base leading-snug mb-1.5">{lesson.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{lesson.description}</p>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Icon name="user" size={12} /> {lesson.author}</span>
          <span className="flex items-center gap-1"><Icon name="helpCircle" size={12} /> {questionCount} questions</span>
          <span className="flex items-center gap-1"><Icon name="layers" size={12} /> {lesson.blocks.length} blocks</span>
        </div>
      </div>
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
        <button onClick={() => onView(lesson)}
          className={`w-full py-2 rounded-xl text-sm font-semibold transition-all ${showActions ? "bg-white border border-gray-200 text-gray-700 hover:border-indigo-300 hover:text-indigo-600" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"}`}>
          {showActions ? "Preview Lesson" : "Start Lesson"}
        </button>
      </div>
    </div>
  );
}

// ─── Learner View ──────────────────────────────────────────────────────────────
function LearnerView({ lesson, onBack, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [fitbInputs, setFitbInputs] = useState({});
  const [score, setScore] = useState(null);

  const questions = lesson.blocks.filter(b => b.type === "mcq" || b.type === "fitb");

  const submitMCQ = (blockId, idx) => {
    setAnswers({ ...answers, [blockId]: idx });
    setSubmitted({ ...submitted, [blockId]: true });
  };

  const submitFitb = (blockId, block) => {
    const inputs = fitbInputs[blockId] || [];
    const correct = block.blanks.every((ans, i) => (inputs[i] || "").toLowerCase().trim() === ans.toLowerCase().trim());
    setAnswers({ ...answers, [blockId]: correct ? "correct" : "wrong" });
    setSubmitted({ ...submitted, [blockId]: true });
  };

  const finish = () => {
    let correct = 0;
    questions.forEach(q => {
      if (q.type === "mcq" && answers[q.id] === q.correct) correct++;
      if (q.type === "fitb" && answers[q.id] === "correct") correct++;
    });
    const sc = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 100;
    setScore(sc);
    onComplete(sc);
  };

  if (score !== null) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-sm">
          <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6 ${score >= 70 ? "bg-emerald-100" : "bg-amber-100"}`}>
            <span className={`text-3xl font-bold ${score >= 70 ? "text-emerald-700" : "text-amber-700"}`}>{score}%</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{score >= 70 ? "Great job!" : "Keep practicing!"}</h2>
          <p className="text-gray-500 mb-6">You scored {score}% on "{lesson.title}"</p>
          <div className="flex gap-3 justify-center">
            <button onClick={onBack} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">Back to Lessons</button>
          </div>
        </div>
      </div>
    );
  }

  const allAnswered = questions.every(q => submitted[q.id]);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
          <Icon name="arrowLeft" size={16} /> Back to lessons
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
          <p className="text-gray-500">{lesson.description}</p>
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-400">
            <span>By {lesson.author}</span>
            <span>·</span>
            <span>{questions.length} questions</span>
          </div>
        </div>

        <div className="space-y-4">
          {lesson.blocks.map((block, i) => {
            if (block.type === "text") {
              return (
                <div key={block.id} className="bg-white border border-gray-100 rounded-2xl p-6">
                  <p className="text-gray-800 leading-relaxed">{block.content}</p>
                </div>
              );
            }

            if (block.type === "mcq") {
              const isSubmitted = submitted[block.id];
              const selected = answers[block.id];
              return (
                <div key={block.id} className="bg-white border border-gray-100 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">{i}</span>
                    <h3 className="font-semibold text-gray-900">{block.question}</h3>
                  </div>
                  <div className="space-y-2">
                    {block.options.map((opt, idx) => {
                      let cls = "w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ";
                      if (!isSubmitted) cls += "border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50";
                      else if (idx === block.correct) cls += "border-emerald-400 bg-emerald-50 text-emerald-800";
                      else if (idx === selected && idx !== block.correct) cls += "border-red-300 bg-red-50 text-red-700";
                      else cls += "border-gray-100 text-gray-400";
                      return (
                        <button key={idx} onClick={() => !isSubmitted && submitMCQ(block.id, idx)} className={cls} disabled={isSubmitted}>
                          <div className="flex items-center gap-3">
                            <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${isSubmitted && idx === block.correct ? "border-emerald-500 bg-emerald-500" : isSubmitted && idx === selected ? "border-red-400" : "border-gray-300"}`}>
                              {isSubmitted && idx === block.correct && <Icon name="check" size={11} className="text-white" />}
                              {isSubmitted && idx === selected && idx !== block.correct && <Icon name="x" size={11} className="text-red-400" />}
                            </span>
                            {opt}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {isSubmitted && block.feedback && (
                    <div className={`mt-3 p-3 rounded-xl text-sm ${selected === block.correct ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                      {block.feedback[selected]}
                    </div>
                  )}
                </div>
              );
            }

            if (block.type === "fitb") {
              const isSubmitted = submitted[block.id];
              const isCorrect = answers[block.id] === "correct";
              const parts = block.question.split("___");
              return (
                <div key={block.id} className="bg-white border border-gray-100 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">{i}</span>
                    <h3 className="font-semibold text-gray-900">Fill in the blank</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-4 text-gray-800">
                    {parts.map((part, pi) => (
                      <span key={pi} className="flex items-center gap-2 flex-wrap">
                        <span>{part}</span>
                        {pi < parts.length - 1 && (
                          <input value={(fitbInputs[block.id] || [])[pi] || ""}
                            onChange={e => { const inp = [...(fitbInputs[block.id] || block.blanks.map(() => ""))]; inp[pi] = e.target.value; setFitbInputs({ ...fitbInputs, [block.id]: inp }); }}
                            disabled={isSubmitted}
                            className={`px-3 py-1.5 rounded-lg border text-sm w-32 outline-none ${isSubmitted ? (isCorrect ? "border-emerald-400 bg-emerald-50 text-emerald-800" : "border-red-300 bg-red-50 text-red-700") : "border-gray-300 focus:border-indigo-400"}`}
                            placeholder="…" />
                        )}
                      </span>
                    ))}
                  </div>
                  {block.hint && !isSubmitted && <p className="text-xs text-gray-400 mb-3">💡 Hint: {block.hint}</p>}
                  {!isSubmitted && (
                    <button onClick={() => submitFitb(block.id, block)} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all">Check Answer</button>
                  )}
                  {isSubmitted && (
                    <div className={`p-3 rounded-xl text-sm ${isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                      {isCorrect ? "Correct! Well done." : `Not quite. The correct answer is: ${block.blanks.join(", ")}`}
                    </div>
                  )}
                </div>
              );
            }
            return null;
          })}
        </div>

        {allAnswered && questions.length > 0 && (
          <div className="mt-6">
            <button onClick={finish} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-base transition-all shadow-sm">
              Complete Lesson →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Progress Tracker ──────────────────────────────────────────────────────────
function ProgressView({ completedLessons }) {
  const total = completedLessons.length;
  const avgScore = total > 0 ? Math.round(completedLessons.reduce((s, l) => s + l.score, 0) / total) : 0;

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Progress</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[["Lessons Completed", total, "award"], ["Average Score", `${avgScore}%`, "star"], ["Questions Answered", completedLessons.reduce((s, l) => s + (l.questions || 0), 0), "checkCircle"]].map(([label, val, icon]) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-3">
              <Icon name={icon} size={18} className="text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{val}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>
      {total === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Icon name="book" size={40} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium">No lessons completed yet</p>
          <p className="text-sm">Start exploring lessons to see your progress here</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-gray-700 mb-3">Completed Lessons</h2>
          {completedLessons.map((l, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${l.score >= 70 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {l.score}%
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{l.title}</p>
                <p className="text-xs text-gray-400">{l.questions} questions answered</p>
              </div>
              <div className="ml-auto">
                <Icon name={l.score >= 70 ? "checkCircle" : "alertCircle"} size={18} className={l.score >= 70 ? "text-emerald-500" : "text-amber-500"} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Admin Dashboard ───────────────────────────────────────────────────────────
function AdminDashboard({ lessons }) {
  const totalAttempts = lessons.reduce((s, l) => s + l.stats.attempts, 0);
  const avgScore = lessons.length > 0 ? Math.round(lessons.reduce((s, l) => s + l.stats.avgScore, 0) / lessons.length) : 0;
  const totalCompletions = lessons.reduce((s, l) => s + l.stats.completions, 0);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Overview</h1>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[["Total Lessons", lessons.length, "layers", "text-indigo-600", "bg-indigo-50"],
          ["Total Attempts", totalAttempts, "user", "text-blue-600", "bg-blue-50"],
          ["Avg. Score", `${avgScore}%`, "star", "text-emerald-600", "bg-emerald-50"],
          ["Completions", totalCompletions, "checkCircle", "text-purple-600", "bg-purple-50"]].map(([label, val, icon, tc, bc]) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className={`w-10 h-10 rounded-xl ${bc} flex items-center justify-center mb-3`}>
              <Icon name={icon} size={18} className={tc} />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{val}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Lesson Statistics</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Lesson", "Category", "Attempts", "Avg Score", "Completions", "Rate"].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {lessons.map(l => {
              const rate = l.stats.attempts > 0 ? Math.round((l.stats.completions / l.stats.attempts) * 100) : 0;
              const colors = CATEGORY_COLORS[l.category] || CATEGORY_COLORS.default;
              return (
                <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">{l.title}</p>
                    <p className="text-xs text-gray-400">by {l.author}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${colors.bg} ${colors.text}`}>{l.category}</span>
                  </td>
                  <td className="px-5 py-4 text-gray-700 font-medium">{l.stats.attempts}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full">
                        <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${l.stats.avgScore}%` }} />
                      </div>
                      <span className="font-medium text-gray-700">{l.stats.avgScore}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-700 font-medium">{l.stats.completions}</td>
                  <td className="px-5 py-4">
                    <span className={`font-semibold ${rate >= 70 ? "text-emerald-600" : rate >= 50 ? "text-amber-600" : "text-red-500"}`}>{rate}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Creator Dashboard ─────────────────────────────────────────────────────────
function CreatorDashboard({ lessons, user }) {
  const myLessons = lessons.filter(l => l.authorId === user.id);
  const totalAttempts = myLessons.reduce((s, l) => s + l.stats.attempts, 0);
  const avgScore = myLessons.length > 0 ? Math.round(myLessons.reduce((s, l) => s + l.stats.avgScore, 0) / myLessons.length) : 0;

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name.split(" ")[0]} 👋</h1>
        <p className="text-gray-500 mt-1">Here's how your lessons are performing</p>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[["My Lessons", myLessons.length, "book"], ["Total Learners", totalAttempts, "user"], ["Avg. Score", `${avgScore}%`, "star"]].map(([label, val, icon]) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-3">
              <Icon name={icon} size={18} className="text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{val}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [editingLesson, setEditingLesson] = useState(null);
  const [viewingLesson, setViewingLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);

  useEffect(() => {
    mockAPI.getLessons().then(setLessons);
  }, []);

  useEffect(() => {
    if (user) {
      const defaults = { creator: "dashboard", learner: "explore", admin: "adminDash" };
      setView(defaults[user.role] || "explore");
    }
  }, [user]);

  const refreshLessons = () => mockAPI.getLessons().then(setLessons);

  const handleSave = async (lessonData) => {
    if (editingLesson?.id) {
      await mockAPI.updateLesson(editingLesson.id, lessonData);
    } else {
      await mockAPI.createLesson(lessonData);
    }
    await refreshLessons();
    setEditingLesson(null);
    setView("lessons");
  };

  const handleDelete = async (id) => {
    if (window.confirm ? window.confirm("Delete this lesson?") : true) {
      await mockAPI.deleteLesson(id);
      await refreshLessons();
    }
  };

  const handleComplete = (score) => {
    const questions = viewingLesson.blocks.filter(b => b.type === "mcq" || b.type === "fitb").length;
    setCompletedLessons(prev => [...prev, { title: viewingLesson.title, score, questions }]);
  };

  if (!user) return <AuthPage onLogin={setUser} />;

  // Lesson form
  if (view === "create" || (view === "edit" && editingLesson)) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar user={user} view={view} setView={setView} onLogout={() => setUser(null)} />
        <LessonForm user={user} lesson={editingLesson} onSave={handleSave} onCancel={() => { setEditingLesson(null); setView(user.role === "creator" ? "lessons" : "explore"); }} />
      </div>
    );
  }

  // Lesson viewer
  if (viewingLesson) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar user={user} view={view} setView={v => { setViewingLesson(null); setView(v); }} onLogout={() => setUser(null)} />
        <LearnerView lesson={viewingLesson} onBack={() => setViewingLesson(null)} onComplete={handleComplete} />
      </div>
    );
  }

  const myLessons = lessons.filter(l => l.authorId === user.id);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar user={user} view={view} setView={setView} onLogout={() => setUser(null)} />
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Creator views */}
        {user.role === "creator" && view === "dashboard" && <CreatorDashboard lessons={lessons} user={user} />}
        {user.role === "creator" && view === "lessons" && (
          <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">My Lessons</h1>
              <button onClick={() => { setEditingLesson(null); setView("create"); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm">
                <Icon name="plus" size={15} /> New Lesson
              </button>
            </div>
            {myLessons.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Icon name="book" size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-medium text-gray-500">No lessons yet</p>
                <p className="text-sm mb-6">Create your first interactive lesson</p>
                <button onClick={() => setView("create")} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700">Create Lesson</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {myLessons.map(l => <LessonCard key={l.id} lesson={l} showActions onEdit={ls => { setEditingLesson(ls); setView("edit"); }} onDelete={handleDelete} onView={setViewingLesson} />)}
              </div>
            )}
          </div>
        )}

        {/* Learner views */}
        {user.role === "learner" && view === "explore" && (
          <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Explore Lessons</h1>
            <p className="text-gray-500 mb-6">{lessons.length} interactive lessons available</p>
            <div className="grid grid-cols-2 gap-4">
              {lessons.map(l => <LessonCard key={l.id} lesson={l} onView={setViewingLesson} />)}
            </div>
          </div>
        )}
        {user.role === "learner" && view === "progress" && <ProgressView completedLessons={completedLessons} />}

        {/* Admin views */}
        {user.role === "admin" && view === "adminDash" && <AdminDashboard lessons={lessons} />}
        {user.role === "admin" && view === "allLessons" && (
          <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">All Lessons</h1>
            <div className="grid grid-cols-2 gap-4">
              {lessons.map(l => <LessonCard key={l.id} lesson={l} onView={setViewingLesson} />)}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
