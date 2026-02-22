import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Field, form, required } from '@angular/forms/signals';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthService } from 'src/app/services/auth';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule, Field],
  templateUrl: './signin.html',
  styleUrls: ['./signin.scss']
})
export class SignInComponent {
  private cd = inject(ChangeDetectorRef);
  private router = inject(Router);
  private authService = inject(AuthService);

  submitted = signal(false);
  error = signal('');
  showPassword = signal(false);
  isLoading = signal(false);

  // Modèle réaligné sur les attentes du backend
  loginModal = signal({
    username: '',
    password: ''
  });

  loginForm = form(this.loginModal, (schemaPath) => {
    required(schemaPath.username, { message: 'Nom d\'utilisateur requis' });
    required(schemaPath.password, { message: 'Mot de passe requis' });
  });

  onSubmit(event: Event) {
    event.preventDefault();
    this.submitted.set(true);
    this.error.set(''); // Reset de l'erreur précédente

    const data = this.loginModal();

    // On vérifie que les champs ne sont pas vides avant d'envoyer
    if (data.username.trim() !== '' && data.password.trim() !== '') {
      this.isLoading.set(true);

      // Appel au service d'authentification lié au backend
      this.authService.login(data).subscribe({
        next: () => {
          this.router.navigate(['/dashboard-v1']).then(() => {
            this.isLoading.set(false);
          });
        },
        error: (err) => {
          this.isLoading.set(false);

          // Gestion de l'affichage de l'erreur dans l'interface
          if (err.status === 401 || err.status === 403) {
            this.error.set('Identifiants invalides ou utilisateur non enregistré.');
          } else if (err.status === 0) {
            this.error.set('Impossible de contacter le serveur.');
          } else {
            this.error.set(err.message || 'Une erreur est survenue lors de la connexion.');
          }

          this.cd.detectChanges();
        }
      });
    } else {
      this.error.set('Veuillez remplir correctement les champs.');
    }
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }
}
