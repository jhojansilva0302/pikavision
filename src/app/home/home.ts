import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PokeApiService } from '../services/pokeapi.service';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card';

export type SortOption =
  | 'numero-asc'
  | 'numero-desc'
  | 'nombre-az'
  | 'nombre-za';

export interface SortBtn {
  key: SortOption;
  label: string;
  icon: string;
}

/**
 * Home page displaying a filterable, sortable grid of Pokémon cards.
 *
 * State:
 * - pokemonList: lista completa obtenida de la API.
 * - searchQuery: signal que se actualiza en cada tecla.
 * - sortBy: signal con la opción de ordenamiento activa.
 * - displayList: computed que filtra Y ordena en tiempo real.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, FormsModule, PokemonCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {

  /** Lista completa de Pokémon de la API. */
  pokemonList = signal<any[]>([]);

  /** Consulta de búsqueda reactiva — se actualiza por keystroke. */
  searchQuery = signal('');

  /** Opción de ordenamiento activa. */
  sortBy = signal<SortOption>('numero-asc');

  /** Opciones de ordenamiento disponibles para el template. */
  readonly sortOptions: SortBtn[] = [
    { key: 'numero-asc',  label: 'Más conocido',    icon: '🏆' },
    { key: 'numero-desc', label: 'Menos conocido',   icon: '🌟' },
    { key: 'nombre-az',   label: 'A → Z',            icon: '🔤' },
    { key: 'nombre-za',   label: 'Z → A',            icon: '🔡' },
  ];

  /**
   * Computed signal: filtra por nombre Y ordena según sortBy().
   * Se recalcula automáticamente cada vez que cambia pokemonList,
   * searchQuery o sortBy — sin ninguna llamada a la API adicional.
   */
  displayList = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const sort  = this.sortBy();

    // 1. Filtrar
    let list = query
      ? this.pokemonList().filter(p => p.name.toLowerCase().includes(query))
      : [...this.pokemonList()];

    // 2. Ordenar
    switch (sort) {
      case 'numero-asc':
        list.sort((a, b) => this.extractId(a) - this.extractId(b));
        break;
      case 'numero-desc':
        list.sort((a, b) => this.extractId(b) - this.extractId(a));
        break;
      case 'nombre-az':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nombre-za':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return list;
  });

  /** Estado de carga. */
  loading = signal(true);

  /** Mensaje de error HTTP. */
  error = signal<string | null>(null);

  /** Skeletons mostrados mientras carga. */
  readonly skeletonItems = Array(40).fill(0);

  constructor(private api: PokeApiService) {}

  ngOnInit(): void {
    this.api.getPokemonList(2000, 0).subscribe({
      next: (data: any) => {
        this.pokemonList.set(data.results);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo conectar con la PokéAPI. Verifica tu conexión e intenta de nuevo.');
        this.loading.set(false);
      }
    });
  }

  /** Actualiza la búsqueda vía [(ngModel)]. */
  onSearch(value: string): void {
    this.searchQuery.set(value);
  }

  /** Limpia el input de búsqueda. */
  clearSearch(): void {
    this.searchQuery.set('');
  }

  /** Cambia el criterio de ordenamiento. */
  setSort(option: SortOption): void {
    this.sortBy.set(option);
  }

  /** Extrae el ID numérico desde la URL de la API o desde el objeto. */
  private extractId(p: any): number {
    if (p.id) return +p.id;
    const parts = (p.url as string).split('/').filter(Boolean);
    return parseInt(parts[parts.length - 1], 10);
  }
}
