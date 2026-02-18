
'use client';

import React, { useState, useEffect, useRef } from 'react';

interface TextScrambleProps {
    children: string;
    className?: string;
    scrambleSpeed?: number;
    revealsDuration?: number;
    autoStart?: boolean;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;:,.<>?';

export function TextScramble({
    children,
    className,
    scrambleSpeed = 30,
    revealsDuration = 1000,
    autoStart = true
}: TextScrambleProps) {
    const [displayText, setDisplayText] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (autoStart) {
            startAnimation();
        }
    }, [children, autoStart]);

    const startAnimation = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        setIsAnimating(true);
        const startTime = Date.now();
        const length = children.length;

        intervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / revealsDuration, 1);
            const revealedChars = Math.floor(progress * length);

            let result = '';

            // Reconstructed string
            for (let i = 0; i < length; i++) {
                if (i < revealedChars) {
                    result += children[i];
                } else {
                    // Random character
                    result += CHARS[Math.floor(Math.random() * CHARS.length)];
                }
            }

            setDisplayText(result);

            if (progress >= 1) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setIsAnimating(false);
            }
        }, scrambleSpeed);
    };

    return (
        <span className={className} onMouseEnter={() => !isAnimating && startAnimation()}>
            {displayText}
        </span>
    );
}
