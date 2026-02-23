import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  //  Utilisation de 'unknown' au lieu de 'any' pour la requête
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    const isApiUrl = request.url.startsWith('http://localhost:8080');

    if (token && isApiUrl) {
      // Le clonage conserve le typage de la requête originale
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }
}
