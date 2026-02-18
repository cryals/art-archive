'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AssetItem } from '@/lib/characters';
import { LockScreen } from './LockScreen';
import { OSShell } from './Shell';
import { BootSequence } from './BootSequence';
import { FolderGrid } from '@/components/files/FolderGrid';
import { DossierViewer } from '@/components/dossier/DossierViewer';
import { ImageViewer } from '@/components/viewer/ImageViewer';
import { useSound } from '@/hooks/useSound';
import { AmbientBackground } from './AmbientBackground';

interface DesktopEnvironmentProps {
    initialCharacters: AssetItem[];
    initialDossierId?: string;
}

type ViewState = 'HOME' | 'DOSSIER' | 'GALLERY';

export function DesktopEnvironment({ initialCharacters, initialDossierId }: DesktopEnvironmentProps) {
    const { playClick, playBoot } = useSound();
    const [booted, setBooted] = useState(false);
    const [locked, setLocked] = useState(true);

    // Initialize view state based on initialDossierId
    const initialItem = initialDossierId
        ? initialCharacters.find(c => c.id.toLowerCase() === initialDossierId.toLowerCase())
        : null;

    const [view, setView] = useState<ViewState>(initialItem ? 'DOSSIER' : 'HOME');
    const [activeItem, setActiveItem] = useState<AssetItem | null>(initialItem || null);

    const handleBootComplete = () => {
        setBooted(true);
        // If we have a deep link, we might want to skip lock screen or auto-unlock
        if (initialDossierId) {
            setLocked(false);
        }
    };

    const handleUnlock = () => {
        playClick();
        setLocked(false);
    };

    const handleOpenItem = (item: AssetItem) => {
        setActiveItem(item);
        // Sync URL without reload
        window.history.pushState(null, '', `/${item.id}`);

        if (item.type === 'CHARACTER') {
            setView('DOSSIER');
        } else if (item.type === 'GALLERY') {
            setView('GALLERY');
        }
    };

    const handleBack = () => {
        playClick();
        // Sync URL back to root
        window.history.pushState(null, '', '/');

        setView('HOME');
        setActiveItem(null);
    };

    return (
        <>
            <AnimatePresence>
                {!booted && <BootSequence onComplete={handleBootComplete} />}
            </AnimatePresence>

            <AnimatePresence>
                {booted && locked && <LockScreen onUnlock={handleUnlock} />}
            </AnimatePresence>

            <motion.div
                className="h-full w-full"
                initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                animate={{ opacity: locked ? 0 : 1, scale: locked ? 0.98 : 1, filter: locked ? 'blur(10px)' : 'blur(0px)' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
                {view === 'GALLERY' && activeItem ? (
                    <ImageViewer item={activeItem} onClose={handleBack} />
                ) : (
                    <OSShell
                        title={view === 'HOME' ? 'ROOT DIRECTORY' : activeItem?.name}
                        canBack={view !== 'HOME'}
                        onBack={handleBack}
                    >
                        <AnimatePresence mode="wait">
                            {view === 'HOME' && (
                                <motion.div
                                    key="home"
                                    className="h-full w-full"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <FolderGrid items={initialCharacters} onSelect={handleOpenItem} />
                                </motion.div>
                            )}

                            {view === 'DOSSIER' && activeItem && (
                                <motion.div
                                    key="dossier"
                                    className="h-full w-full"
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 50 }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <DossierViewer character={activeItem} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </OSShell>
                )}
            </motion.div>
        </>
    );
}
