import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth';
import { ThemeService } from '../../../core/services/theme';

@Component({
  selector: 'app-fees',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fees.html',
  styleUrl: './fees.css'
})
export class Fees implements OnInit {

  private http = inject(HttpClient);
  private auth = inject(AuthService);
  public themeService = inject(ThemeService);

  myPayments = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    const studentId = this.auth.getStudentId();
    if (!studentId) return;

    // ✅ Saara data mangwayenge aur phir filter karenge
    this.http.get<any[]>('http://localhost:3000/payments')
      .subscribe({
        next: (allPayments) => {
          // ✅ Sirf is student ki payments filter karein
          const filteredPayments = allPayments.filter(p => 
            String(p.student_id) === String(studentId)
          );
          
          this.myPayments.set(filteredPayments);
          this.isLoading.set(false);
          console.log('✅ Fee History Data:', filteredPayments); // Console mein check karein
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error('❌ Payments error:', err);
        }
      });
  }
}