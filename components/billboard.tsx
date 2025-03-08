"use client";

import { Billboard as BillboardType } from '@/types';
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface BillboardProps {
  data: BillboardType | null;
}

const Billboard: React.FC<BillboardProps> = ({ data }) => {
  const router = useRouter();
  const t = useTranslations('codForm');

  if (!data) {
    return null;
  }

  const handleRedirect = () => {
    if (data.label) {
      router.push(data.label);
    }
  };

  return (
    <div className="my-[17px]">
      {/* Desktop Version */}
      <div className='hidden md:block h-[600px] rounded-md w-full relative overflow-hidden object-cover'>
        <div 
          className='absolute inset-0'
          style={{
            backgroundImage: `url('${data.imageUrl}')`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '100%',
            height: '100%'
          }}
        >
          <div className='absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-center'>
            {data.label && (
              <button 
                onClick={handleRedirect}
                className="text-white border-2 border-white font-semibold py-1 px-10 rounded-md text-lg hover:bg-transparent transition hover:scale-105 hover:duration-500 hover:text-pink-600"
              >
                {t('shopNow')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className='md:hidden relative w-full rounded-md'>
        <div className='aspect-[4/3] overflow-hidden'>
          <img 
            src={data.imageUrl} 
            alt={data.label}
            className='object-cover w-full h-full'
          />
          <div className='absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-center'>
            {data.label && (
              <button 
                onClick={handleRedirect}
                className="text-white border-2 border-white font-semibold py-1 px-4 rounded-md text-lg hover:bg-transparent transition hover:scale-105 hover:duration-500 hover:text-pink-600"
              >
                {t('shopNow')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Billboard;
