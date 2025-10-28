import React from 'react';

export const ChartLineIcon = ({ size = 32, color = "#ffffff" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v16a2 2 0 0 0 2 2h16"/>
      <path d="m19 9-5 5-4-4-3 3"/>
    </svg>
  );
};