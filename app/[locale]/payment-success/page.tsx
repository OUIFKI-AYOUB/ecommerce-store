"use client"
import { useEffect, useState } from "react";
import { CheckCircle, CreditCard, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import useCart from "@/hooks/use-cart";
import Confetti from "react-confetti";
import { useTranslations } from "next-intl";

const SuccessPage = () => {
  const router = useRouter();
  const removeAll = useCart((state) => state.removeAll);

  const t = useTranslations('success.card');
  const [showConfetti, setShowConfetti] = useState(true);
  const [confettiPieces, setConfettiPieces] = useState(200);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  
  // Add a separate useEffect for initial window dimensions
  useEffect(() => {
    // Set initial dimensions
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
  
    removeAll();
  
    // Start fading after 6 seconds
    const startFadeOut = setTimeout(() => {
      const fadeOutInterval = setInterval(() => {
        setConfettiPieces((prev) => {
          if (prev <= 0) {
            clearInterval(fadeOutInterval);
            setShowConfetti(false);
            return 0;
          }
          return prev - 2; // Reduce by only 2 pieces at a time
        });
      }, 300); // Update every 300ms
  
      return () => clearInterval(fadeOutInterval);
    }, 6000); // Wait 6 seconds before starting fade
  
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
  
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(startFadeOut);
    };
  }, [removeAll]);
  
  const steps = [
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: t('steps.payment.title'),
      description: t('steps.payment.description')
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: t('steps.processing.title'),
      description: t('steps.processing.description')
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: t('steps.shipping.title'),
      description: t('steps.shipping.description')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
 {showConfetti && windowDimensions.width > 0 && (
  <div style={{ 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%', 
    zIndex: 0,  // Changed from 50 to 0
    pointerEvents: 'none'  // Add this line
  }}>
    <Confetti 
      width={windowDimensions.width} 
      height={windowDimensions.height}
      numberOfPieces={confettiPieces}
      recycle={true}
      run={showConfetti}
      gravity={0.1}
      tweenDuration={5000}
    />
  </div>
)}



      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-lg w-full">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('title')}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {t('subtitle')}
            </p>
          </div>

          <div className="space-y-4 py-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-4 text-left">
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                  {step.icon}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white rtl:text-right">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => router.push('/')}
              className="w-full bg-black hover:bg-gray-800 text-white"
            >
              {t('continueButton')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;