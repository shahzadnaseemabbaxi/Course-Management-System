import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth'; 
import { ThemeService } from '../../../core/services/theme';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  public themeService = inject(ThemeService);

  myCoursesCount = signal<number>(0);
  totalFee = signal<number>(0);
  paidFee = signal<number>(0);
  pendingFee = signal<number>(0);
  studentName = signal<string>('');

  ngOnInit() {
    this.studentName.set(this.auth.currentUser()?.name || 'Student');
    this.loadStudentData();
  }

  loadStudentData() {
    const studentId = this.auth.getStudentId(); 
    console.log('🔍 Fetching data for Student ID:', studentId); 

    if (!studentId) {
      console.log('❌ Student ID not found. Login again.');
      return;
    }

    // 1. Enrollments fetch karein
    this.http.get<any[]>('http://localhost:3000/enrollments')
      .subscribe({
        next: (allEnrollments) => {
          // ✅ Filter karein (String compare taake "1" aur 1 match ho jayein)
          const myEnrollments = allEnrollments.filter(e => 
            String(e.student_id) === String(studentId)
          );
          
          console.log('✅ Meri Enrollments:', myEnrollments);
          this.myCoursesCount.set(myEnrollments.length);
          
          const totalCourseFee = myEnrollments.reduce((sum, e) => sum + Number(e.course_fee || 0), 0);
          this.totalFee.set(totalCourseFee);

          // 2. Payments fetch karein
          this.http.get<any[]>('http://localhost:3000/payments')
            .subscribe({
              next: (allPayments) => {
                const myPayments = allPayments.filter(p => 
                  String(p.student_id) === String(studentId)
                );
                
                console.log('✅ Meri Payments:', myPayments);
                const totalPaid = myPayments.reduce((sum, p) => sum + Number(p.paid_amount || 0), 0);
                this.paidFee.set(totalPaid);
                this.pendingFee.set(totalCourseFee - totalPaid);
              },
              error: (err) => console.error('❌ Payments error:', err)
            });
        },
        error: (err) => console.error('❌ Enrollments error:', err)
      });
  }
}