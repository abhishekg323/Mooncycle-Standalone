import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PeriodEntry, SymptomType } from '../../models/cycle.model';
import { CycleService } from '../../services/cycle.service';

@Component({
  selector: 'app-log-period',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './log-period.component.html',
  styleUrls: ['./log-period.component.scss']
})
export class LogPeriodComponent implements OnInit {
  @Input() periodToEdit?: PeriodEntry;
  @Input() prefilledDate?: Date;
  @Output() close = new EventEmitter<void>();

  startDate: string = '';
  endDate: string = '';
  flowIntensity: 'spotting' | 'light' | 'medium' | 'heavy' = 'medium';

  selectedSymptoms: Set<SymptomType> = new Set();
  symptomSeverity: Map<SymptomType, 'mild' | 'moderate' | 'severe'> = new Map();
  notes: string = '';

  isEditMode = false;

  availableSymptoms: { type: SymptomType; label: string; icon: string }[] = [
    { type: 'cramps', label: 'Cramps', icon: '💢' },
    { type: 'headache', label: 'Headache', icon: '🤕' },
    { type: 'bloating', label: 'Bloating', icon: '🎈' },
    { type: 'mood_swings', label: 'Mood Swings', icon: '😢' },
    { type: 'fatigue', label: 'Fatigue', icon: '😴' },
    { type: 'breast_tenderness', label: 'Breast Tenderness', icon: '🤱' },
    { type: 'acne', label: 'Acne', icon: '😣' },
    { type: 'backache', label: 'Backache', icon: '🔙' },
    { type: 'nausea', label: 'Nausea', icon: '🤢' },
    { type: 'insomnia', label: 'Insomnia', icon: '😵' },
    { type: 'food_cravings', label: 'Food Cravings', icon: '🍫' },
    { type: 'other', label: 'Other', icon: '📝' }
  ];

  constructor(private cycleService: CycleService) {}

  ngOnInit(): void {
    if (this.periodToEdit) {
      this.isEditMode = true;
      this.loadPeriodData(this.periodToEdit);
    } else if (this.prefilledDate) {
      // Set start date to the prefilled date
      this.startDate = this.formatDate(this.prefilledDate);
    } else {
      // Set default start date to today for new entries
      const today = new Date();
      this.startDate = this.formatDate(today);
    }
  }

  private loadPeriodData(period: PeriodEntry): void {
    this.startDate = this.formatDate(new Date(period.startDate));
    if (period.endDate) {
      this.endDate = this.formatDate(new Date(period.endDate));
    }

    // Load flow intensity (use first day's flow as default)
    if (period.flowIntensity && period.flowIntensity.length > 0) {
      this.flowIntensity = period.flowIntensity[0].intensity;
    }

    // Load symptoms
    if (period.symptoms && period.symptoms.length > 0) {
      period.symptoms.forEach(symptom => {
        this.selectedSymptoms.add(symptom.type);
        if (symptom.severity) {
          this.symptomSeverity.set(symptom.type, symptom.severity);
        }
      });
    }

    // Load notes
    if (period.notes) {
      this.notes = period.notes;
    }
  }

  toggleSymptom(symptomType: SymptomType): void {
    if (this.selectedSymptoms.has(symptomType)) {
      this.selectedSymptoms.delete(symptomType);
      this.symptomSeverity.delete(symptomType);
    } else {
      this.selectedSymptoms.add(symptomType);
      this.symptomSeverity.set(symptomType, 'moderate');
    }
  }

  setSeverity(symptomType: SymptomType, severity: 'mild' | 'moderate' | 'severe'): void {
    this.symptomSeverity.set(symptomType, severity);
  }

  getSeverity(symptomType: SymptomType): 'mild' | 'moderate' | 'severe' {
    return this.symptomSeverity.get(symptomType) || 'moderate';
  }

  savePeriod(): void {
    if (!this.startDate) {
      alert('Please select a start date');
      return;
    }

    const start = new Date(this.startDate);
    const end = this.endDate ? new Date(this.endDate) : undefined;

    if (end && end < start) {
      alert('End date cannot be before start date');
      return;
    }

    const symptoms = Array.from(this.selectedSymptoms).map(type => ({
      date: start,
      type,
      severity: this.symptomSeverity.get(type),
      notes: type === 'other' ? this.notes : undefined
    }));

    const flowIntensity = this.generateFlowIntensity(start, end);

    const period: PeriodEntry = {
      id: this.isEditMode && this.periodToEdit ? this.periodToEdit.id : Date.now().toString(),
      startDate: start,
      endDate: end,
      flowIntensity,
      symptoms,
      notes: this.notes
    };

    if (this.isEditMode && this.periodToEdit) {
      this.cycleService.updatePeriod(period);
    } else {
      this.cycleService.addPeriod(period);
    }

    this.close.emit();
  }

  deletePeriod(): void {
    if (this.isEditMode && this.periodToEdit) {
      if (confirm('Are you sure you want to delete this period entry?')) {
        this.cycleService.deletePeriod(this.periodToEdit.id);
        this.close.emit();
      }
    }
  }

  private generateFlowIntensity(start: Date, end?: Date): any[] {
    const flowDays = [];
    const current = new Date(start);
    const endDate = end || new Date(start);

    while (current <= endDate) {
      flowDays.push({
        date: new Date(current),
        intensity: this.flowIntensity
      });
      current.setDate(current.getDate() + 1);
    }

    return flowDays;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  cancel(): void {
    this.close.emit();
  }
}
