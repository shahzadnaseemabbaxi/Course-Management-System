import { Routes } from '@angular/router';
import { Student } from './pages/student/student';
import { Enrollment } from './pages/enrollment/enrollment';
import { Fees } from './pages/fees/fees';
import { Dashboard } from './features/dashboard/components/dashboard/dashboard';
import { Course } from './pages/course/course';
import { Setting } from './pages/setting/setting';
import { AdminProfile } from './pages/admin-profile/admin-profile';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard',   component: Dashboard },
  { path: 'students',    component: Student },
  { path: 'courses',     component: Course },
  { path: 'enrollments', component: Enrollment },
  { path: 'fees',        component: Fees },
  { path: 'settings',    component: Setting},
  { path: 'admin-profile',    component: AdminProfile }
];