import React, { useEffect, useRef } from 'react';
import clientsLogos from '../assets/clients-images.webp';
import clientTwo from '../assets/image (21).webp';
import clientThree from '../assets/clients-images (1).webp';
import clientFour from '../assets/clients-images (2).webp';
import clientFive from '../assets/clients-images (3).webp';

function ClientSection() {
  const logosRef = useRef(null);

  return (
    <div className="clients-section">
      <p className="clients-heading">
        Join Over+15,000 <br /> Happy Clients
      </p>
      <div
        ref={logosRef}
        className="clients-logos"
        style={{
          display: 'flex',
          overflowX: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        <img
          src={clientsLogos}
          alt="Premier"
          className="client-logo"
          //  loading="lazy"
        />
        <img
          src={clientTwo}
          alt="Von Republic"
          className="client-logo"
          //  loading="lazy"
        />
        <img
          src={clientThree}
          alt="QLOVAR"
          className="client-logo"
          //  loading="lazy"
        />
        <img
          src={clientFour}
          alt="HyperTribe"
          className="client-logo"
          //  loading="lazy"
        />
        <img
          src={clientFive}
          alt="Flipbase"
          className="client-logo"
          //  loading="lazy"
        />
      </div>
    </div>
  );
}

export default ClientSection;
