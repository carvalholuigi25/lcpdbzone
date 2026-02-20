import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SettingsService } from '@/app/services/settings.service';
import { Settings, ThemeOption } from '@/app/models/settings';
import { ToastService } from '@/app/services/toast.service';

@Component({
  selector: 'app-admsettings',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admsettings.html',
  styleUrl: './admsettings.scss',
})
export class Admsettings implements OnInit {
  @Input() hideSidebar: boolean = false;

  settingsForm: FormGroup;
  settings: Settings | null = null;
  themeOptions: ThemeOption[] = [];
  loading: boolean = false;
  saved: boolean = false;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private toastService: ToastService
  ) {
    this.settingsForm = this.fb.group({
      theme: ['dark', Validators.required],
      realTimeDataEnabled: [true],
      autoRefreshInterval: [30, [Validators.required, Validators.min(5), Validators.max(300)]],
      notificationsEnabled: [true],
      enableLogging: [false]
    });
  }

  ngOnInit() {
    this.loadSettings();
    this.themeOptions = this.settingsService.themeOptions;
  }

  loadSettings(): void {
    this.settingsService.getSettings().subscribe({
      next: (settings) => {
        this.settings = settings;
        this.settingsForm.patchValue(settings);
      },
      error: (err) => {
        console.error('Error loading settings:', err);
        this.toastService.showToast('Error loading settings', 'error');
      }
    });
  }

  onSubmit(): void {
    if (this.settingsForm.invalid) {
      this.toastService.showToast('Please fix form errors', 'error');
      return;
    }

    this.loading = true;
    const formValue = this.settingsForm.value as Settings;

    this.settingsService.updateSettings(formValue).subscribe({
      next: () => {
        this.loading = false;
        this.saved = true;
        this.toastService.showToast('Settings saved successfully', 'success');
        setTimeout(() => {
          this.saved = false;
        }, 3000);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error saving settings:', err);
        this.toastService.showToast('Error saving settings', 'error');
      }
    });
  }

  resetToDefaults(): void {
    if (confirm('Are you sure you want to reset to default settings?')) {
      this.loading = true;
      this.settingsService.resetToDefaults().subscribe({
        next: (settings) => {
          this.settings = settings;
          this.settingsForm.patchValue(settings);
          this.loading = false;
          this.toastService.showToast('Settings reset to defaults', 'success');
        },
        error: (err) => {
          this.loading = false;
          console.error('Error resetting settings:', err);
          this.toastService.showToast('Error resetting settings', 'error');
        }
      });
    }
  }

  saveLocally(): void {
    if (this.settingsForm.invalid) {
      this.toastService.showToast('Please fix form errors', 'error');
      return;
    }

    const formValue = this.settingsForm.value as Settings;
    this.settingsService.saveSettingsLocally(formValue);
    this.saved = true;
    this.toastService.showToast('Settings saved locally', 'success');
    setTimeout(() => {
      this.saved = false;
    }, 3000);
  }
}

