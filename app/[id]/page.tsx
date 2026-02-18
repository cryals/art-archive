
import { getAssets } from '@/lib/characters';
import { DesktopEnvironment } from '@/components/os/DesktopEnvironment';

export async function generateStaticParams() {
    const assets = await getAssets();
    // Only generate params for characters/folders that are suitable for deep linking
    return assets.map((asset) => ({
        id: asset.id,
    }));
}

export default async function CharacterPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const characters = await getAssets();

    return (
        <main className="h-screen w-screen bg-black overflow-hidden relative">
            <DesktopEnvironment
                initialCharacters={characters}
                initialDossierId={params.id}
            />
        </main>
    );
}
