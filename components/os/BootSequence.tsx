
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BootSequenceProps {
    onComplete: () => void;
}

const BOOT_LOGS = [
    "INITIALIZING KERNEL...",
    "LOADING DRIVERS [OK]",
    "MOUNTING FILE SYSTEM...",
    "CHECKING INTEGRITY... [VERIFIED]",
    "CONNECTING TO NANOTRASEN NET...",
    "ESTABLISHING SECURE TUNNEL [KC-14]",
    "DECRYPTING USER PROFILE...",
    "ACCESS GRANTED."
];

export function BootSequence({ onComplete }: BootSequenceProps) {
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        let delay = 0;

        // Add logs one by one
        BOOT_LOGS.forEach((log, index) => {
            delay += Math.random() * 300 + 100; // Random delay between 100-400ms
            setTimeout(() => {
                setLogs(prev => [...prev, log]);
            }, delay);
        });

        // Complete after all logs + buffer
        setTimeout(() => {
            onComplete();
        }, delay + 800);

    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[9999] bg-black text-green-500 font-mono text-sm p-10 flex flex-col justify-end pointer-events-none"
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
        >
            <div className="mb-4 text-xs opacity-50">
                NANOTRASEN SECURE BOOTLOADER v2.4.1
            </div>

            <div className="flex flex-col gap-1">
                {logs.map((log, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-white/80"
                    >
                        <span className="text-green-500 mr-2">{'>'}</span>
                        {log}
                    </motion.div>
                ))}
                <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-2 h-4 bg-green-500 mt-1"
                />
            </div>

            {/* Decorative Scanline */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]" style={{ backgroundSize: "100% 2px, 3px 100%" }} />
        </motion.div>
    );
}
