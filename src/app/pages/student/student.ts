import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student.html',
  styleUrl: './student.css'
})
export class Student implements OnInit {

  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  public themeService = inject(ThemeService);

  // ✅ Modal state
  showModal = signal<boolean>(false);

  students = signal<any[]>([]);
  selectedStudentId = signal<number | null>(null);

  // ✅ Toast signals
  showToast = signal<boolean>(false);
  toastMessage = signal<string>('');
  toastType = signal<'error' | 'success'>('error');

  // ✅ Department dropdown signals
  showDeptDropdown = signal<boolean>(false);
  selectedDeptLabel = signal<string>('');

  // ✅ Department options
  departmentOptions = [
    'Computer Science',
    'Software Engineering',
    'Information Technology',
    'Artificial Intelligence',
    'Data Science',
    'Cyber Security',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Business Administration',
    'Mathematics'
  ];

  // ✅ Sab fields required
  studentForm = this.fb.group({
    name:        ['', Validators.required],
    father_name: ['', Validators.required],
    email:       ['', Validators.required],
    phone:       ['', Validators.required],
    address:     ['', Validators.required],
    department:  ['', Validators.required]
  });

  ngOnInit() {
    this.loadStudents();
  }

  // ✅ Toast helper
  showToastMsg(msg: string, type: 'error' | 'success' = 'error') {
    this.toastMessage.set(msg);
    this.toastType.set(type);
    this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 3000);
  }

  // ✅ Department dropdown toggle
  toggleDeptDropdown() {
    this.showDeptDropdown.update(v => !v);
  }

  // ✅ Select department
  selectDept(dept: string) {
    this.selectedDeptLabel.set(dept);
    this.studentForm.patchValue({
      department: dept
    });
    this.showDeptDropdown.set(false);
  }

  // ✅ Modal open
  openModal() {
    this.selectedStudentId.set(null);
    this.studentForm.reset();
    this.selectedDeptLabel.set('');
    this.showDeptDropdown.set(false);
    this.showModal.set(true);
  }

  // ✅ Modal close
  closeModal() {
    this.showModal.set(false);
    this.selectedStudentId.set(null);
    this.studentForm.reset();
    this.selectedDeptLabel.set('');
    this.showDeptDropdown.set(false);
  }

  loadStudents() {
    this.http.get<any[]>('http://localhost:3000/students')
      .subscribe(data => this.students.set(data));
  }

  // ✅ Save with validation
  saveStudent() {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      this.showToastMsg('⚠ Please fill all required fields', 'error');
      return;
    }

    const url = 'http://localhost:3000/students';

    if (this.selectedStudentId() === null) {
      this.http.post(url, this.studentForm.value).subscribe(() => {
        this.showToastMsg('✅ Student added successfully!', 'success');
        this.closeModal();
        this.loadStudents();
      });
    } else {
      this.http.put(`${url}/${this.selectedStudentId()}`, this.studentForm.value)
        .subscribe(() => {
          this.showToastMsg('✅ Student updated successfully!', 'success');
          this.closeModal();
          this.loadStudents();
        });
    }
  }

  editStudent(student: any) {
    this.selectedStudentId.set(student.id);
    this.studentForm.setValue({
      name: student.name,
      father_name: student.father_name,
      email: student.email,
      phone: student.phone,
      address: student.address,
      department: student.department
    });
    this.selectedDeptLabel.set(student.department);   // ✅ dropdown label set
    this.showModal.set(true);
  }

  deleteStudent(id: number) {
    this.http.delete(`http://localhost:3000/students/${id}`)
      .subscribe(() => {
        this.showToastMsg('🗑 Student deleted', 'success');
        this.loadStudents();
      });
  }

  // ✅ Field invalid check
  isInvalid(field: string): boolean {
    const control = this.studentForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}