import HuntsSection from '@/components/hunts/hunts-section';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/hunts')({
  component: HuntsPage,
});

function HuntsPage() {
  return (
    <div className="h-screen pt-20">
      <HuntsSection />
    </div>
  );
}
