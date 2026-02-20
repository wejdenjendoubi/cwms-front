import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';

// Vérifie bien que le chemin ./pages/auth/signin/signin est correct (sans .ts)
import { SignInComponent } from './pages/auth/signin/signin';
import { SignUpComponent } from './pages/auth/signup/signup';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard-v1',
        pathMatch: 'full'
      },
      {
        path: 'dashboard-v1',
        loadComponent: () => import('./pages/dashboard-v1/dashboard-v1').then((c) => c.DashboardV1Component)
      }
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'login',
        component: SignInComponent
      },
      {
        path: 'register',
        component: SignUpComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard-v1'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
