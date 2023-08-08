'use client';
import useClickOutside from '@/lib/hooks/useClickOutside';
import React, { useRef } from 'react';



interface OffCanvasProps {
  children: React.ReactNode;
  open: boolean;
  back:()=>void
}

// eslint-disable-next-line react/display-name
const OffCanvas:React.FC<OffCanvasProps> = ({ children, open,back }) => {
  
  const ref = useRef(null)

  useClickOutside(ref, () => {
    back()
  })
  
    return (
      <div
        ref={ref}
        className={`fixed bottom-0 -right-full z-10 h-[calc(100vh-4rem)] w-full overflow-auto bg-white bg-opacity-[.95] shadow-lg transition-all md:w-[50%] lg:w-[38%] ${
          open ? '!right-0' : ''
        } p-6`}
      >
        {children}
      </div>
    );
}

export default OffCanvas;


