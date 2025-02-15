import { useEffect } from 'react';

export default function useHandleOutsideClick(itemRef: HTMLElement | null, callback: () => void) {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (itemRef && !(itemRef as HTMLElement).contains(target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [callback, itemRef]);
}