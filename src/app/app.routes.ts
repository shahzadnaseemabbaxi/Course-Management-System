import { Routes } from '@angular/router';
import { authGuard } from './core/gaurds/auth.guard';
import { adminGuard } from './core/gaurds/admin.guard';
import { studentGuard } from './core/gaurds/student.guard';

export const routes: Routes = [
  // ✅ Default → Login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // ✅ Login Pages (public)
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'login/admin',
    loadComponent: () =>
      import('./features/auth/admin-login/admin-login').then(m => m.AdminLoginComponent)
  },
  {
    path: 'login/student',
    loadComponent: () =>
      import('./features/auth/student-login/student-login').then(m => m.StudentLoginComponent)
  },

  // =========================
  // ✅ ADMIN ROUTES
  // =========================
  {
    path: 'dashboard',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/dashboard/components/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'students',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/student/components/student/student').then(m => m.Student)
  },
  {
    path: 'courses',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/courses/components/course/course').then(m => m.Course)
  },
  {
    path: 'enrollments',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/enrollment/components/enrollment/enrollment').then(m => m.Enrollment)
  },
  {
    path: 'fees',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/fees/components/fees/fees').then(m => m.Fees)
  },
  {
    path: 'settings',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/setting/components/setting/setting').then(m => m.Setting)
  },
  {
    path: 'admin-profile',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin-profile/components/admin-profile/admin-profile').then(m => m.AdminProfile)
  },

  // =========================
  // ✅ STUDENT ROUTES (kal banayenge)
  // =========================
  // NOTE: Filhaal student login karega to /login pe wapas bhej dega
  // Kal student-portal components banane ke baad, in routes ko uncomment karenge
  //
  {
    path: 'student/dashboard',
    canActivate: [authGuard, studentGuard],
    loadComponent: () =>
      import('./features/dashboard/components/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'student/courses',
    canActivate: [authGuard, studentGuard],
    loadComponent: () =>
      import('./features/courses/components/course/course').then(m => m.Course)
  },
  {
    path: 'student/fees',
    canActivate: [authGuard, studentGuard],
    loadComponent: () =>
      import('./features/fees/components/fees/fees').then(m => m.Fees)
  },
  // {
  //   path: 'student/profile',
  //   canActivate: [authGuard, studentGuard],
  //   loadComponent: () =>
  //     import('./features/admin-profile/components/admin-profile/admin-profile').then(m => m.MyProfileComponent)
  // },

  // Wildcard
  { path: '**', redirectTo: 'login' }
];