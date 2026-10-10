import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-student-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './student-login.html',
  styleUrl: './student-login.css'
})
export class StudentLoginComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal<boolean>(false);
  errorMessage = signal<string>('');

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const { username, password } = this.loginForm.value;

    this.authService.login(username!, password!, 'student').subscribe({
      next: (users) => {
        this.loading.set(false);

        if (users && users.length > 0) {
          console.log('✅ Student logged in');
          this.router.navigate(['/student/dashboard']);   // ⏭️ Kal banayenge
        } else {
          this.errorMessage.set('❌ Invalid roll number or password');
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