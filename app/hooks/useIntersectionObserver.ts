import { useEffect, useRef } from 'react';

export const useIntersectionObserver = (
  ref: React.RefObject<HTMLElement | undefined>,
  callback: (isIntersecting: boolean) => void,
  options?: IntersectionObserverInit
) => {
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (ref.current) {
      observer.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          callback(entry.isIntersecting);
        });
      }, options);

      observer.current.observe(ref.current);
    }

    return () => observer.current?.disconnect?.();
  }, [ref, callback, options]);
};
