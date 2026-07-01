import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Play, Sparkles } from 'lucide-react';
import { matchResume } from '../api/api';
import { useToast } from '../context/ToastContext';

const JobDescriptionForm = ({ resumeFilename, onAnalysisStart, onAnalysisSuccess }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      addToast('Please enter a job description.', 'error');
      return;
    }

    setLoading(true);
    if (onAnalysisStart) onAnalysisStart();

    try {
      const data = await matchResume(jobDescription);
      addToast('Analysis completed successfully!', 'success');
      if (onAnalysisSuccess) onAnalysisSuccess(data);
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.detail || 'Failed to analyze resume. Please try again.', 'error');
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-blue-500" />
          Job Description Analysis
        </h2>
        <span className="text-xs bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full font-bold max-w-[180px] truncate">
          {resumeFilename}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="jd-textarea" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Paste Job Specification
          </label>
          <textarea
            id="jd-textarea"
            rows="7"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={loading}
            placeholder="Paste the full job description here — include required skills, responsibilities, years of experience, and qualifications..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 p-4 text-sm outline-none transition-all focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50/50 dark:bg-slate-950/30 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 resize-y"
          />
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
            {jobDescription.length} characters • Gemini AI will process this against the uploaded CV
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !jobDescription.trim()}
          className={`w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all ${
            loading || !jobDescription.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01]'
          }`}
        >
          {loading ? (
            <>
              <div className="h-4 w-4 border-2 border-white/40 border-t-white animate-spin rounded-full" />
              Running Gemini AI Analysis...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Analyze & Match Candidate
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default JobDescriptionForm;
