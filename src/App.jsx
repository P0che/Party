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
const SUPABASE_ANON_KEY = "sb_publishable_hPkru9firLUJku9d6JcDmA_BBCaqgwH";

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

  html, body, #root { height: 100%; }

  body {
    background: var(--bg-void);
    color: var(--cream);
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
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
    display: flex; align-items: center; justify-content: center;
    z-index: 200; padding: 20px;
  }
  .modal {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 24px; max-width: 500px;
    width: 100%; max-height: 90vh; overflow-y: auto;
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
        return (
          <input
            key={i}
            className={`hidden-input ${shaking[part.index] ? "error" : ""}`}
            placeholder="_ _ _ _"
            value={inputValues[part.index] || ""}
            onChange={e => setInputValues(v => ({ ...v, [part.index]: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && handleSubmit(part.index, part.value)}
            onBlur={() => handleSubmit(part.index, part.value)}
            style={{ borderColor: errors[part.index] ? "var(--danger-bright)" : undefined }}
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
function QuestForm({ quest, onSave, onClose }) {
  const [form, setForm] = useState({
    titre: quest?.titre || "",
    description: quest?.description || "",
    type: quest?.type || "secondaire",
    active: quest?.active ?? true,
  });
  const [loading, setLoading] = useState(false);
  const { show, ToastEl } = useToast();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.titre.trim()) { show("Le titre est requis", "error"); return; }
    setLoading(true);
    try {
      if (quest?.id) {
        await supabase.from("quests").update(form).eq("id", quest.id);
      } else {
        await supabase.from("quests").insert(form);
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
                        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setModal({ type: "edit", player: p })} title="Modifier">
                          <Icons.Edit />
                        </button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => deletePlayer(p.id)} title="Supprimer">
                          <Icons.Trash />
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
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("quests").select("*").order("created_at", { ascending: false });
    setQuests(data || []);
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
                      <span className={`badge ${q.type === "principale" ? "badge-blood" : "badge-muted"}`}>
                        {q.type === "principale" ? "⚔ Principale" : "📜 Secondaire"}
                      </span>
                    </td>
                    <td>
                      <label className="toggle" style={{ display: "inline-block" }}>
                        <input type="checkbox" checked={q.active} onChange={() => toggle(q)} />
                        <span className="toggle-slider" />
                      </label>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setModal({ type: "edit", quest: q })}><Icons.Edit /></button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => deleteQuest(q.id)}><Icons.Trash /></button>
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
          <QuestForm quest={modal.quest} onSave={() => { setModal(null); load(); toast.show("Quête enregistrée ✓", "success"); }} onClose={() => setModal(null)} />
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
      const pts = val.quests.type === "principale" ? 10 : 5;
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
                      <span className={`badge ${v.quests?.type === "principale" ? "badge-blood" : "badge-muted"}`} style={{ marginLeft: 8, fontSize: 11 }}>
                        {v.quests?.type === "principale" ? "+10" : "+5"} pts
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
        <button className="btn btn-ghost btn-sm" onClick={onLogout}><Icons.Logout /> Déconnexion</button>
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
        {tab === "settings" && <AdminSettings toast={toast} />}
      </div>
    </div>
  );
}

// ============================================================
// PLAYER - PROFILE TAB
// ============================================================
function PlayerProfile({ player }) {
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
        <div className="card card-gold">
          <div className="label">Biographie</div>
          <p style={{ color: "var(--cream-dim)", lineHeight: 1.7 }}>{stripHiddenMarkers(player.bio)}</p>
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
  const [loading, setLoading] = useState(true);
  const { show, ToastEl } = useToast();

  const load = useCallback(async () => {
    const [{ data: q }, { data: v }] = await Promise.all([
      supabase.from("quests").select("*").eq("active", true).order("type"),
      supabase.from("quest_validations").select("*").eq("player_id", player.id),
    ]);
    setQuests(q || []);
    setValidations(v || []);
    setLoading(false);
  }, [player.id]);

  useEffect(() => { load(); }, [load]);

  const getStatus = (questId) => validations.find(v => v.quest_id === questId)?.status || null;

  const requestValidation = async (questId) => {
    const { error } = await supabase.from("quest_validations").insert({ player_id: player.id, quest_id: questId, status: "pending" });
    if (error) {
      show("Déjà envoyé ou erreur", "error");
    } else {
      show("Demande envoyée ✓", "success");
      load();
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;

  const principales = quests.filter(q => q.type === "principale");
  const secondaires = quests.filter(q => q.type === "secondaire");

  const QuestList = ({ list, label }) => (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span className="cinzel" style={{ color: "var(--gold)", fontSize: 15 }}>{label}</span>
        <span className="badge badge-muted">{list.length}</span>
      </div>
      {list.length === 0 && <p style={{ color: "var(--muted)", fontSize: 13 }}>Aucune quête disponible</p>}
      {list.map(q => {
        const status = getStatus(q.id);
        return (
          <div key={q.id} className="quest-card">
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{q.titre}</div>
              {q.description && <div style={{ fontSize: 13, color: "var(--cream-dim)" }}>{q.description}</div>}
            </div>
            <div style={{ flexShrink: 0 }}>
              {status === "approved" && <span className="badge badge-success">✅ Validée</span>}
              {status === "rejected" && <span className="badge badge-blood">✗ Refusée</span>}
              {status === "pending" && <span className="badge badge-pending">⏳ En attente</span>}
              {!status && (
                <button className="btn btn-ghost btn-sm" onClick={() => requestValidation(q.id)}>
                  Valider
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="fade-in">
      {ToastEl}
      <QuestList list={principales} label="⚔ Quêtes Principales" />
      <QuestList list={secondaires} label="📜 Quêtes Secondaires" />
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
    const { data } = await supabase.from("users").select("id, nom, points, photo, titre").order("points", { ascending: false });
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
            {p.titre && <div style={{ fontSize: 12, color: "var(--cream-dim)" }}>{stripHiddenMarkers(p.titre)}</div>}
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

  const renderField = (text, fieldType, targetId, label) => {
    if (!text) return null;
    const hasHidden = hasHiddenWords(text);
    return (
      <div style={{ marginBottom: 10 }}>
        <div className="label">{label}</div>
        <div style={{ fontSize: 14, lineHeight: 1.8 }}>
          {hasHidden ? (
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
        return (
          <div key={p.id} className="investigate-card">
            <div className="investigate-header" onClick={() => setExpanded(e => ({ ...e, [p.id]: !e[p.id] }))}>
              <Avatar url={p.photo} name={p.nom} size={44} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>
                  <InvestigateText text={p.nom} fieldType="nom" targetPlayerId={p.id} investigatorId={player.id} discoveries={discoveries} onDiscover={handleDiscover} />
                </div>
                {p.titre && (
                  <div style={{ fontSize: 13, color: "var(--gold)", marginTop: 2 }}>
                    <InvestigateText text={p.titre} fieldType="titre" targetPlayerId={p.id} investigatorId={player.id} discoveries={discoveries} onDiscover={handleDiscover} />
                  </div>
                )}
              </div>
              <div style={{ color: "var(--muted)" }}>{isExpanded ? <Icons.ChevronUp /> : <Icons.ChevronDown />}</div>
            </div>
            {isExpanded && (
              <div className="investigate-body fade-in">
                {renderField(p.surnom, "surnom", p.id, "Surnom")}
                {renderField(p.bio, "bio", p.id, "Biographie")}
                {descs.map((d, idx) => renderField(d.texte, `description_${idx}`, p.id, `Description ${idx + 1}`))}
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
// PLAYER DASHBOARD
// ============================================================
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
    { id: "quests", label: "Quêtes", icon: <Icons.Scroll /> },
    { id: "leaderboard", label: "Classement", icon: <Icons.Trophy /> },
    { id: "investigate", label: "Enquêter", icon: <Icons.Search /> },
  ];

  return (
    <div className="app">
      <div className="page">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingTop: 8 }}>
          <span className="cinzel title-flicker" style={{ color: "var(--gold)", fontSize: 18, fontWeight: 700 }}>☠ Murder Party</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="badge badge-gold">⚔ {player.points}</span>
            <button className="btn btn-ghost btn-sm btn-icon" onClick={onLogout} title="Déconnexion"><Icons.Logout /></button>
          </div>
        </div>
        {tab === "profile" && <PlayerProfile player={player} />}
        {tab === "quests" && <PlayerQuests player={player} />}
        {tab === "leaderboard" && <Leaderboard currentPlayerId={player.id} />}
        {tab === "investigate" && <PlayerInvestigate player={player} allowSelf={settings.allow_self_investigation} />}
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
