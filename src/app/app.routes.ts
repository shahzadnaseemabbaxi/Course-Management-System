import { Routes } from '@angular/router';
import { Student } from './pages/student/student';
import { Enrollment } from './pages/enrollment/enrollment';
import { Fees } from './pages/fees/fees';
import { Dashboard } from './pages/dashboard/dashboard';
import { Course } from './pages/course/course';

export const routes: Routes = [
    {
        path: "", component: Dashboard
    },   
    {
        path: "student", component: Student
    },   
    {
        path: "courses", component: Course
    },   
    {
        path: "enrollment", component: Enrollment
    },   
    {
        path: "fees", component: Fees
    },   
];
