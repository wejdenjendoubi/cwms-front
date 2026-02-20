import { Component, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';

// IL MANQUE CET IMPORT CI-DESSOUS DANS VOTRE CAPTURE :
import {
  ChartComponent,
  NgApexchartsModule,
  ApexOptions
} from 'ng-apexcharts';

@Component({
  selector: 'app-dashboard-v1',
  standalone: true,
  imports: [CommonModule, SharedModule, NgApexchartsModule],
  templateUrl: './dashboard-v1.html',
  styleUrl: './dashboard-v1.scss',
})
export class DashboardV1Component {
  // Utilisation des signaux viewChild (Angular 17+)
  readonly chart = viewChild<ChartComponent>('chart');
  readonly customerChart = viewChild<ChartComponent>('customerChart');

  // Initialisation des options de graphiques
  chartOptions !: Partial<ApexOptions>;
  chartOptions_1 !: Partial<ApexOptions>;
  chartOptions_2 !: Partial<ApexOptions>;
  chartOptions_3 !: Partial<ApexOptions>;

  constructor() {
    this.initChartOptions();
  }

  private initChartOptions() {
    this.chartOptions = {
      chart: { height: 205, type: 'line', toolbar: { show: false } },
      dataLabels: { enabled: false },
      stroke: { width: 2, curve: 'smooth' },
      series: [
        { name: 'Arts', data: [20, 50, 30, 60, 30, 50] },
        { name: 'Commerce', data: [60, 30, 65, 45, 67, 35] }
      ],
      legend: { position: 'top' },
      xaxis: {
        type: 'datetime',
        categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000'],
        axisBorder: { show: false }
      },
      yaxis: { show: true, min: 10, max: 70 },
      colors: ['#73b4ff', '#59e0c5'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          gradientToColors: ['#4099ff', '#2ed8b6'],
          shadeIntensity: 0.5,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      grid: { borderColor: '#cccccc3b' }
    };

    this.chartOptions_1 = {
      chart: { height: 150, type: 'donut' },
      dataLabels: { enabled: false },
      plotOptions: { pie: { donut: { size: '75%' } } },
      labels: ['New', 'Return'],
      series: [39, 10],
      legend: { show: false },
      tooltip: { theme: 'dark' },
      grid: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
      colors: ['#4680ff', '#2ed8b6'],
      fill: { opacity: [1, 1] },
      stroke: { width: 0 }
    };

    this.chartOptions_2 = {
      chart: { height: 150, type: 'donut' },
      dataLabels: { enabled: false },
      plotOptions: { pie: { donut: { size: '75%' } } },
      labels: ['New', 'Return'],
      series: [20, 15],
      legend: { show: false },
      tooltip: { theme: 'dark' },
      grid: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
      colors: ['#fff', '#2ed8b6'],
      fill: { opacity: [1, 1] },
      stroke: { width: 0 }
    };

    this.chartOptions_3 = {
      chart: { type: 'area', height: 145, sparkline: { enabled: true } },
      dataLabels: { enabled: false },
      colors: ['#ff5370'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: ['#ff869a'],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 0.8,
          stops: [0, 100, 100, 100]
        }
      },
      stroke: { curve: 'smooth', width: 2 },
      series: [{ data: [45, 35, 60, 50, 85, 70] }],
      yaxis: { min: 5, max: 90 },
      tooltip: { fixed: { enabled: false }, x: { show: false }, marker: { show: false } }
    };
  }

  cards = [
    /*{ background: 'bg-c-blue', title: 'Orders Received', icon: 'icon-shopping-cart', text: 'Completed Orders', number: '486', no: '351' },
    { background: 'bg-c-green', title: 'Total Sales', icon: 'icon-tag', text: 'This Month', number: '1641', no: '213' },
    { background: 'bg-c-yellow', title: 'Revenue', icon: 'icon-repeat', text: 'This Month', number: '$42,56', no: '$5,032' },

    { background: 'bg-c-red', title: 'Total Profit', icon: 'icon-shopping-cart', text: 'This Month', number: '$9,562', no: '$542' }

    */

    {
      background: 'bg-c-blue',
      title: 'Total Users',
      icon: 'icon-users',     // Icône de groupe d'utilisateurs
      text: 'Utilisateurs actifs',
      number: '120',          // Tu pourras changer ce chiffre plus tard
      no: '10'
    },
    {
      background: 'bg-c-green',
      title: 'Total Roles',
      icon: 'icon-shield',    // Icône de bouclier pour les rôles/sécurité
      text: 'Rôles définis',
      number: '5',
      no: '2'
    }
  ];

  images = [
    { src: 'assets/images/gallery-grid/img-grd-gal-1.jpg', title: 'Old Scooter', size: 'PNG-100KB' },
    { src: 'assets/images/gallery-grid/img-grd-gal-2.jpg', title: 'Wall Art', size: 'PNG-150KB' },
    { src: 'assets/images/gallery-grid/img-grd-gal-3.jpg', title: 'Microphone', size: 'PNG-150KB' }
  ];
}
