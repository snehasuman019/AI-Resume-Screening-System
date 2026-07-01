import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Star, TrendingUp, RefreshCw, Award, Filter, Search, ShieldCheck } from 'lucide-react';
import { getCandidates, getCandidateStats, getTopCandidates, searchCandidatesBySkill, deleteCandidate } from '../api/api';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/StatCard';
import CandidateCard from '../components/CandidateCard';
import SkeletonLoader from '../components/SkeletonLoader';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { addRecruiterLog } from '../components/RecruiterTimeline';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'top-5', 'top-10', 'top-20'
  const { addToast } = useToast();

  // Deletion Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const data = await getCandidateStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch candidate stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchCandidates = useCallback(async (mode = filterMode, query = searchQuery) => {
    setLoading(true);
    try {
      let data = [];
      if (query.trim()) {
        data = await searchCandidatesBySkill(query.trim());
      } else if (mode === 'top-5') {
        data = await getTopCandidates(5);
      } else if (mode === 'top-10') {
        data = await getTopCandidates(10);
      } else if (mode === 'top-20') {
        data = await getTopCandidates(20);
      } else {
        data = await getCandidates();
      }
      setCandidates(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to fetch candidates.', 'error');
    } finally {
      setLoading(false);
    }
  }, [filterMode, searchQuery, addToast]);

  // Initial Load
  useEffect(() => {
    fetchStats();
  }, []);

  // Debounced Live Search implementation
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCandidates(filterMode, searchQuery);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, filterMode, fetchCandidates]);

  // Open modal on delete request from card
  const handleOpenDeleteModal = (candidate) => {
    setCandidateToDelete(candidate);
    setDeleteModalOpen(true);
  };

  // Perform deletion through Modal confirmation
  const handleConfirmDelete = async () => {
    if (!candidateToDelete) return;
    setIsDeleting(true);
    try {
      await deleteCandidate(candidateToDelete._id);
      
      // Log the deletion action
      addRecruiterLog('candidate_deleted', `Deleted profile: ${candidateToDelete.resume_filename}.`);
      
      addToast(`Deleted profile ${candidateToDelete.resume_filename}`, 'success');
      
      // Remove local copy and refresh KPI
      setCandidates((prev) => prev.filter((c) => c._id !== candidateToDelete._id));
      setDeleteModalOpen(false);
      setCandidateToDelete(null);
      fetchStats();
    } catch (err) {
      console.error(err);
      addToast('Failed to delete candidate profile.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilterMode(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in-up"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Users className="h-7 w-7 text-blue-500" />
            Candidates Directory
          </h1>
          <p className="text-slate-500 dark:text-slate-450 text-sm mt-1">
            Browse matching candidate records, filter high scores, and live-search CV profiles by tech skill.
          </p>
        </div>
        <button
          onClick={() => {
            fetchStats();
            fetchCandidates(filterMode, searchQuery);
            addToast('Refreshed listings', 'info');
          }}
          disabled={loading}
          className="self-start sm:self-center flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-650 dark:text-slate-350 transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* KPI Stats Panel */}
      {statsLoading ? (
        <SkeletonLoader type="stats" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Profiles Screened"
            value={stats?.total_candidates ?? 0}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Highest Match Score"
            value={`${stats?.highest_match_score ?? 0}%`}
            icon={Award}
            color="emerald"
          />
          <StatCard
            title="Average Match Score"
            value={`${stats?.average_match_score ?? 0}%`}
            icon={TrendingUp}
            color="indigo"
          />
        </div>
      )}

      {/* Live Search and Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 border-t border-slate-200 dark:border-slate-800 pt-6">
        {/* Search */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Live search candidates by skill (e.g. python, docker, react)..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 py-2.5 pl-10 pr-10 text-sm outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-900 placeholder-slate-450 dark:placeholder-slate-500 text-slate-900 dark:text-slate-100 shadow-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
            >
              &times;
            </button>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 min-w-[200px]">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <select
            value={filterMode}
            onChange={handleFilterChange}
            disabled={loading}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-xs font-semibold text-slate-700 dark:text-slate-350 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm cursor-pointer"
          >
            <option value="all">All Candidates</option>
            <option value="top-5">Top 5 Candidates</option>
            <option value="top-10">Top 10 Candidates</option>
            <option value="top-20">Top 20 Candidates</option>
          </select>
        </div>
      </div>

      {/* Grid of Results */}
      {loading ? (
        <SkeletonLoader type="cards" count={6} />
      ) : candidates.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {candidates.map((candidate) => (
              <motion.div
                layout
                key={candidate._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <CandidateCard candidate={candidate} onDeletePress={handleOpenDeleteModal} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 p-12 text-center flex flex-col items-center justify-center min-h-[260px]">
          <Star className="h-10 w-10 text-slate-350 dark:text-slate-700 mb-3" />
          <h3 className="font-semibold text-slate-700 dark:text-slate-350 text-sm">No Matching Candidates</h3>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 max-w-sm">
            {searchQuery
              ? `No profiles found with the skill "${searchQuery}". Try python, docker, aws, or react.`
              : 'No candidate evaluations have been saved yet. Upload a CV on the dashboard to start!'}
          </p>
        </div>
      )}

      {/* Deletion confirmation modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        candidateName={candidateToDelete?.resume_filename || ''}
        matchScore={candidateToDelete?.match_score || 0}
        isDeleting={isDeleting}
      />
    </motion.div>
  );
};

export default Candidates;
