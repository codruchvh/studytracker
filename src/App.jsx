import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Play, Pause, RotateCcw, Plus, GraduationCap, Clock, Pencil, Trash2, X,
  CheckCircle2, Circle, FileText, ExternalLink, Link2, ListChecks, Layers, AlertCircle,
} from "lucide-react";

/* ============================================================================
   DESIGN SYSTEM
   Ink-and-brass: a warm near-black surface, one restrained brass accent, a
   serif reserved for key display elements, and a clean monospace for data.
============================================================================ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,450;0,500;0,600;1,500&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

.app-root {
  --bg: #0b0a09;
  --surface: #141210;
  --surface-hover: #1b1815;
  --surface-inset: #0f0e0c;
  --line: rgba(240,232,220,0.08);
  --line-strong: rgba(240,232,220,0.16);
  --text: #ece6da;
  --text-dim: #a49c8d;
  --text-faint: #6b6459;
  --accent: #c2914f;
  --accent-hover: #d3a465;
  --accent-press: #a97b3d;
  --accent-faint: rgba(194,145,79,0.13);
  --accent-dim: rgba(194,145,79,0.34);
  --good: #6fa87c;
  --good-faint: rgba(111,168,124,0.13);
  --bad: #c1685c;
  --bad-faint: rgba(193,104,92,0.13);
  --radius-sm: 6px;
  --radius-md: 9px;
  --radius-lg: 13px;
  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'IBM Plex Sans', -apple-system, sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, monospace;

  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  position: relative;
}
.app-root * { box-sizing: border-box; }
.app-root .fd { font-family: var(--font-display); }
.app-root .fm { font-family: var(--font-mono); }

/* type scale */
.fs-11 { font-size: 11px; }
.fs-12 { font-size: 12px; }
.fs-13 { font-size: 13px; }
.fs-14 { font-size: 14px; }
.fs-15 { font-size: 15px; }
.fs-16 { font-size: 16px; }
.fs-18 { font-size: 18px; }
.fs-24 { font-size: 24px; }
.fs-38 { font-size: 38px; }
.lh-normal { line-height: 1.55; }

.app-root a:focus-visible,
.app-root button:focus-visible,
.app-root input:focus-visible,
.app-root textarea:focus-visible,
.app-root select:focus-visible,
.app-root [tabindex]:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 4px;
}

.scroll-area { scrollbar-width: thin; scrollbar-color: rgba(240,232,220,0.14) transparent; }
.scroll-area::-webkit-scrollbar { width: 6px; height: 6px; }
.scroll-area::-webkit-scrollbar-thumb { background: rgba(240,232,220,0.14); border-radius: 999px; }
.scroll-area::-webkit-scrollbar-track { background: transparent; }

/* surfaces */
.surface { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-lg); }
.list-rows > * + * { border-top: 1px solid var(--line); }
.surface-inset { background: var(--surface-inset); border: 1px solid var(--line); border-radius: var(--radius-md); }
.row-hover { transition: background 0.12s ease, border-color 0.12s ease; }
.row-hover:hover { background: var(--surface-hover); }

/* buttons */
.btn {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  border-radius: var(--radius-md);
  padding: 8px 14px;
  cursor: pointer;
  transition: background 0.12s ease, border-color 0.12s ease, color 0.12s ease;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 1px solid transparent;
}
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-primary { background: var(--accent); color: #1b1509; }
.btn-primary:hover:not(:disabled) { background: var(--accent-hover); }
.btn-primary:active:not(:disabled) { background: var(--accent-press); }
.btn-ghost { background: transparent; color: var(--text-dim); border-color: var(--line-strong); }
.btn-ghost:hover:not(:disabled) { color: var(--text); border-color: var(--text-faint); background: var(--surface-hover); }
.btn-danger { background: transparent; color: var(--bad); border-color: rgba(193,104,92,0.35); }
.btn-danger:hover:not(:disabled) { background: var(--bad-faint); }
.btn-sm { padding: 6px 11px; font-size: 12px; }
.icon-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: var(--radius-sm);
  color: var(--text-dim); background: transparent; border: 1px solid transparent;
  cursor: pointer; transition: all 0.12s ease; flex-shrink: 0;
}
.icon-btn:hover { color: var(--text); background: var(--surface-hover); border-color: var(--line); }
.icon-btn.danger:hover { color: var(--bad); background: var(--bad-faint); }

/* inputs */
.field-label { font-size: 12px; color: var(--text-dim); margin-bottom: 6px; display: block; }
.field-input, .field-textarea, .field-select {
  width: 100%; background: var(--surface-inset); border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm); padding: 9px 11px; color: var(--text);
  font-family: var(--font-body); font-size: 13.5px; outline: none;
  transition: border-color 0.12s ease;
}
.field-input:focus, .field-textarea:focus, .field-select:focus { border-color: var(--accent-dim); }
.field-textarea { resize: vertical; min-height: 76px; line-height: 1.5; }
.field-input::placeholder, .field-textarea::placeholder { color: var(--text-faint); }
.field-select { appearance: none; cursor: pointer; }

/* badges / tags */
.badge {
  font-family: var(--font-mono); font-size: 10.5px; font-weight: 500; letter-spacing: 0.03em;
  padding: 3px 8px; border-radius: 999px; border: 1px solid var(--line-strong);
  color: var(--text-dim); display: inline-flex; align-items: center; gap: 5px; white-space: nowrap;
}
.badge-bad { color: var(--bad); border-color: rgba(193,104,92,0.35); background: var(--bad-faint); }
.dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; display: inline-block; }

/* tabs */
.tab-bar { display: flex; gap: 2px; border-bottom: 1px solid var(--line); overflow-x: auto; }
.tab-item {
  font-size: 13px; font-weight: 500; color: var(--text-faint); padding: 10px 14px;
  border-bottom: 2px solid transparent; cursor: pointer; white-space: nowrap; background: transparent; border-radius: 0;
  transition: color 0.12s ease, border-color 0.12s ease;
}
.tab-item:hover { color: var(--text-dim); }
.tab-item.active { color: var(--text); border-bottom-color: var(--accent); }

/* progress */
.progress-track { height: 5px; border-radius: 999px; background: var(--surface-inset); overflow: hidden; }
.progress-fill { height: 100%; border-radius: 999px; background: var(--accent); transition: width 0.4s ease; }

/* segmented control */
.segmented { display: inline-flex; gap: 2px; padding: 2px; background: var(--surface-inset); border: 1px solid var(--line-strong); border-radius: var(--radius-md); }
.segmented button { font-family: var(--font-body); font-size: 12px; font-weight: 500; padding: 5px 10px; border-radius: 7px; border: none; background: transparent; color: var(--text-dim); cursor: pointer; transition: all 0.12s ease; white-space: nowrap; }
.segmented button:hover:not(:disabled) { color: var(--text); }
.segmented button.active { background: var(--accent); color: #1b1509; }
.segmented button:disabled { opacity: 0.4; cursor: not-allowed; }

/* consistency heatmap */
.heatmap-grid { display: grid; grid-auto-flow: column; grid-template-rows: repeat(7, 1fr); gap: 3px; width: fit-content; }
.heatmap-cell { width: 11px; height: 11px; border-radius: 2.5px; background: var(--surface-inset); border: 1px solid var(--line); }
.heatmap-cell.empty { visibility: hidden; }

/* overlays */
.overlay-backdrop { position: fixed; inset: 0; z-index: 40; background: rgba(6,5,4,0.68); animation: fade-in-fast 0.15s ease both; }
.modal-panel { animation: modal-in 0.16s cubic-bezier(.2,.9,.3,1) both; box-shadow: 0 24px 60px -12px rgba(0,0,0,0.6); }
@keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
@keyframes fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
@keyframes modal-in { from { opacity: 0; transform: scale(0.97) translateY(6px); } to { opacity: 1; transform: scale(1) translateY(0); } }
.anim-fade-in { animation: fade-in 0.25s ease both; }

/* status pulse */
.pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--good); flex-shrink: 0; }
.pulse-dot.busy { animation: pulse-soft 1.2s ease-in-out infinite; background: var(--accent); }
@keyframes pulse-soft { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }

/* toast */
.toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 60; font-size: 12.5px; color: var(--text); background: #1c1a17; border: 1px solid var(--line-strong); padding: 10px 16px; border-radius: var(--radius-md); box-shadow: 0 12px 30px rgba(0,0,0,0.5); animation: fade-in 0.2s ease both; display: flex; align-items: center; gap: 8px; max-width: 86vw; }

/* mini bar chart */
.mbar-track { display: flex; align-items: flex-end; gap: 7px; }
.mbar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; }
.mbar-fill { width: 100%; border-radius: 3px 3px 1px 1px; transition: height 0.35s ease; min-height: 2px; }

/* layout grids */
.notes-grid { display: flex; flex-direction: column; gap: 20px; }
@media (min-width: 1024px) {
  .notes-grid { display: grid; grid-template-columns: 240px 1fr; }
}

/* flip card */
.flip-card { perspective: 900px; cursor: pointer; }
.flip-inner { position: relative; width: 100%; height: 100%; transition: transform 0.35s; transform-style: preserve-3d; }
.flip-card.flipped .flip-inner { transform: rotateY(180deg); }
.flip-face { position: absolute; inset: 0; backface-visibility: hidden; display: flex; align-items: center; justify-content: center; text-align: center; padding: 14px; border-radius: var(--radius-md); }
.flip-back { transform: rotateY(180deg); }

@media (prefers-reduced-motion: reduce) {
  .app-root *, .app-root *::before, .app-root *::after {
    animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important;
  }
}
`;

/* ============================================================================
   CONSTANTS
============================================================================ */
const STUDY_TABS = [
  { id: "overview", label: "Analytics" },
  { id: "notes", label: "Notes" },
  { id: "research", label: "Research" },
  { id: "planner", label: "Planner" },
  { id: "flashcards", label: "Flashcards" },
];
const STUDY_SWATCHES = ["#8f96c4", "#c17a52", "#6fa87c", "#c2914f", "#7c8fa6", "#b06b8f"];
const TIME_RANGE_OPTIONS = [
  { value: "week", label: "Weekly" },
  { value: "month", label: "Monthly" },
  { value: "all", label: "All time" },
];
const FOCUS_PRESETS = [25, 45, 60];
const BREAK_PRESETS = [5, 10, 15];
const RATING_EMOJI = { great: "🙂", okay: "😐", rough: "😕" };
const HEATMAP_COLORS = ["var(--surface-inset)", "rgba(194,145,79,0.25)", "rgba(194,145,79,0.48)", "rgba(194,145,79,0.72)", "var(--accent)"];
const SUBJECT_TABLE_COLS = "1.6fr 0.8fr 0.6fr 0.8fr 1.6fr 0.9fr";

function createEmptyStudyState() {
  return { subjects: [], notes: [], sources: [], tasks: [], flashcards: [], sessions: [] };
}

/* ============================================================================
   HELPERS & UTILITIES
============================================================================ */
let idCounter = 1000;
const uid = () => `id-${Date.now().toString(36)}-${idCounter++}`;

function todayISO() { return new Date().toISOString().slice(0, 10); }
function addDaysISO(n) { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }
function daysUntil(iso) {
  if (!iso) return null;
  const target = new Date(iso + "T00:00:00");
  const now = new Date();
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const b = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.round((b - a) / 86400000);
}
function formatDueLabel(iso) {
  const d = daysUntil(iso);
  if (d === null) return "No date";
  if (d < 0) return `${Math.abs(d)}d overdue`;
  if (d === 0) return "Due today";
  if (d === 1) return "Due tomorrow";
  return `Due in ${d}d`;
}
function formatDateShort(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function formatRelativeTime(ts) {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  const wk = Math.floor(day / 7);
  if (wk < 5) return `${wk}w ago`;
  return `${Math.floor(day / 30)}mo ago`;
}

function isoOf(d) { return d.toISOString().slice(0, 10); }
function startOfWeek(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}
function startOfMonth(d) { const x = new Date(d); x.setDate(1); x.setHours(0, 0, 0, 0); return x; }
function endOfMonth(d) { const x = new Date(d); x.setMonth(x.getMonth() + 1, 0); x.setHours(0, 0, 0, 0); return x; }

function sessionsInCalendarRange(sessions, range) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (range === "week") {
    const start = startOfWeek(today);
    const end = new Date(start); end.setDate(end.getDate() + 6);
    const startIso = isoOf(start), endIso = isoOf(end);
    return sessions.filter((s) => s.date && s.date >= startIso && s.date <= endIso);
  }
  if (range === "month") {
    const start = startOfMonth(today), end = endOfMonth(today);
    const startIso = isoOf(start), endIso = isoOf(end);
    return sessions.filter((s) => s.date && s.date >= startIso && s.date <= endIso);
  }
  return sessions;
}

function buildTrendBuckets(sessions, range) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (range === "week") {
    const start = startOfWeek(today);
    const buckets = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start); d.setDate(d.getDate() + i);
      const iso = isoOf(d);
      const minutes = sessions.filter((s) => s.date === iso).reduce((sum, s) => sum + (Number(s.minutes) || 0), 0);
      buckets.push({ key: iso, label: d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2), minutes });
    }
    return buckets;
  }
  if (range === "month") {
    const monthStart = startOfMonth(today), monthEnd = endOfMonth(today);
    const monthKey = isoOf(monthStart).slice(0, 7);
    const buckets = [];
    let cursor = startOfWeek(monthStart);
    const lastWeekStart = startOfWeek(monthEnd);
    let weekNum = 1;
    while (cursor <= lastWeekStart) {
      const weekStartIso = isoOf(cursor);
      const weekEnd = new Date(cursor); weekEnd.setDate(weekEnd.getDate() + 6);
      const weekEndIso = isoOf(weekEnd);
      const minutes = sessions.filter((s) => s.date && s.date >= weekStartIso && s.date <= weekEndIso && s.date.slice(0, 7) === monthKey).reduce((sum, s) => sum + (Number(s.minutes) || 0), 0);
      buckets.push({ key: weekStartIso, label: `Wk ${weekNum}`, minutes });
      cursor = new Date(cursor); cursor.setDate(cursor.getDate() + 7);
      weekNum++;
    }
    return buckets;
  }
  if (sessions.length === 0) return [];
  const sorted = [...sessions].sort((a, b) => (a.date < b.date ? -1 : 1));
  let [y, m] = sorted[0].date.slice(0, 7).split("-").map(Number);
  const now = new Date();
  const buckets = [];
  while (y < now.getFullYear() || (y === now.getFullYear() && m <= now.getMonth() + 1)) {
    const key = `${y}-${String(m).padStart(2, "0")}`;
    const minutes = sessions.filter((s) => s.date && s.date.slice(0, 7) === key).reduce((sum, s) => sum + (Number(s.minutes) || 0), 0);
    buckets.push({ key, label: new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "short" }), minutes });
    m++; if (m > 12) { m = 1; y++; }
  }
  return buckets.slice(-24);
}

function buildSubjectTotals(sessions, subjects) {
  const map = {};
  sessions.forEach((s) => {
    if (!s.subjectId) return;
    if (!map[s.subjectId]) map[s.subjectId] = { minutes: 0, count: 0 };
    map[s.subjectId].minutes += Number(s.minutes) || 0;
    map[s.subjectId].count += 1;
  });
  const total = Object.values(map).reduce((sum, v) => sum + v.minutes, 0);
  return subjects.map((sub) => {
    const m = map[sub.id] || { minutes: 0, count: 0 };
    return { subject: sub, minutes: m.minutes, count: m.count, avg: m.count ? Math.round(m.minutes / m.count) : 0, pct: total ? Math.round((m.minutes / total) * 100) : 0 };
  });
}

function buildHeatmapWeeks(sessions, weeksCount) {
  const byDate = {};
  sessions.forEach((s) => { if (s.date) byDate[s.date] = (byDate[s.date] || 0) + (Number(s.minutes) || 0); });
  const totalDays = weeksCount * 7;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const weekEnd = new Date(today); weekEnd.setDate(weekEnd.getDate() + (6 - weekEnd.getDay()));
  const weekStart = new Date(weekEnd); weekStart.setDate(weekStart.getDate() - (totalDays - 1));
  const cells = [];
  let maxMinutes = 0;
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(weekStart); d.setDate(d.getDate() + i);
    const iso = isoOf(d);
    const minutes = byDate[iso] || 0;
    const future = d > today;
    if (!future) maxMinutes = Math.max(maxMinutes, minutes);
    cells.push({ iso, minutes, future, label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) });
  }
  return { cells, maxMinutes };
}

function formatMinutes(min) {
  const m = Math.round(min);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60), rem = m % 60;
  return rem ? `${h}h ${rem}m` : `${h}h`;
}
function minutesToHours(min) { return (min / 60).toFixed(1); }

function timerDisplaySeconds(timer) {
  if (timer.mode === "focus") return Math.max(0, timer.targetMinutes * 60 - timer.seconds);
  if (timer.mode === "break") return Math.max(0, timer.breakMinutes * 60 - timer.seconds);
  return timer.seconds;
}
function formatClock(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function playChime() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.9);
    osc.onended = () => ctx.close();
  } catch (e) { /* audio fallback */ }
}

const STORAGE_KEY = "study-tracker:data";
function storageProbe() {
  try {
    const testKey = "study-tracker:probe";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) { return false; }
}
function storageLoad() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}
function storageSave(value) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); return true; }
  catch (e) { return false; }
}
function storageWipe() {
  try { window.localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
}

/* ============================================================================
   PRIMITIVES
============================================================================ */
function SegmentedControl({ options, value, onChange, disabled }) {
  return (
    <div className="segmented">
      {options.map((o) => (
        <button key={String(o.value)} type="button" className={value === o.value ? "active" : ""} disabled={disabled} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Badge({ children, tone, dot }) {
  const cls = tone === "bad" ? "badge badge-bad" : "badge";
  return <span className={cls}>{dot && <span className="dot" style={{ background: dot }} />}{children}</span>;
}

function EmptyState({ icon: Icon, title, hint, action }) {
  return (
    <div className="flex flex-col items-center text-center py-12 px-6">
      {Icon && <Icon size={22} style={{ color: "var(--text-faint)", marginBottom: 12 }} />}
      <div className="fs-14" style={{ color: "var(--text)" }}>{title}</div>
      {hint && <div className="fs-13 mt-1.5 lh-normal" style={{ color: "var(--text-faint)", maxWidth: 320 }}>{hint}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function StatTile({ label, value }) {
  return (
    <div className="surface-inset px-4 py-3">
      <div className="fs-11" style={{ color: "var(--text-faint)" }}>{label}</div>
      <div className="fm fs-18 mt-1" style={{ color: "var(--text)" }}>{value}</div>
    </div>
  );
}

function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tab-bar">
      {tabs.map((t) => (
        <button key={t.id} className={`tab-item ${active === t.id ? "active" : ""}`} onClick={() => onChange(t.id)}>{t.label}</button>
      ))}
    </div>
  );
}

function MiniBarChart({ data, color, height }) {
  const h = height || 90;
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="mbar-track" style={{ height: h }}>
      {data.map((d, i) => (
        <div key={i} className="mbar-col">
          <div className="mbar-fill" style={{ height: `${Math.max(2, (d.value / max) * (h - 20))}px`, background: color }} title={`${d.label}: ${d.value}`} />
          <span className="fm fs-11" style={{ color: "var(--text-faint)" }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function Modal({ title, onClose, children, width }) {
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="overlay-backdrop" onClick={onClose} />
      <div className="modal-panel surface relative w-full p-5" style={{ maxWidth: width || 440, maxHeight: "88vh", overflowY: "auto" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="fs-16" style={{ color: "var(--text)" }}>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={15} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormField({ field, value, onChange }) {
  const common = { value: value == null ? "" : value, onChange: (e) => onChange(field.key, e.target.value) };
  return (
    <div className="mb-3.5">
      <label className="field-label">{field.label}{field.required && <span style={{ color: "var(--accent)" }}> *</span>}</label>
      {field.type === "textarea" && <textarea className="field-textarea" placeholder={field.placeholder} rows={3} {...common} />}
      {field.type === "select" && (
        <select className="field-select" {...common}>
          <option value="">Select…</option>
          {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
      {field.type === "number" && <input type="number" className="field-input" placeholder={field.placeholder} {...common} />}
      {field.type === "date" && <input type="date" className="field-input" {...common} />}
      {(!field.type || field.type === "text") && <input type="text" className="field-input" placeholder={field.placeholder} {...common} />}
      {field.type === "swatch" && (
        <div className="flex gap-2">
          {STUDY_SWATCHES.map((c) => (
            <button key={c} type="button" onClick={() => onChange(field.key, c)}
              style={{ width: 26, height: 26, borderRadius: "50%", background: c, border: value === c ? "2px solid var(--text)" : "2px solid transparent", cursor: "pointer" }} aria-label={`Choose color ${c}`} />
          ))}
        </div>
      )}
    </div>
  );
}

function RecordForm({ fields, initial, onCancel, onSave, saveLabel }) {
  const [values, setValues] = useState(() => {
    const v = { ...initial };
    fields.forEach((f) => { if (v[f.key] === undefined) v[f.key] = f.type === "date" ? todayISO() : f.type === "swatch" ? STUDY_SWATCHES[0] : ""; });
    return v;
  });
  const canSave = fields.every((f) => !f.required || (values[f.key] !== undefined && String(values[f.key]).trim() !== ""));
  return (
    <div>
      {fields.map((f) => <FormField key={f.key} field={f} value={values[f.key]} onChange={(k, v) => setValues((prev) => ({ ...prev, [k]: v }))} />)}
      <div className="flex gap-2 mt-1">
        <button className="btn btn-primary" disabled={!canSave} onClick={() => onSave(values)}>{saveLabel || "Save"}</button>
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

function SubjectPill({ subject, active, onClick }) {
  return (
    <button className="btn btn-sm" onClick={onClick}
      style={active ? { background: "var(--accent-faint)", color: "var(--accent)", borderColor: "var(--accent-dim)" } : { background: "transparent", color: "var(--text-dim)", borderColor: "var(--line-strong)" }}>
      <span className="dot" style={{ background: subject ? subject.color : "var(--text-faint)" }} />
      {subject ? subject.name : "All subjects"}
    </button>
  );
}

/* ============================================================================
   STUDY ANALYTICS
============================================================================ */
function heatmapLevel(minutes, max) {
  if (minutes <= 0) return 0;
  if (max <= 0) return 1;
  const frac = minutes / max;
  if (frac > 0.75) return 4;
  if (frac > 0.5) return 3;
  if (frac > 0.25) return 2;
  return 1;
}

function SubjectDonut({ segments, totalMinutes }) {
  const size = 140, stroke = 18, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  let offset = 0;
  const withMinutes = segments.filter((s) => s.minutes > 0);
  return (
    <div className="flex items-center gap-5 flex-wrap">
      <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-inset)" strokeWidth={stroke} />
          {withMinutes.map((s) => {
            const frac = s.minutes / totalMinutes;
            const dash = frac * c;
            const el = (
              <circle key={s.subject.id} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.subject.color} strokeWidth={stroke}
                strokeDasharray={`${dash} ${c - dash}`} strokeDashoffset={-offset} strokeLinecap="butt" />
            );
            offset += dash;
            return el;
          })}
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span className="fm fs-18" style={{ color: "var(--text)" }}>{minutesToHours(totalMinutes)}h</span>
          <span className="fs-11" style={{ color: "var(--text-faint)" }}>total</span>
        </div>
      </div>
      <div className="flex-1 space-y-1.5" style={{ minWidth: 140 }}>
        {totalMinutes === 0 ? <div className="fs-12" style={{ color: "var(--text-faint)" }}>No study time logged yet.</div> : segments.filter((s) => s.minutes > 0).map((s) => (
          <div key={s.subject.id} className="flex items-center gap-2">
            <span className="dot" style={{ background: s.subject.color }} />
            <span className="fs-12 flex-1 truncate" style={{ color: "var(--text)" }}>{s.subject.name}</span>
            <span className="fm fs-11" style={{ color: "var(--text-faint)" }}>{formatMinutes(s.minutes)} · {s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConsistencyHeatmap({ sessions, weeks }) {
  const { cells, maxMinutes } = useMemo(() => buildHeatmapWeeks(sessions, weeks), [sessions, weeks]);
  return (
    <div>
      <div className="heatmap-grid">
        {cells.map((c) => (
          c.future
            ? <div key={c.iso} className="heatmap-cell empty" />
            : <div key={c.iso} className="heatmap-cell" title={`${c.label}: ${c.minutes ? formatMinutes(c.minutes) : "No study time"}`}
                style={{ background: HEATMAP_COLORS[heatmapLevel(c.minutes, maxMinutes)], borderColor: c.minutes > 0 ? "transparent" : "var(--line)" }} />
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-3">
        <span className="fs-11" style={{ color: "var(--text-faint)" }}>Less</span>
        {HEATMAP_COLORS.map((col, i) => <span key={i} style={{ width: 11, height: 11, borderRadius: 2.5, background: col, border: "1px solid var(--line)" }} />)}
        <span className="fs-11" style={{ color: "var(--text-faint)" }}>More</span>
      </div>
    </div>
  );
}

function SubjectAnalyticsTable({ rangeRows, weekMinutesBySubject, flashcards, onAdjustGoal }) {
  return (
    <div className="surface">
      <div className="px-4 py-2.5" style={{ display: "grid", gridTemplateColumns: SUBJECT_TABLE_COLS, gap: 8, borderBottom: "1px solid var(--line)" }}>
        {["Subject", "Time", "Sessions", "Avg", "Weekly goal", "Flashcards"].map((h) => (
          <span key={h} className="fs-11" style={{ color: "var(--text-faint)" }}>{h}</span>
        ))}
      </div>
      <div className="list-rows">
        {rangeRows.map((r) => {
          const weekMin = weekMinutesBySubject[r.subject.id] || 0;
          const goal = r.subject.weeklyGoalMinutes || 0;
          const goalPct = goal > 0 ? Math.min(100, Math.round((weekMin / goal) * 100)) : null;
          const cardStats = flashcards.filter((c) => c.subjectId === r.subject.id).reduce((acc, c) => ({ correct: acc.correct + (c.correct || 0), total: acc.total + (c.correct || 0) + (c.missed || 0) }), { correct: 0, total: 0 });
          return (
            <div key={r.subject.id} className="px-4 py-3" style={{ display: "grid", gridTemplateColumns: SUBJECT_TABLE_COLS, gap: 8, alignItems: "center" }}>
              <div className="flex items-center gap-2 min-w-0"><span className="dot" style={{ background: r.subject.color }} /><span className="fs-13 truncate" style={{ color: "var(--text)" }}>{r.subject.name}</span></div>
              <span className="fm fs-12" style={{ color: "var(--text)" }}>{formatMinutes(r.minutes)}</span>
              <span className="fm fs-12" style={{ color: "var(--text)" }}>{r.count}</span>
              <span className="fm fs-12" style={{ color: "var(--text)" }}>{r.count ? formatMinutes(r.avg) : "—"}</span>
              <div>
                {goal > 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="progress-track" style={{ width: 52, flexShrink: 0 }}><div className="progress-fill" style={{ width: `${goalPct}%` }} /></div>
                    <span className="fm fs-11" style={{ color: "var(--text-faint)" }}>{minutesToHours(weekMin)}/{minutesToHours(goal)}h</span>
                  </div>
                ) : <span className="fs-11" style={{ color: "var(--text-faint)" }}>No goal</span>}
                <div className="flex items-center gap-1 mt-1">
                  <button className="icon-btn" style={{ width: 20, height: 20 }} onClick={() => onAdjustGoal(r.subject.id, -30)} aria-label={`Decrease ${r.subject.name} weekly goal`}>−</button>
                  <button className="icon-btn" style={{ width: 20, height: 20 }} onClick={() => onAdjustGoal(r.subject.id, 30)} aria-label={`Increase ${r.subject.name} weekly goal`}>+</button>
                </div>
              </div>
              <span className="fm fs-12" style={{ color: "var(--text)" }}>{cardStats.total ? `${Math.round((cardStats.correct / cardStats.total) * 100)}%` : "—"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SessionLogList({ sessions, subjects, tasks, onEdit, onDelete }) {
  const [showAll, setShowAll] = useState(false);
  const sorted = [...sessions].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const shown = showAll ? sorted : sorted.slice(0, 8);
  if (sessions.length === 0) return <EmptyState icon={Clock} title="No sessions logged yet" hint="Use the timer above, or log one manually." />;
  return (
    <div>
      <div className="surface list-rows">
        {shown.map((s) => {
          const sub = subjects.find((x) => x.id === s.subjectId);
          const task = tasks.find((t) => t.id === s.taskId);
          return (
            <div key={s.id} className="flex items-center gap-3 px-4 py-2.5 row-hover">
              <span className="fm fs-11" style={{ color: "var(--text-faint)", width: 62, flexShrink: 0 }}>{formatDateShort(s.date)}</span>
              {sub ? <span className="dot" style={{ background: sub.color }} /> : <span style={{ width: 7, flexShrink: 0 }} />}
              <div className="flex-1 min-w-0">
                <span className="fs-13" style={{ color: "var(--text)" }}>{sub ? sub.name : "No subject"}</span>
                {(s.note || task) && <div className="fs-11 truncate" style={{ color: "var(--text-faint)" }}>{task ? `Task: ${task.title}` : s.note}</div>}
              </div>
              {s.rating && <span title={s.rating}>{RATING_EMOJI[s.rating]}</span>}
              <span className="fm fs-12" style={{ color: "var(--text)" }}>{formatMinutes(s.minutes)}</span>
              <button className="icon-btn" style={{ width: 26, height: 26 }} onClick={() => onEdit(s)} aria-label="Edit session"><Pencil size={12} /></button>
              <button className="icon-btn danger" style={{ width: 26, height: 26 }} onClick={() => onDelete(s.id)} aria-label="Delete session"><Trash2 size={12} /></button>
            </div>
          );
        })}
      </div>
      {sorted.length > 8 && <button className="btn btn-ghost btn-sm mt-2.5" onClick={() => setShowAll(!showAll)}>{showAll ? "Show less" : `Show all ${sorted.length}`}</button>}
    </div>
  );
}

function PostSessionCard({ prompt, subjects, tasks, onRate, onCompleteTask, onStartBreak, onDismiss }) {
  if (!prompt) return null;
  const subject = subjects.find((s) => s.id === prompt.subjectId);
  const task = tasks.find((t) => t.id === prompt.taskId);
  return (
    <div className="surface-inset p-3.5 mt-3 anim-fade-in" style={{ borderColor: "var(--accent-dim)" }}>
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span className="fs-13" style={{ color: "var(--text)" }}>Nice work{subject ? ` on ${subject.name}` : ""}. How did that go?</span>
        <button className="icon-btn" style={{ width: 24, height: 24, flexShrink: 0 }} onClick={onDismiss} aria-label="Dismiss"><X size={13} /></button>
      </div>
      <div className="flex gap-2 flex-wrap mb-2.5">
        {Object.entries(RATING_EMOJI).map(([key, emoji]) => (
          <button key={key} className="btn btn-ghost btn-sm" onClick={() => onRate(key)}>{emoji} {key.charAt(0).toUpperCase() + key.slice(1)}</button>
        ))}
      </div>
      {(task || prompt.mode === "focus") && (
        <div className="flex items-center gap-2 flex-wrap pt-2.5 border-t" style={{ borderColor: "var(--line)" }}>
          {task && <button className="btn btn-ghost btn-sm" onClick={onCompleteTask}><CheckCircle2 size={12} /> Mark "{task.title}" done</button>}
          {prompt.mode === "focus" && (
            <div className="flex items-center gap-1.5">
              <Clock size={12} style={{ color: "var(--text-faint)" }} />
              <span className="fs-11" style={{ color: "var(--text-faint)" }}>Break:</span>
              {BREAK_PRESETS.map((m) => (
                <button key={m} className="btn btn-primary btn-sm" onClick={() => onStartBreak(m)}>{m}m</button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StudyOverview({ study, timer, onStartPause, onResetTimer, onSelectTimerSubject, onTimerModeChange, onTimerTargetChange, onTimerTaskChange, onStartBreak, postSessionPrompt, onDismissPostSession, onRateSession, onCompleteLinkedTask, studyActions }) {
  const [range, setRange] = useState("week");
  const [sessionModal, setSessionModal] = useState(null);

  const filteredSessions = useMemo(() => sessionsInCalendarRange(study.sessions, range), [study.sessions, range]);
  const trendBuckets = useMemo(() => buildTrendBuckets(filteredSessions, range), [filteredSessions, range]);
  const subjectTotals = useMemo(() => buildSubjectTotals(filteredSessions, study.subjects), [filteredSessions, study.subjects]);
  const rangeTotalMinutes = subjectTotals.reduce((sum, r) => sum + r.minutes, 0);

  const weekSessions = useMemo(() => sessionsInCalendarRange(study.sessions, "week"), [study.sessions]);
  const weekMinutesBySubject = useMemo(() => {
    const map = {};
    weekSessions.forEach((s) => { if (s.subjectId) map[s.subjectId] = (map[s.subjectId] || 0) + (Number(s.minutes) || 0); });
    return map;
  }, [weekSessions]);

  const todayMinutes = study.sessions.filter((s) => s.date === todayISO()).reduce((sum, s) => sum + (Number(s.minutes) || 0), 0);
  const weekMinutes = weekSessions.reduce((sum, s) => sum + (Number(s.minutes) || 0), 0);

  const clock = formatClock(timerDisplaySeconds(timer));
  const timerPct = timer.mode === "focus" ? Math.min(100, Math.round((timer.seconds / (timer.targetMinutes * 60)) * 100))
    : timer.mode === "break" ? Math.min(100, Math.round((timer.seconds / (timer.breakMinutes * 60)) * 100)) : 0;
  const openTasks = study.tasks.filter((t) => !t.done);

  function closeSessionModal() { setSessionModal(null); }
  function saveSession(v) {
    const subj = study.subjects.find((s) => s.name === v.subjectId);
    const payload = { date: v.date, subjectId: subj ? subj.id : null, minutes: Number(v.minutes) || 0, note: v.note || "" };
    if (sessionModal.mode === "edit") studyActions.updateSession(sessionModal.session.id, payload);
    else studyActions.addSession(payload);
    closeSessionModal();
  }

  return (
    <div className="py-5 space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <StatTile label="Today" value={formatMinutes(todayMinutes)} />
        <StatTile label="This week" value={formatMinutes(weekMinutes)} />
        <StatTile label="Current streak" value={`${study.streak}d`} />
        <StatTile label="Longest streak" value={`${study.longestStreak}d`} />
      </div>

      <div className="surface p-4">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2">
            {timer.running && <span className="pulse-dot busy" style={{ background: timer.mode === "break" ? "var(--good)" : "var(--accent)" }} />}
            <span className="fs-12" style={{ color: "var(--text-faint)" }}>{timer.mode === "break" ? "On a break" : "Timer"}</span>
          </div>
          {timer.mode !== "break" && (
            <SegmentedControl options={[{ value: "stopwatch", label: "Stopwatch" }, { value: "focus", label: "Focus" }]} value={timer.mode} onChange={onTimerModeChange} disabled={timer.running} />
          )}
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="fm fs-38" style={{ color: timer.mode === "break" ? "var(--good)" : "var(--text)" }}>{clock}</div>
          <div className="flex gap-2 flex-1 flex-wrap">
            <button className="btn btn-primary btn-sm" onClick={onStartPause}>
              {timer.running ? <Pause size={13} /> : <Play size={13} />} {timer.running ? "Pause" : "Start"}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={onResetTimer}>
              <RotateCcw size={13} /> {timer.mode === "break" ? "Skip break" : "Log & reset"}
            </button>
          </div>
        </div>

        {timer.mode !== "stopwatch" && (
          <div className="progress-track mt-3"><div className="progress-fill" style={{ width: `${timerPct}%`, background: timer.mode === "break" ? "var(--good)" : "var(--accent)" }} /></div>
        )}

        {timer.mode !== "break" && (
          <div className="flex items-center gap-3 flex-wrap mt-3">
            <select className="field-select" style={{ maxWidth: 190 }} value={timer.subjectId || ""} onChange={(e) => onSelectTimerSubject(e.target.value)} disabled={timer.running}>
              <option value="">No subject</option>
              {study.subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            {timer.mode === "focus" && (
              <>
                <SegmentedControl options={FOCUS_PRESETS.map((p) => ({ value: p, label: `${p}m` }))} value={timer.targetMinutes} onChange={onTimerTargetChange} disabled={timer.running} />
                {openTasks.length > 0 && (
                  <select className="field-select" style={{ maxWidth: 190 }} value={timer.taskId || ""} onChange={(e) => onTimerTaskChange(e.target.value)} disabled={timer.running}>
                    <option value="">No linked task</option>
                    {openTasks.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
                  </select>
                )}
              </>
            )}
          </div>
        )}

        <PostSessionCard
          prompt={postSessionPrompt}
          subjects={study.subjects}
          tasks={study.tasks}
          onRate={(rating) => postSessionPrompt && onRateSession(postSessionPrompt.sessionId, rating)}
          onCompleteTask={() => postSessionPrompt && onCompleteLinkedTask(postSessionPrompt.taskId)}
          onStartBreak={(m) => onStartBreak(m)}
          onDismiss={onDismissPostSession}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="surface p-4">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="fs-12" style={{ color: "var(--text-faint)" }}>Study time</div>
            <SegmentedControl options={TIME_RANGE_OPTIONS} value={range} onChange={setRange} />
          </div>
          {rangeTotalMinutes === 0 ? (
            <div className="fs-12 py-6 text-center" style={{ color: "var(--text-faint)" }}>No study time logged {range === "all" ? "yet" : `this ${range}`}.</div>
          ) : (
            <MiniBarChart data={trendBuckets.map((b) => ({ label: b.label, value: b.minutes / 60 }))} color="var(--accent)" height={110} />
          )}
        </div>
        <div className="surface p-4">
          <div className="fs-12 mb-3" style={{ color: "var(--text-faint)" }}>Time by subject</div>
          <SubjectDonut segments={subjectTotals} totalMinutes={rangeTotalMinutes} />
        </div>
      </div>

      <div className="surface p-4">
        <div className="fs-12 mb-3" style={{ color: "var(--text-faint)" }}>Consistency — last 13 weeks</div>
        <div className="overflow-x-auto"><ConsistencyHeatmap sessions={study.sessions} weeks={13} /></div>
      </div>

      <div>
        <div className="fs-12 mb-2.5" style={{ color: "var(--text-faint)" }}>By subject</div>
        {study.subjects.length === 0 ? (
          <EmptyState icon={GraduationCap} title="No subjects yet" hint="Add one from the Notes tab, then log time against it here." />
        ) : (
          <div className="overflow-x-auto">
            <div style={{ minWidth: 640 }}>
              <SubjectAnalyticsTable rangeRows={subjectTotals} weekMinutesBySubject={weekMinutesBySubject} flashcards={study.flashcards} onAdjustGoal={studyActions.updateSubjectGoal} />
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="fs-12" style={{ color: "var(--text-faint)" }}>Session log</div>
          <button className="btn btn-ghost btn-sm" onClick={() => setSessionModal({ mode: "new" })}><Plus size={13} /> Log session</button>
        </div>
        <SessionLogList sessions={study.sessions} subjects={study.subjects} tasks={study.tasks} onEdit={(s) => setSessionModal({ mode: "edit", session: s })} onDelete={(id) => studyActions.deleteSession(id)} />
      </div>

      {sessionModal && (
        <Modal title={sessionModal.mode === "edit" ? "Edit session" : "Log session"} onClose={closeSessionModal}>
          <RecordForm
            fields={[
              { key: "date", label: "Date", type: "date", required: true },
              { key: "subjectId", label: "Subject", type: "select", options: study.subjects.map((s) => s.name) },
              { key: "minutes", label: "Minutes", type: "number", required: true, placeholder: "45" },
              { key: "note", label: "Note (optional)", type: "text", placeholder: "What did you cover?" },
            ]}
            initial={sessionModal.mode === "edit" ? { date: sessionModal.session.date, subjectId: (study.subjects.find((s) => s.id === sessionModal.session.subjectId) || {}).name || "", minutes: sessionModal.session.minutes, note: sessionModal.session.note || "" } : {}}
            onCancel={closeSessionModal}
            onSave={saveSession}
            saveLabel={sessionModal.mode === "edit" ? "Save changes" : "Log session"}
          />
        </Modal>
      )}
    </div>
  );
}

/* ============================================================================
   NOTES, RESEARCH, PLANNER, FLASHCARDS
============================================================================ */
function NotesTab({ study, onAddNote, onUpdateNote, onDeleteNote, onAddSubject }) {
  const [selectedId, setSelectedId] = useState(study.notes[0] ? study.notes[0].id : null);
  const [subjectFilter, setSubjectFilter] = useState(null);
  const [draft, setDraft] = useState(null);
  const [subjectModal, setSubjectModal] = useState(false);

  const notes = subjectFilter ? study.notes.filter((n) => n.subjectId === subjectFilter) : study.notes;
  const selected = draft || study.notes.find((n) => n.id === selectedId) || null;

  useEffect(() => { setDraft(null); }, [selectedId]);

  function startNewNote() {
    const newDraft = { id: null, subjectId: study.subjects[0] ? study.subjects[0].id : null, title: "", body: "" };
    setDraft(newDraft);
  }
  function saveDraft() {
    if (!draft.title.trim()) return;
    if (draft.id) onUpdateNote(draft.id, { title: draft.title, body: draft.body, subjectId: draft.subjectId });
    else { const id = onAddNote({ title: draft.title, body: draft.body, subjectId: draft.subjectId }); setSelectedId(id); }
    setDraft(null);
  }
  function editField(key, value) { setDraft((prev) => ({ ...(prev || selected), [key]: value })); }

  return (
    <div className="py-5 notes-grid">
      <div>
        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
          <button className="btn btn-primary btn-sm" onClick={startNewNote}><Plus size={13} /> New note</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setSubjectModal(true)}>+ Subject</button>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          <SubjectPill subject={null} active={!subjectFilter} onClick={() => setSubjectFilter(null)} />
          {study.subjects.map((s) => <SubjectPill key={s.id} subject={s} active={subjectFilter === s.id} onClick={() => setSubjectFilter(s.id)} />)}
        </div>
        <div className="surface list-rows">
          {notes.length === 0 && <div className="fs-12 px-3.5 py-4" style={{ color: "var(--text-faint)" }}>No notes yet.</div>}
          {notes.map((n) => {
            const sub = study.subjects.find((s) => s.id === n.subjectId);
            return (
              <button key={n.id} className="row-hover w-full text-left px-3.5 py-2.5" style={{ background: selectedId === n.id && !draft ? "var(--accent-faint)" : "transparent" }} onClick={() => setSelectedId(n.id)}>
                <div className="fs-13 truncate" style={{ color: "var(--text)" }}>{n.title || "Untitled"}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  {sub && <span className="dot" style={{ background: sub.color }} />}
                  <span className="fm fs-11" style={{ color: "var(--text-faint)" }}>{formatRelativeTime(n.updatedAt)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="surface p-4">
        {!selected ? <EmptyState icon={FileText} title="Select or create a note" hint="Notes are organized by subject. Create one to start writing." /> : (
          <>
            <input className="field-input mb-2.5" style={{ fontSize: 15, background: "transparent", border: "none", padding: "2px 0", fontFamily: "var(--font-display)" }}
              placeholder="Note title" value={selected.title} onChange={(e) => editField("title", e.target.value)} />
            <select className="field-select mb-3" style={{ maxWidth: 220 }} value={selected.subjectId || ""} onChange={(e) => editField("subjectId", e.target.value)}>
              <option value="">No subject</option>
              {study.subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <textarea className="field-textarea" rows={12} placeholder="Write here…" value={selected.body} onChange={(e) => editField("body", e.target.value)} />
            <div className="fm fs-11 mt-1.5" style={{ color: "var(--text-faint)" }}>{selected.body.trim() ? selected.body.trim().split(/\s+/).length : 0} words</div>

            <div className="flex gap-2 mt-4 pt-3.5 border-t" style={{ borderColor: "var(--line)" }}>
              {draft ? <button className="btn btn-primary btn-sm" onClick={saveDraft} disabled={!draft.title.trim()}>Save note</button> : <span className="fs-11" style={{ color: "var(--good)" }}>Saved</span>}
              {draft && <button className="btn btn-ghost btn-sm" onClick={() => setDraft(null)}>Cancel</button>}
              {!draft && <button className="btn btn-danger btn-sm ml-auto" onClick={() => { onDeleteNote(selected.id); setSelectedId(null); }}><Trash2 size={12} /> Delete</button>}
            </div>
          </>
        )}
      </div>

      {subjectModal && (
        <Modal title="New subject" onClose={() => setSubjectModal(false)}>
          <RecordForm
            fields={[
              { key: "name", label: "Subject name", type: "text", required: true, placeholder: "e.g. Economics" },
              { key: "color", label: "Color", type: "swatch" },
              { key: "weeklyGoalHours", label: "Weekly goal (hours)", type: "number", placeholder: "3" },
            ]}
            initial={{}} onCancel={() => setSubjectModal(false)} onSave={(v) => { onAddSubject(v); setSubjectModal(false); }}
          />
        </Modal>
      )}
    </div>
  );
}

function ResearchTab({ study, onAddSource, onDeleteSource }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="py-5">
      <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2">
        <button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}><Plus size={13} /> Add source</button>
      </div>

      {study.sources.length === 0 ? <EmptyState icon={Link2} title="No sources yet" hint="Log articles, pages or references as you research, all in one place." /> : (
        <div className="surface list-rows">
          {study.sources.map((s) => {
            const sub = study.subjects.find((x) => x.id === s.subjectId);
            return (
              <div key={s.id} className="flex items-start gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="fs-13" style={{ color: "var(--text)" }}>{s.title}</span>
                    {s.url && <a href={s.url} target="_blank" rel="noreferrer" className="icon-btn" style={{ width: 22, height: 22 }}><ExternalLink size={11} /></a>}
                  </div>
                  {s.note && <p className="fs-12 mt-1 lh-normal" style={{ color: "var(--text-dim)" }}>{s.note}</p>}
                  {sub && <div className="flex items-center gap-1.5 mt-1.5"><span className="dot" style={{ background: sub.color }} /><span className="fm fs-11" style={{ color: "var(--text-faint)" }}>{sub.name}</span></div>}
                </div>
                <button className="icon-btn danger" onClick={() => onDeleteSource(s.id)} aria-label="Delete source"><Trash2 size={13} /></button>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <Modal title="Add source" onClose={() => setModalOpen(false)}>
          <RecordForm
            fields={[
              { key: "title", label: "Title", type: "text", required: true, placeholder: "Source title" },
              { key: "url", label: "URL", type: "text", placeholder: "https://…" },
              { key: "subjectId", label: "Subject", type: "select", options: study.subjects.map((s) => s.name) },
              { key: "note", label: "Key takeaway", type: "textarea", placeholder: "What's useful about this?" },
            ]}
            initial={{}} onCancel={() => setModalOpen(false)}
            onSave={(v) => { const subj = study.subjects.find((s) => s.name === v.subjectId); onAddSource({ ...v, subjectId: subj ? subj.id : null }); setModalOpen(false); }}
          />
        </Modal>
      )}
    </div>
  );
}

function PlannerTab({ study, onAddTask, onToggleTask, onDeleteTask }) {
  const [modalOpen, setModalOpen] = useState(false);
  const groups = useMemo(() => {
    const overdue = [], today = [], upcoming = [], noDate = [];
    study.tasks.forEach((t) => {
      if (t.done) return;
      if (!t.dueDate) { noDate.push(t); return; }
      const d = daysUntil(t.dueDate);
      if (d < 0) overdue.push(t); else if (d === 0) today.push(t); else upcoming.push(t);
    });
    const done = study.tasks.filter((t) => t.done);
    return { overdue, today, upcoming: upcoming.sort((a, b) => daysUntil(a.dueDate) - daysUntil(b.dueDate)), noDate, done };
  }, [study.tasks]);

  function Row({ t }) {
    const sub = study.subjects.find((s) => s.id === t.subjectId);
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 row-hover">
        <button onClick={() => onToggleTask(t.id)} aria-label="Toggle done">
          {t.done ? <CheckCircle2 size={16} style={{ color: "var(--good)" }} /> : <Circle size={16} style={{ color: "var(--text-faint)" }} />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="fs-13" style={{ color: t.done ? "var(--text-faint)" : "var(--text)", textDecoration: t.done ? "line-through" : "none" }}>{t.title}</div>
          {sub && <div className="flex items-center gap-1.5 mt-1"><span className="dot" style={{ background: sub.color }} /><span className="fm fs-11" style={{ color: "var(--text-faint)" }}>{sub.name}</span></div>}
        </div>
        {t.dueDate && <Badge tone={daysUntil(t.dueDate) < 0 && !t.done ? "bad" : undefined}>{formatDueLabel(t.dueDate)}</Badge>}
        <button className="icon-btn danger" onClick={() => onDeleteTask(t.id)} aria-label="Delete task"><Trash2 size={13} /></button>
      </div>
    );
  }
  function Section({ label, items }) {
    if (items.length === 0) return null;
    return (
      <div className="mb-5">
        <div className="fs-12 mb-2" style={{ color: "var(--text-faint)" }}>{label}</div>
        <div className="surface list-rows">{items.map((t) => <Row key={t.id} t={t} />)}</div>
      </div>
    );
  }

  return (
    <div className="py-5">
      <button className="btn btn-primary btn-sm mb-4" onClick={() => setModalOpen(true)}><Plus size={13} /> New task</button>
      {study.tasks.length === 0 ? <EmptyState icon={ListChecks} title="No tasks yet" hint="Add deadlines and to-dos — overdue items always surface first." /> : (
        <>
          <Section label="Overdue" items={groups.overdue} />
          <Section label="Today" items={groups.today} />
          <Section label="Upcoming" items={groups.upcoming} />
          <Section label="No date" items={groups.noDate} />
          <Section label="Done" items={groups.done} />
        </>
      )}
      {modalOpen && (
        <Modal title="New task" onClose={() => setModalOpen(false)}>
          <RecordForm
            fields={[
              { key: "title", label: "Task", type: "text", required: true, placeholder: "Economics problem set 6" },
              { key: "subjectId", label: "Subject", type: "select", options: study.subjects.map((s) => s.name) },
              { key: "dueDate", label: "Due date", type: "date" },
            ]}
            initial={{}} onCancel={() => setModalOpen(false)}
            onSave={(v) => { const subj = study.subjects.find((s) => s.name === v.subjectId); onAddTask({ ...v, subjectId: subj ? subj.id : null, done: false }); setModalOpen(false); }}
          />
        </Modal>
      )}
    </div>
  );
}

function Flashcard({ card, onMark }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div>
      <div className={`flip-card ${flipped ? "flipped" : ""}`} style={{ height: 130 }} onClick={() => setFlipped(!flipped)}>
        <div className="flip-inner">
          <div className="flip-face surface" style={{ borderColor: "var(--line)" }}><span className="fs-13" style={{ color: "var(--text)" }}>{card.front}</span></div>
          <div className="flip-face flip-back surface-inset" style={{ borderColor: "var(--accent-dim)" }}><span className="fs-13" style={{ color: "var(--text)" }}>{card.back}</span></div>
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <button className="btn btn-ghost btn-sm flex-1" onClick={() => onMark(card.id, "missed")}>Missed</button>
        <button className="btn btn-primary btn-sm flex-1" onClick={() => onMark(card.id, "correct")}>Got it</button>
      </div>
    </div>
  );
}

function FlashcardsTab({ study, onAddCard, onMarkCard }) {
  const [subjectFilter, setSubjectFilter] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const cards = subjectFilter ? study.flashcards.filter((c) => c.subjectId === subjectFilter) : study.flashcards;
  const totalReviews = study.flashcards.reduce((s, c) => s + c.correct + c.missed, 0);
  const totalCorrect = study.flashcards.reduce((s, c) => s + c.correct, 0);

  return (
    <div className="py-5">
      <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2">
        <div className="flex flex-wrap gap-1.5">
          <SubjectPill subject={null} active={!subjectFilter} onClick={() => setSubjectFilter(null)} />
          {study.subjects.map((s) => <SubjectPill key={s.id} subject={s} active={subjectFilter === s.id} onClick={() => setSubjectFilter(s.id)} />)}
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}><Plus size={13} /> Add card</button>
      </div>
      {totalReviews > 0 && <div className="fs-12 mb-3" style={{ color: "var(--text-faint)" }}>{totalCorrect} of {totalReviews} reviews correct ({Math.round((totalCorrect / totalReviews) * 100)}%)</div>}
      {cards.length === 0 ? <EmptyState icon={Layers} title="No flashcards yet" hint="Add cards manually to start building a deck." /> : (
        <div className="grid sm:grid-cols-3 gap-3">{cards.map((c) => <Flashcard key={c.id} card={c} onMark={onMarkCard} />)}</div>
      )}
      {modalOpen && (
        <Modal title="Add flashcard" onClose={() => setModalOpen(false)}>
          <RecordForm
            fields={[
              { key: "front", label: "Front", type: "textarea", required: true, placeholder: "Question or prompt" },
              { key: "back", label: "Back", type: "textarea", required: true, placeholder: "Answer" },
              { key: "subjectId", label: "Subject", type: "select", options: study.subjects.map((s) => s.name) },
            ]}
            initial={{}} onCancel={() => setModalOpen(false)}
            onSave={(v) => { const subj = study.subjects.find((s) => s.name === v.subjectId); onAddCard({ ...v, subjectId: subj ? subj.id : null, correct: 0, missed: 0 }); setModalOpen(false); }}
          />
        </Modal>
      )}
    </div>
  );
}

/* ============================================================================
   HEADER
============================================================================ */
function Header({ onReset }) {
  return (
    <header className="flex items-center justify-between px-5 sm:px-8 h-14 border-b flex-shrink-0" style={{ borderColor: "var(--line)" }}>
      <span className="fd fs-18" style={{ color: "var(--text)", fontStyle: "italic", fontWeight: 500 }}>Study Tracker</span>
      <button className="btn btn-ghost btn-sm" onClick={onReset}>Reset data</button>
    </header>
  );
}

/* ============================================================================
   MAIN APP
============================================================================ */
export default function App() {
  const [study, setStudy] = useState(createEmptyStudyState);
  const [studyTab, setStudyTab] = useState("overview");
  const [timer, setTimer] = useState({ running: false, seconds: 0, subjectId: null, mode: "stopwatch", targetMinutes: 25, breakMinutes: 5, taskId: null });
  const [postSessionPrompt, setPostSessionPrompt] = useState(null);

  const [storageAvailable, setStorageAvailable] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (text) => { setToast(text); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(null), 2600); };

  useEffect(() => {
    const available = storageProbe();
    setStorageAvailable(available);
    if (available) {
      const saved = storageLoad();
      if (saved && Array.isArray(saved.subjects)) setStudy(saved);
    }
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated && storageAvailable) storageSave(study); }, [hydrated, storageAvailable, study]);

  useEffect(() => {
    if (!timer.running) return;
    const iv = setInterval(() => setTimer((t) => ({ ...t, seconds: t.seconds + 1 })), 1000);
    return () => clearInterval(iv);
  }, [timer.running]);

  useEffect(() => {
    if (!timer.running) return;
    if (timer.mode === "focus" && timer.seconds >= timer.targetMinutes * 60) {
      const minutes = timer.targetMinutes;
      const newId = uid();
      setStudy((prev) => ({ ...prev, sessions: [{ id: newId, date: todayISO(), subjectId: timer.subjectId, minutes, note: "", rating: null, taskId: timer.taskId || null }, ...prev.sessions] }));
      showToast(`Focus session complete — logged ${minutes} min`);
      playChime();
      setPostSessionPrompt({ sessionId: newId, subjectId: timer.subjectId, taskId: timer.taskId, mode: "focus" });
      setTimer((t) => ({ ...t, running: false, seconds: 0 }));
    } else if (timer.mode === "break" && timer.seconds >= timer.breakMinutes * 60) {
      playChime();
      showToast("Break's over — ready for another round?");
      setTimer((t) => ({ ...t, running: false, seconds: 0, mode: "focus" }));
    }
  }, [timer.seconds, timer.mode, timer.running, timer.targetMinutes, timer.breakMinutes, timer.subjectId, timer.taskId]);

  const studyStreak = useMemo(() => {
    let streak = 0;
    for (let i = 0; i < 60; i++) {
      const iso = addDaysISO(-i);
      const has = study.sessions.some((s) => s.date === iso);
      if (has) streak++; else if (i === 0) continue; else break;
    }
    return streak;
  }, [study.sessions]);

  const longestStreak = useMemo(() => {
    const uniqueDates = Array.from(new Set(study.sessions.map((s) => s.date))).sort();
    let longest = 0, current = 0, prevTime = null;
    for (const d of uniqueDates) {
      const t = new Date(d + "T00:00:00").getTime();
      current = prevTime !== null && t - prevTime === 86400000 ? current + 1 : 1;
      longest = Math.max(longest, current);
      prevTime = t;
    }
    return longest;
  }, [study.sessions]);

  function onTimerStartPause() {
    if (!timer.running) setPostSessionPrompt(null);
    setTimer((t) => ({ ...t, running: !t.running }));
  }
  function onTimerReset() {
    if (timer.mode === "break") {
      setTimer((t) => ({ ...t, running: false, seconds: 0, mode: "focus" }));
      return;
    }
    if (timer.seconds >= 60) {
      const minutes = Math.round(timer.seconds / 60);
      const newId = uid();
      setStudy((prev) => ({ ...prev, sessions: [{ id: newId, date: todayISO(), subjectId: timer.subjectId, minutes, note: "", rating: null, taskId: timer.taskId || null }, ...prev.sessions] }));
      showToast(`Logged ${minutes} min`);
      setPostSessionPrompt({ sessionId: newId, subjectId: timer.subjectId, taskId: timer.taskId, mode: timer.mode });
    }
    setTimer((t) => ({ ...t, running: false, seconds: 0 }));
  }
  function onTimerSubject(id) { setTimer((t) => ({ ...t, subjectId: id || null })); }
  function onTimerModeChange(mode) { setTimer((t) => ({ ...t, mode, seconds: 0, running: false })); }
  function onTimerTargetChange(minutes) { setTimer((t) => ({ ...t, targetMinutes: minutes, seconds: 0, running: false })); }
  function onTimerTaskChange(taskId) { setTimer((t) => ({ ...t, taskId: taskId || null })); }
  function onStartBreak(minutes) {
    setTimer((t) => ({ ...t, mode: "break", breakMinutes: minutes, seconds: 0, running: true }));
    setPostSessionPrompt(null);
  }
  function onDismissPostSession() { setPostSessionPrompt(null); }
  function onRateSession(sessionId, rating) {
    setStudy((prev) => ({ ...prev, sessions: prev.sessions.map((s) => (s.id === sessionId ? { ...s, rating } : s)) }));
    setPostSessionPrompt(null);
  }
  function onCompleteLinkedTask(taskId) {
    if (!taskId) return;
    setStudy((prev) => ({ ...prev, tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, done: true } : t)) }));
    setPostSessionPrompt(null);
    showToast("Task marked done");
  }

  const studyActions = {
    addSubject: (v) => setStudy((prev) => ({ ...prev, subjects: [...prev.subjects, { id: uid(), name: v.name, color: v.color || STUDY_SWATCHES[0], weeklyGoalMinutes: v.weeklyGoalHours ? Math.round(Number(v.weeklyGoalHours) * 60) : 180 }] })),
    addNote: (v) => { const id = uid(); setStudy((prev) => ({ ...prev, notes: [{ id, title: v.title, body: v.body || "", subjectId: v.subjectId, updatedAt: Date.now() }, ...prev.notes] })); return id; },
    updateNote: (id, v) => setStudy((prev) => ({ ...prev, notes: prev.notes.map((n) => (n.id === id ? { ...n, ...v, updatedAt: Date.now() } : n)) })),
    deleteNote: (id) => setStudy((prev) => ({ ...prev, notes: prev.notes.filter((n) => n.id !== id) })),
    addSource: (v) => setStudy((prev) => ({ ...prev, sources: [{ id: uid(), ...v, updatedAt: Date.now() }, ...prev.sources] })),
    deleteSource: (id) => setStudy((prev) => ({ ...prev, sources: prev.sources.filter((s) => s.id !== id) })),
    addTask: (v) => setStudy((prev) => ({ ...prev, tasks: [{ id: uid(), ...v }, ...prev.tasks] })),
    toggleTask: (id) => setStudy((prev) => ({ ...prev, tasks: prev.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) })),
    deleteTask: (id) => setStudy((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== id) })),
    addCard: (v) => setStudy((prev) => ({ ...prev, flashcards: [{ id: uid(), ...v }, ...prev.flashcards] })),
    markCard: (id, kind) => setStudy((prev) => ({ ...prev, flashcards: prev.flashcards.map((c) => (c.id === id ? { ...c, [kind]: (c[kind] || 0) + 1 } : c)) })),
    addSession: (v) => setStudy((prev) => ({ ...prev, sessions: [{ id: uid(), date: v.date, subjectId: v.subjectId || null, minutes: Number(v.minutes) || 0, note: v.note || "", rating: null, taskId: null }, ...prev.sessions] })),
    updateSession: (id, v) => setStudy((prev) => ({ ...prev, sessions: prev.sessions.map((s) => (s.id === id ? { ...s, date: v.date, subjectId: v.subjectId || null, minutes: Number(v.minutes) || 0, note: v.note || "" } : s)) })),
    deleteSession: (id) => setStudy((prev) => ({ ...prev, sessions: prev.sessions.filter((s) => s.id !== id) })),
    updateSubjectGoal: (id, deltaMinutes) => setStudy((prev) => ({ ...prev, subjects: prev.subjects.map((s) => (s.id === id ? { ...s, weeklyGoalMinutes: Math.max(0, (s.weeklyGoalMinutes || 0) + deltaMinutes) } : s)) })),
  };

  function onResetAll() {
    if (typeof window !== "undefined" && window.confirm) {
      const ok = window.confirm("Reset all study data? This clears subjects, notes, sources, tasks, flashcards and sessions on this device.");
      if (!ok) return;
    }
    setStudy(createEmptyStudyState());
    setTimer({ running: false, seconds: 0, subjectId: null, mode: "stopwatch", targetMinutes: 25, breakMinutes: 5, taskId: null });
    setPostSessionPrompt(null);
    storageWipe();
    showToast("All data reset");
  }

  return (
    <div className="app-root h-screen w-full flex flex-col overflow-hidden">
      <style>{STYLES}</style>
      <Header onReset={onResetAll} />
      <main className="flex-1 overflow-y-auto scroll-area">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-6 pb-10">
          <h1 className="fd fs-24" style={{ color: "var(--text)", fontWeight: 500 }}>Study</h1>
          <p className="fs-13 mt-1" style={{ color: "var(--text-dim)" }}>Subjects, writing, research and deadlines in one place.</p>
          <div className="mt-5"><Tabs tabs={STUDY_TABS} active={studyTab} onChange={setStudyTab} /></div>

          {studyTab === "overview" && (
            <StudyOverview
              study={{ ...study, streak: studyStreak, longestStreak }}
              timer={timer}
              onStartPause={onTimerStartPause}
              onResetTimer={onTimerReset}
              onSelectTimerSubject={onTimerSubject}
              onTimerModeChange={onTimerModeChange}
              onTimerTargetChange={onTimerTargetChange}
              onTimerTaskChange={onTimerTaskChange}
              onStartBreak={onStartBreak}
              postSessionPrompt={postSessionPrompt}
              onDismissPostSession={onDismissPostSession}
              onRateSession={onRateSession}
              onCompleteLinkedTask={onCompleteLinkedTask}
              studyActions={studyActions}
            />
          )}
          {studyTab === "notes" && (
            <NotesTab study={study} onAddNote={studyActions.addNote} onUpdateNote={studyActions.updateNote} onDeleteNote={studyActions.deleteNote} onAddSubject={studyActions.addSubject} />
          )}
          {studyTab === "research" && (
            <ResearchTab study={study} onAddSource={studyActions.addSource} onDeleteSource={studyActions.deleteSource} />
          )}
          {studyTab === "planner" && (
            <PlannerTab study={study} onAddTask={studyActions.addTask} onToggleTask={studyActions.toggleTask} onDeleteTask={studyActions.deleteTask} />
          )}
          {studyTab === "flashcards" && (
            <FlashcardsTab study={study} onAddCard={studyActions.addCard} onMarkCard={studyActions.markCard} />
          )}
        </div>
      </main>
      {toast && <div className="toast"><AlertCircle size={13} style={{ color: "var(--accent)" }} />{toast}</div>}
    </div>
  );
}
