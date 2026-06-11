import { signal } from '@angular/core';

const STORAGE_KEY = 'pikavision_favorites';

/**
 * Loads the favorites list from localStorage.
 * Returns an empty array if nothing is stored or if parsing fails.
 */
function loadFromStorage(): any[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Persists the favorites list to localStorage.
 */
function saveToStorage(list: any[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Silently ignore storage errors (e.g. private mode quota)
  }
}

/**
 * Global signal that holds the list of favorite Pokémon.
 * Initialized from localStorage so favorites survive page reloads.
 */
export const favorites = signal<any[]>(loadFromStorage());

export function addFavorite(pokemon: any): void {
  const list = favorites();
  if (!list.find(p => p.id === pokemon.id)) {
    const next = [...list, pokemon];
    favorites.set(next);
    saveToStorage(next);
  }
}

export function removeFavorite(pokemon: any): void {
  const next = favorites().filter(p => p.id !== pokemon.id);
  favorites.set(next);
  saveToStorage(next);
}

export function toggleFavorite(pokemon: any): void {
  const list = favorites();
  const exists = list.some(p => p.id === pokemon.id);
  if (exists) {
    removeFavorite(pokemon);
  } else {
    addFavorite(pokemon);
  }
}

export function isFavorite(pokemon: any): boolean {
  return favorites().some(p => p.id === pokemon.id);
}
