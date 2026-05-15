import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CycleService } from '../../services/cycle.service';
import { CycleData, CycleInsights, PeriodEntry } from '../../models/cycle.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Output() editPeriod = new EventEmitter<PeriodEntry>();

  cycleData: CycleData | null = null;
  insights: CycleInsights | null = null;
  periods: PeriodEntry[] = [];

  constructor(private cycleService: CycleService) {}

  ngOnInit(): void {
    this.cycleService.cycleData$.subscribe(data => {
      this.cycleData = data;
    });

    this.cycleService.periods$.subscribe(periods => {
      this.periods = periods.sort((a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
      this.insights = this.cycleService.getCycleInsights();
    });
  }

  onEditPeriod(period: PeriodEntry): void {
    this.editPeriod.emit(period);
  }

  getDaysUntilNextPeriod(): number | null {
    if (!this.cycleData?.nextPredictedPeriod) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextPeriod = new Date(this.cycleData.nextPredictedPeriod);
    nextPeriod.setHours(0, 0, 0, 0);

    const diff = Math.ceil((nextPeriod.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  }

  getCurrentPhase(): string {
    if (!this.cycleData?.currentDayOfCycle) return 'Unknown';

    const day = this.cycleData.currentDayOfCycle;
    const cycleLength = this.cycleData.averageCycleLength;

    if (day <= this.cycleData.averagePeriodLength) {
      return 'Menstrual Phase';
    } else if (day <= 14) {
      return 'Follicular Phase';
    } else if (day <= 16) {
      return 'Ovulation';
    } else {
      return 'Luteal Phase';
    }
  }

  getPhaseDescription(): string {
    const phase = this.getCurrentPhase();

    switch (phase) {
      case 'Menstrual Phase':
        return 'Your period is here. Rest and take care of yourself.';
      case 'Follicular Phase':
        return 'Energy levels rising. Great time for new activities.';
      case 'Ovulation':
        return 'Peak fertility. You may feel more energetic and social.';
      case 'Luteal Phase':
        return 'Progesterone rising. You may prefer calmer activities.';
      default:
        return 'Track your period to see cycle insights.';
    }
  }

  getRegularityLabel(): string {
    if (!this.insights) return '';

    switch (this.insights.cycleRegularity) {
      case 'regular': return 'Regular';
      case 'irregular': return 'Irregular';
      case 'very_irregular': return 'Very Irregular';
      default: return '';
    }
  }

  getSymptomLabel(type: string): string {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}
