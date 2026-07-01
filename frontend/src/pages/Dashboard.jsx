import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileText, Cpu, CheckCircle2, Award, Users, TrendingUp, History, ClipboardCheck, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { getUploadedResumeSkills, getUploadedResumeParse, getCandidates, getCandidateStats, getCandidateById } from '../api/api';
import { useToast } from '../context/ToastContext';
import UploadForm from '../components/UploadForm';
import JobDescriptionForm from '../components/JobDescriptionForm';
import SkillBadge from '../components/SkillBadge';
import FeedbackCard from '../components/FeedbackCard';
import LoadingSpinner from '../components/LoadingSpinner';
import DashboardCharts from '../components/DashboardCharts';
import RecruiterTimeline, { addRecruiterLog } from '../components/RecruiterTimeline';

const Dashboard = () => {
  const { addToast } = useToast();
  const [uploadedFilename, setUploadedFilename] = useState('');
  const [parsingCV, setParsingCV] = useState(false);
  const [parsedSkills, setParsedSkills] = useState([]);
  const [parsedTextPreview, setParsedTextPreview] = useState('');
  
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Statistics & History states
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [allCandidates, setAllCandidates] = useState([]);
  const [recentScreenings, setRecentScreenings] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);

  // Fetch metrics & recent profiles
  const loadDashboardData = useCallback(async () => {
    setStatsLoading(true);
    setRecentLoading(true);
    try {
      const statsData = await getCandidateStats();
      setStats(statsData);
      
      const candidatesList = await getCandidates();
      setAllCandidates(candidatesList);
      setRecentScreenings(candidatesList.slice(0, 5)); // show latest 5
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setStatsLoading(false);
      setRecentLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // When a resume upload succeeds
  const handleUploadSuccess = async (filename) => {
    setUploadedFilename(filename);
    setAnalysisResult(null);
    setParsingCV(true);
    
    // Add activity log
    addRecruiterLog('cv_uploaded', `Uploaded CV: ${filename}.`);
    
    try {
      // Get immediate parsing feedback
      const [skillsRes, parseRes] = await Promise.all([
        getUploadedResumeSkills(),
        getUploadedResumeParse()
      ]);
      
      setParsedSkills(skillsRes.skills || []);
      setParsedTextPreview(parseRes.text || '');
      addToast('CV Parsed successfully! Proceed to write a Job Description.', 'info');
    } catch (err) {
      console.error(err);
      addToast('Resume uploaded, but failed to fetch parsing preview.', 'warning');
    } finally {
      setParsingCV(false);
    }
  };

  const handleAnalysisStart = () => {
    setAnalyzing(true);
    setAnalysisResult(null);
  };

  const handleAnalysisSuccess = (result) => {
    setAnalysisResult(result);
    setAnalyzing(false);
    
    // Log the match action
    addRecruiterLog('candidate_analyzed', `Matched ${result.resume_filename}. Score: ${result.match_score}%`);
    
    loadDashboardData(); // Refresh history and statistics
    
    // Smooth scroll to results
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Load a previously screened candidate from the sidebar history
  const handleSelectRecent = async (candidateId) => {
    setAnalyzing(true);
    setAnalysisResult(null);
    try {
      const fullCandidate = await getCandidateById(candidateId);
      setAnalysisResult(fullCandidate);
      setUploadedFilename(fullCandidate.resume_filename);
      setParsedSkills(fullCandidate.skills_found || []);
      setParsedTextPreview(fullCandidate.resume_text || '');
      
      addToast(`Loaded assessment: ${fullCandidate.resume_filename}`, 'success');
      
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      addToast('Failed to load candidate details.', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  // Helper for match score color mapping
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

  // SVG Radial Gauge Params
  const radius = 45;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageVariants}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8"
    >
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 p-6 md:p-8 text-white shadow-xl border border-indigo-950/40 dark:border-slate-800 transition-colors duration-300">
        {/* Glow Particles */}
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 border border-blue-500/25 px-3 py-1 text-xs font-semibold text-blue-300">
              <Sparkles className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
              SaaS AI Recruiter Platform
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Talent Screening Hub
            </h1>
            <p className="text-slate-400 text-xs md:text-sm max-w-xl leading-relaxed">
              Upload CVs, verify extracted skills automatically, and generate contextual matching score indexes using Gemini AI modeling.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Upload Area & Match Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Span 5): Upload Form & Recruiter Timeline History */}
        <div className="lg:col-span-5 space-y-8">
          <UploadForm onUploadSuccess={handleUploadSuccess} />

          {/* Recruiter Timeline log */}
          <RecruiterTimeline />
        </div>

        {/* Right Column (Span 7): Processing / Immediate Parse Feedback / JD Input */}
        <div className="lg:col-span-7">
          {parsingCV ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center shadow-sm">
              <LoadingSpinner text="Reading PDF layout, extracting keyword parameters, and compiling skill list..." />
            </div>
          ) : uploadedFilename ? (
            <div className="space-y-6">
              {/* Interactive Immediate Feedback CV Card */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4 animate-fade-in-up transition-colors duration-300">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <ClipboardCheck className="h-4.5 w-4.5 text-emerald-500" />
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Immediate CV Parsing Feedback
                  </h3>
                </div>

                {/* Parsed Skills */}
                <div className="space-y-2">
                  <p className="text-2xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Extracted Tech Skills:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {parsedSkills.length > 0 ? (
                      parsedSkills.map((skill, index) => (
                        <SkillBadge key={index} skill={skill} isFound={true} />
                      ))
                    ) : (
                      <span className="text-xs italic text-slate-400">No skills parsed yet.</span>
                    )}
                  </div>
                </div>

                {/* CV Text Preview */}
                {parsedTextPreview && (
                  <div className="space-y-1.5">
                    <p className="text-2xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Extracted Text Preview:</p>
                    <div className="text-3xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 p-2.5 rounded-lg text-slate-650 dark:text-slate-400 max-h-[85px] overflow-y-auto leading-relaxed whitespace-pre-wrap">
                      {parsedTextPreview.substring(0, 350)}...
                    </div>
                  </div>
                )}
              </div>

              {/* Job Description Matching Form */}
              <JobDescriptionForm
                resumeFilename={uploadedFilename}
                onAnalysisStart={handleAnalysisStart}
                onAnalysisSuccess={handleAnalysisSuccess}
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 p-12 text-center flex flex-col items-center justify-center min-h-[320px] border-dashed">
              <FileText className="h-12 w-12 text-slate-350 dark:text-slate-700 mb-3" />
              <h3 className="font-semibold text-slate-700 dark:text-slate-350 text-sm">Upload A Candidate CV</h3>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 max-w-xs leading-relaxed">
                Add a PDF resume. The screening engine will extract candidate skills and output an immediate text preview.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Analysis In-Progress Loader */}
      {analyzing && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 shadow-sm">
          <LoadingSpinner text="Deep semantic matching is in progress. Google Gemini AI is compiling feedback and suggested interview questions..." />
        </div>
      )}

      {/* Matching Results Section */}
      {analysisResult && !analyzing && (
        <div id="results-section" className="space-y-8 border-t border-slate-200 dark:border-slate-800 pt-8 animate-fade-in-up">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-450">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Screening Assessment Details
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Result Card: Radial Progress Score Gauge */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col items-center text-center space-y-6 transition-colors duration-300">
                <p className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">
                  Overall Compatibility
                </p>

                {/* SVG Gauge */}
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
                      stroke={getScoreColorHex(analysisResult.match_score)}
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - (analysisResult.match_score / 100) * circumference}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  {/* Central Text */}
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
                      {analysisResult.match_score}%
                    </span>
                    <span className="text-4xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5 animate-pulse">
                      Match
                    </span>
                  </div>
                </div>

                <div className="w-full border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-col items-center">
                  <span className="text-3xs text-slate-450 dark:text-slate-500 font-bold uppercase tracking-widest">Selected Profile</span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 max-w-[200px] truncate" title={analysisResult.resume_filename}>
                    {analysisResult.resume_filename}
                  </span>
                </div>
              </div>

              {/* Skills Found vs Missing Badge List */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4 transition-colors duration-300">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                  Talent Skills Audit
                </h3>

                {/* Found */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <span>Skills Found ({analysisResult.skills_found?.length || 0})</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.skills_found && analysisResult.skills_found.length > 0 ? (
                      analysisResult.skills_found.map((skill, index) => (
                        <SkillBadge key={index} skill={skill} isFound={true} />
                      ))
                    ) : (
                      <span className="text-xs italic text-slate-400">None detected.</span>
                    )}
                  </div>
                </div>

                {/* Missing */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-850 mt-2">
                  <h4 className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <span>Missing Skills ({analysisResult.missing_skills?.length || 0})</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.missing_skills && analysisResult.missing_skills.length > 0 ? (
                      analysisResult.missing_skills.map((skill, index) => (
                        <SkillBadge key={index} skill={skill} isFound={false} />
                      ))
                    ) : (
                      <span className="text-xs italic text-slate-450">All skills present!</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: AI Feedback Cards Grid */}
            <div className="lg:col-span-2 space-y-6">
              {analysisResult.ai_feedback && (
                <>
                  {/* Summary */}
                  {analysisResult.ai_feedback.summary && (
                    <FeedbackCard type="summary" data={analysisResult.ai_feedback.summary} />
                  )}

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FeedbackCard type="strengths" data={analysisResult.ai_feedback.strengths} />
                    <FeedbackCard type="weaknesses" data={analysisResult.ai_feedback.weaknesses} />
                  </div>

                  {/* Recommendations */}
                  {analysisResult.ai_feedback.resume_improvements && (
                    <FeedbackCard type="improvements" data={analysisResult.ai_feedback.resume_improvements} />
                  )}

                  {/* Suggested Interview Questions */}
                  {analysisResult.ai_feedback.interview_questions && (
                    <FeedbackCard type="questions" data={analysisResult.ai_feedback.interview_questions} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recharts Analytics Panel */}
      {allCandidates.length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 space-y-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Database Analytics & Insights
            </h2>
          </div>
          <DashboardCharts candidates={allCandidates} />
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;
