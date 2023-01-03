import React, { useEffect, useReducer } from 'react';
import clsx from 'clsx';
import { createPortal } from 'react-dom';


export function useForceUpdate() {
  return useReducer((v: number) => v + 1, 0)[1];
}

export function H1({ title, children }) {
  // 这里有可能挂不上去。。。
  const el = document.querySelector('#headerContent');

  const update = useForceUpdate();

  useEffect(() => {
    update();
  }, [el]);

  return (
    <>
      {createPortal(title, el || document.body)}
      <div className={clsx('md:m-2')}>{children}</div>
    </>
  );
}
