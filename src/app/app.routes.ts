import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth'; 
import { authGuard } from './core/gaurds/auth.guard';
import { adminGuard } from './core/gaurds/admin.guard';
import { studentGuard } from './core/gaurds/student.guard';

export const routes: Routes = [
  // ✅ Default → Login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // ✅ Login Pages
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent),
    canActivate: [() => {
      const auth = inject(AuthService);
      const router = inject(Router);
      if (auth.isLoggedIn()) {
        router.navigate([auth.isAdmin() ? '/dashboard' : '/student/dashboard']);
        return false;
      }
      return true;
    }]
  },
  {
    path: 'login/admin',
    loadComponent: () => import('./features/auth/admin-login/admin-login').then(m => m.AdminLoginComponent),
    canActivate: [() => {
      const auth = inject(AuthService);
      const router = inject(Router);
      if (auth.isLoggedIn()) { router.navigate(['/dashboard']); return false; }
      return true;
    }]
  },
  {
    path: 'login/student',
    loadComponent: () => import('./features/auth/student-login/student-login').then(m => m.StudentLoginComponent),
    canActivate: [() => {
      const auth = inject(AuthService);
      const router = inject(Router);
      if (auth.isLoggedIn()) { router.navigate(['/student/dashboard']); return false; }
      return true;
    }]
  },

  // =========================
  // ✅ ADMIN ROUTES
  // =========================
  {
    path: 'dashboard',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/dashboard/components/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'students',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/student/components/student/student').then(m => m.Student)
  },
  {
    path: 'courses',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/courses/components/course/course').then(m => m.Course)
  },
  {
    path: 'enrollments',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/enrollment/components/enrollment/enrollment').then(m => m.Enrollment)
  },
  {
    path: 'fees',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/fees/components/fees/fees').then(m => m.Fees)
  },
  {
    path: 'settings',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/setting/components/setting/setting').then(m => m.Setting)
  },
  {
    path: 'admin-profile',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin-profile/components/admin-profile/admin-profile').then(m => m.AdminProfile)
  },

  // =========================
  // ✅ STUDENT ROUTES (NEW)
  // =========================
  {
    path: 'student/dashboard',
    canActivate: [authGuard, studentGuard],
    // ✅ Ab yeh naye component par jayega
    loadComponent: () => import('./features/student-portal/dashboard/dashboard').then(m => m.Dashboard) 
  },
  {
    path: 'student/courses',
    canActivate: [authGuard, studentGuard],
    // ✅ Ab yeh naye component par jayega
    loadComponent: () => import('./features/student-portal/courses/courses').then(m => m.Courses)
  },
  {
    path: 'student/fees',
    canActivate: [authGuard, studentGuard],
    // ✅ Ab yeh naye component par jayega
    loadComponent: () => import('./features/student-portal/fees/fees').then(m => m.Fees)
  },

  // Wildcard
  { path: '**', redirectTo: 'login' }
];