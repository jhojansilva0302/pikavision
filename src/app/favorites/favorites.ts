import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card';
import { favorites, removeFavorite } from './favorites.signal';

/**
 * Displays the list of favorite Pokémon.
 */
@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, PokemonCardComponent],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class FavoritesComponent {
  // expose the signal directly for the template
  favList = favorites;

  constructor() {}

  /** Remove a Pokémon from favorites */
  remove(pokemon: any): void {
    removeFavorite(pokemon);
  }
}
