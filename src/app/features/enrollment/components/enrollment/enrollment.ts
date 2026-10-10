import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ThemeService } from '../../../../core/services/theme';

@Component({
  selector: 'app-enrollment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './enrollment.html',
  styleUrl: './enrollment.css'
})
export class Enrollment implements OnInit {

  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  public themeService = inject(ThemeService);

  showModal = signal<boolean>(false);
  enrollments = signal<any[]>([]);
  students = signal<any[]>([]);
  courses = signal<any[]>([]);
  selectedEnrollmentId = signal<number | null>(null);

  // Toast
  showToast = signal<boolean>(false);
  toastMessage = signal<string>('');
  toastType = signal<'error' | 'success'>('error');

  // Dropdowns
  showStudentDropdown = signal<boolean>(false);
  selectedStudentLabel = signal<string>('');
  showCourseDropdown = signal<boolean>(false);
  selectedCourseLabel = signal<string>('');

  form = this.fb.group({
    student_id:   ['', Validators.required],
    student_name: [''],
    course_id:    ['', Validators.required],
    course_name:  [''],
    course_fee:   ['', Validators.required],
    enroll_date:  [new Date().toISOString().slice(0, 10), Validators.required],
    status:       ['Active', Validators.required]
  });

  ngOnInit() {
    this.loadEnrollments();
    this.loadStudents();
    this.loadCourses();
  }

  showToastMsg(msg: string, type: 'error' | 'success' = 'error') {
    this.toastMessage.set(msg);
    this.toastType.set(type);
    this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 3000);
  }

  loadEnrollments() {
    this.http.get<any[]>('http://localhost:3000/enrollments')
      .subscribe(data => this.enrollments.set(data));
  }

  loadStudents() {
    this.http.get<any[]>('http://localhost:3000/students')
      .subscribe(data => this.students.set(data));
  }
onStudentChange(event: Event) {
  const select = event.target as HTMLSelectElement;
  const studentId = select.value;    // ✅ Number() HATAO

  console.log('🔵 Student ID:', studentId);

  const student = this.students().find(s => String(s.id) === studentId);

  if (student) {
    this.form.patchValue({
      student_id: student.id,
      student_name: student.name
    });
    console.log('✅ Student set:', student.name);
  } else {
    console.log('❌ Student not found:', studentId);
  }
}

  loadCourses() {
    this.http.get<any[]>('http://localhost:3000/courses')
      .subscribe(data => this.courses.set(data));
  }
onCourseChange(event: Event) {
  const select = event.target as HTMLSelectElement;
  const courseId = select.value;    // ✅ Number() HATAO

  console.log('🔵 Course ID:', courseId);
  console.log('🔵 Courses:', this.courses());

  const course = this.courses().find(c => String(c.id) === courseId);

  if (course) {
    this.form.patchValue({
      course_id: course.id,
      course_name: course.course_name,
      course_fee: course.course_fee
    });
    console.log('✅ Fee set:', course.course_fee);
  } else {
    console.log('❌ Course not found:', courseId);
  }
}
  toggleStudentDropdown() { this.showStudentDropdown.update(v => !v); }
  toggleCourseDropdown()  { this.showCourseDropdown.update(v => !v); }

  selectStudent(s: any) {
    this.selectedStudentLabel.set(s.name);
    this.form.patchValue({
      student_id: s.id,
      student_name: s.name
    });
    this.showStudentDropdown.set(false);
  }

  selectCourse(c: any) {
    this.selectedCourseLabel.set(c.course_name);
    this.form.patchValue({
      course_id: c.id,
      course_name: c.course_name,
      course_fee: c.course_fee
    });
    this.showCourseDropdown.set(false);
  }

  openModal() {
    this.selectedEnrollmentId.set(null);
    this.form.reset({
      status: 'Active',
      enroll_date: new Date().toISOString().slice(0, 10)
    });
    this.selectedStudentLabel.set('');
    this.selectedCourseLabel.set('');
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedEnrollmentId.set(null);
    this.form.reset();
    this.selectedStudentLabel.set('');
    this.selectedCourseLabel.set('');
  }

  saveEnrollment() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showToastMsg('⚠ Please fill all required fields', 'error');
      return;
    }

    const url = 'http://localhost:3000/enrollments';

    if (this.selectedEnrollmentId() === null) {
      this.http.post(url, this.form.value).subscribe(() => {
        this.showToastMsg('✅ Enrollment created!', 'success');
        this.closeModal();
        this.loadEnrollments();
      });
    } else {
      this.http.put(`${url}/${this.selectedEnrollmentId()}`, this.form.value)
        .subscribe(() => {
          this.showToastMsg('✅ Enrollment updated!', 'success');
          this.closeModal();
          this.loadEnrollments();
        });
    }
  }

  editEnrollment(e: any) {
    this.selectedEnrollmentId.set(e.id);
    this.form.setValue({
      student_id: e.student_id,
      student_name: e.student_name,
      course_id: e.course_id,
      course_name: e.course_name,
      course_fee: e.course_fee,
      enroll_date: e.enroll_date,
      status: e.status
    });
    this.selectedStudentLabel.set(e.student_name);
    this.selectedCourseLabel.set(e.course_name);
    this.showModal.set(true);
  }

  deleteEnrollment(id: number) {
    this.http.delete(`http://localhost:3000/enrollments/${id}`)
      .subscribe(() => {
        this.showToastMsg('🗑 Enrollment deleted', 'success');
        this.loadEnrollments();
      });
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }
}