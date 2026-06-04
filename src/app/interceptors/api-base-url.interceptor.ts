import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class ApiBaseUrlInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only prepend if the request URL is relative (does not start with http)
    const url = req.url.startsWith('http') ? req.url : `${environment.apiBaseUrl}/${req.url}`;
    const modifiedReq = req.clone({ url });
    return next.handle(modifiedReq);
  }
}
