import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { SignInComponent } from './pages/auth/signin/signin';
import { UserManagement } from './pages/admin/user-management/user-management';
import { AuthGuard } from './guards/auth-guard';

const routes: Routes = [
  // 1. Routes publiques (Sans Guard)
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'login',
        component: SignInComponent
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },

  // 2. Routes privées (Avec Guard)
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard], // Le guard ne s'applique qu'ici
    children: [
      {
        path: 'dashboard-v1',
        loadComponent: () => import('./pages/dashboard-v1/dashboard-v1').then((c) => c.DashboardV1Component)
      },
      {
        path: 'user-management',
        component: UserManagement,
        data: { roles: ['ROLE_ADMIN'] }
      }
    ]
  },

  // 3. Fallback
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
