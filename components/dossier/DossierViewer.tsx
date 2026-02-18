'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AssetItem } from '@/lib/characters';
import clsx from 'clsx';
import { Share_Tech_Mono } from 'next/font/google';

interface DossierViewerProps {
    character: AssetItem;
}

// Decorative component for corner brackets
import { TextScramble } from '@/components/shared/TextScramble';

// Decorative component for corner brackets
const CornerBrackets = ({ className }: { className?: string }) => (
    <div className={clsx("absolute inset-0 pointer-events-none", className)}>
        <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-white/40" />
        <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-white/40" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-white/40" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-white/40" />
    </div>
);

// Decorative scanning line
const ScanLine = () => (
    <motion.div
        initial={{ top: '0%', opacity: 0 }}
        animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="absolute left-0 right-0 h-[1px] bg-red-500/50 shadow-[0_0_8px_rgba(255,0,0,0.5)] z-20 pointer-events-none"
    />
);

import { useSound } from '@/hooks/useSound';

// ...

export function DossierViewer({ character }: DossierViewerProps) {
    const { playClick, playHover } = useSound();
    const [activeTab, setActiveTab] = useState(0);

    // Sync with URL Hash
    React.useEffect(() => {
        const handleHashChange = () => {
            const hash = decodeURIComponent(window.location.hash.substring(1));
            if (hash && character.tabs) {
                const tabIndex = character.tabs.findIndex(t => t.title.toLowerCase() === hash.toLowerCase());
                if (tabIndex !== -1) {
                    setActiveTab(tabIndex);
                }
            }
        };

        // Check on mount
        handleHashChange();

        // Listen for changes
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [character.tabs]);

    const handleTabChange = (index: number) => {
        playClick();
        setActiveTab(index);
        const title = character.tabs?.[index]?.title;
        if (title) {
            window.history.replaceState(null, '', `#${title}`);
        }
    };

    return (
        <div className="flex h-full w-full bg-[#050505]/80 backdrop-blur-[40px] flex-col md:flex-row border-t border-white/10 relative overflow-hidden">

            {/* Background Decor (Desktop Only) */}
            <div className="hidden md:block absolute top-0 right-0 p-4 opacity-10 pointer-events-none z-0">
                <div className="border border-white w-32 h-32 flex items-center justify-center rounded-full animate-[spin_10s_linear_infinite]">
                    <div className="w-2 h-2 bg-white rounded-full" />
                </div>
            </div>

            {/* LEFT COLUMN: IDENTITY & NAV */}
            {/* Mobile: Top Section. Desktop: Left Sidebar */}
            <div className="w-full md:w-[280px] shrink-0 border-b md:border-b-0 md:border-r border-white/10 flex flex-col bg-black/20 relative z-20">

                {/* Photo & Identity Group */}
                <div className="flex flex-row md:flex-col h-[100px] md:h-auto">
                    {/* Photo */}
                    <div className="aspect-square h-full md:w-full md:h-auto relative shrink-0 group border-r md:border-r-0 md:border-b border-white/10 bg-black/40 overflow-hidden">
                        {character.img ? (
                            <>
                                <motion.img
                                    initial={{ scale: 1.1, filter: 'blur(5px)' }}
                                    animate={{ scale: 1, filter: 'blur(0px)' }}
                                    transition={{ duration: 0.8 }}
                                    src={character.img}
                                    alt={character.name}
                                    className="w-full h-full object-cover pixelated grayscale contrast-[1.2] brightness-90"
                                />
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="hidden md:block"><ScanLine /></div>
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center font-sans text-6xl font-bold text-white/5 animate-pulse">?</div>
                        )}

                        <CornerBrackets className="m-2 opacity-50 hidden md:block" />

                        {/* Status Badge */}
                        <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-red-900/40 border border-red-500/30 px-1.5 py-0.5 text-[0.4rem] md:text-[0.5rem] tracking-[2px] text-red-200 uppercase backdrop-blur-sm">
                            Verified
                        </div>
                    </div>

                    {/* Identity Info */}
                    <div className="flex-1 p-4 md:p-5 flex flex-col justify-center md:border-b border-white/10 relative overflow-hidden bg-white/[0.02] md:bg-transparent">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="font-sans text-lg md:text-2xl font-bold uppercase tracking-[2px] text-white leading-none mb-1 md:mb-2">
                                <TextScramble>{character.name}</TextScramble>
                            </h1>
                            <div className="font-mono text-[0.6rem] md:text-xs text-white/50 tracking-[1px] uppercase border-l-2 border-red-500/50 pl-2">
                                <TextScramble autoStart={false} revealsDuration={500} scrambleSpeed={50}>{character.sub}</TextScramble>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Quick Stats Grid (Hidden on very small screens, visible on desktop) */}
                <div className="hidden md:grid grid-cols-2 gap-px bg-white/10 border-b border-white/10">
                    {Object.entries(character.stats || {}).map(([key, value]) => (
                        <div key={key} className="bg-[#0a0a0a] p-3 flex flex-col gap-1 hover:bg-white/5 transition-colors">
                            <span className="text-[0.55rem] uppercase tracking-[2px] text-white/40">{key}</span>
                            <span className="font-mono text-xs text-green-500/90">{value}</span>
                        </div>
                    ))}
                </div>

                {/* Navigation - Horizontal on Mobile, Vertical on Desktop */}
                <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible scrollbar-hide bg-black/40 md:bg-transparent md:py-4">
                    {(character.tabs || []).map((tab, i) => (
                        <button
                            key={i}
                            onClick={() => handleTabChange(i)} onMouseEnter={() => playHover()}
                            className={clsx(
                                "flex-none h-12 md:h-14 px-6 flex items-center gap-3 transition-all relative group whitespace-nowrap md:whitespace-nowrap border-r md:border-r-0 border-white/5 w-auto md:w-full text-left",
                                activeTab === i
                                    ? "bg-white/10 md:bg-white/5 text-white md:border-l-2 md:border-l-green-500"
                                    : "text-white/40 hover:text-white hover:bg-white/[0.02] md:border-l-2 md:border-l-transparent"
                            )}
                        >
                            {/* Active Indicator: Top bar mobile only (Desktop uses left border) */}
                            {activeTab === i && (
                                <motion.div
                                    layoutId="activeTabMobile"
                                    className="absolute left-0 right-0 top-0 h-[2px] bg-green-500 md:hidden"
                                />
                            )}

                            {/* Desktop Hover Decor */}
                            <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block pointer-events-none" />

                            <div className="text-[0.6rem] md:text-[0.65rem] font-bold tracking-[2px] uppercase flex items-center gap-2">
                                <span className={clsx("transition-colors duration-300", activeTab === i ? "text-green-500" : "text-white/30")}>0{i + 1} //</span>
                                {tab.title}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* RIGHT COLUMN: CONTENT */}
            <div className="flex-1 relative bg-black/10 flex flex-col h-full overflow-hidden z-10">
                {/* Header Decoration */}
                <div className="h-12 md:h-16 shrink-0 border-b border-white/10 flex items-center justify-between px-4 md:px-8 bg-white/[0.02]">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="font-mono text-[0.6rem] md:text-xs text-green-500 tracking-wider">
                            SECURE CONN<span className="hidden md:inline">ECTION ESTABLISHED</span>
                        </span>
                    </div>
                    <div className="font-mono text-[0.6rem] md:text-xs text-white/20">
                        {character.id.toUpperCase()} <span className="hidden md:inline">// P-{new Date().getFullYear()}-00{activeTab + 1}</span>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-12 relative scrollbar-hide">
                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none"
                        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                    />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                            animate={{ opacity: 1, filter: 'blur(0)', y: 0 }}
                            exit={{ opacity: 0, filter: 'blur(5px)', y: -20 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="relative z-10 max-w-3xl mx-auto"
                        >
                            <h2 className="font-sans text-3xl md:text-5xl border-b border-white/20 pb-4 md:pb-6 mb-6 md:mb-8 text-white/90 uppercase tracking-tight">
                                {(character.tabs || [])[activeTab]?.title}
                            </h2>

                            <div className="space-y-6">
                                {(character.tabs || [])[activeTab]?.content.description.map((text, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 + 0.2 }}
                                        className="group relative pl-4 md:pl-6"
                                    >
                                        <div className="absolute left-0 top-1.5 bottom-1.5 w-[1px] bg-white/10 group-hover:bg-green-500/50 transition-colors duration-500" />
                                        <p className="text-sm md:text-lg leading-relaxed text-white/70 font-light text-justify">
                                            {text}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer Decoration */}
                <div className="h-8 shrink-0 border-t border-white/10 bg-black/40 flex items-center justify-between px-4 text-[0.5rem] text-white/20 font-mono uppercase">
                    <span>Mem: 64TB</span>
                    <span>ID: 808-A</span>
                </div>
            </div>
        </div>
    );
}
