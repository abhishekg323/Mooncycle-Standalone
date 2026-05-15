import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  PeriodEntry,
  CycleData,
  CycleInsights,
  DayInfo,
  Symptom,
  SymptomType,
  FlowIntensity
} from '../models/cycle.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CycleService {
  private periodsSubject = new BehaviorSubject<PeriodEntry[]>([]);
  public periods$ = this.periodsSubject.asObservable();

  private cycleDataSubject = new BehaviorSubject<CycleData | null>(null);
  public cycleData$ = this.cycleDataSubject.asObservable();

  constructor(private storageService: StorageService) {
    this.loadPeriods();
  }

  private loadPeriods(): void {
    const periods = this.storageService.loadPeriods();
    this.periodsSubject.next(periods);
    this.calculateCycleData();
  }

  getPeriods(): PeriodEntry[] {
    return this.periodsSubject.value;
  }

  addPeriod(period: PeriodEntry): void {
    const periods = [...this.periodsSubject.value, period];
    this.savePeriods(periods);
  }

  updatePeriod(updatedPeriod: PeriodEntry): void {
    const periods = this.periodsSubject.value.map(p =>
      p.id === updatedPeriod.id ? updatedPeriod : p
    );
    this.savePeriods(periods);
  }

  deletePeriod(id: string): void {
    const periods = this.periodsSubject.value.filter(p => p.id !== id);
    this.savePeriods(periods);
  }

  private savePeriods(periods: PeriodEntry[]): void {
    this.periodsSubject.next(periods);
    this.storageService.savePeriods(periods);
    this.calculateCycleData();
  }

  private calculateCycleData(): void {
    const periods = this.periodsSubject.value
      .filter(p => p.startDate)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

    if (periods.length < 1) {
      this.cycleDataSubject.next(null);
      return;
    }

    const cycleLengths: number[] = [];
    const periodLengths: number[] = [];

    for (let i = 0; i < periods.length - 1; i++) {
      const current = new Date(periods[i].startDate);
      const next = new Date(periods[i + 1].startDate);
      const diff = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));
      if (diff > 0 && diff < 60) {
        cycleLengths.push(diff);
      }
    }

    periods.forEach(p => {
      if (p.endDate) {
        const start = new Date(p.startDate);
        const end = new Date(p.endDate);
        const length = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        if (length > 0 && length < 15) {
          periodLengths.push(length);
        }
      }
    });

    const avgCycleLength = cycleLengths.length > 0
      ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
      : 28;

    const avgPeriodLength = periodLengths.length > 0
      ? Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length)
      : 5;

    const lastPeriod = new Date(periods[0].startDate);
    const nextPredicted = new Date(lastPeriod);
    nextPredicted.setDate(nextPredicted.getDate() + avgCycleLength);

    const ovulationDay = new Date(nextPredicted);
    ovulationDay.setDate(ovulationDay.getDate() - 14);

    const fertileStart = new Date(ovulationDay);
    fertileStart.setDate(fertileStart.getDate() - 5);

    const fertileEnd = new Date(ovulationDay);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
    const currentDay = (daysSinceLastPeriod % avgCycleLength) + 1;

    this.cycleDataSubject.next({
      averageCycleLength: avgCycleLength,
      averagePeriodLength: avgPeriodLength,
      lastPeriodStart: lastPeriod,
      nextPredictedPeriod: nextPredicted,
      fertileWindowStart: fertileStart,
      fertileWindowEnd: fertileEnd,
      ovulationDay: ovulationDay,
      currentDayOfCycle: currentDay
    });
  }

  getCycleInsights(): CycleInsights | null {
    const periods = this.periodsSubject.value;
    if (periods.length < 2) return null;

    const sortedPeriods = [...periods].sort((a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    const cycleLengths: number[] = [];
    const periodLengths: number[] = [];

    for (let i = 0; i < sortedPeriods.length - 1; i++) {
      const current = new Date(sortedPeriods[i].startDate);
      const next = new Date(sortedPeriods[i + 1].startDate);
      const diff = Math.floor((next.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
      if (diff > 0 && diff < 60) cycleLengths.push(diff);
    }

    sortedPeriods.forEach(p => {
      if (p.endDate) {
        const start = new Date(p.startDate);
        const end = new Date(p.endDate);
        const length = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        if (length > 0 && length < 15) periodLengths.push(length);
      }
    });

    const avgCycle = cycleLengths.length > 0
      ? cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length
      : 28;

    const avgPeriod = periodLengths.length > 0
      ? periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length
      : 5;

    const variance = cycleLengths.reduce((sum, len) => sum + Math.pow(len - avgCycle, 2), 0) / cycleLengths.length;
    const stdDev = Math.sqrt(variance);

    let regularity: 'regular' | 'irregular' | 'very_irregular' = 'regular';
    if (stdDev > 7) regularity = 'very_irregular';
    else if (stdDev > 4) regularity = 'irregular';

    const symptomCounts: Map<SymptomType, number> = new Map();
    periods.forEach(p => {
      p.symptoms?.forEach(s => {
        symptomCounts.set(s.type, (symptomCounts.get(s.type) || 0) + 1);
      });
    });

    const commonSymptoms = Array.from(symptomCounts.entries())
      .map(([symptom, count]) => ({ symptom, frequency: count }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);

    return {
      totalCycles: cycleLengths.length,
      averageCycleLength: Math.round(avgCycle),
      averagePeriodLength: Math.round(avgPeriod),
      shortestCycle: Math.min(...cycleLengths),
      longestCycle: Math.max(...cycleLengths),
      cycleRegularity: regularity,
      commonSymptoms
    };
  }

  getDayInfo(date: Date): DayInfo {
    const periods = this.periodsSubject.value;
    const cycleData = this.cycleDataSubject.value;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    const info: DayInfo = {
      date: checkDate,
      isPeriod: false,
      isToday: checkDate.getTime() === today.getTime(),
      isPredicted: false,
      isFertile: false,
      isOvulation: false,
      symptoms: []
    };

    // Check if date is in recorded period
    for (const period of periods) {
      const start = new Date(period.startDate);
      start.setHours(0, 0, 0, 0);
      const end = period.endDate ? new Date(period.endDate) : new Date(start);
      end.setHours(0, 0, 0, 0);

      if (checkDate >= start && checkDate <= end) {
        info.isPeriod = true;
        const flowEntry = period.flowIntensity?.find(f => {
          const flowDate = new Date(f.date);
          flowDate.setHours(0, 0, 0, 0);
          return flowDate.getTime() === checkDate.getTime();
        });
        if (flowEntry) info.flowIntensity = flowEntry.intensity;

        const symptomEntries = period.symptoms?.filter(s => {
          const symptomDate = new Date(s.date);
          symptomDate.setHours(0, 0, 0, 0);
          return symptomDate.getTime() === checkDate.getTime();
        });
        if (symptomEntries) info.symptoms = symptomEntries;
        break;
      }
    }

    // Check predicted period
    if (cycleData?.nextPredictedPeriod && cycleData.averagePeriodLength) {
      const predictedStart = new Date(cycleData.nextPredictedPeriod);
      predictedStart.setHours(0, 0, 0, 0);
      const predictedEnd = new Date(predictedStart);
      predictedEnd.setDate(predictedEnd.getDate() + cycleData.averagePeriodLength - 1);

      if (checkDate >= predictedStart && checkDate <= predictedEnd) {
        info.isPredicted = true;
      }
    }

    // Check fertile window
    if (cycleData?.fertileWindowStart && cycleData.fertileWindowEnd) {
      const fertileStart = new Date(cycleData.fertileWindowStart);
      fertileStart.setHours(0, 0, 0, 0);
      const fertileEnd = new Date(cycleData.fertileWindowEnd);
      fertileEnd.setHours(0, 0, 0, 0);

      if (checkDate >= fertileStart && checkDate <= fertileEnd) {
        info.isFertile = true;
      }
    }

    // Check ovulation day
    if (cycleData?.ovulationDay) {
      const ovulation = new Date(cycleData.ovulationDay);
      ovulation.setHours(0, 0, 0, 0);
      if (checkDate.getTime() === ovulation.getTime()) {
        info.isOvulation = true;
      }
    }

    // Calculate day of cycle
    if (cycleData?.lastPeriodStart && cycleData.averageCycleLength) {
      const lastPeriod = new Date(cycleData.lastPeriodStart);
      lastPeriod.setHours(0, 0, 0, 0);
      const daysSince = Math.floor((checkDate.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSince >= 0) {
        info.dayOfCycle = (daysSince % cycleData.averageCycleLength) + 1;
      }
    }

    return info;
  }

  getMonthDays(year: number, month: number): DayInfo[] {
    const days: DayInfo[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      days.push(this.getDayInfo(date));
    }

    return days;
  }
}
