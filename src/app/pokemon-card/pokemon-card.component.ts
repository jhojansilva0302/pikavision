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
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.css']
})
export class PokemonCardComponent {
  @Input() pokemon!: any;

  /** Returns the URL of the official artwork for the Pokémon. */
  get artworkUrl(): string {
    return this.pokemon?.sprites?.other?.['official-artwork']?.front_default ?? '';
  }
}
