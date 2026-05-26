import React from 'react';
import { Search } from 'lucide-react';

const DashboardHeader = ({ user, searchQuery, setSearchQuery }) => {
  return (
    <div className="flex justify-between items-center mb-12">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-text-h mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'Akshat'}!
        </h1>
        <p className="text-text-muted text-lg">Your AI-powered mind mapping hub.</p>
      </div>

      <div className="relative w-96 hidden md:block">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input 
          type="text" 
          placeholder="Search your maps..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-bg-card border border-border rounded-xl py-3 pl-12 pr-4 text-text-h outline-none focus:border-border-focus transition-all"
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
