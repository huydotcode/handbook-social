import { useCallback, useEffect, useState } from 'react';

// ---------- Types ----------

export type DismissType = 'dismiss' | 'sent';

interface DismissedEntry {
    dismissedAt: number;
    type: DismissType;
}

interface DismissedMap {
    [userId: string]: DismissedEntry;
}

const STORAGE_KEY = 'handbook_dismissed_suggestions';

const TTL: Record<DismissType, number> = {
    dismiss: 7 * 24 * 60 * 60 * 1000, // 7 days
    sent: 30 * 24 * 60 * 60 * 1000, // 30 days
};

function readStorage(): DismissedMap {
    if (typeof window === 'undefined') return {};
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as DismissedMap) : {};
    } catch {
        return {};
    }
}

function writeStorage(map: DismissedMap): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    } catch {}
}

function pruneExpired(map: DismissedMap): DismissedMap {
    const now = Date.now();
    const pruned: DismissedMap = {};
    for (const [id, entry] of Object.entries(map)) {
        if (now - entry.dismissedAt < TTL[entry.type]) {
            pruned[id] = entry;
        }
    }
    return pruned;
}

export function useDismissedSuggestions() {
    const [dismissedMap, setDismissedMap] = useState<DismissedMap>({});

    useEffect(() => {
        const pruned = pruneExpired(readStorage());
        writeStorage(pruned);
        setDismissedMap(pruned);
    }, []);

    const isDismissed = useCallback(
        (userId: string): boolean => {
            const entry = dismissedMap[userId];
            if (!entry) return false;
            return Date.now() - entry.dismissedAt < TTL[entry.type];
        },
        [dismissedMap]
    );

    const dismiss = useCallback((userId: string, type: DismissType = 'dismiss') => {
        setDismissedMap((prev) => {
            const next: DismissedMap = {
                ...prev,
                [userId]: { dismissedAt: Date.now(), type },
            };
            writeStorage(next);
            return next;
        });
    }, []);

    const undismiss = useCallback((userId: string) => {
        setDismissedMap((prev) => {
            const next = { ...prev };
            delete next[userId];
            writeStorage(next);
            return next;
        });
    }, []);

    const remainingLabel = useCallback(
        (userId: string): string => {
            const entry = dismissedMap[userId];
            if (!entry) return '';
            const remaining = TTL[entry.type] - (Date.now() - entry.dismissedAt);
            if (remaining <= 0) return '';
            const days = Math.ceil(remaining / (24 * 60 * 60 * 1000));
            return days <= 1 ? 'Còn < 1 ngày' : `Còn ${days} ngày`;
        },
        [dismissedMap]
    );

    return { isDismissed, dismiss, undismiss, remainingLabel };
}
