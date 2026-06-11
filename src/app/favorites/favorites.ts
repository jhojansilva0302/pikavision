import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card';
import { favorites, removeFavorite } from './favorites.signal';

/**
 * Displays the list of favorite Pokémon.
 * Reads from the global favorites signal (persisted in localStorage).
 */
@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RouterModule, PokemonCardComponent],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class FavoritesComponent {
  /** Expose the signal directly for the template. */
  favList = favorites;

  /** Remove a Pokémon from favorites. */
  remove(pokemon: any): void {
    removeFavorite(pokemon);
  }
}
