import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoursesService } from '../../services/courses.service';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course.html',
  styleUrl: './course.css',
})
export class Course implements OnInit {

  showModal = signal<boolean>(false);

  private fb = inject(FormBuilder);
  private courseService = inject(CoursesService);
  public themeService = inject(ThemeService);

  courses = signal<any[]>([]);
  selectedCourseId = signal<number | null>(null);

  showSeatsDropdown = signal<boolean>(false);
  selectedSeatsLabel = signal<string>('');

  // ✅ Toast signals
  showToast = signal<boolean>(false);
  toastMessage = signal<string>('');
  toastType = signal<'error' | 'success'>('error');

  seatsOptions = [
    { code: 'CS',      seats: 20 },
    { code: 'MLT',     seats: 15 },
    { code: 'Angular', seats: 20 },
    { code: 'React',   seats: 15 },
    { code: 'Python',  seats: 25 },
    { code: 'Java',    seats: 22 },
    { code: 'Node',    seats: 18 },
    { code: 'UI/UX',   seats: 12 }
  ];

  // ✅ Sab fields required hain
  courseForm = this.fb.group({
    course_name:        ['', Validators.required],
    course_description: ['', Validators.required],
    course_duration:    ['', Validators.required],
    instructor:         ['', Validators.required],
    available_seats:    ['', Validators.required],
    course_fee:         ['', Validators.required],
  });

  ngOnInit() {
    this.loadCourses();
  }

  // ✅ Toast helper
  showToastMsg(msg: string, type: 'error' | 'success' = 'error') {
    this.toastMessage.set(msg);
    this.toastType.set(type);
    this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 3000);
  }

  openModal() {
    this.selectedCourseId.set(null);
    this.courseForm.reset();
    this.selectedSeatsLabel.set('');
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedCourseId.set(null);
    this.courseForm.reset();
    this.selectedSeatsLabel.set('');
    this.showSeatsDropdown.set(false);
  }

  toggleSeatsDropdown() {
    // v => !v current value ko ulta karta hai (true ko false aur false ko true); use na karo to toggle open/close nahi hoga,
    this.showSeatsDropdown.update(v => !v);
  }

  selectSeats(option: { code: string; seats: number }) {
    this.selectedSeatsLabel.set(`${option.code} — ${option.seats} seats`);
    this.courseForm.patchValue({
      available_seats: option.seats.toString()
    });
    this.showSeatsDropdown.set(false);
  }

  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: (data) => this.courses.set(data),
      error: (err) => console.error('Load error:', err),
    });
  }

  // ✅ Updated saveCourse with validation + toast
  saveCourse() {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      this.showToastMsg('⚠ Please fill all required fields', 'error');
      return;
    }

    if (this.selectedCourseId() === null) {
      this.courseService.addCourse(this.courseForm.value).subscribe(() => {
        this.showToastMsg('✅ Course added successfully!', 'success');
        this.closeModal();
        this.loadCourses();
      });
    } else {
      this.courseService
        .updateCourse(this.selectedCourseId()!, this.courseForm.value)
        .subscribe(() => {
          this.showToastMsg('✅ Course updated successfully!', 'success');
          this.closeModal();
          this.loadCourses();
        });
    }
  }

  editCourse(course: any) {
    this.selectedCourseId.set(course.id);
    this.courseForm.setValue({
      course_name: course.course_name,
      course_description: course.course_description,
      course_duration: course.course_duration,
      instructor: course.instructor,
      available_seats: course.available_seats,
      course_fee: course.course_fee,
    });
    this.selectedSeatsLabel.set(`Seats: ${course.available_seats}`);
    this.showModal.set(true);
  }

  deleteCourse(id: number) {
    this.courseService.deleteCourse(id).subscribe(() => {
      this.showToastMsg('🗑 Course deleted', 'success');
      this.loadCourses();
    });
  }

  // ✅ Field invalid check
  isInvalid(field: string): boolean {
    const control = this.courseForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}