import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, CheckCircle2 } from 'lucide-react';
import { uploadResume } from '../api/api';
import { useToast } from '../context/ToastContext';

const UploadForm = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      addToast('Only PDF files are allowed', 'error');
      return;
    }
    setFile(selectedFile);
    setUploaded(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) validateAndSetFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files?.[0]) validateAndSetFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    try {
      const data = await uploadResume(file);
      setUploaded(true);
      addToast('Resume uploaded successfully!', 'success');
      if (onUploadSuccess) onUploadSuccess(data.filename);
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.detail || 'Failed to upload resume. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors duration-300">
      <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
        <Upload className="h-5 w-5 text-blue-500" />
        Upload Candidate Resume
      </h2>

      <form onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop} onSubmit={handleUpload} className="space-y-4">
        <input ref={fileInputRef} type="file" className="hidden" accept=".pdf" onChange={handleChange} disabled={loading} />

        {/* Drop Zone */}
        <div
          onClick={loading ? undefined : () => fileInputRef.current.click()}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all duration-300 ${
            dragActive
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
              : 'border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <AnimatePresence mode="wait">
            {file ? (
              <motion.div
                key="file-selected"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center text-center"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl mb-3 ${uploaded ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600' : 'bg-blue-50 dark:bg-blue-950/30 text-blue-600'}`}>
                  {uploaded ? <CheckCircle2 className="h-6 w-6" /> : <File className="h-6 w-6" />}
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 max-w-[200px] truncate">{file.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB • PDF</p>
                {!uploaded && (
                  <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} disabled={loading}
                    className="mt-3 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline">
                    Remove File
                  </button>
                )}
                {uploaded && <span className="mt-3 text-xs font-bold text-emerald-600 dark:text-emerald-400">Uploaded Successfully</span>}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
                  <Upload className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Drag and drop your PDF here</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">or click to browse files</p>
                <span className="mt-4 inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
                  PDF format only
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Upload Button */}
        <AnimatePresence>
          {file && !uploaded && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/40 border-t-white animate-spin rounded-full" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload Resume
                </>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default UploadForm;
