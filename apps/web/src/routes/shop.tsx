import { createFileRoute } from '@tanstack/react-router';
import ShopSection from '@/components/shop/shop-section';

export const Route = createFileRoute('/shop')({
  component: ShopPage,
});

function ShopPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <ShopSection />
    </div>
  );
}
