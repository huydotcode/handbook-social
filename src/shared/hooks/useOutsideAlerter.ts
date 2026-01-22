'use client';
import { useEffect } from 'react';

function useOutsideAlerter(
    ref: any,
    cb: (event: Event) => void,
    enabled = true
) {
    useEffect(() => {
        if (!enabled) return;
        function handleClickOutside(event: Event) {
            if (ref.current && !ref.current.contains(event.target)) {
                cb(event);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, cb, enabled]);
}

export default useOutsideAlerter;
