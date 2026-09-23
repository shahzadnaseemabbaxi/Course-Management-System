import { Routes } from '@angular/router';
import { Student } from './pages/student/student';
import { Courses } from './pages/courses/courses';
import { Enrollment } from './pages/enrollment/enrollment';
import { Fees } from './pages/fees/fees';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
    {
        path: "", component: Dashboard
    },   
    {
        path: "student", component: Student
    },   
    {
        path: "courses", component: Courses
    },   
    {
        path: "enrollment", component: Enrollment
    },   
    {
        path: "fees", component: Fees
    },   
];
