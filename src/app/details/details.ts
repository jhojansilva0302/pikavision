import { Component, signal, OnInit, computed, ChangeDetectionStrategy } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MovieCommentsComponent } from './movie-comments/movie-comments.component';
import { forkJoin } from 'rxjs';
import { PokeApiService } from '../services/pokeapi.service';
import { toggleFavorite, isFavorite } from '../favorites/favorites.signal';

/** Traducción fija de los 6 nombres de estadísticas base. */
const STAT_ES: Record<string, string> = {
  'hp':               'PS',
  'attack':           'Ataque',
  'defense':          'Defensa',
  'special-attack':   'Atq. Esp.',
  'special-defense':  'Def. Esp.',
  'speed':            'Velocidad',
};

/**
 * Component to display detailed information about a single Pokémon.
 * Translates stat names with a static map and fetches ability names
 * in Spanish from the PokéAPI (parallel requests via forkJoin).
 */
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [RouterModule, TitleCasePipe, MovieCommentsComponent],
  templateUrl: './details.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './details.css'
})
export class DetailsComponent implements OnInit {
  pokemon = signal<any>(null);
  loading = signal(true);
  error   = signal<string | null>(null);

  /**
   * Maps ability slug → Spanish name.
   * e.g. { 'static': 'Electricidad estática', 'overgrow': 'Espesura' }
   * Populated after the Pokémon loads via parallel API calls.
   */
  abilitiesEs = signal<Record<string, string>>({});

  isFav = computed(() => {
    const p = this.pokemon();
    return p ? isFavorite(p) : false;
  });

  /**
   * Primary type of the Pokémon (e.g. 'fire', 'water').
   * Drives the CSS theme class applied to the page wrapper.
   */
  typeTheme = computed(() => {
    const types: any[] = this.pokemon()?.types ?? [];
    return types[0]?.type?.name ?? 'normal';
  });

  constructor(private route: ActivatedRoute, private api: PokeApiService) {}

  toggleFav(): void {
    if (this.pokemon()) toggleFavorite(this.pokemon());
  }

  /** Returns the Spanish name for a stat slug. */
  statName(slug: string): string {
    return STAT_ES[slug] ?? slug;
  }

  /** Returns the Spanish ability name from the loaded map, or falls back to titlecase. */
  abilityName(slug: string): string {
    const es = this.abilitiesEs()[slug];
    if (es) return es;
    // Fallback: capitalize slug
    return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('No se proporcionó un ID de Pokémon válido.');
      this.loading.set(false);
      return;
    }

    this.api.getPokemonDetail(id).subscribe({
      next: (data: any) => {
        this.pokemon.set(data);
        this.loading.set(false);

        // Fetch Spanish names for each ability in parallel
        const abilities: any[] = data.abilities ?? [];
        if (abilities.length === 0) return;

        const requests = abilities.map((a: any) =>
          this.api.getAbilityDetail(a.ability.name)
        );

        forkJoin(requests).subscribe({
          next: (results: any[]) => {
            const map: Record<string, string> = {};
            results.forEach((r: any, i: number) => {
              const esEntry = r.names?.find(
                (n: any) => n.language.name === 'es'
              );
              if (esEntry) {
                map[abilities[i].ability.name] = esEntry.name;
              }
            });
            this.abilitiesEs.set(map);
          },
          error: () => {
            // If ability translation fails, fallback names already handled in abilityName()
          }
        });
      },
      error: (err: any) => {
        if (err.status === 404) {
          this.error.set(`No se encontró ningún Pokémon con el ID "${id}".`);
        } else {
          this.error.set('No se pudo cargar el detalle. Verifica tu conexión e intenta de nuevo.');
        }
        this.loading.set(false);
      }
    });
  }
}
