'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Folder, Lock, Database, Image as ImageIcon } from 'lucide-react';
import { AssetItem } from '@/lib/characters';
import { useSound } from '@/hooks/useSound';
import clsx from 'clsx';

interface FolderGridProps {
    items: AssetItem[];
    onSelect: (item: AssetItem) => void;
}

export function FolderGrid({ items, onSelect }: FolderGridProps) {
    const { playHover, playClick } = useSound();

    return (
        <div className="p-8 md:p-12 overflow-y-auto h-full scrollbar-hide">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {items.map((item, i) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        onClick={() => {
                            if (!item.locked) {
                                playClick();
                                onSelect(item);
                            }
                        }}
                        onMouseEnter={() => !item.locked && playHover()}
                        whileHover={!item.locked ? { scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' } : {}}
                        whileTap={!item.locked ? { scale: 0.98 } : {}}
                        className={clsx(
                            "group relative h-[160px] p-6 flex flex-col justify-between border backdrop-blur-md transition-all duration-300",
                            item.locked
                                ? "border-white/5 bg-black/20 opacity-40 cursor-not-allowed grayscale"
                                : "border-white/10 bg-white/[0.02] hover:border-white/30 cursor-pointer shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                        )}
                    >
                        {/* Decorative Corners */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-white/20 group-hover:border-white/60 transition-colors" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-white/20 group-hover:border-white/60 transition-colors" />

                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div className={clsx("transition-colors duration-300", item.locked ? "text-white/20" : "text-white/40 group-hover:text-red-400")}>
                                {item.locked ? <Lock className="w-8 h-8" strokeWidth={1.5} /> :
                                    item.type === 'GALLERY' ? <ImageIcon className="w-8 h-8" strokeWidth={1.5} /> :
                                        <Folder className="w-8 h-8" strokeWidth={1.5} />
                                }
                            </div>
                            <div className="text-[0.55rem] font-mono tracking-[2px] text-white/20">
                                {item.stats?.['File ID'] || (item.type === 'GALLERY' ? 'LOG-IMG' : 'DIR-0') + i}
                            </div>
                        </div>

                        {/* Footer content */}
                        <div>
                            <h3 className="font-sans text-lg font-bold tracking-[2px] uppercase text-white mb-1 group-hover:translate-x-1 transition-transform truncate">
                                {item.name}
                            </h3>
                            <div className="flex items-center gap-2">
                                <div className={clsx("w-1.5 h-1.5 rounded-full", item.locked ? "bg-red-900" : "bg-green-500/50 group-hover:bg-green-400 group-hover:shadow-[0_0_5px_#4ade80]")} />
                                <span className="text-[0.6rem] tracking-[2px] uppercase text-white/30 truncate block max-w-full">
                                    {item.sub}
                                </span>
                            </div>
                        </div>

                        {/* Hover Technical Detail */}
                        {!item.locked && (
                            <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Database className="w-4 h-4 text-white/10" />
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
