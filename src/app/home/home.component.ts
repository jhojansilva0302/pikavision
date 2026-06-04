import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PokeApiService } from '../services/pokeapi.service';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';

/**
 * Home page displaying a grid of Pokémon cards.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, PokemonCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // Signal holding the list of Pokémon objects.
  pokemonList = signal<any[]>([]);
  // Simple loading flag.
  loading = signal(true);

  constructor(private api: PokeApiService) { }

  ngOnInit(): void {
    this.api.getPokemonList(0, 50).subscribe({
      next: (data: any) => {
        this.pokemonList.set(data.results);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Failed to load Pokémon list', err);
        this.loading.set(false);
      }
    });
  }
}
