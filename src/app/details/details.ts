import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { PokeApiService } from '../services/pokeapi.service';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card';

/**
 * Component to display detailed information about a single Pokémon.
 * Route param `id` can be either name or numeric ID.
 */
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, RouterModule, PokemonCardComponent],
  templateUrl: './details.html',
  styleUrl: './details.css'
})
export class DetailsComponent implements OnInit {
  pokemon = signal<any>(null);
  loading = signal(true);

  constructor(private route: ActivatedRoute, private api: PokeApiService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading.set(false);
      return;
    }
    this.api.getPokemonDetail(id).subscribe({
      next: (data: any) => {
        this.pokemon.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Failed to load Pokémon details', err);
        this.loading.set(false);
      }
    });
  }
}
