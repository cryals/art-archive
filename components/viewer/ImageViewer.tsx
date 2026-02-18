
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AssetItem } from '@/lib/characters';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSound } from '@/hooks/useSound';
import clsx from 'clsx';

interface ImageViewerProps {
    item: AssetItem;
    onClose: () => void;
}

import { TextScramble } from '@/components/shared/TextScramble';

const crtVariants = {
    hidden: {
        opacity: 0,
        scaleY: 0.005,
        scaleX: 0,
        filter: 'brightness(5)'
    },
    visible: {
        opacity: 1,
        scaleY: 1,
        scaleX: 1,
        filter: 'brightness(1)',
        transition: {
            duration: 0.4,
            scaleX: { delay: 0.1, duration: 0.3 },
            scaleY: { duration: 0.3 },
            filter: { duration: 0.4, delay: 0.2 }
        }
    },
    exit: {
        opacity: 0,
        scaleY: 0.005,
        scaleX: 0,
        filter: 'brightness(5)',
        transition: {
            duration: 0.3,
            scaleX: { duration: 0.2 },
            scaleY: { delay: 0.1, duration: 0.2 }
        }
    }
};

export function ImageViewer({ item, onClose }: ImageViewerProps) {
    const { playClick, playHover, playBack } = useSound();
    const images = item.galleryImages || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const currentImage = images[currentIndex];
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [isHoveringControl, setIsHoveringControl] = useState(false);

    // Reset zoom/pan when changing images
    React.useEffect(() => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    }, [currentIndex]);

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (currentIndex < images.length - 1) {
            playClick();
            setCurrentIndex(c => c + 1);
        }
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (currentIndex > 0) {
            playClick();
            setCurrentIndex(c => c - 1);
        }
    };

    const handleZoomIn = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        playClick();
        setScale(s => s * 1.2); // Exponential zoom is better for large scales
    };

    const handleZoomOut = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        playClick();
        setScale(s => Math.max(s / 1.2, 0.1));
        if (scale <= 2) setPosition({ x: 0, y: 0 });
    };

    // Wheel Zoom Handler
    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const delta = -e.deltaY;
            const factor = 1.1;

            if (delta > 0) {
                setScale(s => s * factor);
            } else {
                setScale(s => Math.max(s / factor, 0.1));
            }
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, []);

    const handleClose = () => {
        playBack();
        onClose();
    };

    return (
        <motion.div
            variants={crtVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[200] flex flex-col bg-[#050505] overflow-hidden"
        >

            {/* 2. MAIN HEADER (Matching OSShell Layout) */}
            <div className="h-[50px] shrink-0 bg-[#080808]/90 backdrop-blur-[20px] border-b border-white/10 flex items-center justify-between px-4 gap-4 relative z-[210]">

                {/* Left: Navigation (Close) */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleClose}
                        onMouseEnter={() => {
                            playHover();
                            setIsHoveringControl(true);
                        }}
                        onMouseLeave={() => setIsHoveringControl(false)}
                        className="h-8 w-8 flex items-center justify-center rounded-[2px] transition-all duration-200 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/40 text-red-200 group cursor-pointer"
                    >
                        <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    </button>

                    <div className="flex flex-col justify-center">
                        <div className="text-[0.55rem] uppercase tracking-[2px] text-white/30 leading-tight">
                            REF // {String(currentIndex + 1).padStart(3, '0')}
                        </div>
                        <div className="text-[0.7rem] font-bold uppercase tracking-wider text-white/90 leading-tight">
                            <TextScramble>{currentImage?.name || item.name}</TextScramble>
                        </div>
                    </div>
                </div>

                {/* Center: Zoom Controls (Styled like Path Bar) */}
                <div className="hidden md:flex flex-1 max-w-lg items-center justify-center px-4">
                    <div className="w-full bg-black/40 border border-white/5 h-8 px-1 rounded-[2px] flex items-center justify-between relative">
                        <button
                            onClick={handleZoomOut}
                            onMouseEnter={playHover}
                            className="h-full px-3 text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-20 transition-colors flex items-center justify-center"
                        >
                            <ZoomOut className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center gap-2 font-mono text-xs text-green-500/90 tracking-widest">
                            <span>ZOOM:</span>
                            <span className="w-12 text-center">{Math.round(scale * 100)}%</span>
                        </div>

                        <button
                            onClick={handleZoomIn}
                            onMouseEnter={playHover}
                            className="h-full px-3 text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-20 transition-colors flex items-center justify-center"
                        >
                            <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* Right: Logo & Status */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end leading-none">
                        <span className="text-[0.5rem] text-white/30 font-mono">RESOLUTION</span>
                        <span className="text-[0.6rem] text-white/70 font-bold tracking-widest">RAW // PIXEL</span>
                    </div>
                    <div className="w-8 h-8 opacity-90">
                        <img src="/api/asset/Logs/ntlogo.svg" alt="NT" className="w-full h-full object-contain" />
                    </div>
                </div>
            </div>

            {/* Main Viewport */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden p-0 bg-[#020202]" ref={containerRef}>
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] opacity-50 pointer-events-none" />

                {/* Mobile Zoom Controls (Floating) */}
                <div className="md:hidden absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 p-1 rounded-full z-30">
                    <button onClick={handleZoomOut} className="p-2 text-white/70"><ZoomOut className="w-4 h-4" /></button>
                    <span className="text-[0.6rem] font-mono text-white w-8 text-center">{Math.round(scale * 100)}%</span>
                    <button onClick={handleZoomIn} className="p-2 text-white/70"><ZoomIn className="w-4 h-4" /></button>
                </div>

                {/* Arrow Navigation */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            disabled={currentIndex === 0}
                            className="absolute left-4 md:left-8 z-30 p-4 rounded-full border border-white/5 bg-black/40 text-white/20 hover:text-white hover:bg-white/10 hover:border-white/20 disabled:hidden transition-all group backdrop-blur-[2px]"
                        >
                            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={nextImage}
                            disabled={currentIndex === images.length - 1}
                            className="absolute right-4 md:right-8 z-30 p-4 rounded-full border border-white/5 bg-black/40 text-white/20 hover:text-white hover:bg-white/10 hover:border-white/20 disabled:hidden transition-all group backdrop-blur-[2px]"
                        >
                            <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </>
                )}

                {/* Image Container with Drag/Zoom */}
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-move active:cursor-grabbing">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentImage?.url}
                            className="relative"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                                opacity: 1,
                                scale: scale,
                                x: position.x,
                                y: position.y
                            }}
                            drag
                            dragConstraints={containerRef}
                            dragElastic={0.2}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 20
                            }}
                        >
                            <img
                                src={currentImage?.url}
                                alt={currentImage?.name}
                                className="max-w-[95vw] max-h-[85vh] object-contain pixelated shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                                draggable={false}
                                style={{ imageRendering: 'pixelated' }}
                            />

                            {/* Pro Overlay: Only visible when zoomed */}
                            <motion.div
                                className="absolute inset-0 border border-green-500/30 pointer-events-none"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: scale > 1 ? 1 : 0 }}
                            >
                                <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-green-500" />
                                <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-green-500" />
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-green-500" />
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-green-500" />
                                <div className="absolute inset-0 bg-green-500/5 mix-blend-overlay" />
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
