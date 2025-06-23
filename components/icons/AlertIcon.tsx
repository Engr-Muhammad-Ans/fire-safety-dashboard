
import React from 'react';

const AlertIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.519 13.007c1.155 2-." clipRule="evenodd" />
    <path fillRule="evenodd" d="M10.26 3.22A.75.75 0 0111.25 3h1.5a.75.75 0 01.732.992l-.304 1.768a.75.75 0 001.448.25l.303-1.768a2.25 2.25 0 00-2.195-2.992h-1.5a2.25 2.25 0 00-2.196 2.993l.304 1.768a.75.75 0 001.447-.25l-.304-1.768zM12 6.75a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0v-6a.75.75 0 01.75-.75zm0 9a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.06-5.47a.75.75 0 10-1.06-1.06L12 5.69 11.753 5.443A.75.75 0 0010.5 6.25v2.5a.75.75 0 001.5 0V7.31l.22.22a.75.75 0 001.06-1.061l-1.25-1.25zM12 15.75a.75.75 0 01.75.75v.008a.75.75 0 01-1.5 0v-.008a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);
// A simplified version of Heroicons ExclamationTriangleIcon for brevity.
// In a real scenario, use the full path or a library.
// For the purpose of this example, a more generic alert shape with an exclamation mark.
// The provided path was incomplete, so using a simpler one.
const AlertIconSimple: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L11.44 12l-2.22 2.22a.75.75 0 101.06 1.06L12 13.06l2.22 2.22a.75.75 0 101.06-1.06L13.06 12l2.22-2.22a.75.75 0 10-1.06-1.06L12 10.94l-2.22-2.22z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M11.25 7.5V12h1.5V7.5h-1.5zM11.25 13.5v3h1.5v-3h-1.5z" clipRule="evenodd" transform="translate(0 0.75)" />
  </svg>
);


// Using a simpler exclamation icon from Heroicons
const AlertIconSolid: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.042.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836A.75.75 0 0110.956 10.558zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
    </svg>
  );

export default AlertIconSolid;
