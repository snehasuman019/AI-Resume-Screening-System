import React from 'react';
import { Terminal, Brain, Database, Cloud, Layout, Settings, FileCode, Check, X } from 'lucide-react';

const SkillBadge = ({ skill, isFound = true }) => {
  // Categorize skills based on name matching
  const getCategory = (skillName) => {
    const s = skillName.toLowerCase();
    
    // 1. Programming Languages
    if (/\b(python|javascript|typescript|c\+\+|java|go|rust|c#|php|swift|kotlin|ruby|scala|perl|bash|shell|haskell)\b/.test(s)) {
      return 'programming';
    }
    // 2. Machine Learning & AI
    if (/\b(ml|nlp|cnn|rnn|llm|pytorch|tensorflow|keras|scikit|sklearn|pandas|numpy|transformers|bert|gemini|openai|generative|deep learning|machine learning|computer vision|data science)\b/.test(s)) {
      return 'ml';
    }
    // 3. Databases
    if (/\b(sql|mysql|postgres|postgresql|mongodb|redis|dynamodb|cassandra|sqlite|oracle|mariadb|nosql|db)\b/.test(s)) {
      return 'database';
    }
    // 4. Cloud
    if (/\b(aws|azure|gcp|google cloud|lambda|s3|ec2|cloudfront|firebase|cloudflare|heroku)\b/.test(s)) {
      return 'cloud';
    }
    // 5. Frontend & UI
    if (/\b(react|vue|angular|html|css|tailwind|sass|bootstrap|svelte|next\.js|nuxt|webpack|vite|ui|ux|frontend)\b/.test(s)) {
      return 'frontend';
    }
    // 6. DevOps & Infrastructure
    if (/\b(docker|kubernetes|git|jenkins|ci\/cd|github|gitlab|ansible|terraform|linux|nginx|devops|prometheus|grafana)\b/.test(s)) {
      return 'devops';
    }
    
    return 'unknown';
  };

  const category = getCategory(skill);

  // Category Configuration
  const categoryStyles = {
    programming: {
      color: isFound 
        ? 'bg-blue-50/70 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30' 
        : 'bg-rose-50/70 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-900/30',
      icon: Terminal
    },
    ml: {
      color: isFound 
        ? 'bg-purple-50/70 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30' 
        : 'bg-rose-50/70 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-900/30',
      icon: Brain
    },
    database: {
      color: isFound 
        ? 'bg-orange-50/70 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30' 
        : 'bg-rose-50/70 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-900/30',
      icon: Database
    },
    cloud: {
      color: isFound 
        ? 'bg-cyan-50/70 text-cyan-700 border-cyan-200 dark:bg-cyan-950/20 dark:text-cyan-400 dark:border-cyan-900/30' 
        : 'bg-rose-50/70 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-900/30',
      icon: Cloud
    },
    frontend: {
      color: isFound 
        ? 'bg-pink-50/70 text-pink-700 border-pink-200 dark:bg-pink-950/20 dark:text-pink-400 dark:border-pink-900/30' 
        : 'bg-rose-50/70 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-900/30',
      icon: Layout
    },
    devops: {
      color: isFound 
        ? 'bg-emerald-50/70 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30' 
        : 'bg-rose-50/70 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-900/30',
      icon: Settings
    },
    unknown: {
      color: isFound 
        ? 'bg-slate-50/70 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800/30' 
        : 'bg-rose-50/70 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-900/30',
      icon: FileCode
    }
  };

  const style = categoryStyles[category] || categoryStyles.unknown;
  const CategoryIcon = style.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border select-none transition-all duration-300 ${style.color}`}
    >
      {/* Category Icon */}
      <CategoryIcon className="h-3.5 w-3.5 opacity-70 shrink-0" />
      
      <span>{skill}</span>

      {/* Audit Symbol */}
      <span className="shrink-0">
        {isFound ? (
          <Check className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
        ) : (
          <X className="h-2.5 w-2.5 text-rose-600 dark:text-rose-400 stroke-[3]" />
        )}
      </span>
    </span>
  );
};

export default SkillBadge;
