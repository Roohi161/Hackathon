import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  FileText,
  Edit3,
  PenTool,
  Type,
  Palette,
  Lock,
  Globe,
  Users,
  Eraser,
  Heading,
  X,
  Plus,
  Pen,
  Pencil,
  Highlighter,
  ShieldAlert,
  Save
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export interface NoteItem {
  id: string;
  title: string;
  author: string;
  authorEmail: string;
  teamName: string;
  content: string; // Typed notes content
  handwrittenDataUrl?: string; // Saved Canvas image data URL for handwritten notes
  isPublic: boolean; // Public visibility to team members
  fontFamily: 'Inter' | 'Sora' | 'Courier New';
  headingSize: 'h1' | 'h2' | 'p';
  penColor: string;
  highlightColor: string;
  drawingTool: 'pencil' | 'pen' | 'marker' | 'eraser';
  updatedAt: string;
}

export const LearningCenterView: React.FC = () => {
  const currentUser = useAuthStore((s) => s.user);
  const currentUserEmail = (currentUser?.email || 'participant@hackathon.com').toLowerCase();

  // Initial Notes State initialized dynamically & persisted per user email in localStorage
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const storageKey = `hc_notes_store_${currentUserEmail}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore parse errors
    }

    const defaultNotes: NoteItem[] = [
      {
        id: 'n-1',
        title: 'AI Pipeline Architecture & Vector Embedding Notes',
        author: 'Roohi',
        authorEmail: 'roohi@hackathon.com',
        teamName: 'Alpha Coders',
        content: 'Key Architecture Decision:\n1. We are using pgvector in PostgreSQL for 1536-dim embeddings.\n2. Cosine similarity threshold set to 0.82 for RAG retrieval.\n3. FastAPI server handles background task queue.\n\nCheck spelling on algorithm terms: "Asynchronous", "Cosine", "Embeddings".',
        isPublic: true,
        fontFamily: 'Sora',
        headingSize: 'h1',
        penColor: '#4f46e5',
        highlightColor: '#fef08a',
        drawingTool: 'pen',
        updatedAt: 'Aug 03, 2026 at 10:30 AM'
      },
      {
        id: 'n-2',
        title: 'Frontend UI Styling & Design Tokens Checklist',
        author: 'Bhavya',
        authorEmail: 'bhavya@hackathon.com',
        teamName: 'Alpha Coders',
        content: 'UI Principles:\n- Light Theme background: #f8fafc\n- Header font: Google Sora\n- Body font: Inter & Plus Jakarta Sans\n- Primary Accent: Indigo 600 (#4f46e5)\n- Responsive grid padding: p-6 on desktop, p-4 on mobile.',
        isPublic: true,
        fontFamily: 'Inter',
        headingSize: 'h2',
        penColor: '#059669',
        highlightColor: '#bbf7d0',
        drawingTool: 'marker',
        updatedAt: 'Aug 03, 2026 at 01:15 PM'
      },
      {
        id: 'n-3',
        title: `${currentUser?.name || 'Participant'}'s Personal Scratchpad`,
        author: currentUser?.name || 'Participant User',
        authorEmail: currentUserEmail,
        teamName: 'Alpha Coders',
        content: 'My Personal Notes: Start typing or writing your personal brainstorming notes here...',
        isPublic: false,
        fontFamily: 'Courier New',
        headingSize: 'p',
        penColor: '#d97706',
        highlightColor: '#fed7aa',
        drawingTool: 'pencil',
        updatedAt: 'Aug 03, 2026 at 03:00 PM'
      }
    ];

    if (currentUserEmail !== 'participant@hackathon.com' && currentUserEmail !== 'roohi@hackathon.com') {
      return [
        {
          id: `n-${Date.now()}`,
          title: `Welcome ${currentUser?.name || 'Participant'} - Personal Notes`,
          author: currentUser?.name || 'Participant User',
          authorEmail: currentUserEmail,
          teamName: `${currentUser?.name || 'Participant'}'s Squad`,
          content: 'Welcome! This is your private workspace. Use the top Pen Icon to write or draw notes.',
          isPublic: false,
          fontFamily: 'Inter',
          headingSize: 'p',
          penColor: '#4f46e5',
          highlightColor: '#fef08a',
          drawingTool: 'pen',
          updatedAt: 'Just now'
        }
      ];
    }

    return defaultNotes;
  });

  // Save notes to localStorage whenever modified
  useEffect(() => {
    const storageKey = `hc_notes_store_${currentUserEmail}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(notes));
    } catch {
      // Ignore quota errors
    }
  }, [notes, currentUserEmail]);

  // Selected Team Filter to View Team Notes
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('Alpha Coders');

  // Currently Active Selected Note
  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0].id);
  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  // Read-Only Permissions Check: Only Owner (Author Email) Can Modify! Public Viewers get Read-Only
  const isOwnerOfActiveNote = activeNote.authorEmail.toLowerCase() === currentUserEmail;

  // Editor Toggle: Hidden by default until top Pen Icon is clicked!
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);

  // Note Editor Mode: 'type' or 'draw'
  const [editorMode, setEditorMode] = useState<'type' | 'draw'>('draw');

  // Drawing Tools: 'pencil' (1.5px), 'pen' (3.5px), 'marker' (12px translucent), 'eraser' (stroke eraser 20px white)
  const [drawingTool, setDrawingTool] = useState<'pencil' | 'pen' | 'marker' | 'eraser'>('pen');

  // Note Formatting Tool States
  const [selectedFont, setSelectedFont] = useState<'Inter' | 'Sora' | 'Courier New'>(activeNote.fontFamily);
  const [selectedHeading, setSelectedHeading] = useState<'h1' | 'h2' | 'p'>(activeNote.headingSize);
  const [selectedPenColor, setSelectedPenColor] = useState<string>('#4f46e5');
  const [selectedHighlight, setSelectedHighlight] = useState<string>('#fef08a');
  const [noteTextContent, setNoteTextContent] = useState<string>(activeNote.content);
  const [isNotePublic, setIsNotePublic] = useState<boolean>(activeNote.isPublic);

  // Available Colors & Fonts
  const PEN_COLORS = ['#4f46e5', '#059669', '#d97706', '#dc2626', '#0284c7', '#000000'];
  const HIGHLIGHT_COLORS = ['transparent', '#fef08a', '#bbf7d0', '#fed7aa', '#bae6fd', '#fbcfe8'];

  // Handwriting Canvas Setup
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize Clean White Plain Board Canvas
  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth - 32;
      canvas.height = 360;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Fill clean solid white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load saved image data if present for this note
    if (activeNote.handwrittenDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = activeNote.handwrittenDataUrl;
    }
  };

  useEffect(() => {
    // Sync editor state when activeNoteId changes
    const current = notes.find(n => n.id === activeNoteId);
    if (current) {
      setNoteTextContent(current.content);
      setSelectedFont(current.fontFamily);
      setSelectedHeading(current.headingSize);
      setSelectedPenColor(current.penColor);
      setSelectedHighlight(current.highlightColor);
      setDrawingTool(current.drawingTool || 'pen');
      setIsNotePublic(current.isPublic);
    }
    if (isEditorOpen && editorMode === 'draw') {
      setTimeout(initializeCanvas, 100);
    }
  }, [activeNoteId, isEditorOpen, editorMode]);

  // Handle Canvas Handwriting Pointer & Touch Events (Only Enabled for Owner!)
  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isOwnerOfActiveNote) return; // Strict Read-Only protection for non-owners!

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);

    if (drawingTool === 'eraser') {
      ctx.strokeStyle = '#ffffff'; // White eraser stroke
      ctx.lineWidth = 24;
      ctx.globalAlpha = 1.0;
    } else {
      ctx.strokeStyle = selectedPenColor;
      if (drawingTool === 'pencil') {
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.85;
      } else if (drawingTool === 'pen') {
        ctx.lineWidth = 3.5;
        ctx.globalAlpha = 1.0;
      } else if (drawingTool === 'marker') {
        ctx.lineWidth = 12;
        ctx.globalAlpha = 0.45;
      }
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isOwnerOfActiveNote) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoordinates(e);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing || !isOwnerOfActiveNote) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    setNotes(notes.map(n => n.id === activeNoteId ? { ...n, handwrittenDataUrl: dataUrl } : n));
  };

  const clearCanvas = () => {
    if (!isOwnerOfActiveNote) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    setNotes(notes.map(n => n.id === activeNoteId ? { ...n, handwrittenDataUrl: undefined } : n));
  };

  // Create New Note
  const handleCreateNewNote = () => {
    const newNote: NoteItem = {
      id: `n-${Date.now()}`,
      title: 'Untitled Hackathon Note',
      author: currentUser?.name || 'Participant User',
      authorEmail: currentUserEmail,
      teamName: selectedTeamFilter,
      content: 'Type your team notes here...',
      isPublic: true,
      fontFamily: 'Inter',
      headingSize: 'p',
      penColor: '#4f46e5',
      highlightColor: '#fef08a',
      drawingTool: 'pen',
      updatedAt: 'Just now'
    };

    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setIsEditorOpen(true); // Open editor immediately when creating new note
  };

  // SAVE NOTE MODIFICATIONS (ALLOW OWNER TO MODIFY AFTER SAVING CONTINUOUSLY)
  const handleSaveNote = () => {
    if (!isOwnerOfActiveNote) {
      alert('🔒 Access Denied: You are viewing a public team note. Only the owner can modify changes!');
      return;
    }

    let currentDataUrl = activeNote.handwrittenDataUrl;
    if (canvasRef.current && editorMode === 'draw') {
      currentDataUrl = canvasRef.current.toDataURL();
    }

    const updatedNotes = notes.map(n => {
      if (n.id === activeNoteId) {
        return {
          ...n,
          content: noteTextContent,
          fontFamily: selectedFont,
          headingSize: selectedHeading,
          penColor: selectedPenColor,
          highlightColor: selectedHighlight,
          drawingTool: drawingTool,
          handwrittenDataUrl: currentDataUrl,
          isPublic: isNotePublic,
          updatedAt: 'Aug 03, 2026 at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return n;
    });

    setNotes(updatedNotes);
    alert('✅ Note saved successfully! As owner, you can modify it anytime by clicking Edit Note.');
  };

  // Filter notes visible to selected team
  const visibleTeamNotes = notes.filter(n =>
    n.teamName === selectedTeamFilter && (n.isPublic || n.authorEmail.toLowerCase() === currentUserEmail)
  );

  return (
    <div className="space-y-6 animate-fadeIn relative z-10 pb-20">
      
      {/* TOP HEADER & PEN ICON EDITOR TRIGGER */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-2xs">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight font-heading">Team & Personal Notes</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Clean Workspace
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal mt-0.5">Click the top Pen Icon to edit. Owners can modify saved notes anytime. Eraser tool included.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Team Notes Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
              <Users className="w-4 h-4 text-indigo-600 ml-1" />
              <select
                value={selectedTeamFilter}
                onChange={(e) => setSelectedTeamFilter(e.target.value)}
                className="px-2 py-1 text-xs font-semibold rounded-xl bg-transparent text-slate-900 outline-none cursor-pointer"
              >
                <option value="Alpha Coders">Team: Alpha Coders</option>
                <option value="Quantum Innovators">Team: Quantum Innovators</option>
                <option value="HealthTech Pioneers">Team: HealthTech Pioneers</option>
              </select>
            </div>

            {/* TOP PEN ICON BUTTON THAT OPENS THE EDITOR CANVAS */}
            <button
              onClick={() => setIsEditorOpen(!isEditorOpen)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                isEditorOpen
                  ? 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
              title="Click Pen Icon to Open Note Writing Canvas"
            >
              <Pen className="w-4 h-4 text-amber-300" />
              <span>{isEditorOpen ? 'Close Note Canvas' : 'Open Note Canvas (Pen Icon)'}</span>
            </button>

            <button
              onClick={handleCreateNewNote}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create New Note
            </button>
          </div>
        </div>
      </div>

      {/* CLEAN & NEAT 2-COLUMN LAYOUT: LEFT = NOTES CARDS | RIGHT = WHITE PLAIN BOARD NOTE DISPLAY / EDITOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT 1 COL: CLEAN TEAM NOTES LIST */}
        <div className="lg:col-span-1 p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-600" /> {selectedTeamFilter} Notes
            </h3>
            <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 font-mono">
              {visibleTeamNotes.length} Saved
            </span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {visibleTeamNotes.map((n) => {
              const isSelected = n.id === activeNoteId;
              const isOwner = n.authorEmail.toLowerCase() === currentUserEmail;

              return (
                <div
                  key={n.id}
                  onClick={() => {
                    setActiveNoteId(n.id);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-indigo-50/90 border-indigo-300 shadow-2xs'
                      : 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 line-clamp-1">{n.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold flex items-center gap-1 ${
                      n.isPublic ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {n.isPublic ? <Globe className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                      {n.isPublic ? (isOwner ? 'Public (Owner Edit)' : 'Public (Read-Only)') : 'Private'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed font-normal">
                    {n.content}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1.5 border-t border-slate-200/60">
                    <span>By: <strong>{n.author}</strong></span>
                    <span className="text-[9px]">{n.updatedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT 2 COLS: WHITE PLAIN BOARD NOTE DISPLAY & EDITOR */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. READ-ONLY WHITE PLAIN BOARD NOTE DISPLAY (BESIDE THE NOTES) */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 font-heading">{activeNote.title}</h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    isOwnerOfActiveNote ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {isOwnerOfActiveNote ? 'Owner (Can Modify Anytime)' : 'Read-Only (Public Note)'}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  Author: <strong>{activeNote.author}</strong> ({activeNote.authorEmail}) • Updated: {activeNote.updatedAt}
                </span>
              </div>

              {isOwnerOfActiveNote ? (
                <button
                  onClick={() => setIsEditorOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Modify Note
                </button>
              ) : (
                <div className="flex items-center gap-1 text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                  <ShieldAlert className="w-4 h-4 text-amber-600" /> Read-Only Mode
                </div>
              )}
            </div>

            {/* Clean Note Content Display */}
            <div
              className={`p-5 rounded-2xl border border-slate-200/80 bg-white space-y-3 ${
                activeNote.fontFamily === 'Sora' ? 'font-heading font-bold' : activeNote.fontFamily === 'Courier New' ? 'font-mono' : 'font-sans'
              }`}
              style={{ backgroundColor: activeNote.highlightColor !== 'transparent' ? activeNote.highlightColor : '#ffffff' }}
            >
              <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed font-normal">
                {activeNote.content}
              </p>

              {/* Render Saved Handwritten Drawing Image if exists */}
              {activeNote.handwrittenDataUrl && (
                <div className="pt-3 border-t border-slate-200/80 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Handwritten Drawing Canvas:</span>
                  <img src={activeNote.handwrittenDataUrl} alt="Handwritten notes" className="w-full h-auto max-h-72 rounded-xl border border-slate-200 bg-white" />
                </div>
              )}
            </div>
          </div>

          {/* 2. EDITOR CANVAS (ONLY OPENS WHEN TOP PEN ICON IS CLICKED OR OWNER CLICKS MODIFY) */}
          {isEditorOpen && (
            <div className="p-6 rounded-3xl bg-white border border-indigo-200 shadow-md space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Pen className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    {isOwnerOfActiveNote ? 'Note Canvas & Editor (Modify Anytime)' : 'Read-Only Viewer (Owner Only Can Modify)'}
                  </h3>
                </div>

                <button onClick={() => setIsEditorOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!isOwnerOfActiveNote ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldAlert className="w-4 h-4 text-amber-600" /> Read-Only Mode Enforced
                  </div>
                  <p>You are viewing <strong>{activeNote.author}'s</strong> public note. Only the original author can edit or modify the contents.</p>
                </div>
              ) : (
                <>
                  {/* Note Editing Controls */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    
                    {/* Pencil, Pen, Marker, ERASER Selector */}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-200/60 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          <PenTool className="w-4 h-4 text-indigo-600" /> Drawing & Eraser Instrument:
                        </span>
                        
                        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200">
                          <button
                            onClick={() => setDrawingTool('pencil')}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                              drawingTool === 'pencil' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <Pencil className="w-3.5 h-3.5" /> Pencil (1.5px)
                          </button>

                          <button
                            onClick={() => setDrawingTool('pen')}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                              drawingTool === 'pen' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <Pen className="w-3.5 h-3.5" /> Pen (3.5px)
                          </button>

                          <button
                            onClick={() => setDrawingTool('marker')}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                              drawingTool === 'marker' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <Highlighter className="w-3.5 h-3.5" /> Marker (12px)
                          </button>

                          {/* ERASER TOOL BUTTON */}
                          <button
                            onClick={() => setDrawingTool('eraser')}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                              drawingTool === 'eraser' ? 'bg-red-600 text-white shadow-2xs' : 'text-red-700 bg-red-50 hover:bg-red-100 border border-red-200'
                            }`}
                          >
                            <Eraser className="w-3.5 h-3.5" /> Stroke Eraser 🧹
                          </button>
                        </div>
                      </div>

                      {/* 3 Fonts Selector */}
                      <div className="flex items-center gap-1.5">
                        <Type className="w-3.5 h-3.5 text-slate-500" />
                        <span className="font-semibold text-slate-700">3 Fonts:</span>
                        <select
                          value={selectedFont}
                          onChange={(e: any) => setSelectedFont(e.target.value)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-800 outline-none cursor-pointer"
                        >
                          <option value="Inter">Inter (Clean Modern)</option>
                          <option value="Sora">Sora (Premium Headings)</option>
                          <option value="Courier New">Courier New (Monospace Code)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                      
                      {/* Headings Selector */}
                      <div className="flex items-center gap-1.5">
                        <Heading className="w-3.5 h-3.5 text-slate-500" />
                        <span className="font-semibold text-slate-700">Heading Size:</span>
                        <select
                          value={selectedHeading}
                          onChange={(e: any) => setSelectedHeading(e.target.value)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-800 outline-none cursor-pointer"
                        >
                          <option value="h1">Heading 1 (Large)</option>
                          <option value="h2">Heading 2 (Medium)</option>
                          <option value="p">Paragraph (Body)</option>
                        </select>
                      </div>

                      {/* Pen Colors Palette */}
                      <div className="flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-slate-500" />
                        <span className="font-semibold text-slate-700">Colors:</span>
                        <div className="flex items-center gap-1">
                          {PEN_COLORS.map((c) => (
                            <button
                              key={c}
                              onClick={() => setSelectedPenColor(c)}
                              className={`w-5 h-5 rounded-full border-2 transition-transform cursor-pointer ${
                                selectedPenColor === c ? 'scale-110 border-slate-900 ring-2 ring-indigo-500' : 'border-white'
                              }`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Highlighting Colors */}
                      <div className="flex items-center gap-1.5">
                        <Highlighter className="w-3.5 h-3.5 text-slate-500" />
                        <span className="font-semibold text-slate-700">Highlight:</span>
                        <div className="flex items-center gap-1">
                          {HIGHLIGHT_COLORS.map((hc, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedHighlight(hc)}
                              className={`w-5 h-5 rounded-md border transition-transform cursor-pointer ${
                                selectedHighlight === hc ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-slate-300'
                              }`}
                              style={{ backgroundColor: hc === 'transparent' ? '#ffffff' : hc }}
                              title={hc === 'transparent' ? 'No Highlight' : 'Highlight'}
                            />
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Mode Selector: Handwritten White Board vs Typing */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
                      <button
                        onClick={() => setEditorMode('draw')}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                          editorMode === 'draw' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600'
                        }`}
                      >
                        <PenTool className="w-3.5 h-3.5" /> Handwritten White Board
                      </button>
                      <button
                        onClick={() => setEditorMode('type')}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                          editorMode === 'type' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600'
                        }`}
                      >
                        <Type className="w-3.5 h-3.5" /> Typing Text
                      </button>
                    </div>

                    <button
                      onClick={() => setIsNotePublic(!isNotePublic)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                        isNotePublic ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {isNotePublic ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      {isNotePublic ? 'Public to Team' : 'Private Only'}
                    </button>
                  </div>

                  {/* EDITOR CONTENT AREA */}
                  {editorMode === 'draw' ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-600 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100">
                        <span className="font-semibold flex items-center gap-1.5">
                          <PenTool className="w-4 h-4 text-indigo-600" /> Tool Active: <strong className="uppercase font-bold text-indigo-900">{drawingTool}</strong> {drawingTool === 'eraser' ? '(Erasing Strokes)' : `in color (${selectedPenColor})`}
                        </span>
                        <button
                          onClick={clearCanvas}
                          className="px-2.5 py-1 text-[11px] font-semibold text-red-600 bg-white hover:bg-red-50 rounded-lg border border-red-200 cursor-pointer flex items-center gap-1 shadow-2xs"
                        >
                          <Eraser className="w-3.5 h-3.5 text-red-500" /> Clear Entire Canvas
                        </button>
                      </div>

                      {/* Clean Solid White Canvas */}
                      <div className="p-2 rounded-2xl border-2 border-indigo-200 bg-white shadow-inner">
                        <canvas
                          ref={canvasRef}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          onTouchStart={startDrawing}
                          onTouchMove={draw}
                          onTouchEnd={stopDrawing}
                          className="w-full h-80 rounded-xl bg-white cursor-crosshair touch-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <textarea
                      rows={10}
                      value={noteTextContent}
                      onChange={(e) => setNoteTextContent(e.target.value)}
                      className={`w-full p-4 rounded-2xl border border-slate-200 text-slate-900 outline-none focus:border-indigo-500 transition-all ${
                        selectedFont === 'Sora' ? 'font-heading font-bold' : selectedFont === 'Courier New' ? 'font-mono' : 'font-sans'
                      } ${
                        selectedHeading === 'h1' ? 'text-lg leading-relaxed' : selectedHeading === 'h2' ? 'text-base leading-relaxed' : 'text-xs leading-relaxed'
                      }`}
                      style={{ backgroundColor: selectedHighlight !== 'transparent' ? selectedHighlight : '#ffffff', color: selectedPenColor }}
                    />
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditorOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-100"
                    >
                      Close Editor
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveNote}
                      className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl cursor-pointer shadow-md flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" /> Save Note Modifications
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
