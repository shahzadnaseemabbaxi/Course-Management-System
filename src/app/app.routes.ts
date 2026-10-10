import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/components/dashboard/dashboard';
import { Setting } from './features/setting/components/setting/setting';
import { AdminProfile } from './features/admin-profile/components/admin-profile/admin-profile';
import { Course } from './features/courses/components/course/course';
import { Enrollment } from './features/enrollment/components/enrollment/enrollment';
import { Fees } from './features/fees/components/fees/fees';
import { Student } from './features/student/components/student/student';

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