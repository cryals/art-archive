
import { getAssets } from '@/lib/characters';
import { DesktopEnvironment } from '@/components/os/DesktopEnvironment';

export default async function Home() {
  const characters = await getAssets();

  return (
    <main className="h-screen w-screen bg-black overflow-hidden relative">
      <DesktopEnvironment initialCharacters={characters} />
    </main>
  );
}
