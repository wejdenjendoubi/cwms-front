import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-user-dashboard',
  imports: [SharedModule],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.scss',
})
export class UserDashboard {
   private authService = inject(AuthService);
  userName = this.authService.currentUserValue?.userName || 'Utilisateur';

}


