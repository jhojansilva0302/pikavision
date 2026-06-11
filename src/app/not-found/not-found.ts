import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Page displayed for unknown routes.
 */
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './not-found.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './not-found.css'
})
export class NotFoundComponent {}
