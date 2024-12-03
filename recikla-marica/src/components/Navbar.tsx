// components/Navbar.tsx
import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link href="/" passHref>
          <span className="navbar-brand">Recikla Maricá</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
