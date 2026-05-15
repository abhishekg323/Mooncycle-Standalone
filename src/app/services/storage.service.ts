import { Injectable } from '@angular/core';
import { PeriodEntry } from '../models/cycle.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'mooncycle_data';

  constructor() { }

  savePeriods(periods: PeriodEntry[]): void {
    try {
      const serialized = JSON.stringify(periods, (key, value) => {
        if (value instanceof Date) {
          return { _type: 'Date', value: value.toISOString() };
        }
        return value;
      });
      localStorage.setItem(this.STORAGE_KEY, serialized);
    } catch (error) {
      console.error('Error saving periods:', error);
    }
  }

  loadPeriods(): PeriodEntry[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];

      return JSON.parse(data, (key, value) => {
        if (value && typeof value === 'object' && value._type === 'Date') {
          return new Date(value.value);
        }
        return value;
      });
    } catch (error) {
      console.error('Error loading periods:', error);
      return [];
    }
  }

  clearAllData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  exportData(): string {
    return localStorage.getItem(this.STORAGE_KEY) || '';
  }

  importData(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      localStorage.setItem(this.STORAGE_KEY, data);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}
