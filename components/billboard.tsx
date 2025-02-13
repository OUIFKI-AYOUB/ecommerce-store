import { Billboard as BillboardType } from '@/types'

interface BillboardProps {
  data: BillboardType | null;
}

const Billboard: React.FC<BillboardProps> = ({ data }) => {
  if (!data) {
    return null;
  }

  return (
    <div className="my-2"> {/* Added margin bottom */}
     
      {/* Desktop Version */}
      <div className='hidden md:block h-[550px] w-full relative overflow-hidden'>
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
          <div className='absolute inset-0 bg-black/20 flex items-center justify-center'>
            <div className='font-bold text-white text-4xl lg:text-5xl max-w-xl text-center px-4'>
              {data.label}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className='md:hidden relative w-full'>
        <div className='aspect-[16/9] overflow-hidden'>
          <img 
            src={data.imageUrl} 
            alt={data.label}
            className='object-cover w-full h-full'
          />
          <div className='absolute inset-0 bg-black/30'>
            <div className='h-full w-full flex flex-col justify-center items-center text-center'>
              <div className='text-white font-bold text-2xl max-w-xs px-4'>
                {data.label}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Billboard;
