import { Component, Input, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommentService } from '../../core/services/comment.service';
import { Comment, CreateCommentDTO } from '../../core/models/comment.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-movie-comments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './movie-comments.component.html',
  styleUrls: ['./movie-comments.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieCommentsComponent implements OnInit {
  @Input() itemId!: string | number;

  comments = signal<Comment[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  submitting = signal(false);
  successMsg = signal<string | null>(null);

  hoverRating = signal<number>(0);

  form = new FormGroup({
    author: new FormControl('', [Validators.required, Validators.maxLength(60)]),
    comment: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(1000)]),
    rating: new FormControl<number | null>(null, [Validators.required])
  });

  constructor(private svc: CommentService) {}

  ngOnInit(): void {
    this.loadComments();
  }

  private loadComments(): void {
    this.loading.set(true);
    this.error.set(null);
    const id = String(this.itemId ?? '');
    this.svc.getCommentsByItem(id).subscribe({
      next: (list) => {
        this.comments.set(list ?? []);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.error.set(err?.message || 'No se pudieron cargar los comentarios.');
        this.loading.set(false);
      }
    });
  }

  trackById(index: number, item: Comment) {
    return item.id;
  }

  setHover(v: number) { this.hoverRating.set(v); }
  clearHover() { this.hoverRating.set(0); }

  setRatingStars(v: number) { this.form.get('rating')?.setValue(v); }

  submit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);
    this.successMsg.set(null);

    const dto: CreateCommentDTO = {
      appId: (environment as any).appId ?? 'MovieNexus',
      itemId: String(this.itemId),
      author: this.form.value.author ?? 'Anónimo',
      text: this.form.value.comment ?? '',
      rating: Number(this.form.value.rating)
    };

    this.svc.postComment(dto).subscribe({
      next: (c) => {
        // Prepend new comment
        this.comments.update(prev => [c, ...prev]);
        this.form.reset();
        this.submitting.set(false);
        this.successMsg.set('Comentario publicado.');
        setTimeout(() => this.successMsg.set(null), 4000);
      },
      error: (err: any) => {
        this.submitting.set(false);
        this.successMsg.set(null);
        this.error.set(err?.message || 'Error al enviar el comentario.');
      }
    });
  }
}
