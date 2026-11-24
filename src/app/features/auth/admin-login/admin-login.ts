import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-admin-login', // ✅ Selector theek kiya
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-login.html', // ✅ Sahi HTML file
  styleUrl: './admin-login.css'      // ✅ Sahi CSS file
})
export class AdminLoginComponent implements OnInit {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal<boolean>(false);
  errorMessage = signal<string>('');
  showPassword = signal<boolean>(false); 

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  ngOnInit() {
    this.loginForm.reset();
    
    // ✅ Browser auto-fill rokne ke liye
    setTimeout(() => {
      this.loginForm.reset();
    }, 100);
  }

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const { username, password } = this.loginForm.value;

    // ✅ Role 'admin' kiya
    this.authService.login(username!, password!, 'admin').subscribe({
      next: (users) => {
        this.loading.set(false);

        if (users && users.length > 0) {
          console.log('✅ Admin logged in');
          // ✅ Admin dashboard par bheja
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