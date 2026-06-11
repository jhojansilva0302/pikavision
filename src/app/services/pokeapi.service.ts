import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Pokemon {
  id: number;
  name: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
}

export interface PokemonDetail {
  id: number;
  name: string;
  sprites: { front_default: string };
  types: { slot: number; type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  // Add other fields as needed
}

@Injectable({ providedIn: 'root' })
export class PokeApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  getPokemonList(limit: number = 20, offset: number = 0): Observable<PokemonListResponse> {
    const url = `pokemon?limit=${limit}&offset=${offset}`;
    return this.http.get<PokemonListResponse>(url);
  }

  searchPokemon(name: string): Observable<PokemonDetail> {
    const url = `pokemon/${name.toLowerCase()}`;
    return this.http.get<PokemonDetail>(url);
  }

  getPokemonDetail(idOrName: string | number): Observable<PokemonDetail> {
    const url = `pokemon/${idOrName}`;
    return this.http.get<PokemonDetail>(url);
  }

  /** Fetches full ability data — includes `names` array with localized names. */
  getAbilityDetail(nameOrId: string): Observable<any> {
    return this.http.get<any>(`ability/${nameOrId}`);
  }
}
