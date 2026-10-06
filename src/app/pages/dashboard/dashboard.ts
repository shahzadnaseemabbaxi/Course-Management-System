import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  private http = inject(HttpClient);
  public themeService = inject(ThemeService);

  // ✅ Signals — real data se fill honge
  totalStudents = signal<number>(0);
  totalCourses = signal<number>(0);
  totalEnrollments = signal<number>(0);
  totalFee = signal<number>(0);
  pendingFee = signal<number>(0);

  // Enrollment Target (percentage)
  monthlyTarget = signal<number>(72);
  targetGrowth = signal<number>(10);

  // Monthly fees chart
  salesData = [
    { month: 'Jan', value: 160 },
    { month: 'Feb', value: 350 },
    { month: 'Mar', value: 200 },
    { month: 'Apr', value: 280 },
    { month: 'May', value: 180 },
    { month: 'Jun', value: 190 },
    { month: 'Jul', value: 270 },
    { month: 'Aug', value: 100 },
    { month: 'Sep', value: 210 },
    { month: 'Oct', value: 380 },
    { month: 'Nov', value: 260 },
    { month: 'Dec', value: 110 }
  ];

  maxSales = 400;

  ngOnInit() {
    console.log('🔵 Dashboard ngOnInit');
    this.loadAllData();
  }

  // ✅ Sab data ek saath load karo
  loadAllData() {
    // Students
    this.http.get<any[]>('http://localhost:3000/students')
      .subscribe({
        next: (data) => {
          console.log('🟢 Students:', data.length);
          this.totalStudents.set(data.length);
        },
        error: (err) => console.error('❌ Students error:', err)
      });

    // Courses
    this.http.get<any[]>('http://localhost:3000/courses')
      .subscribe({
        next: (data) => {
          console.log('🟢 Courses:', data.length);
          this.totalCourses.set(data.length);
        },
        error: (err) => console.error('❌ Courses error:', err)
      });

    // Enrollments
    this.http.get<any[]>('http://localhost:3000/enrollments')
      .subscribe({
        next: (data) => {
          console.log('🟢 Enrollments:', data.length);
          this.totalEnrollments.set(data.length);

          // Total enrolled fee calculate
          const total = data.reduce((sum, e) => sum + Number(e.course_fee || 0), 0);
          this.totalFee.set(total);
          console.log('🟢 Total enrolled fee:', total);
        },
        error: (err) => console.error('❌ Enrollments error:', err)
      });

    // Payments — Pending calculate
    this.http.get<any[]>('http://localhost:3000/payments')
      .subscribe({
        next: (payments) => {
          // Enrollments + Payments dono chahiye pending ke liye
          this.http.get<any[]>('http://localhost:3000/enrollments')
            .subscribe(enrollments => {
              const totalEnrolled = enrollments.reduce((sum, e) => sum + Number(e.course_fee || 0), 0);
              const totalPaid = payments.reduce((sum, p) => sum + Number(p.paid_amount || 0), 0);
              const pending = totalEnrolled - totalPaid;
              this.pendingFee.set(pending);
              console.log('🟢 Total paid:', totalPaid, '| Pending:', pending);
            });
        },
        error: (err) => console.error('❌ Payments error:', err)
      });
  }

  getBarHeight(value: number): number {
    return (value / this.maxSales) * 100;
  }
}