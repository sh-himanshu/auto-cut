const STORAGE_KEY = "auto-cut:hf-token";

export function getHfToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEY);
}

export function setHfToken(token: string): void {
    localStorage.setItem(STORAGE_KEY, token);
}

export function clearHfToken(): void {
    localStorage.removeItem(STORAGE_KEY);
}
