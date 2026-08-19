import { useEffect, useState } from 'react';

/**
 * Tracks the `dark` class that useColorMode toggles on <body>, so components
 * rendering outside Tailwind (react-select, canvas, etc.) can theme themselves.
 */
const useIsDark = (): boolean => {
    const [isDark, setIsDark] = useState<boolean>(
        typeof document !== 'undefined' &&
        document.body.classList.contains('dark'),
    );

    useEffect(() => {
        const observer = new MutationObserver(() =>
            setIsDark(document.body.classList.contains('dark')),
        );

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);

    return isDark;
};

export default useIsDark;
