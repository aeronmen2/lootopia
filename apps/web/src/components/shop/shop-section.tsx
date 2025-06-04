import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import useToast from '@/hooks/useToast';
import { useBalance } from '@/hooks/query/useBalanceQuery';
import { useCreateCheckout } from '@/hooks/query/usePaymentMutation';

// Currency packages
const CURRENCY_PACKAGES = [
  {
    id: 'micro',
    name: 'Discovery Pack',
    amount: 10,
    price: 0.99,
    popular: false,
  },
  {
    id: 'small',
    name: 'Basic Pack',
    amount: 25,
    price: 2.49,
    popular: false,
  },
  {
    id: 'medium',
    name: 'Standard Pack',
    amount: 50,
    price: 4.99,
    popular: true,
  },
  {
    id: 'large',
    name: 'Premium Pack',
    amount: 100,
    price: 9.99,
    popular: false,
  },
  {
    id: 'mega',
    name: 'Mega Pack',
    amount: 1000,
    price: 89.99,
    popular: false,
  },
];

const ShopSection = () => {
  const { toast } = useToast();
  const { data: balanceData } = useBalance();
  const createCheckoutMutation = useCreateCheckout();
  const [selectedPackage, setSelectedPackage] = useState(CURRENCY_PACKAGES[2]); // default to medium package

  const handlePurchase = async () => {
    try {
      const data = await createCheckoutMutation.mutateAsync(selectedPackage.id);

      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error({
        title: 'Error',
        message: 'Error creating checkout',
      });
    }
  };

  return (
    <section className="relative h-screen pt-20 bg-white overflow-hidden">
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-3xl animate-bounce">👑</span>
            <span className="text-3xl animate-bounce">💎</span>
            <span className="text-3xl animate-bounce">✨</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            Crown Shop
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Purchase crowns to unlock premium features and enhance your treasure
            hunting experience
          </p>

          {/* Current Balance */}
          <div className="inline-flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 shadow-lg">
            <span className="text-yellow-500 text-lg">👑</span>
            <span className="text-gray-700 font-medium">Current Balance:</span>
            <span className="text-xl font-bold text-gray-900">
              {balanceData ?? 0}
            </span>
            <span className="text-gray-600">crowns</span>
          </div>
        </div>

        {/* Crown Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {CURRENCY_PACKAGES.map((pkg) => (
            <Card
              key={pkg.id}
              className={`cursor-pointer transition-all duration-300 group bg-white border border-gray-200 hover:border-gray-300 hover:scale-105 hover:shadow-xl ${
                selectedPackage.id === pkg.id
                  ? 'ring-2 ring-black border-black shadow-lg scale-105'
                  : 'shadow-md'
              }`}
              onClick={() => setSelectedPackage(pkg)}
            >
              <CardHeader className="relative pb-2">
                {pkg.popular && (
                  <div className="absolute -top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    Popular
                  </div>
                )}
                <CardTitle className="flex items-center justify-center text-lg text-gray-900">
                  <span className="font-bold text-2xl">{pkg.amount}</span>
                  <span className="text-yellow-500 text-xl ml-2">👑</span>
                </CardTitle>
                <CardDescription className="text-gray-600 text-center text-xs">
                  {pkg.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="py-1 text-center">
                <p className="text-xl font-bold text-gray-900">${pkg.price}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {((pkg.price / pkg.amount) * 100).toFixed(1)}¢ per crown
                </p>
              </CardContent>
              <CardFooter className="pt-0 pb-2">
                <Button
                  className={`w-full text-xs h-7 transition-all duration-200 ${
                    selectedPackage.id === pkg.id
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-gray-50 border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  {selectedPackage.id === pkg.id ? '✓ Selected' : 'Select'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Purchase Summary */}
        <div className="flex justify-center">
          <Card className="w-full max-w-sm bg-white border border-gray-200 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-center text-lg text-gray-900">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">
                    {selectedPackage.name}
                  </span>
                  <div className="flex items-center">
                    <span className="font-medium text-base text-gray-900">
                      {selectedPackage.amount}
                    </span>
                    <span className="text-yellow-500 text-base ml-1">👑</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  <span>
                    {(
                      (selectedPackage.price / selectedPackage.amount) *
                      100
                    ).toFixed(1)}{' '}
                    cents per crown
                  </span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-gray-200 text-base">
                  <span className="text-gray-700">Total</span>
                  <span className="text-gray-900">
                    ${selectedPackage.price}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-3">
              <Button
                className="w-full bg-black text-white hover:bg-gray-800 font-bold py-2 text-base rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
                size="lg"
                onClick={handlePurchase}
                disabled={createCheckoutMutation.isPending}
              >
                {createCheckoutMutation.isPending ? (
                  <>
                    <span>🔄</span>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>💳</span>
                    <span>Purchase for ${selectedPackage.price}</span>
                    <svg
                      className="w-4 h-4 ml-1"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M1.5 6.375c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 17.625V6.375Z" />
                      <path
                        d="M21 9.375A.375.375 0 0 0 20.625 9H3.375a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h17.25a.375.375 0 0 0 .375-.375v-1.5Z"
                        fill="#fff"
                      />
                      <text
                        x="12"
                        y="15"
                        textAnchor="middle"
                        fontSize="6"
                        fill="#fff"
                        fontFamily="Arial, sans-serif"
                        fontWeight="bold"
                      >
                        STRIPE
                      </text>
                    </svg>
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Bottom Section - Security Info */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            🔒 Secure payment via Stripe. By making this purchase, you agree to
            our terms and conditions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ShopSection;
