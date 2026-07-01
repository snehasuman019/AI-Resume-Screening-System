import React from 'react';
import { Download, FileJson, FileSpreadsheet, Printer, Share2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const ExportButtons = ({ candidate }) => {
  const { addToast } = useToast();

  if (!candidate) return null;

  // 1. Export as JSON
  const handleExportJSON = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(candidate, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `Candidate_Report_${candidate.resume_filename.split('.')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      addToast('JSON Export downloaded successfully', 'success');
    } catch (e) {
      console.error(e);
      addToast('JSON Export failed', 'error');
    }
  };

  // 2. Export as CSV
  const handleExportCSV = () => {
    try {
      const rows = [
        ['Field', 'Value'],
        ['ID', candidate._id],
        ['Resume Filename', candidate.resume_filename],
        ['Match Score', `${candidate.match_score}%`],
        ['Date Evaluated', candidate.created_at],
        ['Skills Found', (candidate.skills_found || []).join('; ')],
        ['Missing Skills', (candidate.missing_skills || []).join('; ')],
        ['AI Executive Summary', (candidate.ai_feedback?.summary || '').replace(/"/g, '""')],
        ['AI Strengths', (candidate.ai_feedback?.strengths || []).join('; ').replace(/"/g, '""')],
        ['AI Weaknesses', (candidate.ai_feedback?.weaknesses || []).join('; ').replace(/"/g, '""')],
        ['AI Improvements', (candidate.ai_feedback?.resume_improvements || []).join('; ').replace(/"/g, '""')],
        ['Suggested Interview Questions', (candidate.ai_feedback?.interview_questions || []).join('; ').replace(/"/g, '""')]
      ];

      const csvContent = 'data:text/csv;charset=utf-8,' 
        + rows.map(e => e.map(val => `"${String(val).replace(/\n/g, ' ')}"`).join(',')).join('\n');

      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', encodeURI(csvContent));
      downloadAnchor.setAttribute('download', `Candidate_Report_${candidate.resume_filename.split('.')[0]}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      addToast('CSV Export downloaded successfully', 'success');
    } catch (e) {
      console.error(e);
      addToast('CSV Export failed', 'error');
    }
  };

  // 3. Print Report (triggers PDF generation automatically in standard browsers)
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5 no-print">
      <span className="text-3xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1">
        Export Report:
      </span>
      
      {/* CSV */}
      <button
        onClick={handleExportCSV}
        className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-350 shadow-sm transition-all hover:scale-105"
        title="Download spreadsheet report"
      >
        <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
        <span>CSV</span>
      </button>

      {/* JSON */}
      <button
        onClick={handleExportJSON}
        className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-350 shadow-sm transition-all hover:scale-105"
        title="Download JSON manifest"
      >
        <FileJson className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
        <span>JSON</span>
      </button>

      {/* Print / Save PDF */}
      <button
        onClick={handlePrint}
        className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/10 transition-all hover:scale-105"
        title="Print candidate report or save as PDF"
      >
        <Printer className="h-4 w-4" />
        <span>Print / PDF</span>
      </button>
    </div>
  );
};

export default ExportButtons;
