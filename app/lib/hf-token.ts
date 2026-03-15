const STORAGE_KEY = "auto-cut:hf-token";

export function getHfToken(): string | null {
    if (typeof window === "undefined") return null;
    // Check sessionStorage first, then localStorage (for users who opted to persist)
    return sessionStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(STORAGE_KEY);
}

export function setHfToken(token: string, persist = false): void {
    sessionStorage.setItem(STORAGE_KEY, token);
    if (persist) {
        localStorage.setItem(STORAGE_KEY, token);
    }
}

export function clearHfToken(): void {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
}
