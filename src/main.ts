/// <reference types="@angular/localize" />

import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';

// --- AJOUTS POUR LE CLIENT HTTP ET L'INTERCEPTEUR ---
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './app/interceptors/jwt-interceptor';
// ---------------------------------------------------

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, AppRoutingModule),

    // 1. On active le HttpClient pour que AuthService puisse l'utiliser
    provideHttpClient(
      withInterceptorsFromDi()
    ),

    // 2. On enregistre l'intercepteur pour injecter le Token dans les requêtes
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ]
}).catch((err) => console.error(err));
