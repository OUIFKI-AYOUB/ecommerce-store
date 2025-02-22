"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Package, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { useTranslations } from "next-intl";

declare global {
  interface Window {
    gtag: (command: string, action: string, params: object) => void;
  }
}



const SuccessPage = () => {
  const router = useRouter();
  const t = useTranslations('success.cod');
  const [showConfetti, setShowConfetti] = useState(true);
  const [confettiPieces, setConfettiPieces] = useState(200);
  const [windowDimensions, setWindowDimensions] = useState({ 
    width: 0,
    height: 0 
  });

  useEffect(() => {
    // Set initial dimensions
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
  
    // Track purchase
    const trackPurchase = () => {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'purchase_success', {
          event_category: 'ecommerce',
          event_label: 'COD Order Success'
        });
      }
    };
    trackPurchase();
  
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
    }, 6000);
  
    // Handle resize
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
  }, []);


  const steps = [
    {
      icon: <Package className="w-6 h-6" />,
      title: t('steps.processing.title'),
      description: t('steps.processing.description')
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: t('steps.confirmation.title'),
      description: t('steps.confirmation.description')
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: t('steps.delivery.title'),
      description: t('steps.delivery.description')
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