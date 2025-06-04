import MyArtefactsSection from '@/components/artefacts/my-artefacts-section';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/artefacts')({
  component: ArtefactsePage,
});

function ArtefactsePage() {
  return (
    <div className="h-screen">
      <MyArtefactsSection />
    </div>
  );
}
