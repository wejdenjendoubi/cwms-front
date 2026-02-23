/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardV1 } from './dashboard-v1';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgApexchartsModule } from 'ng-apexcharts';

describe('DashboardV1', () => {
  let component: DashboardV1;
  let fixture: ComponentFixture<DashboardV1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // On importe le composant et les modules nécessaires aux tests
      imports: [
        DashboardV1,
        HttpClientTestingModule,
        RouterTestingModule,
        NgApexchartsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardV1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
