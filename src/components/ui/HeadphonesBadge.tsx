import React from 'react';
import { Headphones } from 'lucide-react';

export const HeadphonesBadge = () => {
    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-medium text-primary shadow-[0_0_10px_rgba(124,58,237,0.1)]">
            <Headphones className="w-3.5 h-3.5" />
            <span>Headphones Required</span>
        </div>
    );
};
