import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Calendar, Trash2, ArrowRight } from 'lucide-react';

const CandidateCard = ({ candidate, onDeletePress }) => {
  const navigate = useNavigate();
  const { _id, resume_filename, match_score, created_at, skills_found = [], missing_skills = [], ai_feedback = {} } = candidate;

  // Format Date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Color mapping based on score thresholds
  const getScoreColor = (score) => {
    if (score >= 70) return { stroke: '#10b981', text: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30' };
    if (score >= 40) return { stroke: '#f59e0b', text: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30' };
    return { stroke: '#ef4444', text: 'text-rose-600 dark:text-rose-450 bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30' };
  };

  const themeConfig = getScoreColor(match_score);

  // SVG Gauge calculations
  const radius = 16;
  const strokeWidth = 3.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (match_score / 100) * circumference;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-slate-950/20 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500/50 flex flex-col justify-between h-full transition-colors duration-300"
    >
      <div>
        {/* Header: File Icon and Circular Progress Gauge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/30 group-hover:text-blue-500 transition-colors border border-slate-100 dark:border-slate-800">
            <FileText className="h-5 w-5" />
          </div>

          {/* Mini Circular Progress Gauge */}
          <div className="relative flex items-center justify-center h-11 w-11">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="22"
                cy="22"
                r={radius}
                fill="transparent"
                stroke={localStorage.getItem('theme') === 'dark' ? '#334155' : '#f1f5f9'}
                strokeWidth={strokeWidth}
              />
              <circle
                cx="22"
                cy="22"
                r={radius}
                fill="transparent"
                stroke={themeConfig.stroke}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute text-3xs font-extrabold text-slate-800 dark:text-slate-200">
              {match_score}%
            </div>
          </div>
        </div>

        {/* Filename Title */}
        <h3
          className="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1"
          title={resume_filename}
        >
          {resume_filename}
        </h3>

        {/* Upload Date */}
        <div className="flex items-center gap-1 text-slate-400 dark:text-slate-555 text-2xs mb-3 font-semibold">
          <Calendar className="h-3.5 w-3.5" />
          <span>Added: {formatDate(created_at)}</span>
        </div>

        {/* AI Summary Preview */}
        {ai_feedback?.summary && (
          <p className="text-2xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {ai_feedback.summary}
          </p>
        )}

        {/* Skills Found & Missing Snippets */}
        <div className="space-y-2 mb-4 border-t border-slate-100 dark:border-slate-800 pt-3 text-3xs font-bold uppercase tracking-wider">
          {skills_found.length > 0 && (
            <div className="flex flex-wrap gap-1 items-center">
              <span className="text-emerald-600 dark:text-emerald-450 mr-1 shrink-0">Found:</span>
              {skills_found.slice(0, 3).map((skill, index) => (
                <span key={index} className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/10 font-semibold normal-case">
                  {skill}
                </span>
              ))}
              {skills_found.length > 3 && (
                <span className="text-slate-400 dark:text-slate-500 font-bold normal-case">+{skills_found.length - 3}</span>
              )}
            </div>
          )}
          {missing_skills.length > 0 && (
            <div className="flex flex-wrap gap-1 items-center">
              <span className="text-rose-600 dark:text-rose-450 mr-1 shrink-0">Missing:</span>
              {missing_skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 px-1.5 py-0.5 rounded border border-rose-100 dark:border-rose-900/10 font-semibold normal-case">
                  {skill}
                </span>
              ))}
              {missing_skills.length > 3 && (
                <span className="text-slate-400 dark:text-slate-500 font-bold normal-case">+{missing_skills.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Action Bar */}
      <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-3 mt-auto">
        <button
          onClick={() => navigate(`/candidate/${_id}`)}
          className="flex-1 flex items-center justify-center gap-1 bg-slate-50 hover:bg-blue-600 dark:bg-slate-950 dark:hover:bg-blue-600 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:text-white dark:hover:text-white font-bold text-xs py-2 rounded-xl transition-all"
        >
          View Details
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onDeletePress) {
              onDeletePress({ _id, resume_filename, match_score });
            }
          }}
          aria-label="Delete Profile"
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-900/30 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

export default CandidateCard;
