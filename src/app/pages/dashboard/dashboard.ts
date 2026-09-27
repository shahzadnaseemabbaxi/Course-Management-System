import { Component, signal} from '@angular/core';
import { Student } from '../student/student';
import { Course } from '../course/course';

@Component({
  imports: [],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  totalStudents = signal<number>(120)
  totalCourses = signal<number>(12)
  totalEnrollments = signal<number>(180)
  totalFee = signal<number>(5000)
}
