import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CoursesService } from '../../services/courses.service';
@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course.html',
  styleUrl: './course.css',
})
export class Course implements OnInit {
    showForm = input<boolean>(true);
  private fb = inject(FormBuilder);
  private courseService = inject(CoursesService);

  courses = signal<any[]>([]);
  selectedCourseId = signal<number | null>(null);

  courseForm = this.fb.group({
    course_name: '',
    course_description: '',
    course_duration: '',
    instructor: '',
    available_seats: '',
  });

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: (data) => this.courses.set(data),
      error: (err) => console.error('Load error:', err),
    });
  }

  saveCourse() {
    if (this.selectedCourseId() === null) {
      // ADD
      this.courseService.addCourse(this.courseForm.value).subscribe(() => {
        this.courseForm.reset();
        this.loadCourses();
      });
    } else {
      // UPDATE
      this.courseService
        .updateCourse(this.selectedCourseId()!, this.courseForm.value)
        .subscribe(() => {
          this.cancelEdit();
          this.loadCourses();
        });
    }
  }

  cancelEdit() {
    this.selectedCourseId.set(null);
    this.courseForm.reset();
  }

  editCourse(course: any) {
    this.selectedCourseId.set(course.id);
    this.courseForm.setValue({
      course_name: course.course_name,
      course_description: course.course_description,
      course_duration: course.course_duration,
      instructor: course.instructor,
      available_seats: course.available_seats,
    });
  }

  deleteCourse(id: number) {
    this.courseService.deleteCourse(id).subscribe(() => {
      this.loadCourses();
    });
  }
}