import React from 'react';

const ExtinguisherIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M16 3H8C6.9 3 6 3.9 6 5v12c0 1.1.9 2 2 2h1.5v2h5v-2H18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H8V5h8v12z"/>
    <path d="M10 6h4v2h-4z"/>
    <path d="M19 9h-2V7h2v2zm-2 2h2v2h-2v-2zM5 9h2V7H5v2zm2 2H5v2h2v-2z"/>
    <path d="M12 13.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
  </svg>
);

export default ExtinguisherIcon;
