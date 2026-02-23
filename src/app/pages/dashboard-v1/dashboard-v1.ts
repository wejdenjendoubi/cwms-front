import { Component, OnInit, viewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';



import {
  ChartComponent,
  NgApexchartsModule,
  ApexOptions
} from 'ng-apexcharts';
import { AdminService } from 'src/app/services/admin';
import { Role, UserDTO } from 'src/app/models/user.model';

@Component({
  selector: 'app-dashboard-v1',
  standalone: true,
  imports: [CommonModule, SharedModule, NgApexchartsModule],
  templateUrl: './dashboard-v1.html',
  styleUrl: './dashboard-v1.scss',
})
export class DashboardV1 implements OnInit {
  private router = inject(Router);
  private adminService = inject(AdminService);

  readonly chart = viewChild<ChartComponent>('chart');

  chartOptions!: Partial<ApexOptions>;
  chartOptions_1!: Partial<ApexOptions>;
  chartOptions_2!: Partial<ApexOptions>;
  chartOptions_3!: Partial<ApexOptions>;

  cards = [
    {
      background: 'bg-c-blue',
      title: 'Total Users',
      icon: 'icon-users',
      text: 'Utilisateurs actifs',
      number: '...',
      no: '10'
    },
    {
      background: 'bg-c-green',
      title: 'Total Roles',
      icon: 'icon-shield',
      text: 'Rôles définis',
      number: '...',
      no: '2'
    }
  ];

  constructor() {
    this.initChartOptions();
  }

  ngOnInit(): void {
    this.loadRealData();
  }

  private loadRealData(): void {
    this.adminService.getUsers().subscribe({
      next: (users: UserDTO[]) => {
        const userCard = this.cards.find(c => c.title === 'Total Users');
        if (userCard) userCard.number = users.length.toString();
      },
      // Utilisation de unknown au lieu de any pour éviter les erreurs de lint
      error: (err: unknown) => console.error('Erreur utilisateurs:', err)
    });

    this.adminService.getRoles().subscribe({
      next: (roles: Role[]) => {
        const roleCard = this.cards.find(c => c.title === 'Total Roles');
        if (roleCard) roleCard.number = roles.length.toString();
      },
      error: (err: unknown) => console.error('Erreur rôles:', err)
    });
  }

  navigateTo(cardTitle: string): void {
    if (cardTitle === 'Total Users') {
      this.router.navigate(['/user-management']);
    }
  }

  private initChartOptions(): void {
    this.chartOptions = {
      chart: { height: 205, type: 'line', toolbar: { show: false } },
      series: [{ name: 'Arts', data: [20, 50, 30, 60] }],
      xaxis: { type: 'datetime', categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000'] }
    };
    this.chartOptions_1 = { chart: { height: 150, type: 'donut' }, series: [39, 10] };
    this.chartOptions_2 = { chart: { height: 150, type: 'donut' }, series: [20, 15] };
    this.chartOptions_3 = { chart: { type: 'area', height: 145, sparkline: { enabled: true } }, series: [{ data: [45, 35, 60] }] };
  }
}
