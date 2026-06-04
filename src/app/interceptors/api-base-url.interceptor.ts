import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Functional interceptor that prepends the API base URL to relative requests
 * and logs request/response details in the browser console.
 */
export const apiBaseUrlInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const url = req.url.startsWith('http') ? req.url : `${environment.apiBaseUrl}/${req.url}`;
  const modifiedReq = req.clone({ url });

  console.log(`%c[PokeAPI Request] 🚀 ${modifiedReq.method} ${modifiedReq.url}`, 'color: #3b4cca; font-weight: bold; font-size: 11px;');

  return next(modifiedReq).pipe(
    tap({
      next: (event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log(`%c[PokeAPI Response] ✅ Success:`, 'color: #10b981; font-weight: bold; font-size: 11px;', event.body);
        }
      },
      error: (err: any) => {
        console.error(`%c[PokeAPI Error] ❌ Failed:`, 'color: #ef4444; font-weight: bold; font-size: 11px;', err);
      }
    })
  );
};
