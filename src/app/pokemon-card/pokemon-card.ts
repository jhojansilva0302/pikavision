import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Reusable card component to display a Pokémon summary.
 * Expects a `pokemon` object with at least `name`, `id`, and `sprites` properties.
 */
@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.css'
})
export class PokemonCardComponent {
  @Input() pokemon!: any;

  /** Returns the ID of the Pokémon. */
  get pokemonId(): number | string {
    if (this.pokemon?.id) {
      return this.pokemon.id;
    }
    if (this.pokemon?.url) {
      const parts = this.pokemon.url.split('/').filter(Boolean);
      return parts[parts.length - 1];
    }
    return '';
  }

  /** Returns the URL of the official artwork for the Pokémon. */
  get artworkUrl(): string {
    if (this.pokemon?.sprites?.other?.['official-artwork']?.front_default) {
      return this.pokemon.sprites.other['official-artwork'].front_default;
    }
    const id = this.pokemonId;
    if (id) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    }
    return '';
  }
}
