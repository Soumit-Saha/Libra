import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Upload, FileText, Image, BookOpen, Trash2, Edit3,
  CheckCircle, AlertCircle, ArrowLeft, Eye, Download,
  Grid, Plus, X, Shield
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLibrary } from '../context/LibraryContext'
import { Book } from '../data/books'

const CATEGORIES = [
  'Classic Fiction', 'Science Fiction', 'Mystery', 'Romance', 'Adventure',
  'Horror', 'Gothic Fiction', 'Gothic Horror', 'Dystopian', 'Fantasy',
  'Psychological Fiction', 'Non-Fiction', 'Biography', 'History', 'Self-Help',
  'Technology', 'Philosophy', 'Poetry', 'Drama', 'Other'
];

interface UploadedFile {
  name: string;
  size: number;
  dataUrl: string;   // base64 data URL stored in localStorage
  type: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

// ─── File → base64 dataURL ────────────────────────────────────────────────────
const readFileAsDataURL = (file: File): Promise<string> =>
  new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result as string);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

export default function AdminPage() {
  const { user, isAdmin, logout } = useAuth();
  const { uploadedBooks, addUploadedBook, removeUploadedBook } = useLibrary();
  const navigate = useNavigate();

  // ── Form state ──────────────────────────────────────────────────────────────
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [pages, setPages] = useState('');

  const [pdfFile, setPdfFile] = useState<UploadedFile | null>(null);
  const [coverFile, setCoverFile] = useState<UploadedFile | null>(null);

  const [pdfDragging, setPdfDragging] = useState(false);
  const [coverDragging, setCoverDragging] = useState(false);

  const [publishing, setPublishing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'manage'>('upload');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Guard: non-admins are bounced immediately
  useEffect(() => {
    if (!isAdmin) navigate('/dashboard', { replace: true });
  }, [isAdmin]);

  // ── Toast helpers ────────────────────────────────────────────────────────────
  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  // ── File handlers ────────────────────────────────────────────────────────────
  const handlePdfDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setPdfDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { addToast('Please drop a PDF file', 'error'); return; }
    if (file.size > 50 * 1024 * 1024) { addToast('PDF must be under 50 MB', 'error'); return; }
    try {
      const dataUrl = await readFileAsDataURL(file);
      setPdfFile({ name: file.name, size: file.size, dataUrl, type: file.type });
      setErrors(p => ({ ...p, pdf: '' }));
      addToast('PDF loaded successfully', 'success');
    } catch { addToast('Failed to read PDF', 'error'); }
  }, []);

  const handleCoverDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setCoverDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { addToast('Please drop an image file', 'error'); return; }
    if (file.size > 5 * 1024 * 1024) { addToast('Cover image must be under 5 MB', 'error'); return; }
    try {
      const dataUrl = await readFileAsDataURL(file);
      setCoverFile({ name: file.name, size: file.size, dataUrl, type: file.type });
      setErrors(p => ({ ...p, cover: '' }));
      addToast('Cover image loaded', 'success');
    } catch { addToast('Failed to read image', 'error'); }
  }, []);

  const handlePdfInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) { addToast('PDF must be under 50 MB', 'error'); return; }
    try {
      const dataUrl = await readFileAsDataURL(file);
      setPdfFile({ name: file.name, size: file.size, dataUrl, type: file.type });
      setErrors(p => ({ ...p, pdf: '' }));
      addToast('PDF loaded successfully', 'success');
    } catch { addToast('Failed to read PDF', 'error'); }
  };

  const handleCoverInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { addToast('Cover image must be under 5 MB', 'error'); return; }
    try {
      const dataUrl = await readFileAsDataURL(file);
      setCoverFile({ name: file.name, size: file.size, dataUrl, type: file.type });
      setErrors(p => ({ ...p, cover: '' }));
    } catch { addToast('Failed to read image', 'error'); }
  };

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Title is required';
    if (!author.trim()) e.author = 'Author is required';
    if (!category) e.category = 'Please select a category';
    if (!pdfFile) e.pdf = 'A PDF file is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Publish ──────────────────────────────────────────────────────────────────
  const handlePublish = async () => {
    if (!validate()) { addToast('Please fill all required fields', 'error'); return; }
    setPublishing(true);
    await new Promise(r => setTimeout(r, 1200)); // simulate processing

    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
    if (tagList.length === 0) tagList.push(category);

    const book: Book = {
      id: `uploaded_${Date.now()}`,
      title: title.trim(),
      author: author.trim(),
      coverImageURL: coverFile?.dataUrl ?? '',
      pdf_filePath: pdfFile!.dataUrl,   // base64 data URL — direct download works
      genre: category,
      year: parseInt(year) || new Date().getFullYear(),
      pages: parseInt(pages) || 0,
      rating: 4.0,
      description: description.trim() || `${title} by ${author}.`,
      tags: tagList,
      new: true,
    };

    try {
      addUploadedBook(book);
      addToast(`"${book.title}" published successfully!`, 'success');
      // Reset form
      setTitle(''); setAuthor(''); setCategory(''); setDescription('');
      setTags(''); setYear(new Date().getFullYear().toString()); setPages('');
      setPdfFile(null); setCoverFile(null);
      setErrors({});
      setActiveTab('manage');
    } catch (err) {
      addToast('Failed to publish book. Storage may be full.', 'error');
    } finally {
      setPublishing(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
  const handleDelete = (id: string) => {
    removeUploadedBook(id);
    setDeleteConfirm(null);
    addToast('Book removed from library', 'info');
  };

  if (!isAdmin) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      {/* Background orbs */}
      <div className="orb" style={{ width: 500, height: 500, background: 'rgba(99,102,241,0.06)', top: '-100px', right: '-100px' }} />
      <div className="orb" style={{ width: 350, height: 350, background: 'rgba(239,68,68,0.03)', bottom: '50px', left: '-50px' }} />

      {/* ── Toast notifications ── */}
      <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {toasts.map(t => (
          <div key={t.id} className="animate-fade-in-up" style={{
            padding: '12px 18px', borderRadius: 12, minWidth: 280, maxWidth: 380,
            display: 'flex', alignItems: 'center', gap: 10,
            background: t.type === 'success' ? 'rgba(16,185,129,0.15)' : t.type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(99,102,241,0.15)',
            border: `1px solid ${t.type === 'success' ? 'rgba(16,185,129,0.3)' : t.type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(99,102,241,0.3)'}`,
            backdropFilter: 'blur(16px)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 500,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}>
            {t.type === 'success' ? <CheckCircle size={16} color="#10b981" /> : t.type === 'error' ? <AlertCircle size={16} color="#ef4444" /> : <BookOpen size={16} color="#818cf8" />}
            {t.message}
          </div>
        ))}
      </div>

      {/* ── Top nav bar ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,10,20,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(99,102,241,0.15)',
        padding: '0 32px', height: 64,
        display: 'flex', alignItems: 'center', gap: 16
      }}>
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 14 }}>
          <ArrowLeft size={16} /> Back to Library
        </Link>
        <div style={{ flex: 1 }} />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 14px', borderRadius: 10,
          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)'
        }}>
          <Shield size={14} color="var(--indigo-400)" />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--indigo-300)' }}>Admin Dashboard</span>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700, color: 'white'
        }}>A</div>
        <button onClick={logout} style={{
          padding: '6px 12px', background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8,
          color: '#fca5a5', fontSize: 13, cursor: 'pointer'
        }}>Sign out</button>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,3vw,32px)' }}>

        {/* ── Page header ── */}
        <div className="animate-fade-in-up" style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(99,102,241,0.35)'
            }}>
              <Shield size={22} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.4px' }}>
                Admin <span className="gradient-text">Control Panel</span>
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Manage the library collection · Logged in as {user?.name}</p>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="animate-fade-in-up stagger-1" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 12, marginBottom: 36
        }}>
          {[
            { label: 'Uploaded Books', value: uploadedBooks.length, icon: <BookOpen size={18} />, color: '#6366f1' },
            { label: 'Total Library', value: uploadedBooks.length + 12, icon: <Grid size={18} />, color: '#10b981' },
            { label: 'Admin Access', value: 'Active', icon: <Shield size={18} />, color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 16, padding: '18px 20px',
              display: 'flex', alignItems: 'center', gap: 12
            }}>
              <div style={{ color: s.color, opacity: 0.8 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 4, width: 'fit-content' }}>
          {[
            { key: 'upload', label: 'Upload New Book', icon: <Plus size={15} /> },
            { key: 'manage', label: `Manage (${uploadedBooks.length})`, icon: <Edit3 size={15} /> },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 18px', borderRadius: 9,
              background: activeTab === tab.key ? 'rgba(99,102,241,0.2)' : 'transparent',
              border: activeTab === tab.key ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
              color: activeTab === tab.key ? 'var(--indigo-300)' : 'var(--text-muted)',
              fontSize: 14, fontWeight: activeTab === tab.key ? 600 : 400, cursor: 'pointer'
            }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════
            UPLOAD TAB
        ══════════════════════════════════════════════════ */}
        {activeTab === 'upload' && (
          <div className="animate-fade-in-up">
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 24 }}>

              {/* Left column — dropzones + metadata */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* PDF Drop Zone */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.08em', marginBottom: 10 }}>
                    PDF FILE <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div
                    onDragOver={e => { e.preventDefault(); setPdfDragging(true); }}
                    onDragLeave={() => setPdfDragging(false)}
                    onDrop={handlePdfDrop}
                    onClick={() => !pdfFile && pdfInputRef.current?.click()}
                    style={{
                      border: `2px dashed ${errors.pdf ? 'rgba(239,68,68,0.5)' : pdfDragging ? 'rgba(99,102,241,0.7)' : 'rgba(99,102,241,0.25)'}`,
                      borderRadius: 16, padding: '28px 20px', textAlign: 'center',
                      background: pdfDragging ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.03)',
                      cursor: pdfFile ? 'default' : 'pointer',
                      transition: 'all 0.2s', position: 'relative',
                      minHeight: 140
                    }}
                  >
                    {pdfFile ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                          background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <FileText size={22} color="#f87171" />
                        </div>
                        <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pdfFile.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{formatBytes(pdfFile.size)}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5 }}>
                            <CheckCircle size={13} color="#10b981" />
                            <span style={{ fontSize: 12, color: '#10b981' }}>Ready to publish</span>
                          </div>
                        </div>
                        <button onClick={e => { e.stopPropagation(); setPdfFile(null); }} style={{
                          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                          borderRadius: 8, padding: '6px', cursor: 'pointer', color: '#f87171', flexShrink: 0
                        }}>
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div style={{
                          width: 52, height: 52, borderRadius: 14, margin: '0 auto 12px',
                          background: pdfDragging ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.08)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}>
                          <Upload size={22} color="var(--indigo-400)" />
                        </div>
                        <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>
                          {pdfDragging ? 'Drop your PDF here' : 'Drag & drop PDF here'}
                        </p>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>
                          or click to browse — max 50 MB
                        </p>
                        <span style={{
                          padding: '5px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                          background: 'rgba(99,102,241,0.12)', color: 'var(--indigo-300)',
                          border: '1px solid rgba(99,102,241,0.2)'
                        }}>Browse files</span>
                      </>
                    )}
                    <input ref={pdfInputRef} type="file" accept=".pdf,application/pdf" onChange={handlePdfInput}
                      style={{ display: 'none' }} />
                  </div>
                  {errors.pdf && <p style={{ color: '#fca5a5', fontSize: 12, marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}><AlertCircle size={12} />{errors.pdf}</p>}
                </div>

                {/* Cover Image Drop Zone */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.08em', marginBottom: 10 }}>
                    COVER IMAGE <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
                  </label>
                  <div
                    onDragOver={e => { e.preventDefault(); setCoverDragging(true); }}
                    onDragLeave={() => setCoverDragging(false)}
                    onDrop={handleCoverDrop}
                    onClick={() => !coverFile && coverInputRef.current?.click()}
                    style={{
                      border: `2px dashed ${coverDragging ? 'rgba(99,102,241,0.7)' : 'rgba(99,102,241,0.2)'}`,
                      borderRadius: 16,
                      background: coverDragging ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.02)',
                      cursor: coverFile ? 'default' : 'pointer',
                      transition: 'all 0.2s', overflow: 'hidden',
                      minHeight: 120
                    }}
                  >
                    {coverFile ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px' }}>
                        <img src={coverFile.dataUrl} alt="cover preview" style={{
                          width: 56, height: 80, objectFit: 'cover', borderRadius: 8,
                          border: '1px solid rgba(99,102,241,0.2)', flexShrink: 0
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{coverFile.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{formatBytes(coverFile.size)}</div>
                        </div>
                        <button onClick={e => { e.stopPropagation(); setCoverFile(null); }} style={{
                          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                          borderRadius: 8, padding: '6px', cursor: 'pointer', color: '#f87171', flexShrink: 0
                        }}>
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ padding: '24px 20px', textAlign: 'center' }}>
                        <Image size={24} color="var(--indigo-400)" style={{ opacity: 0.6, marginBottom: 10 }} />
                        <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                          {coverDragging ? 'Drop image here' : 'Drag & drop cover art'}
                        </p>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>PNG, JPG, WEBP — max 5 MB</p>
                      </div>
                    )}
                    <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverInput} style={{ display: 'none' }} />
                  </div>
                </div>

                {/* Metadata fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Title */}
                  <Field label="Book Title" required error={errors.title}>
                    <input value={title} onChange={e => { setTitle(e.target.value); setErrors(p => ({ ...p, title: '' })); }}
                      placeholder="e.g. The Midnight Library" style={inputSx(!!errors.title)}
                      onFocus={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'}
                      onBlur={e => e.currentTarget.style.borderColor = errors.title ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'} />
                  </Field>

                  {/* Author */}
                  <Field label="Author" required error={errors.author}>
                    <input value={author} onChange={e => { setAuthor(e.target.value); setErrors(p => ({ ...p, author: '' })); }}
                      placeholder="e.g. Matt Haig" style={inputSx(!!errors.author)}
                      onFocus={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'}
                      onBlur={e => e.currentTarget.style.borderColor = errors.author ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'} />
                  </Field>

                  {/* Category */}
                  <Field label="Category" required error={errors.category}>
                    <select value={category} onChange={e => { setCategory(e.target.value); setErrors(p => ({ ...p, category: '' })); }}
                      style={{ ...inputSx(!!errors.category), appearance: 'none', cursor: 'pointer' }}>
                      <option value="">Select a category…</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>

                  {/* Year + Pages side by side */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Field label="Year">
                      <input type="number" value={year} onChange={e => setYear(e.target.value)}
                        placeholder={new Date().getFullYear().toString()} style={inputSx(false)}
                        onFocus={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'}
                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'} />
                    </Field>
                    <Field label="Pages">
                      <input type="number" value={pages} onChange={e => setPages(e.target.value)}
                        placeholder="e.g. 320" style={inputSx(false)}
                        onFocus={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'}
                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'} />
                    </Field>
                  </div>

                  {/* Tags */}
                  <Field label="Tags" hint="comma-separated">
                    <input value={tags} onChange={e => setTags(e.target.value)}
                      placeholder="e.g. Fiction, Drama, Modern" style={inputSx(false)}
                      onFocus={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'} />
                  </Field>

                  {/* Description */}
                  <Field label="Description">
                    <textarea value={description} onChange={e => setDescription(e.target.value)}
                      placeholder="A brief synopsis of the book…" rows={3}
                      style={{ ...inputSx(false), resize: 'vertical', minHeight: 80 }}
                      onFocus={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'} />
                  </Field>
                </div>
              </div>

              {/* Right column — live preview card + publish button */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Preview */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: 20, padding: 24 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 16 }}>LIVE PREVIEW</p>
                  <div style={{
                    borderRadius: 14, overflow: 'hidden',
                    background: '#1a1a2e', aspectRatio: '2/3',
                    marginBottom: 16, position: 'relative',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.4)'
                  }}>
                    {coverFile
                      ? <img src={coverFile.dataUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : (
                        <div style={{
                          width: '100%', height: '100%',
                          background: 'linear-gradient(135deg, #1e1b4b, #312e81, #1e1b4b)',
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'center', gap: 12, padding: 20
                        }}>
                          <BookOpen size={48} color="rgba(255,255,255,0.3)" />
                          <p style={{ textAlign: 'center', fontWeight: 700, fontSize: 15, color: 'white', opacity: 0.7 }}>
                            {title || 'Book Title'}
                          </p>
                        </div>
                      )
                    }
                    {/* New badge */}
                    <div style={{ position: 'absolute', top: 10, left: 10 }}>
                      <span className="badge" style={{ background: 'rgba(16,185,129,0.85)', color: 'white', backdropFilter: 'blur(8px)' }}>New</span>
                    </div>
                  </div>
                  <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 4, lineHeight: 1.3 }}>{title || 'Book Title'}</h3>
                  <p style={{ fontSize: 13, color: 'var(--indigo-300)', marginBottom: 10 }}>{author || 'Author Name'}</p>
                  {category && (
                    <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: 'rgba(99,102,241,0.1)', color: 'var(--indigo-300)', border: '1px solid rgba(99,102,241,0.15)' }}>
                      {category}
                    </span>
                  )}
                  {pdfFile && (
                    <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 7, padding: '8px 12px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10 }}>
                      <CheckCircle size={14} color="#10b981" />
                      <span style={{ fontSize: 12, color: '#6ee7b7' }}>PDF ready · {formatBytes(pdfFile.size)}</span>
                    </div>
                  )}
                </div>

                {/* Publish button */}
                <button onClick={handlePublish} disabled={publishing} style={{
                  width: '100%', padding: '16px',
                  background: publishing ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #7c3aed)',
                  color: 'white', borderRadius: 14, fontSize: 15, fontWeight: 700,
                  boxShadow: publishing ? 'none' : '0 8px 28px rgba(99,102,241,0.4)',
                  cursor: publishing ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  border: 'none', letterSpacing: '0.02em'
                }}>
                  {publishing ? (
                    <>
                      <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      Publishing…
                    </>
                  ) : (
                    <><BookOpen size={18} /> Publish to Library</>
                  )}
                </button>

                {/* Info box */}
                <div style={{ padding: '14px 16px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: 12 }}>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                    📌 Files are stored locally (IndexedDB/localStorage) and shared across all browser sessions on this device.<br />
                    🔒 Only the admin account can publish or delete books.<br />
                    ⬇️ Users can download the PDF directly from their library grid.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            MANAGE TAB
        ══════════════════════════════════════════════════ */}
        {activeTab === 'manage' && (
          <div className="animate-fade-in-up">
            {uploadedBooks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                <BookOpen size={64} color="rgba(99,102,241,0.3)" style={{ marginBottom: 20 }} />
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No uploaded books yet</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Upload your first book using the Upload tab</p>
                <button onClick={() => setActiveTab('upload')} style={{
                  padding: '12px 24px', background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12,
                  color: 'var(--indigo-300)', fontSize: 14, fontWeight: 600, cursor: 'pointer'
                }}>+ Upload First Book</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {uploadedBooks.map(book => (
                  <div key={book.id} style={{
                    background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 16, padding: '16px 20px',
                    display: 'flex', alignItems: 'center', gap: 16
                  }}>
                    {/* Cover */}
                    <div style={{ width: 48, height: 68, borderRadius: 8, overflow: 'hidden', background: '#1a1a2e', flexShrink: 0, border: '1px solid rgba(99,102,241,0.15)' }}>
                      {book.coverImageURL
                        ? <img src={book.coverImageURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={20} color="rgba(255,255,255,0.2)" /></div>
                      }
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.title}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{book.author}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                        <span style={{ padding: '2px 8px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: 'rgba(99,102,241,0.1)', color: 'var(--indigo-300)', border: '1px solid rgba(99,102,241,0.15)' }}>{book.genre}</span>
                        {book.pages > 0 && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{book.pages} pages</span>}
                        <span style={{ fontSize: 11, color: '#10b981' }}>✓ Published</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <a href={book.pdf_filePath} download={`${book.title}.pdf`} onClick={e => e.stopPropagation()}
                        title="Download PDF"
                        style={{
                          width: 36, height: 36, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#6ee7b7'
                        }}>
                        <Download size={15} />
                      </a>
                      <button
                        onClick={() => setDeleteConfirm(book.id)}
                        title="Remove book"
                        style={{
                          width: 36, height: 36, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                          color: '#f87171', cursor: 'pointer'
                        }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Delete confirm modal ── */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 500,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div className="animate-scale-in glass" style={{ borderRadius: 20, padding: '32px 36px', maxWidth: 400, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🗑️</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Remove this book?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
              This will remove the book from the library grid. Users will no longer see or download it.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{
                flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
                color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer'
              }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={{
                flex: 1, padding: '12px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                border: 'none', borderRadius: 12,
                color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer'
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────
const inputSx = (hasError: boolean): React.CSSProperties => ({
  width: '100%', padding: '12px 14px',
  background: 'rgba(255,255,255,0.04)',
  border: `1px solid ${hasError ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}`,
  borderRadius: 10, color: 'var(--text-primary)', fontSize: 14,
  fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s',
  outline: 'none'
});

function Field({ label, required, error, hint, children }: {
  label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.07em', marginBottom: 8 }}>
        {label.toUpperCase()}
        {required && <span style={{ color: '#ef4444' }}>*</span>}
        {hint && <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>({hint})</span>}
      </label>
      {children}
      {error && <p style={{ color: '#fca5a5', fontSize: 12, marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={11} />{error}</p>}
    </div>
  );
}
