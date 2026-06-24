import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, timeout } from 'rxjs';
import { Comment, CreateCommentDTO } from '../models/comment.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private http = inject(HttpClient);
  private baseUrl = (environment as any).commentsApiUrl ?? '';

  /** Obtiene comentarios asociados a un item mediante query `itemId` */
  getCommentsByItem(itemId: string): Observable<Comment[]> {
    const url = `${this.baseUrl}?itemId=${encodeURIComponent(itemId)}`;
    return this.http.get<Comment[]>(url).pipe(
      timeout(10000),
      catchError(this.handleError)
    );
  }

  /** Crea un nuevo comentario */
  postComment(dto: CreateCommentDTO): Observable<Comment> {
    return this.http.post<Comment>(this.baseUrl, dto).pipe(
      timeout(10000),
      catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse) {
    // Aquí se puede mejorar con un logger o un servicio de reportes.
    const message = err.error?.message || err.statusText || 'Error desconocido';
    return throwError(() => ({ status: err.status, message }));
  }
}
