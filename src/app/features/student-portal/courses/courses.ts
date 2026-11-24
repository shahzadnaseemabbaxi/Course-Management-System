import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth';
import { ThemeService } from '../../../core/services/theme';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css'
})
export class Courses implements OnInit {
  
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  public themeService = inject(ThemeService);

  myEnrollments = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    const studentId = this.auth.getStudentId();
    if (!studentId) return;

    this.http.get<any[]>('http://localhost:3000/enrollments')
      .subscribe({
        next: (data) => {
          // ✅ Filter karein
          const filtered = data.filter(e => String(e.student_id) === String(studentId));
          this.myEnrollments.set(filtered);
          this.isLoading.set(false);
          console.log('✅ Courses Page Data:', filtered);
        },
        error: () => this.isLoading.set(false)
      });
  }
}