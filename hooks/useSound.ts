'use client';

import { useCallback } from 'react';

// Advanced synthetic sound generator
const playSynth = (type: 'hover' | 'click' | 'boot' | 'back') => {
    if (typeof window === 'undefined') return;

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    try {
        const ctx = new AudioContext();
        const t = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'hover') {
            // High pitch chirp
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, t);
            osc.frequency.exponentialRampToValueAtTime(1200, t + 0.05);

            gain.gain.setValueAtTime(0.02, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

            osc.start(t);
            osc.stop(t + 0.05);
        }
        else if (type === 'click') {
            // Mechanical click
            osc.type = 'square';
            osc.frequency.setValueAtTime(200, t);
            osc.frequency.exponentialRampToValueAtTime(50, t + 0.1);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(3000, t);
            filter.frequency.exponentialRampToValueAtTime(100, t + 0.1);

            gain.gain.setValueAtTime(0.05, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

            osc.start(t);
            osc.stop(t + 0.1);
        }
        else if (type === 'back') {
            // Descending "cancel" tone
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, t);
            osc.frequency.exponentialRampToValueAtTime(200, t + 0.15);

            gain.gain.setValueAtTime(0.05, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

            osc.start(t);
            osc.stop(t + 0.15);
        }
        else if (type === 'boot') {
            // Power up swell
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(50, t);
            osc.frequency.exponentialRampToValueAtTime(200, t + 1.5);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(100, t);
            filter.frequency.linearRampToValueAtTime(2000, t + 1.5);

            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.1, t + 0.5);
            gain.gain.linearRampToValueAtTime(0, t + 1.5);

            osc.start(t);
            osc.stop(t + 1.5);
        }

    } catch (e) {
        console.error("Audio play failed", e);
    }
};

export function useSound() {
    const playHover = useCallback(() => playSynth('hover'), []);
    const playClick = useCallback(() => playSynth('click'), []);
    const playBack = useCallback(() => playSynth('back'), []);
    const playBoot = useCallback(() => playSynth('boot'), []);

    return { playHover, playClick, playBack, playBoot };
}
