// components/Logo.tsx
import React from 'react';
import Image from 'next/image';

interface LogoProps {
  altText?: string;
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({
  altText = 'Logo Recikla Maricá',
  width = 300,
  height = 300,
}) => {
  return (
    <div className="text-center d-flex justify-content-center">
      <Image src="/logo_recikla_marica.jpg" alt={altText} width={width} height={height} />
    </div>
  );
};

export default Logo;
