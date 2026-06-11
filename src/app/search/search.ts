import { Component, OnDestroy, signal, effect } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PokeApiService } from '../services/pokeapi.service';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card';

/**
 * Search page: real-time Pokémon search powered by Angular Signals.
 *
 * Architecture:
 * - querySignal: source of truth for the typed text.
 * - effect(): watches querySignal and schedules a debounced API call
 *   (400 ms) so we don't hammer the API on every keystroke.
 * - results / notFound / networkError / loading: reactive state signals.
 */
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterModule, FormsModule, PokemonCardComponent],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class SearchComponent implements OnDestroy {

  /** Signal that holds the current typed query. */
  querySignal = signal('');

  results    = signal<any[]>([]);
  loading    = signal(false);
  /** true = searched and Pokémon not found (404) */
  notFound   = signal(false);
  /** Set when a network or unexpected error occurs */
  networkError = signal<string | null>(null);
  /** true once at least one search has been triggered */
  hasSearched  = signal(false);

  private debounceTimer: any = null;

  constructor(private api: PokeApiService) {
    /**
     * effect() runs whenever querySignal() changes.
     * We debounce by 400 ms to avoid an API call on every keystroke.
     */
    effect(() => {
      const term = this.querySignal().trim().toLowerCase();

      // Clear any pending debounce
      clearTimeout(this.debounceTimer);

      if (!term) {
        // Reset state immediately when input is cleared
        this.results.set([]);
        this.notFound.set(false);
        this.networkError.set(null);
        this.loading.set(false);
        this.hasSearched.set(false);
        return;
      }

      // Show loading immediately so the UI feels responsive
      this.loading.set(true);
      this.notFound.set(false);
      this.networkError.set(null);

      this.debounceTimer = setTimeout(() => {
        this.hasSearched.set(true);
        this.api.searchPokemon(term).subscribe({
          next: (data: any) => {
            this.results.set([data]);
            this.loading.set(false);
          },
          error: (err: any) => {
            this.results.set([]);
            this.loading.set(false);
            if (err.status === 404) {
              this.notFound.set(true);
            } else {
              this.networkError.set(
                'No se pudo conectar con la PokéAPI. Verifica tu conexión e intenta de nuevo.'
              );
            }
          }
        });
      }, 400);
    });
  }

  /** Bound to the search input — updates the signal on every keystroke. */
  onQueryChange(value: string): void {
    this.querySignal.set(value);
  }

  /** Clear button handler. */
  clearQuery(): void {
    this.querySignal.set('');
  }

  ngOnDestroy(): void {
    clearTimeout(this.debounceTimer);
  }
}