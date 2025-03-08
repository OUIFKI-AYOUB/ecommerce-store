import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, Place, WhatsApp } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './language-switcher';
import { MotionDiv } from "@/components/animations/motion-wrapper";

const Footer = () => {
  const t = useTranslations('mobile-nav');

  return (
                <MotionDiv
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
    <footer className="flex flex-col md:flex-row bg-gray-100 dark:bg-gray-800">
      {/* Store Information Section */}
      <div className="flex-1 flex flex-col p-5">
  <div className="flex items-center"> {/* Add this container */}
    <h1 className="text-base font-bold mr-2">متجر العفيفات</h1> {/* Add margin-right for spacing */}
    <Image
      src="/images/loga.png"
      alt="transfer"
      width={40}
      height={15}
      className="dark:opacity-90"
    />
  </div>
  <p className="my-5 text-sm">
    بيع الملابس الشرعية نقابات عباءات حجابات
    <br />
    قفازات كل ما تحتاجه المرأة المسلمة
  </p>

        <div className="flex">
          {[
            { Icon: Facebook, color: '#4267B2', link: 'https://web.facebook.com/amina.sahrawi.355' },
            { Icon: Instagram, color: '#E4405F', link: 'https://www.instagram.com/matjar_leafifat/?hl=en' },
            { Icon: WhatsApp, color: '#25D366', link: 'https://wa.me/+212633182513' },
          ].map(({ Icon, color, link }, index) => (
            <Link href={link} key={index} target="_blank" rel="noopener noreferrer">
              <div
                className="w-10 h-10 rounded-full text-white flex items-center justify-center mr-2.5 transition-transform hover:scale-110"
                style={{ backgroundColor: color }}
              >
                <Icon />
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className=" border-t dark:border-gray-700" />

      {/* Useful Links Section */}
      <div className="flex-1 p-5">
        <h3 className="text-base font-semibold mb-4">Useful links</h3>
        <ul className="m-0 p-0 text-sm list-none flex flex-wrap">
          {[
            { id: 'home', name: t('Home'), path: '/' },
            { id: 'all-products', name: t('AllProducts'), path: '/all-products' },
            { id: 'new-arrivals', name: t('NewArrivals'), path: '/new-arrivals' },
          ].map((item) => (
            <li key={item.id} className="w-1/2 mb-2.5">
              <Link href={item.path} className="hover:text-pink-600 transition-colors">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
  <br /> 
<LanguageSwitcher /> 

        
      </div>

      <div className=" border-t dark:border-gray-700" />

      {/* Contact Information Section */}
      <div className="flex-1 p-5">
        <h3 className="text-base font-semibold mb-4">Contact</h3>
        {[
          { Icon: Place, text: 'طنجة .الخيرية دبن ديبان قرب الدائرة 6 القديمة' },
          { Icon: Place, text: 'طنجة .الحومة الحداد قرب سوق الحداد' },
          { Icon: Phone, text: '+7536462093' },
          { Icon: Mail, text: 'jie@gmail.com' },
        ].map(({ Icon, text }, index) => (
          <div key={index} className="mb-5 flex items-center text-gray-700 dark:text-gray-200">
            <Icon className="mr-5  text-gray-600 dark:text-gray-300" />
          <div className='text-[15px]'>
          {text}
            </div>  
          </div>
        ))}
       <div className="flex flex-row items-center space-x-2  dark:bg-gray-300 p-2 w-[200px] rounded-md">
  <Image
    src="/images/visa.png"
    alt="Visa"
    width={35}
    height={12}
    className="dark:opacity-90"
  />
    <Image
    src="/images/mast.png"
    alt="Mastercard"
    width={35}
    height={12}
    className="dark:opacity-90"
  />
  <Image
    src="/images/paypal.png"
    alt="PayPal"
    width={35}
    height={12}
    className="dark:opacity-90"
  />

    <Image
    src="/images/transfer.png"
    alt="transfer"
    width={35}
    height={12}
    className="dark:opacity-90"
  />
</div>

      </div>
      


      
    </footer>
    <div className="pt-2 pb-2 text-center text-[15px] text-gray-600 dark:text-gray-300 dark  bg-gray-100 dark:bg-gray-800">
          © 2025 - Matjar leafifat. All rights reserved. developed by{' '}
          <a
            href="https://k-voyd.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:text-pink-700 transition-colors"
          >
            K-voyd.com
          </a>
        </div>
                </MotionDiv>
    
    
  );
};

export default Footer;