import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PokeApiService } from '../services/pokeapi.service';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PokemonCardComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  query: string = '';

  results = signal<any[]>([]);
  loading = signal(false);

  constructor(private api: PokeApiService) { }

  performSearch(): void {

    const term = this.query.trim().toLowerCase();

    if (!term) {
      this.results.set([]);
      return;
    }

    this.loading.set(true);

    this.api.searchPokemon(term).subscribe({

      next: (data: any) => {
        this.results.set([data]);
        this.loading.set(false);
      },

      error: (err: any) => {
        this.results.set([]);
        this.loading.set(false);
      }

    });
  }
}