import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { Students } from '../../services/students';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-student',
  styleUrl: './student.css',
  templateUrl: './student.html',
})
export class Student {
  private fb = inject(FormBuilder);
  private studentService = inject(Students);

  //  Yeh naya input add karein
  showForm = input<boolean>(true); // Default true — Students page par form dikhega

  students = signal<any[]>([]);
  selectedStudentId = signal<number | null>(null);

  studentForm = this.fb.group({
    name: '',
    father_name: '',
    email: '',
    phone: '',
    address: '',
    department: '',
  });

  ngOnInit() {
    this.loadStudent();
  }

  loadStudent() {
    this.studentService.getStudents().subscribe((data) => {
      this.students.set(data);
    });
  }

  saveStudent() {
    if (this.selectedStudentId() === null) {
      // Ager null hoga to ya add student ki trah kam karay ga
      this.studentService.addStudent(this.studentForm.value).subscribe(() => {
        this.studentForm.reset();
        this.loadStudent();
      });
    } else {
      // to edit ya update hoga
      this.studentService
        .updateStudent(this.selectedStudentId()!, this.studentForm.value)
        .subscribe(() => {
          this.cancelEdit();
          this.loadStudent();
        });
    }
  }

  cancelEdit() {
    this.selectedStudentId.set(null);
    this.studentForm.reset();
  }

  editStudent(student: any) {
    this.selectedStudentId.set(student.id);

    this.studentForm.setValue({
      name: student.name,
      father_name: student.father_name,
      email: student.email,
      phone: student.phone,
      address: student.address,
      department: student.department,
    });
  }

  deleteStudent(id: number) {
    this.studentService.deleteStudent(id).subscribe(() => {
      this.loadStudent();
    });
  }
}
