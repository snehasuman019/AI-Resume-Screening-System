import React, { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell, LineChart, Line } from 'recharts';
import { useTheme } from '../App';
import { BarChart3, TrendingUp, Cpu, Award } from 'lucide-react';

const DashboardCharts = ({ candidates }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Common colors
  const textColors = isDark ? '#94a3b8' : '#64748b'; // slate-400 / slate-500
  const gridColors = isDark ? '#334155' : '#e2e8f0'; // slate-700 / slate-200

  // 1. Calculate Match Score Distribution (buckets: 0-40, 40-60, 60-80, 80-100)
  const distributionData = useMemo(() => {
    const buckets = [
      { name: '0-40%', count: 0, fill: '#ef4444' },
      { name: '40-60%', count: 0, fill: '#f59e0b' },
      { name: '60-80%', count: 0, fill: '#3b82f6' },
      { name: '80-100%', count: 0, fill: '#10b981' }
    ];

    candidates.forEach((c) => {
      const score = c.match_score;
      if (score < 40) buckets[0].count += 1;
      else if (score < 60) buckets[1].count += 1;
      else if (score < 80) buckets[2].count += 1;
      else buckets[3].count += 1;
    });

    return buckets;
  }, [candidates]);

  // 2. Calculate Top Skills Frequency (Top 6 skills found across all profiles)
  const skillsData = useMemo(() => {
    const frequencies = {};
    candidates.forEach((c) => {
      const skills = c.skills_found || [];
      skills.forEach((s) => {
        const normalized = s.trim();
        if (normalized) {
          frequencies[normalized] = (frequencies[normalized] || 0) + 1;
        }
      });
    });

    return Object.entries(frequencies)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [candidates]);

  // 3. Top Candidates by Match Score (Top 5)
  const topCandidatesData = useMemo(() => {
    return [...candidates]
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 5)
      .map((c) => ({
        name: c.resume_filename.split('.')[0].substring(0, 10) + '...',
        score: c.match_score,
        fullName: c.resume_filename
      }));
  }, [candidates]);

  // 4. Average Match Trend by Date
  const trendData = useMemo(() => {
    const dateGroups = {};
    candidates.forEach((c) => {
      if (!c.created_at) return;
      // Get date string (YYYY-MM-DD)
      const dateStr = new Date(c.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      if (!dateGroups[dateStr]) {
        dateGroups[dateStr] = { sum: 0, count: 0 };
      }
      dateGroups[dateStr].sum += c.match_score;
      dateGroups[dateStr].count += 1;
    });

    return Object.entries(dateGroups)
      .map(([date, val]) => ({
        date,
        average: parseFloat((val.sum / val.count).toFixed(1))
      }))
      .slice(-7); // take last 7 active dates
  }, [candidates]);

  // Custom tooltips to match SaaS style
  const CustomTooltip = ({ active, payload, label, unit = '' }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-3 shadow-xl backdrop-blur-sm text-xs font-semibold leading-relaxed">
          <p className="text-slate-400 dark:text-slate-500 mb-1">{label}</p>
          {payload.map((p, index) => (
            <p key={index} style={{ color: p.color || p.fill }}>
              {p.name}: <span className="text-slate-850 dark:text-slate-100 font-bold">{p.value}{unit}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!candidates || candidates.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
      {/* 1. Match Score Distribution */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <BarChart3 className="h-4 w-4 text-blue-500" />
          Match Score Distribution
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColors} vertical={false} />
              <XAxis dataKey="name" stroke={textColors} fontSize={10} tickLine={false} />
              <YAxis stroke={textColors} fontSize={10} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? '#1e293b' : '#f8fafc', opacity: 0.5 }} />
              <Bar dataKey="count" name="Candidates" radius={[6, 6, 0, 0]}>
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Top Skills Frequency */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <Cpu className="h-4 w-4 text-purple-500" />
          Top Skills Frequency
        </h3>
        <div className="h-64">
          {skillsData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillsData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColors} horizontal={false} />
                <XAxis type="number" stroke={textColors} fontSize={10} tickLine={false} allowDecimals={false} />
                <YAxis dataKey="name" type="category" stroke={textColors} fontSize={10} tickLine={false} width={80} />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Bar dataKey="count" name="Occurrences" fill="#a855f7" radius={[0, 6, 6, 0]} barSize={16}>
                  {skillsData.map((entry, index) => {
                    const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs italic text-slate-400">
              Awaiting skill analysis data...
            </div>
          )}
        </div>
      </div>

      {/* 3. Average Match Score Trend */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          Average Match Trend
        </h3>
        <div className="h-64">
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColors} vertical={false} />
                <XAxis dataKey="date" stroke={textColors} fontSize={10} tickLine={false} />
                <YAxis stroke={textColors} fontSize={10} tickLine={false} unit="%" domain={[0, 100]} />
                <Tooltip content={<CustomTooltip unit="%" />} />
                <Area type="monotone" dataKey="average" name="Avg Score" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAvg)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs italic text-slate-400">
              Awaiting chronological data...
            </div>
          )}
        </div>
      </div>

      {/* 4. Top Performing Candidates */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <Award className="h-4 w-4 text-amber-500" />
          Top Screened Candidates
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topCandidatesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColors} vertical={false} />
              <XAxis dataKey="name" stroke={textColors} fontSize={9} tickLine={false} />
              <YAxis stroke={textColors} fontSize={10} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip content={<CustomTooltip unit="%" />} cursor={false} />
              <Bar dataKey="score" name="Match Score" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={24}>
                {topCandidatesData.map((entry, index) => {
                  const colors = ['#3b82f6', '#4f46e5', '#6366f1', '#06b6d4', '#0d9488'];
                  return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
