import React from 'react';

const ExportIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75v-4.5a.75.75 0 01.75-.75h3zM21 15.75a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75v-4.5a.75.75 0 01.75-.75h3z" clipRule="evenodd" />
    <path d="M3 12.75A2.25 2.25 0 00.75 15v5.25c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V15c0-.414-.336-.75-.75-.75H3zm18 0a2.25 2.25 0 00-2.25 2.25v5.25c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V15c0-.414-.336-.75-.75-.75h-1.5zM12 2.25A2.25 2.25 0 009.75 4.5v11.69l-3.22-3.22a.75.75 0 00-1.06 1.06l4.5 4.5a.75.75 0 001.06 0l4.5-4.5a.75.75 0 00-1.06-1.06l-3.22 3.22V4.5A2.25 2.25 0 0012 2.25z" />
  </svg>
);
// Simpler Heroicon: ArrowUpTrayIcon
const ExportIconSimple: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);


export default ExportIconSimple;