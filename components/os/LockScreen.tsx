
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

interface LockScreenProps {
    onUnlock: () => void;
}

export function LockScreen({ onUnlock }: LockScreenProps) {
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        const tick = () => {
            const now = new Date();
            setTime(now.toTimeString().substr(0, 5));
            setDate(now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase());
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={false}
            exit={{ y: '-100%', opacity: 0, pointerEvents: 'none' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} // Custom ease
            className="fixed inset-0 z-[9000] bg-black/75 backdrop-blur-[28px] flex flex-col justify-between items-center py-16 px-6 cursor-pointer select-none"
            onClick={onUnlock}
        >
            <div className="text-center">
                <div className="font-sans text-[5.5rem] font-light tracking-[-2px] leading-none text-[#f0f0f0]">
                    {time}
                </div>
                <div className="font-mono text-[0.7rem] tracking-[5px] text-white/45 mt-3 uppercase">
                    {date}
                </div>
                <div className="mt-7 inline-block border border-white/7 bg-white/3 backdrop-blur-[10px] px-5 py-2 text-[0.6rem] tracking-[5px] text-white/18 uppercase">
                    NANOTRASEN DIRECTORATE // KC-14
                </div>
            </div>

            <div className="flex flex-col items-center animate-[pulse_2.2s_ease-in-out_infinite]">
                <ChevronUp className="w-5 h-5 mb-2 text-white/45" />
                <div className="text-[0.6rem] tracking-[4px] uppercase text-white/45">
                    tap to authenticate
                </div>
            </div>
        </motion.div>
    );
}
