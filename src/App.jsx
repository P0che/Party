/**
 * MURDER PARTY - Application complète
 * 
 * SETUP:
 * 1. Créer un projet sur supabase.com
 * 2. Exécuter le fichier murder-party-supabase-schema.sql dans l'éditeur SQL
 * 3. Remplacer SUPABASE_URL et SUPABASE_ANON_KEY ci-dessous
 * 4. npm install @supabase/supabase-js
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ============================================================
// CONFIGURATION - À MODIFIER
// ============================================================
const SUPABASE_URL = "https://uqgjiwmsmptchedrrxcq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxZ2ppd21zbXB0Y2hlZHJyeGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMjU4ODYsImV4cCI6MjA5NzkwMTg4Nn0.B5Wef4IvN5Vzkl2UnZtIso-Z_slZpVXph85NnJV5vPA";


const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// STYLES GLOBAUX (injectés dans <head>)
// ============================================================
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cinzel+Decorative:wght@400;700&family=Inter:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-void: #06060A;
    --bg-deep: #0D0D14;
    --bg-surface: #14141E;
    --bg-card: #1A1A28;
    --bg-hover: #20202E;
    --border: #2A2A3E;
    --border-glow: #8B1A1A;
    --gold: #C9A84C;
    --gold-dim: #8A6F2E;
    --gold-bright: #F0C857;
    --blood: #8B1A1A;
    --blood-bright: #C42B2B;
    --blood-dim: #5C1010;
    --cream: #E8E0D0;
    --cream-dim: #A09080;
    --muted: #606070;
    --success: #2D6A4F;
    --success-bright: #52B788;
    --danger: #6B1515;
    --danger-bright: #E63946;
    --pending: #7B5C00;
    --pending-bright: #F4A261;
    --r: 8px;
    --r-lg: 12px;
    --shadow: 0 4px 24px rgba(0,0,0,0.6);
    --shadow-gold: 0 0 20px rgba(201,168,76,0.15);
    --shadow-blood: 0 0 20px rgba(139,26,26,0.3);
  }

  html, body, #root { min-height: 100%; height: auto; }

  html { background: #06060A; }

  body {
    background: #06060A;
    color: var(--cream);
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    min-height: 100vh;
    min-height: -webkit-fill-available;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg-deep); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .cinzel { font-family: 'Cinzel', serif; }
  .cinzel-deco { font-family: 'Cinzel Decorative', serif; }

  /* Animations */
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse-gold { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
  @keyframes reveal-word { 0% { opacity: 0; background: var(--gold); color: var(--bg-void); padding: 0 4px; border-radius: 3px; } 50% { opacity: 1; background: var(--gold); color: var(--bg-void); padding: 0 4px; border-radius: 3px; } 100% { opacity: 1; background: transparent; color: var(--gold); padding: 0; } }
  @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
  @keyframes flicker { 0%, 100% { opacity: 1; } 92% { opacity: 1; } 93% { opacity: 0.8; } 94% { opacity: 1; } 97% { opacity: 0.9; } }

  .fade-in { animation: fadeIn 0.3s ease forwards; }
  .pulse-gold { animation: pulse-gold 2s ease infinite; }

  /* Layout */
  .app { min-height: 100vh; display: flex; flex-direction: column; }
  
  .page { flex: 1; padding: 20px; max-width: 900px; margin: 0 auto; width: 100%; padding-bottom: 80px; }
  
  /* Boutons */
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 10px 18px; border-radius: var(--r); border: none;
    font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500;
    cursor: pointer; transition: all 0.2s; text-decoration: none;
    white-space: nowrap;
  }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-primary { background: var(--blood); color: var(--cream); }
  .btn-primary:hover:not(:disabled) { background: var(--blood-bright); box-shadow: var(--shadow-blood); }
  .btn-gold { background: var(--gold); color: var(--bg-void); font-weight: 600; }
  .btn-gold:hover:not(:disabled) { background: var(--gold-bright); }
  .btn-ghost { background: transparent; color: var(--cream-dim); border: 1px solid var(--border); }
  .btn-ghost:hover:not(:disabled) { background: var(--bg-hover); color: var(--cream); border-color: var(--muted); }
  .btn-danger { background: var(--danger); color: #fff; }
  .btn-danger:hover:not(:disabled) { background: var(--danger-bright); }
  .btn-success { background: var(--success); color: #fff; }
  .btn-success:hover:not(:disabled) { background: var(--success-bright); color: var(--bg-void); }
  .btn-sm { padding: 6px 12px; font-size: 13px; }
  .btn-lg { padding: 14px 28px; font-size: 16px; }
  .btn-icon { padding: 8px; border-radius: var(--r); }

  /* Inputs */
  .input {
    width: 100%; padding: 10px 14px;
    background: var(--bg-deep); border: 1px solid var(--border);
    border-radius: var(--r); color: var(--cream);
    font-family: 'Inter', sans-serif; font-size: 14px;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
  }
  .input:focus { border-color: var(--gold-dim); box-shadow: 0 0 0 3px rgba(201,168,76,0.1); }
  .input::placeholder { color: var(--muted); }
  .input-lg { padding: 14px 18px; font-size: 18px; text-align: center; letter-spacing: 4px; }
  textarea.input { resize: vertical; min-height: 80px; }
  select.input { cursor: pointer; }

  /* Cards */
  .card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 20px;
    position: relative; overflow: hidden;
  }
  .card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--blood-dim), transparent);
  }
  .card-glow { border-color: var(--blood-dim); box-shadow: var(--shadow-blood); }
  .card-gold { border-color: var(--gold-dim); box-shadow: var(--shadow-gold); }
  .card-gold::before { background: linear-gradient(90deg, transparent, var(--gold-dim), transparent); }

  /* Labels */
  .label { font-size: 12px; color: var(--cream-dim); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; display: block; font-weight: 500; }

  /* Badges */
  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 8px; border-radius: 20px;
    font-size: 12px; font-weight: 600; white-space: nowrap;
  }
  .badge-gold { background: rgba(201,168,76,0.15); color: var(--gold); border: 1px solid var(--gold-dim); }
  .badge-blood { background: rgba(139,26,26,0.2); color: #FF6B6B; border: 1px solid var(--blood); }
  .badge-success { background: rgba(45,106,79,0.2); color: var(--success-bright); border: 1px solid var(--success); }
  .badge-muted { background: rgba(96,96,112,0.2); color: var(--cream-dim); border: 1px solid var(--border); }
  .badge-pending { background: rgba(123,92,0,0.2); color: var(--pending-bright); border: 1px solid var(--pending); }

  /* Nav */
  .bottom-nav {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: var(--bg-surface); border-top: 1px solid var(--border);
    display: flex; padding: 8px 0 env(safe-area-inset-bottom, 8px);
    z-index: 100;
  }
  .nav-item {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    gap: 3px; padding: 6px; cursor: pointer; border: none; background: none;
    color: var(--muted); font-size: 10px; font-family: 'Inter', sans-serif;
    transition: color 0.2s; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .nav-item.active { color: var(--gold); }
  .nav-item svg { width: 22px; height: 22px; }

  /* Header admin */
  .admin-header {
    background: var(--bg-surface); border-bottom: 1px solid var(--border);
    padding: 12px 20px; display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }
  .admin-tabs {
    display: flex; gap: 4px; background: var(--bg-deep);
    padding: 4px; border-radius: var(--r); flex-wrap: wrap;
  }
  .admin-tab {
    padding: 8px 14px; border-radius: 6px; border: none;
    background: transparent; color: var(--cream-dim);
    font-size: 13px; font-family: 'Inter', sans-serif; cursor: pointer;
    transition: all 0.2s; white-space: nowrap;
  }
  .admin-tab.active { background: var(--blood); color: var(--cream); }

  /* Avatar */
  .avatar {
    border-radius: 50%; object-fit: cover; border: 2px solid var(--border);
    background: var(--bg-deep); flex-shrink: 0;
  }
  .avatar-placeholder {
    border-radius: 50%; background: var(--bg-deep); border: 2px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--muted); font-family: 'Cinzel', serif; font-weight: 700;
    flex-shrink: 0;
  }

  /* Leaderboard */
  .rank-1 { color: var(--gold); }
  .rank-2 { color: #C0C0C0; }
  .rank-3 { color: #CD7F32; }

  /* Investigation */
  .hidden-input {
    display: inline-flex; align-items: center;
    background: var(--bg-deep); border: 1px solid var(--blood);
    border-radius: 4px; padding: 2px 6px;
    font-family: 'Inter', sans-serif; font-size: inherit;
    color: var(--cream); outline: none; width: 100px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .hidden-input:focus { border-color: var(--gold); box-shadow: 0 0 0 2px rgba(201,168,76,0.15); }
  .hidden-input.error { animation: shake 0.3s ease; border-color: var(--danger-bright); }
  .revealed-word { color: var(--gold); font-weight: 600; animation: reveal-word 1s ease forwards; }

  /* Modal */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.8);
    display: flex; align-items: flex-start; justify-content: center;
    z-index: 200; padding: 16px; overflow-y: auto;
  }
  .modal {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 24px; max-width: 500px;
    width: 100%; margin: auto;
    box-shadow: var(--shadow);
    animation: fadeIn 0.2s ease;
  }

  /* Divider */
  .divider { border: none; border-top: 1px solid var(--border); margin: 16px 0; }

  /* Alert */
  .alert { padding: 12px 16px; border-radius: var(--r); font-size: 14px; }
  .alert-error { background: rgba(139,26,26,0.15); border: 1px solid var(--blood); color: #FF6B6B; }
  .alert-success { background: rgba(45,106,79,0.15); border: 1px solid var(--success); color: var(--success-bright); }
  .alert-info { background: rgba(201,168,76,0.1); border: 1px solid var(--gold-dim); color: var(--gold); }

  /* Torch flicker on title */
  .title-flicker { animation: flicker 8s ease infinite; }

  /* Grid */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  @media (max-width: 500px) { .grid-2 { grid-template-columns: 1fr; } }

  /* Form group */
  .form-group { margin-bottom: 14px; }
  .form-row { display: flex; gap: 12px; }
  @media (max-width: 500px) { .form-row { flex-direction: column; } }

  /* Points badge large */
  .points-large {
    font-family: 'Cinzel', serif; font-size: 32px; font-weight: 700;
    color: var(--gold); text-shadow: 0 0 20px rgba(201,168,76,0.4);
  }

  /* Separator ornement */
  .ornament {
    text-align: center; color: var(--muted); font-size: 18px;
    margin: 20px 0; letter-spacing: 8px;
  }

  /* Profile hero */
  .profile-hero {
    background: linear-gradient(135deg, var(--bg-card), var(--bg-deep));
    border: 1px solid var(--border); border-radius: var(--r-lg);
    padding: 28px 20px; text-align: center; margin-bottom: 20px;
    position: relative; overflow: hidden;
  }
  .profile-hero::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold-dim), transparent);
  }

  /* Quest card */
  .quest-card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: var(--r); padding: 16px; margin-bottom: 10px;
    display: flex; align-items: flex-start; gap: 12px;
    transition: border-color 0.2s;
  }
  .quest-card:hover { border-color: var(--muted); }

  /* Scrollable section */
  .scroll-section { overflow-y: auto; max-height: 400px; }

  /* Loading */
  .loading {
    display: flex; align-items: center; justify-content: center;
    min-height: 200px; color: var(--muted);
    font-family: 'Cinzel', serif; letter-spacing: 2px;
    font-size: 14px;
  }

  /* Player card in investigation */
  .investigate-card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: var(--r-lg); margin-bottom: 16px;
    overflow: hidden; transition: border-color 0.2s;
  }
  .investigate-card:hover { border-color: var(--blood-dim); }
  .investigate-header {
    padding: 16px 20px; display: flex; align-items: center; gap: 14px;
    cursor: pointer; background: var(--bg-surface);
  }
  .investigate-body { padding: 16px 20px; border-top: 1px solid var(--border); }

  /* Toggle */
  .toggle { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; }
  .toggle input { opacity: 0; width: 0; height: 0; }
  .toggle-slider {
    position: absolute; inset: 0; background: var(--border);
    border-radius: 12px; cursor: pointer; transition: 0.3s;
  }
  .toggle-slider::before {
    content: ''; position: absolute; width: 18px; height: 18px;
    left: 3px; top: 3px; background: var(--cream-dim);
    border-radius: 50%; transition: 0.3s;
  }
  .toggle input:checked + .toggle-slider { background: var(--blood); }
  .toggle input:checked + .toggle-slider::before { transform: translateX(20px); background: var(--cream); }

  /* Admin page */
  .admin-page { min-height: 100vh; }
  .admin-content { max-width: 1100px; margin: 0 auto; padding: 20px; }

  /* Table */
  .table-wrapper { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th { text-align: left; padding: 10px 14px; color: var(--cream-dim); font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid var(--border); font-weight: 500; }
  td { padding: 12px 14px; border-bottom: 1px solid rgba(42,42,62,0.5); vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--bg-hover); }

  /* Empty state */
  .empty-state { text-align: center; padding: 40px 20px; color: var(--muted); }
  .empty-state .icon { font-size: 40px; margin-bottom: 12px; }
  .empty-state p { font-size: 14px; }

  /* Notification toast */
  .toast {
    position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: var(--r); padding: 10px 20px;
    font-size: 14px; z-index: 300; white-space: nowrap;
    animation: fadeIn 0.3s ease;
    box-shadow: var(--shadow);
  }
  .toast-success { border-color: var(--success); color: var(--success-bright); background: rgba(45,106,79,0.2); }
  .toast-error { border-color: var(--blood); color: #FF6B6B; background: rgba(139,26,26,0.2); }
  .toast-gold { border-color: var(--gold-dim); color: var(--gold); background: rgba(201,168,76,0.1); }

  /* Force background noir partout sur mobile */
  .admin-page { background: var(--bg-void); min-height: 100vh; }
  .app { background: var(--bg-void); min-height: 100vh; }
  .admin-content { background: var(--bg-void); }
`;

// ============================================================
// INJECT STYLES
// ============================================================
function StyleInjector() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
}

// ============================================================
// ICONS
// ============================================================
const Icons = {
  User: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Scroll: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Trophy: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="8 21 12 21 16 21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M7 4H4a2 2 0 0 0-2 2v1c0 3.3 2.7 6 6 6h.3a6 6 0 0 0 5.4-3.4"/><path d="M17 4h3a2 2 0 0 1 2 2v1c0 3.3-2.7 6-6 6h-.3a6 6 0 0 1-4-1.5"/><path d="M7 4h10v4a5 5 0 0 1-10 0V4z"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Edit: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  ChevronDown: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>,
  ChevronUp: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>,
  Skull: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C6.5 2 2 6.5 2 12c0 3.8 2 7 5 8.9V22h10v-1.1c3-1.9 5-5.1 5-8.9 0-5.5-4.5-10-10-10z"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><path d="M9 18h6"/></svg>,
  Eye: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Sword: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="19" y1="21" x2="21" y2="19"/></svg>,
  Lock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Unlock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>,
  FileText: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Key: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function parseHiddenWords(text) {
  // Retourne [{type:'text'|'hidden', value, index}]
  const parts = [];
  const regex = /%([^%]+)%/g;
  let lastIndex = 0;
  let match;
  let hiddenIndex = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: "hidden", value: match[1], index: hiddenIndex++ });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) });
  }
  return parts;
}

function hasHiddenWords(text) {
  return /%[^%]+%/.test(text);
}

function stripHiddenMarkers(text) {
  return text.replace(/%([^%]+)%/g, "$1");
}

function Avatar({ url, name, size = 40 }) {
  const [err, setErr] = useState(false);
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  if (!url || err) {
    return (
      <div className="avatar-placeholder" style={{ width: size, height: size, fontSize: size * 0.4 }}>
        {initial}
      </div>
    );
  }
  return <img className="avatar" src={url} alt={name} style={{ width: size, height: size }} onError={() => setErr(true)} />;
}

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return <div className={`toast toast-${type}`}>{message}</div>;
}

function useToast() {
  const [toast, setToast] = useState(null);
  const show = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  }, []);
  const dismiss = useCallback(() => setToast(null), []);
  const ToastEl = toast ? <Toast key={toast.id} message={toast.message} type={toast.type} onClose={dismiss} /> : null;
  return { show, ToastEl };
}

// ============================================================
// MODAL
// ============================================================
function Modal({ title, onClose, children }) {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 className="cinzel" style={{ fontSize: 18, color: "var(--gold)" }}>{title}</h3>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><Icons.X /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ============================================================
// INVESTIGATION TEXT RENDERER
// ============================================================
function InvestigateText({ text, fieldType, targetPlayerId, investigatorId, discoveries, onDiscover }) {
  const parts = parseHiddenWords(text);
  const [inputValues, setInputValues] = useState({});
  const [errors, setErrors] = useState({});
  const [shaking, setShaking] = useState({});

  const isDiscovered = (wordIndex) =>
    discoveries.some(d => d.target_player_id === targetPlayerId && d.field_type === fieldType && d.word_index === wordIndex);

  const handleSubmit = async (wordIndex, correctWord) => {
    const val = (inputValues[wordIndex] || "").trim().toLowerCase();
    if (!val) return;
    if (val === correctWord.trim().toLowerCase()) {
      await onDiscover(targetPlayerId, fieldType, wordIndex, correctWord);
    } else {
      setErrors(e => ({ ...e, [wordIndex]: true }));
      setShaking(s => ({ ...s, [wordIndex]: true }));
      setTimeout(() => {
        setErrors(e => ({ ...e, [wordIndex]: false }));
        setShaking(s => ({ ...s, [wordIndex]: false }));
      }, 500);
    }
  };

  const allHiddenDiscovered = parts.filter(p => p.type === "hidden").every(p => isDiscovered(p.index));

  return (
    <span>
      {parts.map((part, i) => {
        if (part.type === "text") return <span key={i}>{part.value}</span>;
        const discovered = isDiscovered(part.index);
        if (discovered) {
          return <span key={i} className="revealed-word">{part.value}</span>;
        }
        const letters = part.value.length;
        const placeholder = Array.from({ length: letters }, () => "_").join(" ");
        const inputWidth = Math.max(60, letters * 12 + 16);
        return (
          <input
            key={i}
            className={`hidden-input ${shaking[part.index] ? "error" : ""}`}
            placeholder={placeholder}
            value={inputValues[part.index] || ""}
            onChange={e => setInputValues(v => ({ ...v, [part.index]: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && handleSubmit(part.index, part.value)}
            onBlur={() => handleSubmit(part.index, part.value)}
            style={{ borderColor: errors[part.index] ? "var(--danger-bright)" : undefined, width: inputWidth }}
          />
        );
      })}
      {allHiddenDiscovered && parts.some(p => p.type === "hidden") && <span> ✅</span>}
    </span>
  );
}

// ============================================================
// PLAYER FORM (Admin)
// ============================================================
function PlayerForm({ player, onSave, onClose }) {
  const [form, setForm] = useState({
    nom: player?.nom || "",
    code_4_chiffres: player?.code_4_chiffres || "",
    points: player?.points ?? 0,
    photo: player?.photo || "",
    titre: player?.titre || "",
    surnom: player?.surnom || "",
    bio: player?.bio || "",
  });
  const [descriptions, setDescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { show, ToastEl } = useToast();

  useEffect(() => {
    if (player?.id) {
      supabase.from("character_descriptions").select("*").eq("user_id", player.id).order("ordre")
        .then(({ data }) => setDescriptions(data || []));
    }
  }, [player?.id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.nom.trim()) { show("Le nom est requis", "error"); return; }
    if (!/^\d{4}$/.test(form.code_4_chiffres)) { show("Le code doit être 4 chiffres", "error"); return; }
    setLoading(true);
    try {
      let userId = player?.id;
      const payload = { ...form, points: parseInt(form.points) || 0 };
      if (player?.id) {
        const { error } = await supabase.from("users").update(payload).eq("id", player.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("users").insert(payload).select().single();
        if (error) throw error;
        userId = data.id;
      }
      // Save descriptions
      if (userId) {
        await supabase.from("character_descriptions").delete().eq("user_id", userId);
        const descs = descriptions.filter(d => d.texte.trim()).map((d, i) => ({
          user_id: userId, texte: d.texte, ordre: i
        }));
        if (descs.length > 0) await supabase.from("character_descriptions").insert(descs);
      }
      onSave();
    } catch (e) {
      show(e.message || "Erreur", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {ToastEl}
      <div className="form-group">
        <label className="label">Nom *</label>
        <input className="input" value={form.nom} onChange={e => set("nom", e.target.value)} placeholder="Nom du personnage" />
      </div>
      <div className="form-row">
        <div className="form-group" style={{ flex: 1 }}>
          <label className="label">Code 4 chiffres *</label>
          <input className="input" value={form.code_4_chiffres} onChange={e => set("code_4_chiffres", e.target.value)} maxLength={4} placeholder="1234" />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="label">Points</label>
          <input className="input" type="number" value={form.points} onChange={e => set("points", e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label className="label">Photo URL</label>
        <input className="input" value={form.photo} onChange={e => set("photo", e.target.value)} placeholder="https://..." />
      </div>
      <div className="form-group">
        <label className="label">Titre <span style={{ color: "var(--blood)", fontSize: 11 }}>(%mot% pour cacher)</span></label>
        <input className="input" value={form.titre} onChange={e => set("titre", e.target.value)} placeholder="Ex: %Prince% de Lordaeron" />
      </div>
      <div className="form-group">
        <label className="label">Surnom</label>
        <input className="input" value={form.surnom} onChange={e => set("surnom", e.target.value)} placeholder="Ex: Le %Roi% Liche" />
      </div>
      <div className="form-group">
        <label className="label">Bio</label>
        <textarea className="input" value={form.bio} onChange={e => set("bio", e.target.value)} placeholder="Biographie du personnage..." rows={3} />
      </div>
      <div className="form-group">
        <label className="label">Lignes de description</label>
        {descriptions.map((d, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input className="input" value={d.texte} onChange={e => {
              const nd = [...descriptions]; nd[i] = { ...nd[i], texte: e.target.value }; setDescriptions(nd);
            }} placeholder={`Description ${i + 1}`} />
            <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDescriptions(descriptions.filter((_, j) => j !== i))}>
              <Icons.X />
            </button>
          </div>
        ))}
        <button className="btn btn-ghost btn-sm" onClick={() => setDescriptions([...descriptions, { texte: "", ordre: descriptions.length }])}>
          <Icons.Plus /> Ajouter une ligne
        </button>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
        <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
        <button className="btn btn-gold" onClick={handleSave} disabled={loading}>
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </>
  );
}

// ============================================================
// QUEST FORM
// ============================================================
function QuestForm({ quest, players, onSave, onClose }) {
  const [form, setForm] = useState({
    titre: quest?.titre || "",
    description: quest?.description || "",
    type: quest?.type || "secondaire",
    active: quest?.active ?? true,
    player_id: quest?.player_id || null,
  });
  const [loading, setLoading] = useState(false);
  const { show, ToastEl } = useToast();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.titre.trim()) { show("Le titre est requis", "error"); return; }
    setLoading(true);
    try {
      const payload = { ...form, player_id: form.player_id || null };
      if (quest?.id) {
        await supabase.from("quests").update(payload).eq("id", quest.id);
      } else {
        await supabase.from("quests").insert(payload);
      }
      onSave();
    } catch (e) {
      show(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {ToastEl}
      <div className="form-group">
        <label className="label">Titre *</label>
        <input className="input" value={form.titre} onChange={e => set("titre", e.target.value)} placeholder="Titre de la quête" />
      </div>
      <div className="form-group">
        <label className="label">Description</label>
        <textarea className="input" value={form.description} onChange={e => set("description", e.target.value)} rows={3} placeholder="Description de la quête..." />
      </div>
      <div className="form-row">
        <div className="form-group" style={{ flex: 1 }}>
          <label className="label">Type</label>
          <select className="input" value={form.type} onChange={e => set("type", e.target.value)}>
            <option value="principale">Principale (+10 pts)</option>
            <option value="secondaire">Secondaire (+5 pts)</option>
            <option value="sabotage">Sabotage (+15 pts)</option>
          </select>
        </div>
        <div className="form-group" style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 22 }}>
          <label className="toggle">
            <input type="checkbox" checked={form.active} onChange={e => set("active", e.target.checked)} />
            <span className="toggle-slider" />
          </label>
          <span style={{ fontSize: 13 }}>Active</span>
        </div>
      </div>
      <div className="form-group">
        <label className="label">Assigner à un joueur <span style={{ color: "var(--muted)", fontSize: 11 }}>(optionnel — laisser vide = visible par tous)</span></label>
        <select className="input" value={form.player_id || ""} onChange={e => set("player_id", e.target.value || null)}>
          <option value="">— Visible par tous les joueurs —</option>
          {players.map(p => (
            <option key={p.id} value={p.id}>{p.nom}</option>
          ))}
        </select>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
        <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
        <button className="btn btn-gold" onClick={handleSave} disabled={loading}>
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </>
  );
}

// ============================================================
// ADMIN - PLAYERS TAB
// ============================================================
function AdminPlayers({ toast }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | {type:'add'|'edit', player?}

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("users").select("*").order("points", { ascending: false });
    setPlayers(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const deletePlayer = async (id) => {
    if (!confirm("Supprimer ce joueur ?")) return;
    await supabase.from("users").delete().eq("id", id);
    toast.show("Joueur supprimé", "success");
    load();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 className="cinzel" style={{ color: "var(--gold)", fontSize: 20 }}>Joueurs</h2>
        <button className="btn btn-primary" onClick={() => setModal({ type: "add" })}>
          <Icons.Plus /> Ajouter
        </button>
      </div>
      {loading ? <div className="loading">Chargement...</div> : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Joueur</th>
                  <th>Code</th>
                  <th>Points</th>
                  <th>Titre</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {players.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar url={p.photo} name={p.nom} size={32} />
                        <div>
                          <div style={{ fontWeight: 500 }}>{stripHiddenMarkers(p.nom)}</div>
                          {p.surnom && <div style={{ fontSize: 12, color: "var(--cream-dim)" }}>{stripHiddenMarkers(p.surnom)}</div>}
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-muted">{p.code_4_chiffres}</span></td>
                    <td><span className="badge badge-gold">⚔ {p.points}</span></td>
                    <td style={{ color: "var(--cream-dim)", fontSize: 13 }}>{p.titre ? stripHiddenMarkers(p.titre) : "—"}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setModal({ type: "edit", player: p })}>
                          <Icons.Edit /> Modifier
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => deletePlayer(p.id)}>
                          <Icons.Trash /> Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {players.length === 0 && <div className="empty-state"><div className="icon">👥</div><p>Aucun joueur pour l'instant</p></div>}
          </div>
        </div>
      )}
      {modal && (
        <Modal title={modal.type === "add" ? "Nouveau joueur" : "Modifier le joueur"} onClose={() => setModal(null)}>
          <PlayerForm player={modal.player} onSave={() => { setModal(null); load(); toast.show("Joueur enregistré ✓", "success"); }} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

// ============================================================
// ADMIN - QUESTS TAB
// ============================================================
function AdminQuests({ toast }) {
  const [quests, setQuests] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: q }, { data: ps }] = await Promise.all([
      supabase.from("quests").select("*, users(nom)").order("created_at", { ascending: false }),
      supabase.from("users").select("id, nom").order("nom"),
    ]);
    setQuests(q || []);
    setPlayers(ps || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggle = async (quest) => {
    await supabase.from("quests").update({ active: !quest.active }).eq("id", quest.id);
    load();
  };

  const deleteQuest = async (id) => {
    if (!confirm("Supprimer cette quête ?")) return;
    await supabase.from("quests").delete().eq("id", id);
    toast.show("Quête supprimée", "success");
    load();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 className="cinzel" style={{ color: "var(--gold)", fontSize: 20 }}>Quêtes</h2>
        <button className="btn btn-primary" onClick={() => setModal({ type: "add" })}>
          <Icons.Plus /> Créer
        </button>
      </div>
      {loading ? <div className="loading">Chargement...</div> : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Quête</th>
                  <th>Type</th>
                  <th>Assignée à</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quests.map(q => (
                  <tr key={q.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{q.titre}</div>
                      {q.description && <div style={{ fontSize: 12, color: "var(--cream-dim)", marginTop: 2 }}>{q.description.slice(0, 60)}{q.description.length > 60 ? "…" : ""}</div>}
                    </td>
                    <td>
                      <span className={`badge ${q.type === "principale" ? "badge-blood" : q.type === "sabotage" ? "badge-blood" : "badge-muted"}`}
                        style={q.type === "sabotage" ? { background: "rgba(180,0,0,0.2)", color: "#FF3333", border: "1px solid #CC0000" } : {}}>
                        {q.type === "principale" ? "⚔ Principale" : q.type === "sabotage" ? "💀 Sabotage" : "📜 Secondaire"}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, color: q.player_id ? "var(--gold)" : "var(--muted)" }}>
                      {q.users?.nom || "Tous"}
                    </td>
                    <td>
                      <label className="toggle" style={{ display: "inline-block" }}>
                        <input type="checkbox" checked={q.active} onChange={() => toggle(q)} />
                        <span className="toggle-slider" />
                      </label>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setModal({ type: "edit", quest: q })}><Icons.Edit /> Modifier</button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteQuest(q.id)}><Icons.Trash /> Supprimer</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {quests.length === 0 && <div className="empty-state"><div className="icon">📜</div><p>Aucune quête créée</p></div>}
          </div>
        </div>
      )}
      {modal && (
        <Modal title={modal.type === "add" ? "Nouvelle quête" : "Modifier la quête"} onClose={() => setModal(null)}>
          <QuestForm quest={modal.quest} players={players} onSave={() => { setModal(null); load(); toast.show("Quête enregistrée ✓", "success"); }} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

// ============================================================
// ADMIN - VALIDATIONS TAB
// ============================================================
function AdminValidations({ toast }) {
  const [validations, setValidations] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("quest_validations")
      .select("*, users(nom, photo), quests(titre, type)")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    setValidations(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handle = async (val, approve) => {
    if (approve) {
      const pts = val.quests.type === "principale" ? 10 : val.quests.type === "sabotage" ? 15 : 5;
      await supabase.from("users").update({ points: supabase.rpc ? undefined : undefined }).eq("id", val.player_id);
      // Increment points
      const { data: user } = await supabase.from("users").select("points").eq("id", val.player_id).single();
      await supabase.from("users").update({ points: (user?.points || 0) + pts }).eq("id", val.player_id);
      await supabase.from("quest_validations").update({ status: "approved" }).eq("id", val.id);
      toast.show(`+${pts} points attribués à ${val.users.nom} ✓`, "gold");
    } else {
      await supabase.from("quest_validations").update({ status: "rejected" }).eq("id", val.id);
      toast.show("Quête refusée", "error");
    }
    load();
  };

  return (
    <div>
      <h2 className="cinzel" style={{ color: "var(--gold)", fontSize: 20, marginBottom: 20 }}>
        Demandes de validation <span className="badge badge-blood" style={{ fontSize: 13, verticalAlign: "middle" }}>{validations.length}</span>
      </h2>
      {loading ? <div className="loading">Chargement...</div> : (
        validations.length === 0 ? (
          <div className="card">
            <div className="empty-state"><div className="icon">✅</div><p>Aucune demande en attente</p></div>
          </div>
        ) : (
          validations.map(v => (
            <div key={v.id} className="card" style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar url={v.users?.photo} name={v.users?.nom} size={36} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{v.users?.nom}</div>
                    <div style={{ fontSize: 13, color: "var(--cream-dim)" }}>
                      {v.quests?.titre}
                      <span className={`badge ${v.quests?.type === "sabotage" ? "" : v.quests?.type === "principale" ? "badge-blood" : "badge-muted"}`}
                        style={v.quests?.type === "sabotage" ? { marginLeft: 8, fontSize: 11, background: "rgba(180,0,0,0.2)", color: "#FF3333", border: "1px solid #CC0000", display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 20 } : { marginLeft: 8, fontSize: 11 }}>
                        {v.quests?.type === "principale" ? "+10" : v.quests?.type === "sabotage" ? "💀 +15" : "+5"} pts
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                      {new Date(v.created_at).toLocaleString("fr-FR")}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-success btn-sm" onClick={() => handle(v, true)}><Icons.Check /> Valider</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handle(v, false)}><Icons.X /> Refuser</button>
                </div>
              </div>
            </div>
          ))
        )
      )}
    </div>
  );
}

// ============================================================
// ADMIN - SETTINGS TAB
// ============================================================
function AdminSettings({ toast }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("settings").select("*").limit(1).single();
    setSettings(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateSelfInvestigation = async (v) => {
    await supabase.from("settings").update({ allow_self_investigation: v }).eq("id", settings.id);
    setSettings(s => ({ ...s, allow_self_investigation: v }));
    toast.show("Paramètre mis à jour ✓", "success");
  };

  const updatePassword = async () => {
    if (!newPassword.trim()) return;
    await supabase.from("settings").update({ admin_password: newPassword }).eq("id", settings.id);
    setNewPassword("");
    toast.show("Mot de passe mis à jour ✓", "success");
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div>
      <h2 className="cinzel" style={{ color: "var(--gold)", fontSize: 20, marginBottom: 20 }}>Paramètres</h2>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Auto-investigation</div>
            <div style={{ fontSize: 13, color: "var(--cream-dim)" }}>Autoriser les joueurs à investiguer leur propre fiche</div>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={settings?.allow_self_investigation} onChange={e => updateSelfInvestigation(e.target.checked)} />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>
      <div className="card">
        <div style={{ fontWeight: 600, marginBottom: 12 }}>Mot de passe administrateur</div>
        <div style={{ display: "flex", gap: 10 }}>
          <input className="input" type="password" placeholder="Nouveau mot de passe" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          <button className="btn btn-gold" onClick={updatePassword}>Changer</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN DASHBOARD
// ============================================================
function AdminDashboard({ onLogout }) {
  const [tab, setTab] = useState("players");
  const toast = useToast();

  const tabs = [
    { id: "players", label: "Joueurs", icon: <Icons.Users /> },
    { id: "quests", label: "Quêtes", icon: <Icons.Scroll /> },
    { id: "validations", label: "Validations", icon: <Icons.Check /> },
    { id: "coffres", label: "Coffres", icon: <Icons.Lock /> },
    { id: "tableau", label: "Tableau", icon: <Icons.Sword /> },
    { id: "settings", label: "Réglages", icon: <Icons.Settings /> },
  ];

  return (
    <div className="admin-page">
      {toast.ToastEl}
      <div className="admin-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icons.Skull />
          <span className="cinzel" style={{ color: "var(--gold)", fontSize: 16, fontWeight: 700 }}>Murder Party</span>
          <span className="badge badge-blood" style={{ fontSize: 11 }}>Admin</span>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onLogout}><Icons.Logout /> Se déconnecter</button>
      </div>
      <div style={{ background: "var(--bg-deep)", borderBottom: "1px solid var(--border)", padding: "8px 20px" }}>
        <div className="admin-tabs">
          {tabs.map(t => (
            <button key={t.id} className={`admin-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="admin-content fade-in">
        {tab === "players" && <AdminPlayers toast={toast} />}
        {tab === "quests" && <AdminQuests toast={toast} />}
        {tab === "validations" && <AdminValidations toast={toast} />}
        {tab === "coffres" && <AdminCoffres toast={toast} />}
        {tab === "tableau" && <AdminTableau toast={toast} />}
        {tab === "settings" && <AdminSettings toast={toast} />}
      </div>
    </div>
  );
}

// ============================================================
// PLAYER - PROFILE TAB
// ============================================================
function PlayerProfile({ player }) {
  const [descriptions, setDescriptions] = useState([]);

  useEffect(() => {
    supabase.from("character_descriptions").select("*").eq("user_id", player.id).order("ordre")
      .then(({ data }) => setDescriptions(data || []));
  }, [player.id]);

  return (
    <div className="fade-in">
      <div className="profile-hero">
        <Avatar url={player.photo} name={player.nom} size={80} />
        <h2 className="cinzel" style={{ fontSize: 24, marginTop: 14, color: "var(--cream)" }}>
          {stripHiddenMarkers(player.nom)}
        </h2>
        {player.titre && <div style={{ color: "var(--gold)", fontSize: 14, marginTop: 4 }}>{stripHiddenMarkers(player.titre)}</div>}
        {player.surnom && <div style={{ color: "var(--cream-dim)", fontSize: 13, marginTop: 4, fontStyle: "italic" }}>"{stripHiddenMarkers(player.surnom)}"</div>}
        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Points</div>
          <div className="points-large">{player.points}</div>
        </div>
      </div>
      {player.bio && (
        <div className="card card-gold" style={{ marginBottom: 12 }}>
          <div className="label">Biographie</div>
          <p style={{ color: "var(--cream-dim)", lineHeight: 1.7 }}>{stripHiddenMarkers(player.bio)}</p>
        </div>
      )}
      {descriptions.length > 0 && (
        <div className="card" style={{ marginBottom: 12 }}>
          <div className="label" style={{ marginBottom: 10 }}>Informations secrètes</div>
          {descriptions.map((d, i) => (
            <p key={i} style={{ color: "var(--cream-dim)", lineHeight: 1.7, marginBottom: 6, fontSize: 14 }}>
              {stripHiddenMarkers(d.texte)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// PLAYER - QUESTS TAB
// ============================================================
function PlayerQuests({ player }) {
  const [quests, setQuests] = useState([]);
  const [validations, setValidations] = useState([]);
  const [allValidations, setAllValidations] = useState([]);
  const [activations, setActivations] = useState([]);
  const [newActivations, setNewActivations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { show, ToastEl } = useToast();

  const load = useCallback(async () => {
    const [{ data: q }, { data: v }, { data: allV }, { data: acts }] = await Promise.all([
      supabase.from("quests").select("*, users(nom)").eq("active", true).order("type"),
      supabase.from("quest_validations").select("*").eq("player_id", player.id),
      supabase.from("quest_validations").select("*, users(nom)").eq("status", "approved"),
      supabase.from("quest_activations").select("*, quests(id, titre, type, description, player_id)").eq("player_id", player.id),
    ]);

    // Quêtes normales visibles
    const visible = (q || []).filter(quest => !quest.player_id || quest.player_id === player.id);
    setQuests(visible);
    setValidations(v || []);
    setAllValidations(allV || []);
    setActivations(acts || []);

    // Nouvelles activations non vues
    const unseen = (acts || []).filter(a => !a.seen);
    setNewActivations(unseen);

    // Marquer comme vues
    if (unseen.length > 0) {
      await supabase.from("quest_activations").update({ seen: true }).eq("player_id", player.id).eq("seen", false);
    }

    setLoading(false);
  }, [player.id]);

  useEffect(() => { load(); }, [load]);

  // Combiner quêtes normales + quêtes activées (sans doublons)
  const allQuests = [...quests];
  activations.forEach(act => {
    if (act.quests && !allQuests.find(q => q.id === act.quests.id)) {
      allQuests.push({ ...act.quests, _activated: true, _activatedAt: act.activated_at });
    }
  });

  const getMyStatus = (questId) => validations.find(v => v.quest_id === questId)?.status || null;

  const getValidatedBy = (questId) =>
    allValidations.filter(v => v.quest_id === questId && v.player_id !== player.id).map(v => v.users?.nom).filter(Boolean);

  const requestValidation = async (questId) => {
    const existing = validations.find(v => v.quest_id === questId);
    if (existing) {
      const { error } = await supabase.from("quest_validations").update({ status: "pending" }).eq("id", existing.id);
      if (error) { show("Erreur", "error"); } else { show("Nouvelle demande envoyée ✓", "success"); load(); }
    } else {
      const { error } = await supabase.from("quest_validations").insert({ player_id: player.id, quest_id: questId, status: "pending" });
      if (error) { show("Erreur", "error"); } else { show("Demande envoyée ✓", "success"); load(); }
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;

  const principales = allQuests.filter(q => q.type === "principale");
  const secondaires = allQuests.filter(q => q.type === "secondaire");
  const sabotages = allQuests.filter(q => q.type === "sabotage");

  const QuestList = ({ list, label, labelColor }) => {
    return (
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span className="cinzel" style={{ color: labelColor || "var(--gold)", fontSize: 15 }}>{label}</span>
          <span className="badge badge-muted">{list.length}</span>
        </div>
        {list.length === 0 && <p style={{ color: "var(--muted)", fontSize: 13 }}>Aucune quête disponible</p>}
        {list.map(q => {
          const myStatus = getMyStatus(q.id);
          const isPersonal = !!q.player_id; // quête assignée à un joueur précis
          const validatedBy = getValidatedBy(q.id); // autres joueurs qui ont validé
          const takenByOther = validatedBy.length > 0;

          // Quête globale validée par quelqu'un : afficher "Validée par X", bloquer le bouton
          // Quête personnelle : seul le joueur assigné la voit (déjà filtré dans `quests`)

          return (
            <div key={q.id} className="quest-card" style={q._activated ? { borderColor: "#CC0000" } : {}}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ fontWeight: 600 }}>{q.titre}</div>
                  {q._activated && <span className="badge" style={{ background: "rgba(255,51,51,0.15)", color: "#FF3333", border: "1px solid #CC0000", fontSize: 10 }}>🔔 Nouvelle</span>}
                </div>
                {q.description && <div style={{ fontSize: 13, color: "var(--cream-dim)", marginBottom: 6 }}>{q.description}</div>}
                {!isPersonal && takenByOther && (
                  <div style={{ fontSize: 12, color: "var(--success-bright)" }}>
                    ✅ Validée par : {validatedBy.join(", ")}
                  </div>
                )}
              </div>
              <div style={{ flexShrink: 0 }}>
                {myStatus === "approved" && <span className="badge badge-success">✅ Validée</span>}
                {myStatus === "pending" && <span className="badge badge-pending">⏳ En attente</span>}
                {myStatus === "rejected" && !isPersonal && takenByOther && (
                  <span className="badge badge-muted">🔒 Déjà validée</span>
                )}
                {myStatus === "rejected" && (isPersonal || !takenByOther) && (
                  <button className="btn btn-ghost btn-sm" onClick={() => requestValidation(q.id)}>
                    Re-demander
                  </button>
                )}
                {!myStatus && !isPersonal && takenByOther && (
                  <span className="badge badge-muted">🔒 Déjà validée</span>
                )}
                {!myStatus && (!takenByOther || isPersonal) && (
                  <button className="btn btn-ghost btn-sm" onClick={() => requestValidation(q.id)}>
                    Demander validation
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fade-in">
      {ToastEl}
      {/* Bannière nouvelles quêtes */}
      {newActivations.length > 0 && (
        <div style={{ background: "rgba(255,51,51,0.1)", border: "1px solid #CC0000", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 24, flexShrink: 0 }}>🔔</div>
          <div>
            <div style={{ fontWeight: 700, color: "#FF3333", fontSize: 14, marginBottom: 2 }}>
              {newActivations.length} nouvelle(s) quête(s) débloquée(s) !
            </div>
            <div style={{ fontSize: 12, color: "var(--cream-dim)" }}>
              {newActivations.map(a => a.quests?.titre).filter(Boolean).join(" • ")}
            </div>
          </div>
        </div>
      )}
      <QuestList list={principales} label="⚔ Quêtes Principales" />
      <QuestList list={secondaires} label="📜 Quêtes Secondaires" />
      {sabotages.length > 0 && <QuestList list={sabotages} label="💀 Quêtes Sabotage" labelColor="#FF3333" />}
    </div>
  );
}

// ============================================================
// LEADERBOARD (shared)
// ============================================================
function Leaderboard({ currentPlayerId }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase.from("users").select("id, nom, points, photo").order("points", { ascending: false });
    setPlayers(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const channel = supabase.channel("leaderboard-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "users" }, load)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [load]);

  if (loading) return <div className="loading">Chargement...</div>;

  const rankIcon = (i) => ["🥇", "🥈", "🥉"][i] || `${i + 1}.`;
  const rankClass = (i) => ["rank-1", "rank-2", "rank-3"][i] || "";

  return (
    <div className="fade-in">
      <div className="ornament">⚔ ✦ ⚔</div>
      <h2 className="cinzel" style={{ textAlign: "center", color: "var(--gold)", fontSize: 22, marginBottom: 20 }}>
        Classement
      </h2>
      {players.map((p, i) => (
        <div key={p.id} className={`card ${p.id === currentPlayerId ? "card-gold" : ""}`} style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 14, padding: "14px 18px" }}>
          <div className={`cinzel ${rankClass(i)}`} style={{ fontSize: 20, fontWeight: 700, minWidth: 32, textAlign: "center" }}>
            {rankIcon(i)}
          </div>
          <Avatar url={p.photo} name={p.nom} size={38} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: p.id === currentPlayerId ? 700 : 500 }}>
              {stripHiddenMarkers(p.nom)}
              {p.id === currentPlayerId && <span className="badge badge-gold" style={{ marginLeft: 8, fontSize: 11 }}>Vous</span>}
            </div>
          </div>
          <div className="cinzel" style={{ color: "var(--gold)", fontWeight: 700, fontSize: 20 }}>{p.points}</div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// PLAYER - INVESTIGATE TAB
// ============================================================
function PlayerInvestigate({ player, allowSelf }) {
  const [players, setPlayers] = useState([]);
  const [descriptions, setDescriptions] = useState({});
  const [discoveries, setDiscoveries] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);
  const { show, ToastEl } = useToast();

  const load = useCallback(async () => {
    const [{ data: ps }, { data: descs }, { data: discs }] = await Promise.all([
      supabase.from("users").select("*").order("nom"),
      supabase.from("character_descriptions").select("*").order("ordre"),
      supabase.from("discoveries").select("*").eq("investigator_id", player.id),
    ]);
    let filtered = ps || [];
    if (!allowSelf) filtered = filtered.filter(p => p.id !== player.id);
    setPlayers(filtered);
    const descMap = {};
    (descs || []).forEach(d => {
      if (!descMap[d.user_id]) descMap[d.user_id] = [];
      descMap[d.user_id].push(d);
    });
    setDescriptions(descMap);
    setDiscoveries(discs || []);
    setLoading(false);
  }, [player.id, allowSelf]);

  useEffect(() => { load(); }, [load]);

  const handleDiscover = async (targetId, fieldType, wordIndex, word) => {
    const { error } = await supabase.from("discoveries").insert({
      investigator_id: player.id,
      target_player_id: targetId,
      field_type: fieldType,
      word_index: wordIndex,
      original_word: word,
    });
    if (!error) {
      // Award 1 point
      const { data: cur } = await supabase.from("users").select("points").eq("id", player.id).single();
      await supabase.from("users").update({ points: (cur?.points || 0) + 1 }).eq("id", player.id);
      setDiscoveries(d => [...d, { investigator_id: player.id, target_player_id: targetId, field_type: fieldType, word_index: wordIndex }]);
      show("Mot trouvé ! +1 point 🎉", "gold");
    }
  };

  const renderField = (text, fieldType, targetId, label, isSelf = false) => {
    if (!text) return null;
    const hasHidden = hasHiddenWords(text);
    return (
      <div style={{ marginBottom: 10 }}>
        <div className="label">{label}</div>
        <div style={{ fontSize: 14, lineHeight: 1.8 }}>
          {isSelf ? (
            // Propre fiche : afficher le texte complet révélé
            <span style={{ color: "var(--cream-dim)" }}>{stripHiddenMarkers(text)}</span>
          ) : hasHidden ? (
            <InvestigateText
              text={text}
              fieldType={fieldType}
              targetPlayerId={targetId}
              investigatorId={player.id}
              discoveries={discoveries}
              onDiscover={handleDiscover}
            />
          ) : (
            <span>{text}</span>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="fade-in">
      {ToastEl}
      <div className="ornament">🔍 ✦ 🔍</div>
      <h2 className="cinzel" style={{ textAlign: "center", color: "var(--gold)", fontSize: 22, marginBottom: 6 }}>Investiguer</h2>
      <p style={{ textAlign: "center", color: "var(--cream-dim)", fontSize: 13, marginBottom: 24 }}>
        Remplissez les champs pour découvrir les secrets cachés
      </p>
      {players.map(p => {
        const descs = descriptions[p.id] || [];
        const isExpanded = expanded[p.id];
        const isSelf = p.id === player.id;
        return (
          <div key={p.id} className="investigate-card">
            <div className="investigate-header" onClick={() => setExpanded(e => ({ ...e, [p.id]: !e[p.id] }))}>
              <Avatar url={p.photo} name={p.nom} size={44} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>
                  {isSelf
                    ? <span>{stripHiddenMarkers(p.nom)}</span>
                    : <InvestigateText text={p.nom} fieldType="nom" targetPlayerId={p.id} investigatorId={player.id} discoveries={discoveries} onDiscover={handleDiscover} />
                  }
                </div>
                {p.titre && (
                  <div style={{ fontSize: 13, color: "var(--gold)", marginTop: 2 }}>
                    {isSelf
                      ? <span>{stripHiddenMarkers(p.titre)}</span>
                      : <InvestigateText text={p.titre} fieldType="titre" targetPlayerId={p.id} investigatorId={player.id} discoveries={discoveries} onDiscover={handleDiscover} />
                    }
                  </div>
                )}
                {isSelf && <span style={{ fontSize: 11, color: "var(--gold-dim)", marginTop: 2, display: "block" }}>— Votre fiche —</span>}
              </div>
              <div style={{ color: "var(--muted)" }}>{isExpanded ? <Icons.ChevronUp /> : <Icons.ChevronDown />}</div>
            </div>
            {isExpanded && (
              <div className="investigate-body fade-in">
                {renderField(p.surnom, "surnom", p.id, "Surnom", isSelf)}
                {renderField(p.bio, "bio", p.id, "Biographie", isSelf)}
                {descs.map((d, idx) => renderField(d.texte, `description_${idx}`, p.id, `Description ${idx + 1}`, isSelf))}
              </div>
            )}
          </div>
        );
      })}
      {players.length === 0 && (
        <div className="card">
          <div className="empty-state"><div className="icon">🔍</div><p>Aucun personnage à investiguer</p></div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// COFFRE PERSONNEL (Player)
// ============================================================
function CoffrePersonnel({ player }) {
  const [locked, setLocked] = useState(true);
  const [codeInput, setCodeInput] = useState("");
  const [error, setError] = useState("");
  const [indices, setIndices] = useState([]);
  const [receptions, setReceptions] = useState([]);
  const [coffreCode, setCoffreCode] = useState(player.coffre_code || null);
  const [showSetCode, setShowSetCode] = useState(false);
  const [newCode, setNewCode] = useState("");
  const { show, ToastEl } = useToast();

  const unlock = async () => {
    if (!coffreCode) { setError("Aucun code défini. Allez dans Paramètres pour en créer un."); return; }
    if (codeInput === coffreCode) {
      // Load data
      const [{ data: ind }, { data: rec }] = await Promise.all([
        supabase.from("coffre_indices").select("*").eq("player_id", player.id).order("created_at"),
        supabase.from("coffre_receptions").select("*, coffre_documents(titre, contenu)").eq("player_id", player.id).order("received_at"),
      ]);
      setIndices(ind || []);
      setReceptions(rec || []);
      setLocked(false);
      setError("");
    } else {
      setError("Code incorrect");
    }
  };

  if (!coffreCode && !showSetCode) {
    return (
      <div className="fade-in">
        {ToastEl}
        <div className="card card-gold" style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
          <div className="cinzel gold" style={{ fontSize: 18, marginBottom: 8 }}>Coffre Personnel</div>
          <p style={{ color: "var(--cream-dim)", fontSize: 13, marginBottom: 20 }}>Vous n'avez pas encore de code. Définissez-en un dans <strong>Paramètres</strong>.</p>
        </div>
      </div>
    );
  }

  if (locked) {
    return (
      <div className="fade-in">
        {ToastEl}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🔐</div>
          <div className="cinzel gold" style={{ fontSize: 20, marginBottom: 4 }}>Coffre Personnel</div>
          <p style={{ color: "var(--cream-dim)", fontSize: 13 }}>Entrez votre code secret pour l'ouvrir</p>
        </div>
        <div className="card card-glow" style={{ maxWidth: 320, margin: "0 auto", padding: 24 }}>
          <input
            className="input input-lg"
            type="text"
            placeholder="Votre code"
            value={codeInput}
            onChange={e => { setCodeInput(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && unlock()}
            autoFocus
            style={{ marginBottom: 12, letterSpacing: 4 }}
          />
          {error && <div className="alert alert-error" style={{ marginBottom: 12 }}>{error}</div>}
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={unlock}>
            <Icons.Unlock /> Ouvrir le coffre
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {ToastEl}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div className="cinzel gold" style={{ fontSize: 18 }}>🔓 Coffre ouvert</div>
        <button className="btn btn-ghost btn-sm" onClick={() => { setLocked(true); setCodeInput(""); }}>
          <Icons.Lock /> Verrouiller
        </button>
      </div>

      {/* Rôle */}
      {player.role_murder && (
        <div className="card card-glow" style={{ marginBottom: 16 }}>
          <div className="label" style={{ marginBottom: 8 }}>⚔ Votre Rôle</div>
          <p style={{ color: "var(--cream)", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{player.role_murder}</p>
        </div>
      )}

      {/* Indices admin */}
      {indices.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="label" style={{ marginBottom: 10 }}>📜 Indices reçus</div>
          {indices.map((ind, i) => (
            <div key={ind.id} style={{ borderLeft: "2px solid var(--blood)", paddingLeft: 12, marginBottom: 12 }}>
              <p style={{ color: "var(--cream-dim)", fontSize: 14, lineHeight: 1.7 }}>{ind.contenu}</p>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{new Date(ind.created_at).toLocaleString("fr-FR")}</div>
            </div>
          ))}
        </div>
      )}

      {/* Documents reçus des coffres globaux */}
      {receptions.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="label" style={{ marginBottom: 10 }}>📁 Documents découverts</div>
          {receptions.map(r => (
            <div key={r.id} style={{ borderLeft: "2px solid var(--gold-dim)", paddingLeft: 12, marginBottom: 12 }}>
              <div style={{ fontWeight: 600, color: "var(--gold)", fontSize: 14, marginBottom: 4 }}>{r.coffre_documents?.titre}</div>
              {r.coffre_documents?.image_url && <img src={r.coffre_documents.image_url} alt="" style={{ width: "100%", borderRadius: 8, marginBottom: 8, maxHeight: 240, objectFit: "cover" }} onError={e => e.target.style.display="none"} />}
              {r.coffre_documents?.contenu && <p style={{ color: "var(--cream-dim)", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{r.coffre_documents.contenu}</p>}
            </div>
          ))}
        </div>
      )}

      {indices.length === 0 && receptions.length === 0 && !player.role_murder && (
        <div className="empty-state"><div className="icon">📭</div><p>Votre coffre est vide pour l'instant</p></div>
      )}
    </div>
  );
}

// ============================================================
// COFFRES GLOBAUX (Player)
// ============================================================
function CoffresGlobaux({ player }) {
  const [coffres, setCoffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [opened, setOpened] = useState({});
  const { show, ToastEl } = useToast();

  const load = useCallback(async () => {
    const { data } = await supabase.from("coffres_globaux").select("*").order("created_at");
    setCoffres(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const tryOpen = async (coffre) => {
    const input = (inputs[coffre.id] || "").trim();
    if (input !== coffre.code_8) {
      setErrors(e => ({ ...e, [coffre.id]: "Code incorrect" }));
      return;
    }
    setErrors(e => ({ ...e, [coffre.id]: "" }));
    // Load documents
    const { data: docs } = await supabase.from("coffre_documents").select("*").eq("coffre_id", coffre.id).order("ordre");
    if (!docs || docs.length === 0) { show("Coffre vide !", "error"); return; }

    // Insert receptions — compter seulement les nouveaux documents
    let newDocs = 0;
    const newDocIds = [];
    for (const doc of docs) {
      const { error } = await supabase.from("coffre_receptions").insert({ player_id: player.id, coffre_id: coffre.id, document_id: doc.id });
      if (!error) { newDocs++; newDocIds.push(doc.id); }
    }

    // +5 points par nouveau document
    if (newDocs > 0) {
      const { data: cur } = await supabase.from("users").select("points").eq("id", player.id).single();
      await supabase.from("users").update({ points: (cur?.points || 0) + newDocs * 5 }).eq("id", player.id);

      // Déclencher les quêtes liées aux nouveaux documents
      let triggeredQuests = 0;
      for (const docId of newDocIds) {
        const { data: triggers } = await supabase
          .from("quest_triggers")
          .select("*, quests(titre, type)")
          .eq("document_id", docId);

        const { data: triggersFull } = await supabase
          .from("quest_triggers")
          .select("*, quests(id, titre, type, player_id)")
          .eq("document_id", docId);

        for (const trigger of triggersFull || []) {
          // Le destinataire = cible explicite OU propriétaire de la quête
          const destId = trigger.target_player_id || trigger.quests?.player_id;
          // La quête ne s'active QUE si c'est ce joueur qui ouvre le document
          if (!destId || destId !== player.id) continue;

          const { error } = await supabase.from("quest_activations").insert({
            player_id: player.id,
            quest_id: trigger.quest_id,
            triggered_by_document: docId,
            seen: false,
          });
          if (!error) triggeredQuests++;
        }
      }

      let msg = `${newDocs} document(s) découvert(s) ! +${newDocs * 5} points 🎉`;
      if (triggeredQuests > 0) msg += ` • ${triggeredQuests} nouvelle(s) quête(s) activée(s) !`;
      show(msg, "gold");
    } else {
      show("Vous avez déjà tous ces documents.", "success");
    }
    setOpened(o => ({ ...o, [coffre.id]: docs }));
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="fade-in">
      {ToastEl}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🗄️</div>
        <div className="cinzel gold" style={{ fontSize: 20, marginBottom: 4 }}>Coffres Secrets</div>
        <p style={{ color: "var(--cream-dim)", fontSize: 13 }}>Entrez le code à 8 caractères pour ouvrir un coffre</p>
      </div>
      {coffres.length === 0 && <div className="empty-state"><div className="icon">🗄️</div><p>Aucun coffre disponible</p></div>}
      {coffres.map(c => (
        <div key={c.id} className={`card ${opened[c.id] ? "card-gold" : ""}`} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 28 }}>{opened[c.id] ? "🔓" : "🔒"}</span>
            <div className="cinzel" style={{ fontSize: 16, color: opened[c.id] ? "var(--gold)" : "var(--cream)" }}>{c.nom}</div>
          </div>
          {opened[c.id] ? (
            <div>
              <div style={{ fontSize: 12, color: "var(--success-bright)", marginBottom: 10 }}>✅ Documents ajoutés à votre coffre personnel</div>
              {opened[c.id].map(doc => (
                <div key={doc.id} style={{ borderLeft: "2px solid var(--gold-dim)", paddingLeft: 12, marginBottom: 10 }}>
                  <div style={{ fontWeight: 600, color: "var(--gold)", fontSize: 13 }}>{doc.titre}</div>
                  {doc.image_url && <img src={doc.image_url} alt="" style={{ width: "100%", borderRadius: 8, margin: "6px 0", maxHeight: 200, objectFit: "cover" }} onError={e => e.target.style.display="none"} />}
                  {doc.contenu && <p style={{ color: "var(--cream-dim)", fontSize: 12, marginTop: 3, whiteSpace: "pre-wrap" }}>{doc.contenu}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div>
              <input
                className="input"
                placeholder="Code à 8 caractères"
                value={inputs[c.id] || ""}
                onChange={e => setInputs(i => ({ ...i, [c.id]: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && tryOpen(c)}
                style={{ marginBottom: 8 }}
              />
              {errors[c.id] && <div className="alert alert-error" style={{ marginBottom: 8 }}>{errors[c.id]}</div>}
              <button className="btn btn-ghost btn-sm" onClick={() => tryOpen(c)}>
                <Icons.Unlock /> Ouvrir
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// PLAYER SETTINGS
// ============================================================
function PlayerSettings({ player }) {
  const [newCode, setNewCode] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(false);
  const { show, ToastEl } = useToast();

  useEffect(() => {
    supabase.from("coffre_code_requests").select("*").eq("player_id", player.id).eq("status", "pending").limit(1).single()
      .then(({ data }) => setPending(!!data));
  }, [player.id]);

  const submitRequest = async () => {
    if (!newCode.trim()) { show("Entrez un code", "error"); return; }
    if (newCode !== confirmCode) { show("Les codes ne correspondent pas", "error"); return; }
    setLoading(true);
    // Store new code directly (admin can reset later)
    await supabase.from("users").update({ coffre_code: newCode }).eq("id", player.id);
    setNewCode(""); setConfirmCode("");
    show("Code de coffre mis à jour ✓", "success");
    setLoading(false);
  };

  return (
    <div className="fade-in">
      {ToastEl}
      <div className="cinzel gold" style={{ fontSize: 18, marginBottom: 20 }}>⚙ Paramètres</div>
      <div className="card card-gold">
        <div className="label" style={{ marginBottom: 4 }}>🔐 Code du coffre personnel</div>
        <p style={{ color: "var(--cream-dim)", fontSize: 13, marginBottom: 16 }}>
          {player.coffre_code ? "Modifier votre code secret." : "Définissez votre code secret pour accéder à votre coffre."}
        </p>
        <div className="form-group">
          <label className="label">Nouveau code</label>
          <input className="input" type="text" placeholder="Choisissez un code" value={newCode} onChange={e => setNewCode(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="label">Confirmer le code</label>
          <input className="input" type="text" placeholder="Répétez le code" value={confirmCode} onChange={e => setConfirmCode(e.target.value)} />
        </div>
        <button className="btn btn-gold" onClick={submitRequest} disabled={loading}>
          <Icons.Key /> {player.coffre_code ? "Modifier le code" : "Définir le code"}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN - COFFRES TAB
// ============================================================
function AdminCoffres({ toast }) {
  const [coffres, setCoffres] = useState([]);
  const [players, setPlayers] = useState([]);
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [docs, setDocs] = useState({});
  const [triggers, setTriggers] = useState({}); // docId → triggers[]
  const [modal, setModal] = useState(null);
  const [docModal, setDocModal] = useState(null);
  const [indiceModal, setIndiceModal] = useState(null);
  const [triggerModal, setTriggerModal] = useState(null); // { docId, doc }

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: c }, { data: ps }, { data: qs }] = await Promise.all([
      supabase.from("coffres_globaux").select("*").order("created_at"),
      supabase.from("users").select("id, nom, coffre_code, role_murder").order("nom"),
      supabase.from("quests").select("id, titre, type").eq("active", true).order("titre"),
    ]);
    setCoffres(c || []);
    setPlayers(ps || []);
    setQuests(qs || []);
    setLoading(false);
  }, []);

  const loadDocs = async (coffreId) => {
    const { data } = await supabase.from("coffre_documents").select("*").eq("coffre_id", coffreId).order("ordre");
    setDocs(d => ({ ...d, [coffreId]: data || [] }));
    // Charger les triggers pour chaque doc
    for (const doc of data || []) {
      const { data: t } = await supabase.from("quest_triggers").select("*, quests(titre, type), users(nom)").eq("document_id", doc.id);
      setTriggers(tr => ({ ...tr, [doc.id]: t || [] }));
    }
  };

  useEffect(() => { load(); }, [load]);

  const toggleCoffre = (id) => {
    const newVal = !expanded[id];
    setExpanded(e => ({ ...e, [id]: newVal }));
    if (newVal) loadDocs(id);
  };

  const saveCoffre = async (form, id) => {
    if (id) { await supabase.from("coffres_globaux").update(form).eq("id", id); }
    else { await supabase.from("coffres_globaux").insert(form); }
    load(); setModal(null); toast.show("Coffre enregistré ✓", "success");
  };

  const deleteCoffre = async (id) => {
    if (!confirm("Supprimer ce coffre ?")) return;
    await supabase.from("coffres_globaux").delete().eq("id", id);
    load(); toast.show("Coffre supprimé", "success");
  };

  const saveDoc = async (form, coffreId, docId) => {
    if (docId) { await supabase.from("coffre_documents").update(form).eq("id", docId); }
    else { await supabase.from("coffre_documents").insert({ ...form, coffre_id: coffreId }); }
    loadDocs(coffreId); setDocModal(null); toast.show("Document enregistré ✓", "success");
  };

  const deleteDoc = async (docId, coffreId) => {
    if (!confirm("Supprimer ce document ?")) return;
    await supabase.from("coffre_documents").delete().eq("id", docId);
    loadDocs(coffreId); toast.show("Document supprimé", "success");
  };

  const saveTrigger = async (docId, questId, targetPlayerId, coffreId) => {
    await supabase.from("quest_triggers").insert({ document_id: docId, quest_id: questId, target_player_id: targetPlayerId || null });
    loadDocs(coffreId); setTriggerModal(null); toast.show("Déclencheur ajouté ✓", "success");
  };

  const deleteTrigger = async (triggerId, coffreId) => {
    await supabase.from("quest_triggers").delete().eq("id", triggerId);
    loadDocs(coffreId); toast.show("Déclencheur supprimé", "success");
  };

  const saveIndice = async (playerId, contenu) => {
    if (!contenu.trim()) return;
    await supabase.from("coffre_indices").insert({ player_id: playerId, contenu });
    setIndiceModal(null); toast.show("Indice ajouté ✓", "success");
  };

  const resetCoffreCode = async (playerId) => {
    if (!confirm("Réinitialiser le code de ce joueur ?")) return;
    await supabase.from("users").update({ coffre_code: null }).eq("id", playerId);
    load(); toast.show("Code réinitialisé", "success");
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div>
      {/* Coffres personnels */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h2 className="cinzel" style={{ color: "var(--gold)", fontSize: 18 }}>Coffres Personnels</h2>
      </div>
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Joueur</th><th>Code coffre</th><th>Rôle</th><th>Actions</th></tr></thead>
            <tbody>
              {players.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 500 }}>{p.nom}</td>
                  <td><span className="badge badge-muted">{p.coffre_code || "—"}</span></td>
                  <td style={{ fontSize: 12, color: "var(--cream-dim)", maxWidth: 160 }}>{p.role_murder ? p.role_murder.slice(0, 40) + (p.role_murder.length > 40 ? "…" : "") : "—"}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setIndiceModal({ player: p, type: "indice" })}><Icons.Plus /> Indice</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setIndiceModal({ player: p, type: "role" })}><Icons.Edit /> Rôle</button>
                      {p.coffre_code && <button className="btn btn-danger btn-sm" onClick={() => resetCoffreCode(p.id)}><Icons.Key /> Reset code</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coffres globaux */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h2 className="cinzel" style={{ color: "var(--gold)", fontSize: 18 }}>Coffres Globaux</h2>
        <button className="btn btn-primary" onClick={() => setModal({ coffre: null })}>
          <Icons.Plus /> Nouveau coffre
        </button>
      </div>
      {coffres.map(c => (
        <div key={c.id} className="card" style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }} onClick={() => toggleCoffre(c.id)}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>🔒</span>
              <div>
                <div style={{ fontWeight: 600 }}>{c.nom}</div>
                <div style={{ fontSize: 12, color: "var(--cream-dim)" }}>Code : <span style={{ color: "var(--gold)", fontFamily: "monospace" }}>{c.code_8}</span></div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }} onClick={e => e.stopPropagation()}>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal({ coffre: c })}><Icons.Edit /> Modifier</button>
              <button className="btn btn-danger btn-sm" onClick={() => deleteCoffre(c.id)}><Icons.Trash /> Supprimer</button>
            </div>
          </div>
          {expanded[c.id] && (
            <div style={{ marginTop: 14, borderTop: "1px solid var(--border)", paddingTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span className="label" style={{ margin: 0 }}>Documents ({(docs[c.id] || []).length})</span>
                <button className="btn btn-ghost btn-sm" onClick={() => setDocModal({ coffreId: c.id, doc: null })}><Icons.Plus /> Ajouter</button>
              </div>
              {(docs[c.id] || []).map(doc => (
                <div key={doc.id} style={{ background: "var(--bg-deep)", borderRadius: 8, padding: "10px 14px", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "var(--gold)", marginBottom: 3 }}>{doc.titre}</div>
                      {doc.image_url && <img src={doc.image_url} alt="" style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 4, marginBottom: 4 }} onError={e => e.target.style.display="none"} />}
                      {doc.contenu && <div style={{ fontSize: 12, color: "var(--cream-dim)", whiteSpace: "pre-wrap" }}>{doc.contenu.slice(0, 80)}{doc.contenu.length > 80 ? "…" : ""}</div>}
                    </div>
                    <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                      <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setDocModal({ coffreId: c.id, doc })}><Icons.Edit /></button>
                      <button className="btn btn-danger btn-sm btn-icon" onClick={() => deleteDoc(doc.id, c.id)}><Icons.Trash /></button>
                    </div>
                  </div>
                  {/* Déclencheurs liés à ce document */}
                  <div style={{ marginTop: 8, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>⚡ Déclencheurs ({(triggers[doc.id] || []).length})</span>
                      <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, padding: "3px 8px" }} onClick={() => setTriggerModal({ docId: doc.id, doc, coffreId: c.id })}>
                        <Icons.Plus /> Ajouter
                      </button>
                    </div>
                    {(triggers[doc.id] || []).map(t => (
                      <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, fontSize: 12 }}>
                        <span style={{ color: t.quests?.type === "sabotage" ? "#FF3333" : t.quests?.type === "principale" ? "var(--blood-bright)" : "var(--cream-dim)" }}>
                          {t.quests?.type === "sabotage" ? "💀" : t.quests?.type === "principale" ? "⚔" : "📜"} {t.quests?.titre}
                        </span>
                        <span style={{ color: "var(--muted)" }}>→</span>
                        <span style={{ color: "var(--gold)", fontSize: 11 }}>{t.users?.nom || "Tous les joueurs"}</span>
                        <button className="btn btn-danger btn-sm btn-icon" style={{ padding: "2px 5px", marginLeft: "auto" }} onClick={() => deleteTrigger(t.id, c.id)}>
                          <Icons.X />
                        </button>
                      </div>
                    ))}
                    {(triggers[doc.id] || []).length === 0 && <p style={{ fontSize: 11, color: "var(--muted)" }}>Aucun déclencheur</p>}
                  </div>
                </div>
              ))}
              {(docs[c.id] || []).length === 0 && <p style={{ color: "var(--muted)", fontSize: 13 }}>Aucun document dans ce coffre</p>}
            </div>
          )}
        </div>
      ))}
      {coffres.length === 0 && <div className="empty-state"><div className="icon">🗄️</div><p>Aucun coffre créé</p></div>}

      {/* Modal coffre */}
      {modal && (
        <Modal title={modal.coffre ? "Modifier le coffre" : "Nouveau coffre"} onClose={() => setModal(null)}>
          <CoffreForm coffre={modal.coffre} onSave={(f) => saveCoffre(f, modal.coffre?.id)} onClose={() => setModal(null)} />
        </Modal>
      )}

      {/* Modal document */}
      {docModal && (
        <Modal title={docModal.doc ? "Modifier le document" : "Nouveau document"} onClose={() => setDocModal(null)}>
          <DocForm doc={docModal.doc} onSave={(f) => saveDoc(f, docModal.coffreId, docModal.doc?.id)} onClose={() => setDocModal(null)} />
        </Modal>
      )}

      {/* Modal indice / rôle */}
      {indiceModal && (
        <Modal title={indiceModal.type === "role" ? `Rôle de ${indiceModal.player.nom}` : `Indice pour ${indiceModal.player.nom}`} onClose={() => setIndiceModal(null)}>
          {indiceModal.type === "role" ? (
            <RoleForm player={indiceModal.player} onSave={async (role) => {
              await supabase.from("users").update({ role_murder: role }).eq("id", indiceModal.player.id);
              load(); setIndiceModal(null); toast.show("Rôle enregistré ✓", "success");
            }} onClose={() => setIndiceModal(null)} />
          ) : (
            <IndiceForm onSave={(contenu) => saveIndice(indiceModal.player.id, contenu)} onClose={() => setIndiceModal(null)} />
          )}
        </Modal>
      )}

      {/* Modal déclencheur */}
      {triggerModal && (
        <Modal title={`Déclencheur — ${triggerModal.doc.titre}`} onClose={() => setTriggerModal(null)}>
          <TriggerForm quests={quests} players={players} onSave={(questId, targetId) => saveTrigger(triggerModal.docId, questId, targetId, triggerModal.coffreId)} onClose={() => setTriggerModal(null)} />
        </Modal>
      )}
    </div>
  );
}

function CoffreForm({ coffre, onSave, onClose }) {
  const [nom, setNom] = useState(coffre?.nom || "");
  const [code, setCode] = useState(coffre?.code_8 || "");
  const { show, ToastEl } = useToast();
  const save = () => {
    if (!nom.trim() || !code.trim()) { show("Nom et code requis", "error"); return; }
    onSave({ nom, code_8: code });
  };
  return (
    <>
      {ToastEl}
      <div className="form-group"><label className="label">Nom du coffre</label><input className="input" value={nom} onChange={e => setNom(e.target.value)} placeholder="Ex: Coffre de la crypte" /></div>
      <div className="form-group"><label className="label">Code (8 caractères)</label><input className="input" value={code} onChange={e => setCode(e.target.value)} placeholder="Ex: MORT1234" maxLength={20} /></div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}><button className="btn btn-ghost" onClick={onClose}>Annuler</button><button className="btn btn-gold" onClick={save}>Enregistrer</button></div>
    </>
  );
}

function TriggerForm({ quests, players, onSave, onClose }) {
  const [questId, setQuestId] = useState("");
  const [targetId, setTargetId] = useState("");
  const { show, ToastEl } = useToast();
  const save = () => {
    if (!questId) { show("Choisissez une quête", "error"); return; }
    onSave(questId, targetId || null);
  };
  return (
    <>
      {ToastEl}
      <p style={{ fontSize: 13, color: "var(--cream-dim)", marginBottom: 16 }}>
        Quand ce document est découvert, la quête sélectionnée sera automatiquement activée pour le joueur cible (ou pour celui qui trouve le document si aucun cible n'est choisi).
      </p>
      <div className="form-group">
        <label className="label">Quête à activer *</label>
        <select className="input" value={questId} onChange={e => setQuestId(e.target.value)}>
          <option value="">— Choisir une quête —</option>
          {quests.map(q => (
            <option key={q.id} value={q.id}>
              {q.type === "sabotage" ? "💀" : q.type === "principale" ? "⚔" : "📜"} {q.titre}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="label">Joueur cible <span style={{ color: "var(--muted)", fontSize: 11 }}>(vide = activée pour celui qui trouve le document)</span></label>
        <select className="input" value={targetId} onChange={e => setTargetId(e.target.value)}>
          <option value="">— Celui qui trouve le document —</option>
          {players.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
        </select>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
        <button className="btn btn-gold" onClick={save}>Créer le déclencheur</button>
      </div>
    </>
  );
}

function DocForm({ doc, onSave, onClose }) {
  const [titre, setTitre] = useState(doc?.titre || "");
  const [contenu, setContenu] = useState(doc?.contenu || "");
  const [imageUrl, setImageUrl] = useState(doc?.image_url || "");
  const { show, ToastEl } = useToast();
  const save = () => {
    if (!titre.trim()) { show("Titre requis", "error"); return; }
    onSave({ titre, contenu, image_url: imageUrl, ordre: doc?.ordre || 0 });
  };
  return (
    <>
      {ToastEl}
      <div className="form-group"><label className="label">Titre du document</label><input className="input" value={titre} onChange={e => setTitre(e.target.value)} placeholder="Ex: Lettre confidentielle" /></div>
      <div className="form-group"><label className="label">Texte <span style={{color:"var(--muted)",fontSize:11}}>(optionnel)</span></label><textarea className="input" value={contenu} onChange={e => setContenu(e.target.value)} rows={5} placeholder="Contenu du document..." /></div>
      <div className="form-group"><label className="label">Image URL <span style={{color:"var(--muted)",fontSize:11}}>(optionnel)</span></label><input className="input" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." /></div>
      {imageUrl && <img src={imageUrl} alt="aperçu" style={{width:"100%", borderRadius:8, marginBottom:12, maxHeight:200, objectFit:"cover"}} onError={e=>e.target.style.display="none"} />}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}><button className="btn btn-ghost" onClick={onClose}>Annuler</button><button className="btn btn-gold" onClick={save}>Enregistrer</button></div>
    </>
  );
}

function RoleForm({ player, onSave, onClose }) {
  const [role, setRole] = useState(player?.role_murder || "");
  return (
    <>
      <div className="form-group"><label className="label">Rôle dans la Murder Party</label><textarea className="input" value={role} onChange={e => setRole(e.target.value)} rows={6} placeholder="Décrivez le rôle du joueur..." /></div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}><button className="btn btn-ghost" onClick={onClose}>Annuler</button><button className="btn btn-gold" onClick={() => onSave(role)}>Enregistrer</button></div>
    </>
  );
}

function IndiceForm({ onSave, onClose }) {
  const [contenu, setContenu] = useState("");
  return (
    <>
      <div className="form-group"><label className="label">Contenu de l'indice</label><textarea className="input" value={contenu} onChange={e => setContenu(e.target.value)} rows={4} placeholder="Entrez l'indice à ajouter au coffre du joueur..." /></div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}><button className="btn btn-ghost" onClick={onClose}>Annuler</button><button className="btn btn-gold" onClick={() => onSave(contenu)}>Ajouter</button></div>
    </>
  );
}

// ============================================================
// TABLEAU D'INVESTIGATION - VERSION MOBILE FIRST
// ============================================================
const NODE_COLORS = {
  personnage: { bg: "#1A1428", border: "#8B1A1A", accent: "#C42B2B", icon: "👤" },
  lieu:       { bg: "#0F1A14", border: "#2D6A4F", accent: "#52B788", icon: "📍" },
  objet:      { bg: "#1A150A", border: "#8A6F2E", accent: "#C9A84C", icon: "🔎" },
  evenement:  { bg: "#0F0F1A", border: "#4A3A8A", accent: "#9B8EC4", icon: "⚡" },
};

function TableauInvestigation({ player }) {
  const [noeuds, setNoeuds] = useState([]);
  const [liens, setLiens] = useState([]);
  const [unlockedDocs, setUnlockedDocs] = useState(new Set());
  const [fullyDiscoveredPlayers, setFullyDiscoveredPlayers] = useState(new Set());
  const [playersMap, setPlayersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [viewMode, setViewMode] = useState("canvas"); // "canvas" | "list"
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const NODE_W = 110, NODE_H = 64;

  const load = useCallback(async () => {
    const [{ data: n }, { data: l }, { data: rec }, { data: disc }, { data: allUsers }] = await Promise.all([
      supabase.from("tableau_noeuds").select("*"),
      supabase.from("tableau_liens").select("*"),
      supabase.from("coffre_receptions").select("document_id").eq("player_id", player.id),
      supabase.from("discoveries").select("target_player_id, field_type, word_index").eq("investigator_id", player.id),
      supabase.from("users").select("id, nom, titre, surnom, bio"),
    ]);

    setNoeuds(n || []);
    setLiens(l || []);
    setUnlockedDocs(new Set((rec || []).map(r => r.document_id)));

    // Calculer quels joueurs ont TOUS leurs mots cachés découverts
    // On récupère aussi les character_descriptions pour compter les mots cachés
    const { data: descs } = await supabase.from("character_descriptions").select("user_id, texte");

    const countHiddenWords = (text) => {
      if (!text) return 0;
      return (text.match(/%[^%]+%/g) || []).length;
    };

    const fullyDiscovered = new Set();
    (allUsers || []).forEach(u => {
      // Compter tous les mots cachés de ce joueur
      const totalWords =
        countHiddenWords(u.nom) +
        countHiddenWords(u.titre) +
        countHiddenWords(u.surnom) +
        countHiddenWords(u.bio) +
        (descs || []).filter(d => d.user_id === u.id).reduce((acc, d) => acc + countHiddenWords(d.texte), 0);

      if (totalWords === 0) {
        // Pas de mots cachés = visible dès qu'on a au moins une découverte sur ce joueur
        const hasAny = (disc || []).some(d => d.target_player_id === u.id);
        if (hasAny) fullyDiscovered.add(u.id);
      } else {
        // Compter les découvertes pour ce joueur
        const discovered = (disc || []).filter(d => d.target_player_id === u.id).length;
        if (discovered >= totalWords) fullyDiscovered.add(u.id);
      }
    });

    setFullyDiscoveredPlayers(fullyDiscovered);
    // Map id → joueur pour affichage titre
    const pMap = {};
    (allUsers || []).forEach(u => { pMap[u.id] = u; });
    setPlayersMap(pMap);
    setLoading(false);
  }, [player.id]);

  useEffect(() => { load(); }, [load]);

  const isUnlocked = (node) => {
    // Sa propre fiche : toujours visible
    if (node.type === "personnage" && node.player_id === player.id) return true;
    // Autre personnage : visible seulement si toute la fiche a été découverte
    if (node.type === "personnage" && node.player_id) return fullyDiscoveredPlayers.has(node.player_id);
    // Nœud lié à un document : visible si le joueur possède ce document (reçu dans son coffre)
    if (node.document_id) return unlockedDocs.has(node.document_id);
    // Pas de verrou = visible dès le début
    return true;
  };
  const isLienUnlocked = (lien) => !lien.document_id || unlockedDocs.has(lien.document_id);

  const visibleNoeuds = noeuds.filter(isUnlocked);
  const visibleLiens = liens.filter(l => {
    const src = noeuds.find(n => n.id === l.noeud_source);
    const tgt = noeuds.find(n => n.id === l.noeud_cible);
    return src && tgt && isUnlocked(src) && isUnlocked(tgt) && isLienUnlocked(l);
  });

  const getConnections = (nodeId) => visibleLiens.filter(l => l.noeud_source === nodeId || l.noeud_cible === nodeId);

  // Pour un nœud personnage lié à un joueur → affiche le titre du joueur
  // Pour les autres → affiche la description du nœud
  const getNodeSubtitle = (node) => {
    if (node.type === "personnage" && node.player_id && playersMap[node.player_id]) {
      return stripHiddenMarkers(playersMap[node.player_id].titre || "");
    }
    return node.description || "";
  };

  // Pan handlers (read-only canvas)
  const onBgMouseDown = (e) => {
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const onMouseMove = (e) => {
    if (!isPanning) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setPan({ x: clientX - panStart.x, y: clientY - panStart.y });
  };
  const onMouseUp = () => setIsPanning(false);

  if (loading) return <div className="loading">Chargement du tableau...</div>;

  // Vue détail nœud
  if (selectedNode) {
    const c = NODE_COLORS[selectedNode.type] || NODE_COLORS.personnage;
    const connections = getConnections(selectedNode.id);
    return (
      <div className="fade-in">
        <button className="btn btn-ghost btn-sm" onClick={() => setSelectedNode(null)} style={{ marginBottom: 16 }}>← Retour au tableau</button>
        <div style={{ background: c.bg, border: `2px solid ${c.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
          {selectedNode.image_url && <img src={selectedNode.image_url} alt="" style={{ width: "100%", maxHeight: 220, objectFit: "cover" }} onError={e => e.target.style.display = "none"} />}
          <div style={{ padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: c.accent, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{c.icon} {selectedNode.type}</div>
            <div className="cinzel" style={{ fontSize: 22, color: "var(--cream)", marginBottom: getNodeSubtitle(selectedNode) ? 4 : 0 }}>{selectedNode.label}</div>
            {getNodeSubtitle(selectedNode) && <div style={{ fontSize: 14, color: c.accent, fontStyle: "italic" }}>{getNodeSubtitle(selectedNode)}</div>}
          </div>
        </div>
        {connections.length > 0 && (
          <div>
            <div className="cinzel" style={{ color: "var(--gold)", fontSize: 14, marginBottom: 10 }}>🔗 Connexions ({connections.length})</div>
            {connections.map(lien => {
              const isSource = lien.noeud_source === selectedNode.id;
              const otherId = isSource ? lien.noeud_cible : lien.noeud_source;
              const other = noeuds.find(n => n.id === otherId);
              if (!other) return null;
              const oc = NODE_COLORS[other.type] || NODE_COLORS.personnage;
              return (
                <div key={lien.id} onClick={() => setSelectedNode(other)}
                  style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, padding: "12px 14px", background: "var(--bg-card)", border: `1px solid ${lien.couleur || "var(--border)"}`, borderRadius: 10, cursor: "pointer" }}>
                  <div style={{ fontSize: 20, flexShrink: 0, color: lien.couleur || "var(--blood-bright)" }}>{isSource ? "→" : "←"}</div>
                  <div style={{ flex: 1 }}>
                    {lien.label && <div style={{ fontSize: 11, color: lien.couleur || "var(--blood-bright)", fontStyle: "italic", marginBottom: 2 }}>"{lien.label}"</div>}
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{oc.icon} {other.label}</div>
                  </div>
                  <div style={{ color: "var(--muted)", fontSize: 18 }}>›</div>
                </div>
              );
            })}
          </div>
        )}
        {connections.length === 0 && <p style={{ color: "var(--muted)", fontSize: 13, textAlign: "center", padding: 20 }}>Aucune connexion débloquée</p>}
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div className="cinzel gold" style={{ fontSize: 16 }}>🕵️ Tableau d'enquête</div>
          <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
            <span className="badge badge-gold" style={{ fontSize: 11 }}>🔓 {visibleNoeuds.length} révélés</span>
            <span className="badge badge-blood" style={{ fontSize: 11 }}>🔗 {visibleLiens.length} liens</span>
            <span className="badge badge-muted" style={{ fontSize: 11 }}>🔒 {noeuds.length - visibleNoeuds.length} cachés</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button className={`btn btn-sm ${viewMode === "canvas" ? "btn-gold" : "btn-ghost"}`} onClick={() => setViewMode("canvas")}>🗺</button>
          <button className={`btn btn-sm ${viewMode === "list" ? "btn-gold" : "btn-ghost"}`} onClick={() => setViewMode("list")}>📋</button>
        </div>
      </div>

      {/* CANVAS VIEW */}
      {viewMode === "canvas" && (
        <>
          <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>Glissez le fond pour naviguer • Tapez un nœud pour voir le détail</div>
          <div
            ref={containerRef}
            style={{ position: "relative", width: "100%", height: 460, background: "#06060A", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden", cursor: isPanning ? "grabbing" : "grab", userSelect: "none", touchAction: "none" }}
            onMouseDown={onBgMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={e => { setIsPanning(true); setPanStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y }); }}
            onTouchMove={e => { if (!isPanning) return; setPan({ x: e.touches[0].clientX - panStart.x, y: e.touches[0].clientY - panStart.y }); }}
            onTouchEnd={onMouseUp}
          >
            {/* Grille */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
              <defs>
                <pattern id="playergrid" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform={`translate(${pan.x % 40},${pan.y % 40})`}>
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#111118" strokeWidth="0.5" />
                </pattern>
                <marker id="playerarrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="#8B1A1A" />
                </marker>
              </defs>
              <rect width="100%" height="100%" fill="url(#playergrid)" />

              {/* Fils visibles */}
              {visibleLiens.map(lien => {
                const src = noeuds.find(n => n.id === lien.noeud_source);
                const tgt = noeuds.find(n => n.id === lien.noeud_cible);
                if (!src || !tgt) return null;
                const x1 = src.pos_x + pan.x + NODE_W / 2, y1 = src.pos_y + pan.y + NODE_H / 2;
                const x2 = tgt.pos_x + pan.x + NODE_W / 2, y2 = tgt.pos_y + pan.y + NODE_H / 2;
                const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
                const color = lien.couleur || "#8B1A1A";
                return (
                  <g key={lien.id}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" markerEnd="url(#playerarrow)" opacity="0.9" />
                    {lien.label && (
                      <g>
                        <rect x={mx - lien.label.length * 3.5} y={my - 10} width={lien.label.length * 7 + 8} height={18} rx="4" fill="#0D0D14" opacity="0.95" />
                        <text x={mx} y={my + 4} textAnchor="middle" fill={color} fontSize="10" fontFamily="Cinzel, serif">{lien.label}</text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Fils verrouillés — invisibles, on ne les montre pas du tout */}
            </svg>

            {/* Nœuds visibles */}
            {visibleNoeuds.map(node => {
              const c = NODE_COLORS[node.type] || NODE_COLORS.personnage;
              const conns = getConnections(node.id);
              return (
                <div key={node.id}
                  onClick={() => setSelectedNode(node)}
                  style={{ position: "absolute", left: node.pos_x + pan.x, top: node.pos_y + pan.y, width: NODE_W, background: c.bg, border: `2px solid ${c.border}`, borderRadius: 8, padding: "7px 9px", cursor: "pointer", boxShadow: `0 2px 12px rgba(0,0,0,0.5)`, zIndex: 10, transition: "box-shadow 0.2s", userSelect: "none" }}>
                  <div style={{ fontSize: 9, color: c.accent, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>{c.icon} {node.type}</div>
                  {node.image_url && <img src={node.image_url} alt="" style={{ width: "100%", height: 32, objectFit: "cover", borderRadius: 4, marginBottom: 3 }} onError={e => e.target.style.display = "none"} />}
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--cream)", fontFamily: "Cinzel, serif", lineHeight: 1.3, wordBreak: "break-word" }}>{node.label}</div>
                  {getNodeSubtitle(node) && <div style={{ fontSize: 9, color: c.accent, fontStyle: "italic", marginTop: 2, lineHeight: 1.2, wordBreak: "break-word" }}>{getNodeSubtitle(node)}</div>}
                  {conns.length > 0 && <div style={{ fontSize: 9, color: c.accent, marginTop: 3 }}>🔗 {conns.length}</div>}
                </div>
              );
            })}

            {/* Empty state */}
            {noeuds.length === 0 && (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>
                <div className="cinzel" style={{ fontSize: 13 }}>Aucun élément révélé</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Continuez votre enquête !</div>
              </div>
            )}
            {noeuds.length > 0 && visibleNoeuds.length === 0 && (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🔒</div>
                <div className="cinzel" style={{ fontSize: 13 }}>Tableau encore vierge</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Découvrez des indices pour révéler les connexions</div>
              </div>
            )}
          </div>

          {/* Légende */}
          <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
            {Object.entries(NODE_COLORS).map(([type, c]) => (
              <span key={type} style={{ fontSize: 11, color: "var(--cream-dim)", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c.border, display: "inline-block" }} />
                {c.icon} {type}
              </span>
            ))}
          </div>
        </>
      )}

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div>
          {visibleLiens.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div className="cinzel" style={{ color: "var(--blood-bright)", fontSize: 13, marginBottom: 8 }}>🔴 Connexions découvertes</div>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
                {visibleLiens.map((lien, i) => {
                  const src = noeuds.find(n => n.id === lien.noeud_source);
                  const tgt = noeuds.find(n => n.id === lien.noeud_cible);
                  if (!src || !tgt) return null;
                  return (
                    <div key={lien.id} style={{ padding: "10px 14px", borderBottom: i < visibleLiens.length - 1 ? "1px solid var(--border)" : "none", display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: lien.couleur || "#8B1A1A", flexShrink: 0 }} />
                      <div style={{ fontSize: 13, flex: 1 }}>
                        <span style={{ fontWeight: 500 }}>{src.label}</span>
                        {lien.label && <span style={{ color: lien.couleur || "var(--blood-bright)", fontStyle: "italic", margin: "0 6px" }}>"{lien.label}"</span>}
                        <span style={{ fontWeight: 500 }}>{tgt.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {visibleNoeuds.length === 0 && <div className="empty-state"><div className="icon">🔍</div><p>Aucun élément révélé.<br />Continuez votre enquête !</p></div>}
          {visibleNoeuds.map(node => {
            const c = NODE_COLORS[node.type] || NODE_COLORS.personnage;
            const connections = getConnections(node.id);
            return (
              <div key={node.id} onClick={() => setSelectedNode(node)}
                style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, marginBottom: 10, overflow: "hidden", cursor: "pointer" }}>
                <div style={{ display: "flex", gap: 12, padding: "12px 14px", alignItems: "center" }}>
                  {node.image_url
                    ? <img src={node.image_url} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} onError={e => e.target.style.display = "none"} />
                    : <div style={{ width: 48, height: 48, borderRadius: 8, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{c.icon}</div>
                  }
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: c.accent, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>{c.icon} {node.type}</div>
                    <div className="cinzel" style={{ fontSize: 14, color: "var(--cream)", fontWeight: 600 }}>{node.label}</div>
                    {getNodeSubtitle(node) && <div style={{ fontSize: 12, color: c.accent, fontStyle: "italic" }}>{getNodeSubtitle(node)}</div>}
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    {connections.length > 0 && <span className="badge" style={{ background: `${c.border}33`, color: c.accent, border: `1px solid ${c.border}`, fontSize: 11 }}>🔗 {connections.length}</span>}
                    <span style={{ color: "var(--muted)", fontSize: 18, marginLeft: 4 }}>›</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AdminTableau({ toast }) {
  const [noeuds, setNoeuds] = useState([]);
  const [liens, setLiens] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [lienModal, setLienModal] = useState(null);
  const [view, setView] = useState("canvas");
  const [positions, setPositions] = useState({});
  const [dragging, setDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState(null);
  const containerRef = useRef(null);
  const NODE_W = 130, NODE_H = 68;

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: n }, { data: l }, { data: d }, { data: ps }] = await Promise.all([
      supabase.from("tableau_noeuds").select("*").order("created_at"),
      supabase.from("tableau_liens").select("*"),
      supabase.from("coffre_documents").select("id, titre").order("titre"),
      supabase.from("users").select("id, nom").order("nom"),
    ]);
    setNoeuds(n || []);
    setLiens(l || []);
    setDocuments(d || []);
    setPlayers(ps || []);
    const posMap = {};
    (n || []).forEach(node => { posMap[node.id] = { x: node.pos_x, y: node.pos_y }; });
    setPositions(posMap);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const savePos = async (nodeId, x, y) => {
    await supabase.from("tableau_noeuds").update({ pos_x: x, pos_y: y }).eq("id", nodeId);
  };

  const onNodeMouseDown = (e, node) => {
    e.stopPropagation();
    setDragging(node.id);
    setSelectedNode(node);
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const pos = positions[node.id] || { x: node.pos_x, y: node.pos_y };
    setDragOffset({ x: clientX - rect.left - pan.x - pos.x, y: clientY - rect.top - pan.y - pos.y });
  };

  const onMouseMove = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (dragging) {
      const x = Math.max(0, clientX - rect.left - pan.x - dragOffset.x);
      const y = Math.max(0, clientY - rect.top - pan.y - dragOffset.y);
      setPositions(p => ({ ...p, [dragging]: { x, y } }));
    } else if (isPanning) {
      setPan({ x: clientX - panStart.x, y: clientY - panStart.y });
    }
  };

  const onMouseUp = async () => {
    if (dragging) {
      const pos = positions[dragging];
      if (pos) await savePos(dragging, pos.x, pos.y);
      setDragging(null);
    }
    setIsPanning(false);
  };

  const onBgMouseDown = (e) => {
    if (e.target === e.currentTarget || e.target.tagName === "svg") {
      setSelectedNode(null);
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const saveNoeud = async (form, id) => {
    if (id) { await supabase.from("tableau_noeuds").update(form).eq("id", id); }
    else { await supabase.from("tableau_noeuds").insert({ ...form, pos_x: 80 + Math.random() * 400, pos_y: 80 + Math.random() * 300 }); }
    load(); setModal(null); toast.show("Nœud enregistré ✓", "success");
  };

  const deleteNoeud = async (id) => {
    if (!confirm("Supprimer ce nœud ?")) return;
    await supabase.from("tableau_noeuds").delete().eq("id", id);
    load(); toast.show("Nœud supprimé", "success");
  };

  const saveLien = async (form, id) => {
    if (id) { await supabase.from("tableau_liens").update(form).eq("id", id); }
    else { await supabase.from("tableau_liens").insert(form); }
    load(); setLienModal(null); toast.show("Lien enregistré ✓", "success");
  };

  const deleteLien = async (id) => {
    if (!confirm("Supprimer ce lien ?")) return;
    await supabase.from("tableau_liens").delete().eq("id", id);
    load(); toast.show("Lien supprimé", "success");
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <h2 className="cinzel" style={{ color: "var(--gold)", fontSize: 18 }}>Tableau d'enquête</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className={`btn btn-sm ${view === "canvas" ? "btn-gold" : "btn-ghost"}`} onClick={() => setView("canvas")}>🗺 Canvas</button>
          <button className={`btn btn-sm ${view === "list" ? "btn-gold" : "btn-ghost"}`} onClick={() => setView("list")}>📋 Liste</button>
          <button className="btn btn-primary btn-sm" onClick={() => setModal({ noeud: null })}><Icons.Plus /> Nœud</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setLienModal({ lien: null })} disabled={noeuds.length < 2}><Icons.Plus /> Lien</button>
        </div>
      </div>

      {view === "canvas" && (
        <>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>Glissez les nœuds pour les positionner. Position sauvegardée automatiquement. 🔒 = verrouillé par document.</div>
          <div
            ref={containerRef}
            style={{ position: "relative", width: "100%", height: 520, background: "#06060A", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden", cursor: isPanning ? "grabbing" : "grab", userSelect: "none" }}
            onMouseDown={onBgMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchMove={e => { e.preventDefault(); onMouseMove(e); }}
            onTouchEnd={onMouseUp}
          >
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
              <defs>
                <pattern id="admingrid" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform={`translate(${pan.x % 40},${pan.y % 40})`}>
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1A1A28" strokeWidth="0.5" />
                </pattern>
                <marker id="admarrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="#8B1A1A" />
                </marker>
              </defs>
              <rect width="100%" height="100%" fill="url(#admingrid)" />
              {liens.map(lien => {
                const src = noeuds.find(n => n.id === lien.noeud_source);
                const tgt = noeuds.find(n => n.id === lien.noeud_cible);
                if (!src || !tgt) return null;
                const sp = positions[src.id] || { x: src.pos_x, y: src.pos_y };
                const tp = positions[tgt.id] || { x: tgt.pos_x, y: tgt.pos_y };
                const x1 = sp.x + pan.x + NODE_W / 2, y1 = sp.y + pan.y + NODE_H / 2;
                const x2 = tp.x + pan.x + NODE_W / 2, y2 = tp.y + pan.y + NODE_H / 2;
                const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
                const color = lien.couleur || "#8B1A1A";
                return (
                  <g key={lien.id}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.5" strokeDasharray={lien.document_id ? "6,3" : "none"} markerEnd="url(#admarrow)" opacity="0.85" />
                    {lien.label && (
                      <g>
                        <rect x={mx - lien.label.length * 3.5} y={my - 10} width={lien.label.length * 7 + 8} height={18} rx="4" fill="#0D0D14" opacity="0.95" />
                        <text x={mx} y={my + 4} textAnchor="middle" fill={color} fontSize="10" fontFamily="Cinzel, serif">{lien.label}</text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
            {noeuds.map(node => {
              const pos = positions[node.id] || { x: node.pos_x, y: node.pos_y };
              const c = NODE_COLORS[node.type] || NODE_COLORS.personnage;
              const isDraggingThis = dragging === node.id;
              const isSelected = selectedNode?.id === node.id;
              return (
                <div key={node.id}
                  onMouseDown={e => onNodeMouseDown(e, node)}
                  onTouchStart={e => { e.preventDefault(); onNodeMouseDown(e, node); }}
                  style={{ position: "absolute", left: pos.x + pan.x, top: pos.y + pan.y, width: NODE_W, background: c.bg, border: `2px solid ${isSelected ? "var(--gold)" : c.border}`, borderRadius: 8, padding: "7px 10px", cursor: isDraggingThis ? "grabbing" : "grab", boxShadow: isSelected ? `0 0 14px ${c.border}99` : "0 2px 8px rgba(0,0,0,0.5)", zIndex: isDraggingThis ? 100 : isSelected ? 50 : 10, transition: isDraggingThis ? "none" : "box-shadow 0.2s" }}>
                  <div style={{ fontSize: 9, color: c.accent, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>{c.icon} {node.type}{(node.document_id || (node.type === "personnage" && node.player_id)) ? " 🔒" : ""}</div>
                  {node.image_url && <img src={node.image_url} alt="" style={{ width: "100%", height: 30, objectFit: "cover", borderRadius: 4, marginBottom: 3 }} onError={e => e.target.style.display = "none"} />}
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--cream)", fontFamily: "Cinzel, serif", lineHeight: 1.3, wordBreak: "break-word" }}>{node.label}</div>
                </div>
              );
            })}
          </div>
          {selectedNode && (
            <div className="card" style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{NODE_COLORS[selectedNode.type]?.icon} {selectedNode.label}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => { setModal({ noeud: selectedNode }); setSelectedNode(null); }}><Icons.Edit /> Modifier</button>
              <button className="btn btn-danger btn-sm" onClick={() => { deleteNoeud(selectedNode.id); setSelectedNode(null); }}><Icons.Trash /> Supprimer</button>
            </div>
          )}
        </>
      )}

      {view === "list" && (
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="label" style={{ marginBottom: 10 }}>Nœuds ({noeuds.length})</div>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Nœud</th><th>Type</th><th>Déverr.</th><th>Actions</th></tr></thead>
                <tbody>
                  {noeuds.map(n => (
                    <tr key={n.id}>
                      <td style={{ fontWeight: 500 }}>{n.label}</td>
                      <td><span style={{ fontSize: 12 }}>{NODE_COLORS[n.type]?.icon} {n.type}</span></td>
                      <td style={{ fontSize: 12, color: (n.document_id || n.player_id) ? "var(--gold)" : "var(--muted)" }}>
                        {n.type === "personnage" && n.player_id ? "Via enquête joueur" : n.document_id ? (documents.find(d => d.id === n.document_id)?.titre || "Doc lié") : "Dès le début"}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setModal({ noeud: n })}><Icons.Edit /></button>
                          <button className="btn btn-danger btn-sm btn-icon" onClick={() => deleteNoeud(n.id)}><Icons.Trash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {noeuds.length === 0 && <div className="empty-state"><div className="icon">🔍</div><p>Aucun nœud</p></div>}
            </div>
          </div>
          <div className="card">
            <div className="label" style={{ marginBottom: 10 }}>Liens ({liens.length})</div>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Source → Cible</th><th>Label</th><th>Déverr.</th><th>Actions</th></tr></thead>
                <tbody>
                  {liens.map(l => {
                    const src = noeuds.find(n => n.id === l.noeud_source);
                    const tgt = noeuds.find(n => n.id === l.noeud_cible);
                    return (
                      <tr key={l.id}>
                        <td style={{ fontSize: 12 }}>{src?.label || "?"} → {tgt?.label || "?"}</td>
                        <td style={{ fontSize: 12, color: l.couleur || "var(--blood-bright)", fontStyle: "italic" }}>{l.label || "—"}</td>
                        <td style={{ fontSize: 12, color: l.document_id ? "var(--gold)" : "var(--muted)" }}>{l.document_id ? (documents.find(d => d.id === l.document_id)?.titre || "Doc") : "Dès le début"}</td>
                        <td>
                          <div style={{ display: "flex", gap: 4 }}>
                            <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setLienModal({ lien: l })}><Icons.Edit /></button>
                            <button className="btn btn-danger btn-sm btn-icon" onClick={() => deleteLien(l.id)}><Icons.Trash /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {liens.length === 0 && <div className="empty-state"><div className="icon">🕸️</div><p>Aucun lien</p></div>}
            </div>
          </div>
        </div>
      )}

      {modal && (
        <Modal title={modal.noeud ? "Modifier le nœud" : "Nouveau nœud"} onClose={() => setModal(null)}>
          <NoeudForm noeud={modal.noeud} documents={documents} players={players} onSave={(f) => saveNoeud(f, modal.noeud?.id)} onClose={() => setModal(null)} />
        </Modal>
      )}
      {lienModal && (
        <Modal title={lienModal.lien ? "Modifier le lien" : "Nouveau lien"} onClose={() => setLienModal(null)}>
          <LienForm lien={lienModal.lien} noeuds={noeuds} documents={documents} onSave={(f) => saveLien(f, lienModal.lien?.id)} onClose={() => setLienModal(null)} />
        </Modal>
      )}
    </div>
  );
}
function NoeudForm({ noeud, documents, players, onSave, onClose }) {
  const [form, setForm] = useState({
    label: noeud?.label || "",
    type: noeud?.type || "personnage",
    description: noeud?.description || "",
    image_url: noeud?.image_url || "",
    pos_x: noeud?.pos_x || 200,
    pos_y: noeud?.pos_y || 200,
    document_id: noeud?.document_id || null,
    player_id: noeud?.player_id || null,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const { show, ToastEl } = useToast();
  const save = () => {
    if (!form.label.trim()) { show("Label requis", "error"); return; }
    onSave({ ...form, document_id: form.document_id || null, player_id: form.player_id || null });
  };
  return (
    <>
      {ToastEl}
      <div className="form-row">
        <div className="form-group" style={{ flex: 2 }}><label className="label">Label *</label><input className="input" value={form.label} onChange={e => set("label", e.target.value)} placeholder="Ex: Jérémy" /></div>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="label">Type</label>
          <select className="input" value={form.type} onChange={e => set("type", e.target.value)}>
            <option value="personnage">👤 Personnage</option>
            <option value="lieu">📍 Lieu</option>
            <option value="objet">🔎 Objet</option>
            <option value="evenement">⚡ Événement</option>
          </select>
        </div>
      </div>
      {form.type === "personnage" && players?.length > 0 && (
        <div className="form-group">
          <label className="label">Joueur associé <span style={{ color: "var(--gold)", fontSize: 11 }}>— Se déverrouille quand ce joueur est investigué</span></label>
          <select className="input" value={form.player_id || ""} onChange={e => set("player_id", e.target.value || null)}>
            <option value="">— Aucun joueur associé —</option>
            {players.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
          </select>
        </div>
      )}
      <div className="form-group"><label className="label">Description</label><textarea className="input" value={form.description} onChange={e => set("description", e.target.value)} rows={2} placeholder="Détails..." /></div>
      <div className="form-group"><label className="label">Image URL</label><input className="input" value={form.image_url} onChange={e => set("image_url", e.target.value)} placeholder="https://..." /></div>
      {!form.player_id && (
        <div className="form-group">
          <label className="label">Déverrouillé par document <span style={{ color: "var(--muted)", fontSize: 11 }}>(optionnel — vide = visible dès le début)</span></label>
          <select className="input" value={form.document_id || ""} onChange={e => set("document_id", e.target.value || null)}>
            <option value="">— Visible dès le début —</option>
            {documents.map(d => <option key={d.id} value={d.id}>{d.titre}</option>)}
          </select>
        </div>
      )}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}><button className="btn btn-ghost" onClick={onClose}>Annuler</button><button className="btn btn-gold" onClick={save}>Enregistrer</button></div>
    </>
  );
}

function LienForm({ lien, noeuds, documents, onSave, onClose }) {
  const [form, setForm] = useState({
    noeud_source: lien?.noeud_source || "",
    noeud_cible: lien?.noeud_cible || "",
    label: lien?.label || "",
    couleur: lien?.couleur || "#8B1A1A",
    document_id: lien?.document_id || null,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const { show, ToastEl } = useToast();
  const save = () => {
    if (!form.noeud_source || !form.noeud_cible) { show("Source et cible requises", "error"); return; }
    if (form.noeud_source === form.noeud_cible) { show("Source et cible doivent être différentes", "error"); return; }
    onSave({ ...form, document_id: form.document_id || null });
  };
  const COLORS = ["#8B1A1A", "#2D6A4F", "#8A6F2E", "#4A3A8A", "#1A5A8A", "#8A2D6A"];
  return (
    <>
      {ToastEl}
      <div className="form-group">
        <label className="label">Nœud source</label>
        <select className="input" value={form.noeud_source} onChange={e => set("noeud_source", e.target.value)}>
          <option value="">— Choisir —</option>
          {noeuds.map(n => <option key={n.id} value={n.id}>{NODE_COLORS[n.type]?.icon} {n.label}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="label">Relation (label du fil)</label>
        <input className="input" value={form.label} onChange={e => set("label", e.target.value)} placeholder="Ex: a engagé, a tué, possède..." />
      </div>
      <div className="form-group">
        <label className="label">Nœud cible</label>
        <select className="input" value={form.noeud_cible} onChange={e => set("noeud_cible", e.target.value)}>
          <option value="">— Choisir —</option>
          {noeuds.filter(n => n.id !== form.noeud_source).map(n => <option key={n.id} value={n.id}>{NODE_COLORS[n.type]?.icon} {n.label}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="label">Couleur du fil</label>
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          {COLORS.map(c => (
            <div key={c} onClick={() => set("couleur", c)} style={{ width: 24, height: 24, borderRadius: "50%", background: c, cursor: "pointer", border: form.couleur === c ? "2px solid white" : "2px solid transparent" }} />
          ))}
          <input type="color" value={form.couleur} onChange={e => set("couleur", e.target.value)} style={{ width: 24, height: 24, borderRadius: "50%", border: "none", cursor: "pointer", padding: 0 }} />
        </div>
      </div>
      <div className="form-group">
        <label className="label">Déverrouillé par <span style={{ color: "var(--muted)", fontSize: 11 }}>(optionnel)</span></label>
        <select className="input" value={form.document_id || ""} onChange={e => set("document_id", e.target.value || null)}>
          <option value="">— Visible dès le début —</option>
          {documents.map(d => <option key={d.id} value={d.id}>{d.titre}</option>)}
        </select>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}><button className="btn btn-ghost" onClick={onClose}>Annuler</button><button className="btn btn-gold" onClick={save}>Enregistrer</button></div>
    </>
  );
}



function PlayerDashboard({ player: initialPlayer, onLogout }) {
  const [tab, setTab] = useState("profile");
  const [player, setPlayer] = useState(initialPlayer);
  const [settings, setSettings] = useState({ allow_self_investigation: true });

  useEffect(() => {
    supabase.from("settings").select("*").limit(1).single().then(({ data }) => data && setSettings(data));
    const channel = supabase.channel(`player-${player.id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "users", filter: `id=eq.${player.id}` }, ({ new: updated }) => {
        setPlayer(p => ({ ...p, ...updated }));
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [player.id]);

  const tabs = [
    { id: "profile", label: "Profil", icon: <Icons.User /> },
    { id: "coffre", label: "Coffre", icon: <Icons.Lock /> },
    { id: "coffres", label: "Coffres", icon: <Icons.Key /> },
    { id: "tableau", label: "Tableau", icon: <Icons.Sword /> },
    { id: "quests", label: "Quêtes", icon: <Icons.Scroll /> },
    { id: "leaderboard", label: "Classement", icon: <Icons.Trophy /> },
    { id: "investigate", label: "Enquêter", icon: <Icons.Search /> },
    { id: "settings_player", label: "Réglages", icon: <Icons.Settings /> },
  ];

  return (
    <div className="app">
      <div className="page">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingTop: 8 }}>
          <span className="cinzel title-flicker" style={{ color: "var(--gold)", fontSize: 18, fontWeight: 700 }}>☠ Murder Party</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="badge badge-gold">⚔ {player.points}</span>
            <button className="btn btn-ghost btn-sm" onClick={onLogout} title="Déconnexion"><Icons.Logout /> Quitter</button>
          </div>
        </div>
        {tab === "profile" && <PlayerProfile player={player} />}
        {tab === "coffre" && <CoffrePersonnel player={player} />}
        {tab === "coffres" && <CoffresGlobaux player={player} />}
        {tab === "tableau" && <TableauInvestigation player={player} />}
        {tab === "quests" && <PlayerQuests player={player} />}
        {tab === "leaderboard" && <Leaderboard currentPlayerId={player.id} />}
        {tab === "investigate" && <PlayerInvestigate player={player} allowSelf={settings.allow_self_investigation} />}
        {tab === "settings_player" && <PlayerSettings player={player} />}
      </div>
      <nav className="bottom-nav">
        {tabs.map(t => (
          <button key={t.id} className={`nav-item ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

// ============================================================
// LOGIN SCREEN (Player)
// ============================================================
function PlayerLogin({ onLogin }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (code.length !== 4) { setError("Entrez un code à 4 chiffres"); return; }
    setLoading(true);
    setError("");
    const { data, error: e } = await supabase.from("users").select("*").eq("code_4_chiffres", code).single();
    if (e || !data) {
      setError("Code invalide. Réessayez.");
      setLoading(false);
      return;
    }
    onLogin(data);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, background: "var(--bg-void)" }}>
      {/* Atmospheric background */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "20%", left: "10%", width: 300, height: 300, background: "radial-gradient(circle, rgba(139,26,26,0.06) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "10%", width: 200, height: 200, background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)", borderRadius: "50%" }} />
      </div>
      <div style={{ position: "relative", textAlign: "center", maxWidth: 360, width: "100%" }}>
        <div style={{ fontSize: 60, marginBottom: 8 }}>☠</div>
        <h1 className="cinzel-deco title-flicker" style={{ fontSize: 28, color: "var(--gold)", marginBottom: 6, lineHeight: 1.2 }}>
          Murder Party
        </h1>
        <p className="cinzel" style={{ color: "var(--cream-dim)", fontSize: 13, letterSpacing: 3, marginBottom: 40, textTransform: "uppercase" }}>
          Entrez dans la nuit
        </p>
        <div className="card card-glow" style={{ padding: 32 }}>
          <label className="label" style={{ marginBottom: 12 }}>Votre code secret</label>
          <input
            className="input input-lg"
            type="tel"
            inputMode="numeric"
            maxLength={4}
            placeholder="• • • •"
            value={code}
            onChange={e => { setCode(e.target.value.replace(/\D/g, "")); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            autoFocus
          />
          {error && <div className="alert alert-error" style={{ marginTop: 12 }}>{error}</div>}
          <button className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: 20 }} onClick={handleLogin} disabled={loading || code.length !== 4}>
            {loading ? "Vérification..." : "Entrer ⚔"}
          </button>
        </div>
        <button
          style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 12, cursor: "pointer", marginTop: 24 }}
          onClick={() => window.location.href = "?admin=1"}
        >
          Administration →
        </button>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN LOGIN
// ============================================================
function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const { data } = await supabase.from("settings").select("admin_password").limit(1).single();
    if (data?.admin_password === password) {
      onLogin();
    } else {
      setError("Mot de passe incorrect");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 340, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🛡</div>
        <h1 className="cinzel" style={{ color: "var(--gold)", fontSize: 22, marginBottom: 28 }}>Administration</h1>
        <div className="card">
          <label className="label">Mot de passe admin</label>
          <input
            className="input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            autoFocus
            style={{ marginBottom: 12 }}
          />
          {error && <div className="alert alert-error" style={{ marginBottom: 12 }}>{error}</div>}
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleLogin} disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </div>
        <button
          style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 12, cursor: "pointer", marginTop: 20 }}
          onClick={() => window.location.href = window.location.pathname}
        >
          ← Retour joueur
        </button>
      </div>
    </div>
  );
}

// ============================================================
// ROOT APP
// ============================================================
export default function App() {
  const isAdmin = window.location.search.includes("admin=1");
  const [adminLoggedIn, setAdminLoggedIn] = useState(() => sessionStorage.getItem("admin_auth") === "1");
  const [player, setPlayer] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("player") || "null"); } catch { return null; }
  });

  const loginAdmin = () => {
    sessionStorage.setItem("admin_auth", "1");
    setAdminLoggedIn(true);
  };

  const logoutAdmin = () => {
    sessionStorage.removeItem("admin_auth");
    setAdminLoggedIn(false);
    window.location.href = window.location.pathname;
  };

  const loginPlayer = (p) => {
    sessionStorage.setItem("player", JSON.stringify(p));
    setPlayer(p);
  };

  const logoutPlayer = () => {
    sessionStorage.removeItem("player");
    setPlayer(null);
  };

  if (isAdmin) {
    return (
      <>
        <StyleInjector />
        {adminLoggedIn ? <AdminDashboard onLogout={logoutAdmin} /> : <AdminLogin onLogin={loginAdmin} />}
      </>
    );
  }

  return (
    <>
      <StyleInjector />
      {player ? <PlayerDashboard player={player} onLogout={logoutPlayer} /> : <PlayerLogin onLogin={loginPlayer} />}
    </>
  );
}
