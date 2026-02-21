import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

export interface UserDTO {
  userId?: number;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  roleName: string;
  authorities: string[];
  token?: string;
}

interface JwtPayload {
  sub: string;
  authorities: string[];
  [key: string]: unknown; // On remplace 'any' par 'unknown' ici
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly currentUserSubject = new BehaviorSubject<UserDTO | null>(null);
  public readonly currentUser$ = this.currentUserSubject.asObservable();
  private readonly API_URL = 'http://localhost:8080/api/auth';

  constructor() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        this.currentUserSubject.next(this.decodeToken(token));
      } catch {
        this.logout();
      }
    }
  }

  login(credentials: Record<string, string>): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.API_URL}/login`, credentials).pipe(
      map((user: UserDTO) => {
        if (user && user.token) {
          localStorage.setItem('token', user.token);
          this.currentUserSubject.next(this.decodeToken(user.token));
        }
        return user;
      }),
      catchError((err: unknown) => throwError(() => err))
    );
  }

  private decodeToken(token: string): UserDTO {
    const decoded = jwtDecode<JwtPayload>(token);

    return {
      userName: decoded.sub || '',
      authorities: decoded.authorities || [],
      email: typeof decoded['email'] === 'string' ? decoded['email'] : '',
      firstName: typeof decoded['firstName'] === 'string' ? decoded['firstName'] : '',
      lastName: typeof decoded['lastName'] === 'string' ? decoded['lastName'] : '',
      roleName: typeof decoded['roleName'] === 'string' ? decoded['roleName'] : '',
      token: token
    };
  }

  public get currentUserValue(): UserDTO | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return !!(user && user.authorities && user.authorities.includes(role));
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }
}
