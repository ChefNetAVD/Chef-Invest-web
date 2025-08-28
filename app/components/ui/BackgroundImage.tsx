import React from 'react';
import Image from 'next/image';

interface BackgroundImageProps {
  className?: string;
  imageSrc?: string;
}

export const BackgroundImage: React.FC<BackgroundImageProps> = ({ 
  className = '',
  imageSrc = 'https://res.cloudinary.com/djhcpt3oc/image/upload/v1756379820/2_1-4_ysrbwr.png'
}) => {
  return (
    <div 
      className={`relative w-full max-w-[1536px] h-[860px] mx-auto ${className}`}
      style={{
        borderRadius: '0 0 70px 70px',
        overflow: 'hidden'
      }}
    >
      {/* Фоновое изображение */}
      <Image
        src={imageSrc}
        alt="ChefNet Hero Background"
        fill
        className="object-cover object-center"
        priority
        quality={100}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1536px"
      />
      
      {/* Градиентный оверлей для лучшего контраста текста */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-orange-500/10 to-red-600/30"></div>
    </div>
  );
}; 