import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { LogPeriodComponent } from './components/log-period/log-period.component';
import { PeriodEntry } from './models/cycle.model';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    DashboardComponent,
    CalendarComponent,
    LogPeriodComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Moon Cycle';
  currentView: 'dashboard' | 'calendar' = 'dashboard';
  showLogPeriod = false;
  periodToEdit?: PeriodEntry;
  prefilledDate?: Date;

  setView(view: 'dashboard' | 'calendar'): void {
    this.currentView = view;
  }

  openLogPeriod(period?: PeriodEntry): void {
    this.periodToEdit = period;
    this.prefilledDate = undefined;
    this.showLogPeriod = true;
  }

  openLogPeriodWithDate(date: Date): void {
    this.periodToEdit = undefined;
    this.prefilledDate = date;
    this.showLogPeriod = true;
  }

  closeLogPeriod(): void {
    this.showLogPeriod = false;
    this.periodToEdit = undefined;
    this.prefilledDate = undefined;
  }
}
