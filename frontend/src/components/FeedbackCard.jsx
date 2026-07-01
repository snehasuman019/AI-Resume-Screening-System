import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ThumbsUp, ThumbsDown, Lightbulb, FileText, Copy, Check, ChevronDown } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const FeedbackCard = ({ type, data }) => {
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(true); // default open
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const configurations = {
    summary: {
      title: 'AI Executive Summary',
      icon: FileText,
      bgColor: 'bg-indigo-50/50 dark:bg-indigo-950/10 border-indigo-100 dark:border-indigo-900/20',
      textColor: 'text-indigo-900 dark:text-indigo-300',
      iconBg: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400',
      bulletColor: 'bg-indigo-500 dark:bg-indigo-400',
    },
    strengths: {
      title: 'Key Strengths',
      icon: ThumbsUp,
      bgColor: 'bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/20',
      textColor: 'text-emerald-950 dark:text-emerald-300',
      iconBg: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400',
      bulletColor: 'bg-emerald-500 dark:bg-emerald-400',
    },
    weaknesses: {
      title: 'Identified Gaps / Weaknesses',
      icon: ThumbsDown,
      bgColor: 'bg-rose-50/40 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/20',
      textColor: 'text-rose-955 dark:text-rose-300',
      iconBg: 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-455',
      bulletColor: 'bg-rose-500 dark:bg-rose-400',
    },
    improvements: {
      title: 'Resume Recommendations',
      icon: Lightbulb,
      bgColor: 'bg-amber-50/40 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/20',
      textColor: 'text-amber-955 dark:text-amber-300',
      iconBg: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400',
      bulletColor: 'bg-amber-500 dark:bg-amber-400',
    },
    questions: {
      title: 'Suggested Interview Questions',
      icon: HelpCircle,
      bgColor: 'bg-blue-50/40 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/20',
      textColor: 'text-blue-955 dark:text-blue-300',
      iconBg: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400',
      bulletColor: 'bg-blue-500 dark:bg-blue-400',
    },
  };

  const config = configurations[type];
  if (!config) return null;

  const IconComponent = config.icon;
  const isArray = Array.isArray(data);

  const handleCopy = (e) => {
    e.stopPropagation(); // Stop expansion toggle when copying
    
    let copyText = '';
    if (isArray) {
      copyText = data.map((item, idx) => `${idx + 1}. ${item}`).join('\n');
    } else {
      copyText = data;
    }

    navigator.clipboard.writeText(copyText);
    setCopied(true);
    addToast(`${config.title} copied to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md ${config.bgColor}`}>
      {/* Collapsible Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-4 cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.iconBg}`}>
            <IconComponent className="h-5 w-5" />
          </div>
          <h3 className={`text-sm md:text-base font-bold ${config.textColor}`}>
            {config.title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-850 shadow-3xs transition-all hover:scale-105 active:scale-95"
            title="Copy to clipboard"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </button>

          {/* Chevron Rotate */}
          <div className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-950 text-slate-400 transition-colors">
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Accordion Expansion Panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/40 text-sm leading-relaxed text-slate-700 dark:text-slate-350 transition-colors duration-300">
              {isArray ? (
                data.length > 0 ? (
                  <ul className="space-y-3">
                    {data.map((item, index) => (
                      <li key={index} className="flex items-start gap-2.5">
                        <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${config.bulletColor}`} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-slate-400 dark:text-slate-500">None identified.</p>
                )
              ) : (
                <p className="whitespace-pre-wrap">{data}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedbackCard;
