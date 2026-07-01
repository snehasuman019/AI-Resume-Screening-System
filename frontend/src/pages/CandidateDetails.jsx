import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, FileText, Briefcase, Cpu, Award, HelpCircle, Code } from 'lucide-react';
import { getCandidateById } from '../api/api';
import { useToast } from '../context/ToastContext';
import SkillBadge from '../components/SkillBadge';
import FeedbackCard from '../components/FeedbackCard';
import SkeletonLoader from '../components/SkeletonLoader';
import ExportButtons from '../components/ExportButtons';

const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'ai-analysis', 'resume', 'jd', 'raw-resume'

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      setLoading(true);
      try {
        const data = await getCandidateById(id);
        setCandidate(data);
      } catch (err) {
        console.error(err);
        addToast(err.response?.data?.detail || 'Failed to load candidate details.', 'error');
        navigate('/candidates');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateDetails();
  }, [id, addToast, navigate]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SkeletonLoader type="detail" />
      </div>
    );
  }

  if (!candidate) return null;

  const { resume_filename, match_score, resume_text, job_description, skills_found = [], missing_skills = [], ai_feedback = {}, created_at } = candidate;

  // Helper score color
  const getScoreColorHex = (score) => {
    if (score >= 70) return '#10b981'; // emerald-500
    if (score >= 40) return '#f59e0b'; // amber-500
    return '#ef4444'; // rose-500
  };

  const getScoreBgClass = (score) => {
    if (score >= 70) return 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
    if (score >= 40) return 'bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
    return 'bg-rose-50 text-rose-800 dark:bg-rose-950/20 dark:text-rose-400 border-rose-100 dark:border-rose-900/30';
  };

  // SVG Gauge parameters
  const radius = 45;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;

  // Tabs definitions
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'ai-analysis', label: 'AI Analysis' },
    { id: 'resume', label: 'Resume Profile' },
    { id: 'jd', label: 'Job Specification' },
    { id: 'raw-resume', label: 'Raw Extracted Text' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in-up print:p-0 print:space-y-4"
    >
      {/* Back Button & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6 print:border-none print:pb-0">
        <div className="space-y-1.5">
          <button
            onClick={() => navigate('/candidates')}
            className="group flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-250 text-xs font-semibold mb-2 no-print"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Candidates
          </button>
          
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-slate-100 max-w-[450px] truncate" title={resume_filename}>
              {resume_filename}
            </h1>
            <span className={`text-2xs font-extrabold px-3 py-1 rounded-full border shrink-0 ${getScoreBgClass(match_score)}`}>
              {match_score}% Match Index
            </span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Database Record ID: <span className="font-mono">{id}</span> • Added on {new Date(created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Export Utility Buttons */}
        <ExportButtons candidate={candidate} />
      </div>

      {/* Tabs Menu Navigation */}
      <div className="flex overflow-x-auto rounded-xl bg-slate-100 dark:bg-slate-950 p-1 no-print border border-slate-200/50 dark:border-slate-900 transition-colors duration-300">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 dark:text-slate-450 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Printer Header (Only visible when printing) */}
      <div className="hidden print:flex flex-col border-b-2 border-slate-200 pb-4 mb-4">
        <h2 className="text-2xl font-bold text-slate-900">ScreenAI Candidate Matching Report</h2>
        <p className="text-sm text-slate-500">Resume Filename: {resume_filename} | ID: {id}</p>
        <p className="text-sm text-slate-500">Date Evaluated: {new Date(created_at).toLocaleString()}</p>
      </div>

      {/* Tab Panel Content Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Radial Progress Gauge & Skill Audits (Always visible on Overview, otherwise collapses on print depending on active tab) */}
        {((activeTab === 'overview' || activeTab === 'resume') || window.matchMedia('print').matches) && (
          <div className="space-y-6 print:border-none print:shadow-none">
            {/* SVG Score Gauge */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col items-center text-center space-y-6 transition-colors duration-300 print-card">
              <p className="text-xs font-bold text-slate-450 dark:text-slate-550 uppercase tracking-widest">
                Overall Match Score
              </p>

              <div className="relative flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    fill="transparent"
                    stroke={localStorage.getItem('theme') === 'dark' ? '#1e293b' : '#f1f5f9'}
                    strokeWidth={strokeWidth}
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    fill="transparent"
                    stroke={getScoreColorHex(match_score)}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (match_score / 100) * circumference}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
                    {match_score}%
                  </span>
                  <span className="text-4xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                    Assessed
                  </span>
                </div>
              </div>

              <div className="w-full border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-col items-center">
                <span className="text-3xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Score Assessment</span>
                <span className="text-xs font-bold text-slate-850 dark:text-slate-200 mt-1">
                  {match_score >= 70 ? 'Excellent Match' : match_score >= 40 ? 'Moderate Fit' : 'Skill Gap Identified'}
                </span>
              </div>
            </div>

            {/* Skills audit lists */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4 transition-colors duration-300 print-card">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                Required Skills Audit
              </h3>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span>Skills Found ({skills_found.length})</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {skills_found.length > 0 ? (
                    skills_found.map((skill, index) => (
                      <SkillBadge key={index} skill={skill} isFound={true} />
                    ))
                  ) : (
                    <span className="text-xs italic text-slate-400 dark:text-slate-500">None detected.</span>
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/40 mt-2">
                <h4 className="text-xs font-semibold text-rose-600 dark:text-rose-455 flex items-center gap-1.5">
                  <span>Missing Skills ({missing_skills.length})</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {missing_skills.length > 0 ? (
                    missing_skills.map((skill, index) => (
                      <SkillBadge key={index} skill={skill} isFound={false} />
                    ))
                  ) : (
                    <span className="text-xs italic text-slate-400 dark:text-slate-550">No missing skills!</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Column: Tab View panels */}
        <div className={`lg:col-span-2 print:col-span-3 space-y-6 ${activeTab !== 'overview' && activeTab !== 'resume' ? 'lg:col-span-3' : ''}`}>
          
          {/* 1. Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Executive Summary */}
              {ai_feedback?.summary && (
                <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/20 bg-indigo-50/50 dark:bg-indigo-950/10 p-6 shadow-sm space-y-3 print-card">
                  <h3 className="text-base font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                    <Award className="h-5 w-5 text-indigo-650 dark:text-indigo-400" />
                    AI Executive Summary
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-350 whitespace-pre-wrap">
                    {ai_feedback.summary}
                  </p>
                </div>
              )}

              {/* Action Prompt */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4 transition-colors duration-300 print-card no-print">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Recruiter Quick Actions</h3>
                <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                  Toggle the tabs above to explore deep AI feedback analyses (strengths, suggested interview questions) or view full extracted PDF contents alongside target job specifications.
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    onClick={() => setActiveTab('ai-analysis')}
                    className="flex-1 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 text-center hover:bg-slate-100 transition-colors"
                  >
                    View AI Assessment
                  </button>
                  <button
                    onClick={() => setActiveTab('resume')}
                    className="flex-1 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 text-center hover:bg-slate-100 transition-colors"
                  >
                    Compare CV / JD
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. AI Analysis Tab */}
          {(activeTab === 'ai-analysis' || window.matchMedia('print').matches) && (
            <div className="space-y-6">
              {/* Executive Summary */}
              {ai_feedback?.summary && (
                <FeedbackCard type="summary" data={ai_feedback.summary} />
              )}
              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-1">
                <FeedbackCard type="strengths" data={ai_feedback.strengths} />
                <FeedbackCard type="weaknesses" data={ai_feedback.weaknesses} />
              </div>
              {/* Improvements */}
              <FeedbackCard type="improvements" data={ai_feedback.resume_improvements} />
              {/* Suggested Questions */}
              <FeedbackCard type="questions" data={ai_feedback.interview_questions} />
            </div>
          )}

          {/* 3. Resume Profile comparative comparison */}
          {activeTab === 'resume' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3 flex flex-col h-[550px] transition-colors duration-300">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <FileText className="h-4.5 w-4.5 text-blue-500" />
                  Extracted Resume Text
                </h3>
                <div className="flex-1 overflow-y-auto text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-3 rounded-lg text-slate-650 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                  {resume_text || 'No text extracted.'}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3 flex flex-col h-[550px] transition-colors duration-300">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Briefcase className="h-4.5 w-4.5 text-blue-500" />
                  Target Job Specification
                </h3>
                <div className="flex-1 overflow-y-auto text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-3 rounded-lg text-slate-650 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                  {job_description || 'No job description provided.'}
                </div>
              </div>
            </div>
          )}

          {/* 4. Job Spec Tab */}
          {activeTab === 'jd' && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4 transition-colors duration-300">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                <Briefcase className="h-4.5 w-4.5 text-blue-500" />
                Target Job Specification
              </h3>
              <div className="text-xs md:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-4 rounded-xl text-slate-650 dark:text-slate-450 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto font-mono">
                {job_description || 'No job description provided.'}
              </div>
            </div>
          )}

          {/* 5. Raw Extracted Resume Tab */}
          {activeTab === 'raw-resume' && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4 transition-colors duration-300">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5">
                  <Code className="h-4.5 w-4.5 text-indigo-500" />
                  Extracted Raw PDF Text
                </h3>
                <span className="text-4xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Formatted Monospace
                </span>
              </div>
              <div className="text-xs bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-4 rounded-xl text-slate-650 dark:text-slate-450 whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto font-mono">
                {resume_text || 'No text extracted.'}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CandidateDetails;
