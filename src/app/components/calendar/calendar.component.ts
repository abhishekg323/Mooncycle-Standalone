import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CycleService } from '../../services/cycle.service';
import { DayInfo, PeriodEntry } from '../../models/cycle.model';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @Output() editPeriod = new EventEmitter<PeriodEntry>();
  @Output() addPeriod = new EventEmitter<Date>();

  currentDate = new Date();
  currentMonth = this.currentDate.getMonth();
  currentYear = this.currentDate.getFullYear();

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  calendarDays: (DayInfo | null)[] = [];
  selectedDay: DayInfo | null = null;
  periods: PeriodEntry[] = [];

  constructor(private cycleService: CycleService) {}

  ngOnInit(): void {
    this.generateCalendar();
    this.cycleService.periods$.subscribe(periods => {
      this.periods = periods;
      this.generateCalendar();
    });
  }

  generateCalendar(): void {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDay = firstDay.getDay();

    this.calendarDays = [];

    // Add empty cells for days before the month starts
    for (let i = 0; i < startDay; i++) {
      this.calendarDays.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(this.currentYear, this.currentMonth, day);
      this.calendarDays.push(this.cycleService.getDayInfo(date));
    }
  }

  previousMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  selectDay(day: DayInfo | null): void {
    if (day) {
      this.selectedDay = day;
    }
  }

  getDayClasses(day: DayInfo | null): string[] {
    if (!day) return ['empty'];

    const classes = ['day'];

    if (day.isToday) classes.push('today');
    if (day.isPeriod) classes.push('period');
    if (day.isPredicted) classes.push('predicted');
    if (day.isFertile) classes.push('fertile');
    if (day.isOvulation) classes.push('ovulation');
    if (this.selectedDay?.date.getTime() === day.date.getTime()) classes.push('selected');

    return classes;
  }

  getFlowIcon(day: DayInfo): string {
    if (!day.isPeriod || !day.flowIntensity) return '';

    switch (day.flowIntensity) {
      case 'spotting': return '·';
      case 'light': return '•';
      case 'medium': return '••';
      case 'heavy': return '•••';
      default: return '';
    }
  }

  closeDetails(): void {
    this.selectedDay = null;
  }

  getSymptomLabel(type: string): string {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  getPeriodForDay(day: DayInfo): PeriodEntry | null {
    if (!day.isPeriod) return null;

    const checkDate = new Date(day.date);
    checkDate.setHours(0, 0, 0, 0);

    for (const period of this.periods) {
      const start = new Date(period.startDate);
      start.setHours(0, 0, 0, 0);
      const end = period.endDate ? new Date(period.endDate) : new Date(start);
      end.setHours(0, 0, 0, 0);

      if (checkDate >= start && checkDate <= end) {
        return period;
      }
    }

    return null;
  }

  onEditPeriod(): void {
    if (this.selectedDay) {
      const period = this.getPeriodForDay(this.selectedDay);
      if (period) {
        this.editPeriod.emit(period);
        this.closeDetails();
      }
    }
  }

  onAddPeriod(): void {
    if (this.selectedDay) {
      this.addPeriod.emit(new Date(this.selectedDay.date));
      this.closeDetails();
    }
  }

  onDeletePeriod(): void {
    if (this.selectedDay) {
      const period = this.getPeriodForDay(this.selectedDay);
      if (period && confirm('Are you sure you want to delete this period entry?')) {
        this.cycleService.deletePeriod(period.id);
        this.closeDetails();
      }
    }
  }
}
