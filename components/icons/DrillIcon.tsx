import React from 'react';

const DrillIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10.5 3.75a6 6 0 00-5.98 6.496A5.25 5.25 0 006.75 20.25H18a4.5 4.5 0 002.206-8.404 4.502 4.502 0 00-.774-5.328A6.002 6.002 0 0010.5 3.75zm1.693 8.131a.75.75 0 00-1.06-.052l-2.009 1.674a.75.75 0 001.006 1.116l.858-.715v2.247a.75.75 0 001.5 0v-2.583l.852.716a.75.75 0 001.007-1.116l-2.008-1.674a.75.75 0 00-.146-.113z" clipRule="evenodd" />
     <path d="M9.75 6.75a.75.75 0 01.75-.75H18a.75.75 0 01.75.75v.083c.411.09.798.221 1.164.386V6.75A2.25 2.25 0 0018 4.5h-7.5A2.25 2.25 0 008.25 6.75v5.836C8.552 12.288 8.956 12 9.408 12H9.75V6.75z" /> {/* Evacuation route / running person like element */}
    <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 011.06 0l1.25 1.25a.75.75 0 11-1.06 1.06L7.72 13.59l-1.25 1.25a.75.75 0 01-1.06-1.06l1.25-1.25a.75.75 0 01.06-.06z" clipRule="evenodd" />
  </svg>
);

// Fallback simple running icon if the above is too complex or renders poorly
const DrillIconSimple: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 4.5l-4.5 6 4.5 6m6-12l-4.5 6 4.5 6" />
  </svg>
);


export default DrillIconSimple; // Using a simpler run/play icon for drills
