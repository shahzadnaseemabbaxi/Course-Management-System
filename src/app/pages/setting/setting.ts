import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './setting.html',
  styleUrl: './setting.css'
})
export class Setting implements OnInit {

  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  public themeService = inject(ThemeService);

  // Toast
  showToast = signal<boolean>(false);
  toastMessage = signal<string>('');
  toastType = signal<'error' | 'success'>('error');

  // Active tab
  activeTab = signal<'profile' | 'password' | 'appearance' | 'data'>('profile');

  // Profile Form
  profileForm = this.fb.group({
    name:  ['Admin', Validators.required],
    email: ['admin@cms.com', [Validators.required, Validators.email]],
    phone: ['03001234567']
  });

  // Password Form
  passwordForm = this.fb.group({
    current: ['', Validators.required],
    newPass: ['', [Validators.required, Validators.minLength(6)]],
    confirm: ['', Validators.required]
  });

  // Appearance
  accentColor = signal<string>('#10b981');

  ngOnInit() {
    // Load saved profile from localStorage
    const saved = localStorage.getItem('admin_profile');
    if (saved) {
      this.profileForm.patchValue(JSON.parse(saved));
    }
  }

  showToastMsg(msg: string, type: 'error' | 'success' = 'error') {
    this.toastMessage.set(msg);
    this.toastType.set(type);
    this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 3000);
  }

  setTab(tab: 'profile' | 'password' | 'appearance' | 'data') {
    this.activeTab.set(tab);
  }

  // ✅ Save Profile
  saveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.showToastMsg('⚠ Please fill all fields correctly', 'error');
      return;
    }

    localStorage.setItem('admin_profile', JSON.stringify(this.profileForm.value));
    this.showToastMsg('✅ Profile updated successfully!', 'success');
  }

  // ✅ Change Password
  changePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.showToastMsg('⚠ Please fill all fields', 'error');
      return;
    }

    const { current, newPass, confirm } = this.passwordForm.value;

    if (newPass !== confirm) {
      this.showToastMsg('⚠ Passwords do not match', 'error');
      return;
    }

    this.showToastMsg('✅ Password changed successfully!', 'success');
    this.passwordForm.reset();
  }

  // ✅ Set Accent Color
  setAccent(color: string) {
    this.accentColor.set(color);
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('accent_color', color);
    this.showToastMsg('🎨 Accent color updated!', 'success');
  }

  // ✅ Export JSON
  exportJSON() {
    this.http.get<any>('http://localhost:3000/students').subscribe(students => {
      this.http.get<any>('http://localhost:3000/courses').subscribe(courses => {
        this.http.get<any>('http://localhost:3000/enrollments').subscribe(enrollments => {
          this.http.get<any>('http://localhost:3000/payments').subscribe(payments => {
            const data = { students, courses, enrollments, payments };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            this.showToastMsg('✅ Data exported successfully!', 'success');
          });
        });
      });
    });
  }

  // ✅ Reset All Data
  resetAllData() {
    if (!confirm('⚠ Are you sure? This will DELETE all students, courses, enrollments and payments!')) {
      return;
    }

    this.http.put('http://localhost:3000/students', []).subscribe();
    this.http.put('http://localhost:3000/courses', []).subscribe();
    this.http.put('http://localhost:3000/enrollments', []).subscribe();
    this.http.put('http://localhost:3000/payments', []).subscribe(() => {
      this.showToastMsg('🗑 All data reset successfully!', 'success');
    });
  }

  isInvalid(form: any, field: string): boolean {
    const c = form.get(field);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }
}