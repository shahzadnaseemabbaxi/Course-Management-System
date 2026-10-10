import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css'
})
export class AdminLoginComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // ✅ Signals
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');

  // ✅ Login form
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  // ✅ Submit
  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const { username, password } = this.loginForm.value;

    this.authService.login(username!, password!, 'admin').subscribe({
      next: (users) => {
        this.loading.set(false);

        if (users && users.length > 0) {
          // ✅ Success
          console.log('✅ Admin logged in');
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set('❌ Invalid username or password');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set('❌ Login failed. Try again.');
        console.error(err);
      }
    });
  }

  isInvalid(field: string): boolean {
    const c = this.loginForm.get(field);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }
}