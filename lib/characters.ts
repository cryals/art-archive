import fs from 'fs';
import path from 'path';

export type AssetType = 'CHARACTER' | 'GALLERY' | 'LOCKED';

export interface CharacterTab {
    title: string;
    content: {
        description: string[];
    };
}

export interface AssetItem {
    id: string;
    type: AssetType;
    name: string;
    sub: string;
    img: string | null;     // Thumbnail or main image
    locked?: boolean;

    // Character specific
    stats?: Record<string, string>;
    tabs?: CharacterTab[];

    // Gallery specific
    galleryImages?: { name: string; url: string }[];
}

const ASSETS_DIR = path.join(process.cwd(), 'assets');

export async function getAssets(): Promise<AssetItem[]> {
    if (!fs.existsSync(ASSETS_DIR)) {
        return [];
    }

    const entries = fs.readdirSync(ASSETS_DIR, { withFileTypes: true });
    const items: AssetItem[] = [];

    for (const entry of entries) {
        if (entry.isDirectory()) {
            const dirPath = path.join(ASSETS_DIR, entry.name);
            const files = fs.readdirSync(dirPath);

            const jsonFile = files.find(f => f.endsWith('.json'));
            const imageFiles = files.filter(f => /\.(png|jpg|jpeg|gif|webp)$/i.test(f));

            // Case 1: Character (has JSON)
            if (jsonFile) {
                try {
                    const jsonPath = path.join(dirPath, jsonFile);
                    const rawData = fs.readFileSync(jsonPath, 'utf8');
                    const data = JSON.parse(rawData);
                    const charInfo = data.character || {};

                    // Find main image (prefer same name as folder, or first image)
                    const mainImgName = imageFiles.find(f => f.toLowerCase().includes(entry.name.toLowerCase())) || imageFiles[0];

                    items.push({
                        id: entry.name,
                        type: 'CHARACTER',
                        name: charInfo.name || entry.name,
                        sub: charInfo.assignment || 'Unknown Assignment',
                        img: mainImgName ? `/api/asset/${entry.name}/${mainImgName}` : null,
                        stats: charInfo.stats || {},
                        tabs: charInfo.tabs || [],
                        locked: false
                    });
                } catch (error) {
                    console.error(`Error parsing character data for ${entry.name}:`, error);
                }
            }
            // Case 2: Image Gallery (No JSON, has images)
            else if (imageFiles.length > 0) {
                items.push({
                    id: entry.name,
                    type: 'GALLERY',
                    name: entry.name.replace(/_/g, ' '),
                    sub: `${imageFiles.length} IMAGE(S) // EVIDENTIARY`,
                    img: `/api/asset/${entry.name}/${imageFiles[0]}`, // Use first image as thumb
                    galleryImages: imageFiles.map(f => ({
                        name: f,
                        url: `/api/asset/${entry.name}/${f}`
                    })),
                    locked: false
                });
            }
        }
    }

    // Add dummy locked folders
    items.push({
        id: 'locked_1',
        type: 'LOCKED',
        name: 'COMMAND_ONLY',
        sub: 'ENCRYPTED // NO ACCESS',
        img: null,
        locked: true
    });

    return items;
}
