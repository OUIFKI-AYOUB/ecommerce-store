import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, Place, WhatsApp } from '@mui/icons-material';

const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col p-5">
        <h1 className="text-2xl font-bold">KOYP</h1>
        <p className="my-5">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempora, obcaecati optio. Facilis accusamus quos fugiat quam eligendi voluptatem, adipisci dolor ex aliquam quisquam officiis repellendus corporis sit deleniti fugit asperiores.
        </p>
        <div className="flex">
          {[
            { Icon: Facebook, color: '#4267B2', link: 'https://facebook.com/' },
            { Icon: Instagram, color: '#E4405F', link: 'https://instagram.com/' },
            { Icon: WhatsApp, color: '#25D366', link: 'https://wa.me/' },
          ].map(({ Icon, color, link }, index) => (
            <Link href={link} key={index} target="_blank" rel="noopener noreferrer">
              <div className="w-10 h-10 rounded-full text-white flex items-center justify-center mr-2.5 transition-transform hover:scale-110" style={{ backgroundColor: color }}>
                <Icon />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex-1 p-5 hidden md:block">
        <h3 className="text-xl font-semibold mb-7.5">Useful links</h3>
        <ul className="m-0 p-0 list-none flex flex-wrap">
          {['Home', 'Cart', 'Man Fashion', 'Women Fashion', 'Accessories', 'Terms'].map((item, index) => (
            <li key={index} className="w-1/2 mb-2.5">
              <Link href={`/${item.toLowerCase().replace(' ', '-')}`}>
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 p-5 bg-gray-100">
        <h3 className="text-xl font-semibold mb-7.5 p-2">Contact</h3>
        {[
          { Icon: Place, text: 'address' },
          { Icon: Phone, text: '+7536462093' },
          { Icon: Mail, text: 'jie@gmail.com' },
        ].map(({ Icon, text }, index) => (
          <div key={index} className="mb-5 flex items-center">
            <Icon className="mr-5" />
            {text}
          </div>
        ))}
        <Image
          src="https://i.ibb.co/Qfvn4z6/payment.png"
          alt="Payment methods"
          width={200}
          height={50}
        />
      </div>
    </footer>
  );
};

export default Footer;