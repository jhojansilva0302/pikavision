import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  template: `
    <header class="header">
      <nav class="nav">
        <a routerLink="/home" routerLinkActive="active" class="nav-link">Home</a>
        <a routerLink="/search" routerLinkActive="active" class="nav-link">Search</a>
        <a routerLink="/favorites" routerLinkActive="active" class="nav-link">Favorites</a>
      </nav>
    </header>
  `,
  styles: [`
    .header { background: var(--primary-bg); padding: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .nav { display: flex; gap: 2rem; justify-content: center; }
    .nav-link { color: var(--primary-text); text-decoration: none; font-weight: 600; }
    .nav-link.active { border-bottom: 2px solid var(--accent); }
    @media (max-width: 600px) { .nav { flex-direction: column; gap: 0.5rem; } }
  `]
})
export class LegacyHeaderComponent {}
