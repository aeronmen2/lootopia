import ArtefactsSection from '@/components/artefacts/artefacts-section';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/artefacts')({
  component: ArtefactsPage,
});

function ArtefactsPage() {
  return (
    <div className="h-screen">
      <ArtefactsSection />
    </div>
  );
}
