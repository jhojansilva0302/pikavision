import { signal } from '@angular/core';
import { Pokemon } from '../services/pokeapi.service'; // Assuming Pokemon type export (any if not)

/**
 * Global signal that holds the list of favorite Pokémon.
 * Provides helper functions to manipulate the list.
 */
export const favorites = signal<any[]>([]);

export function addFavorite(pokemon: any): void {
  const list = favorites();
  if (!list.find(p => p.id === pokemon.id)) {
    favorites.set([...list, pokemon]);
  }
}

export function removeFavorite(pokemon: any): void {
  const list = favorites();
  favorites.set(list.filter(p => p.id !== pokemon.id));
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
