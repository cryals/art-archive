'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useSound } from '@/hooks/useSound';
import clsx from 'clsx';

interface OSShellProps {
    children: React.ReactNode;
    title?: string;
    onBack?: () => void;
    canBack?: boolean;
}

export function OSShell({ children, title = 'ROOT', onBack, canBack = false }: OSShellProps) {
    const { playBack, playHover } = useSound();
    const [dateCode, setDateCode] = useState('');

    useEffect(() => {
        const now = new Date();
        setDateCode(now.toISOString().split('T')[0].replace(/-/g, '.'));
    }, []);

    return (
        <div className="fixed inset-0 z-100 flex flex-col bg-[radial-gradient(ellipse_120%_100%_at_20%_20%,rgba(255,255,255,0.018)_0%,transparent_55%),radial-gradient(ellipse_80%_120%_at_80%_80%,rgba(255,255,255,0.012)_0%,transparent_55%)] from-[#1a1a1a] via-[#000] to-[#000]">

            {/* Unified Header */}
            <div className="h-[50px] shrink-0 bg-[#080808]/90 backdrop-blur-[20px] border-b border-white/10 flex items-center justify-between px-4 gap-4 relative z-50">

                {/* Left: Navigation */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => {
                                if (canBack) {
                                    playBack();
                                    onBack?.();
                                }
                            }}
                            onMouseEnter={() => canBack && playHover()}
                            disabled={!canBack}
                            className={clsx(
                                "h-8 w-8 flex items-center justify-center rounded-[2px] transition-all duration-200 border relative group overflow-hidden",
                                canBack
                                    ? "border-white/10 bg-white/5 hover:bg-white/10 text-white cursor-pointer"
                                    : "border-transparent text-white/10 pointer-events-none"
                            )}
                        >
                            <div className="absolute inset-0 bg-red-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-100" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 40%, 0 60%)' }} />
                            <div className="absolute inset-0 bg-blue-500/20 -translate-y-full group-hover:translate-y-0 transition-transform duration-100 delay-75" style={{ clipPath: 'polygon(0 60%, 100% 40%, 100% 100%, 0 100%)' }} />
                            <ChevronLeft className="w-5 h-5 relative z-10" />
                        </button>
                    </div>

                    {/* System Breadcrumbs (Mobile: Simple Title, Desktop: Path) */}
                    <div className="flex flex-col justify-center">
                        <div className="text-[0.55rem] uppercase tracking-[2px] text-white/30 leading-tight">
                            SYSTEM // DIRECTORATE
                        </div>
                        <div className="text-[0.7rem] font-bold uppercase tracking-wider text-white/90 leading-tight">
                            {title}
                        </div>
                    </div>
                </div>

                {/* Center: Path Bar (Desktop Only) */}
                <div className="hidden md:flex flex-1 max-w-2xl items-center justify-center px-8">
                    <div className="w-full bg-black/40 border border-white/5 h-8 px-4 rounded-[2px] flex items-center gap-3 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-white/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <span className="text-green-500/80 font-mono text-xs">root@archive:</span>
                        <span className="text-white/40 font-mono text-xs">~/system/{title.toLowerCase().replace(/\s/g, '_')}</span>
                        <span className="animate-pulse w-1.5 h-3 bg-white/40 ml-auto" />
                    </div>
                </div>

                {/* Right: Status & Logo */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end leading-none">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[0.6rem] text-white/80 font-bold tracking-widest">CONNECTED</span>
                        </div>
                        <span className="text-[0.5rem] text-white/30 font-mono">{dateCode}</span>
                    </div>
                    <div className="w-8 h-8 opacity-90">
                        <img src="/api/asset/Logs/ntlogo.svg" alt="NT" className="w-full h-full object-contain" />
                    </div>
                </div>
            </div>

            {/* Viewport */}
            <div className="flex-1 relative overflow-hidden">
                {children}
            </div>
        </div >
    );
}
