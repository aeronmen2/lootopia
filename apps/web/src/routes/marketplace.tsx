import ArtefactsSection from '@/components/artefacts/artefacts-section';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/marketplace')({
  component: MarketplacePage,
});

function MarketplacePage() {
  return (
    <div className="h-screen">
      <ArtefactsSection />
    </div>
  );
}
