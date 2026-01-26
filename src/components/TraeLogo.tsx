import React from 'react';

const TraeLogo = ({ className = "h-8" }: { className?: string }) => {
  return (
    <svg viewBox="0 0 200 50" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Icon Box */}
      <rect x="5" y="10" width="50" height="30" rx="2" stroke="currentColor" strokeWidth="6" />
      {/* Diamonds inside box */}
      <rect x="18" y="25" width="8" height="8" transform="rotate(45 18 25)" fill="currentColor" />
      <rect x="42" y="25" width="8" height="8" transform="rotate(45 42 25)" fill="currentColor" />
      
      {/* T */}
      <path d="M75 10H105V16H93V40H87V16H75V10Z" fill="currentColor" />
      
      {/* R */}
      <path d="M110 10H125C132 10 135 13 135 18C135 22 132 25 125 25H116V40H110V10ZM116 16V20H125C127 20 129 19 129 18C129 17 127 16 125 16H116ZM126 25L136 40H129L120 25H126Z" fill="currentColor" />
      
      {/* A */}
      <path d="M145 10H155L165 40H158L156 34H144L142 40H135L145 10ZM154 28L150 16L146 28H154Z" fill="currentColor" />
      
      {/* E */}
      <path d="M170 10H190V16H176V22H188V28H176V34H190V40H170V10Z" fill="currentColor" />
      
      {/* Diamond after E */}
      <rect x="205" y="25" width="8" height="8" transform="rotate(45 205 25)" fill="currentColor" />
    </svg>
  );
};

export default TraeLogo;
