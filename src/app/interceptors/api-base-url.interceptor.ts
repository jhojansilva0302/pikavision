import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

/**
 * Functional interceptor that prepends the API base URL to relative requests.
 */
export const apiBaseUrlInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const url = req.url.startsWith('http') ? req.url : `${environment.apiBaseUrl}/${req.url}`;
  const modifiedReq = req.clone({ url });
  return next(modifiedReq);
};
