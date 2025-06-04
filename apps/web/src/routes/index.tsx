import Hero from '@/components/hero/hero-section';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <div className="h-screen w-full overflow-hidden">
      <Hero />
    </div>
  );
}
