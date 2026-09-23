import { Component, signal} from '@angular/core';
import { Student } from '../student/student';

@Component({
  imports: [Student],
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
