import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ThemeService } from '../../../../core/services/theme';
import { forkJoin } from 'rxjs';

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

  showModal = signal<boolean>(false);
  students = signal<any[]>([]);
  selectedStudentId = signal<number | null>(null);

  showToast = signal<boolean>(false);
  toastMessage = signal<string>('');
  toastType = signal<'error' | 'success'>('error');

  showDeptDropdown = signal<boolean>(false);
  selectedDeptLabel = signal<string>('');

  showCountryDropdown = signal<boolean>(false);
  selectedCountry = signal<any>({
    code: '+92', iso: 'pk', name: 'Pakistan',
    pattern: /^3\d{9}$/, hint: '3XXXXXXXXX (10 digits starting with 3)'
  });

  phoneError = signal<string>('');

  countryOptions = [
    { code: '+92',  iso: 'pk', name: 'Pakistan',      pattern: /^3\d{9}$/,        hint: '3XXXXXXXXX (10 digits)' },
    { code: '+91',  iso: 'in', name: 'India',         pattern: /^[6-9]\d{9}$/,    hint: '9XXXXXXXXX (10 digits)' },
    { code: '+1',   iso: 'us', name: 'USA',           pattern: /^[2-9]\d{2}[2-9]\d{6}$/, hint: 'XXX-XXX-XXXX (10 digits)' },
    { code: '+44',  iso: 'gb', name: 'UK',            pattern: /^7\d{9}$/,        hint: '7XXXXXXXXX (10 digits)' },
    { code: '+971', iso: 'ae', name: 'UAE',           pattern: /^5\d{8}$/,        hint: '5XXXXXXXX (9 digits)' },
    { code: '+966', iso: 'sa', name: 'Saudi Arabia',  pattern: /^5\d{8}$/,        hint: '5XXXXXXXX (9 digits)' },
    { code: '+86',  iso: 'cn', name: 'China',         pattern: /^1\d{10}$/,       hint: '1XXXXXXXXXX (11 digits)' },
    { code: '+81',  iso: 'jp', name: 'Japan',         pattern: /^[7-9]0\d{8}$/,   hint: '90XXXXXXXX (10 digits)' },
    { code: '+49',  iso: 'de', name: 'Germany',       pattern: /^1[5-7]\d{8,9}$/, hint: '15XXXXXXXX' },
    { code: '+61',  iso: 'au', name: 'Australia',     pattern: /^4\d{8}$/,        hint: '4XXXXXXXX (9 digits)' },
    { code: '+90',  iso: 'tr', name: 'Turkey',        pattern: /^5\d{9}$/,        hint: '5XXXXXXXXX (10 digits)' },
    { code: '+60',  iso: 'my', name: 'Malaysia',      pattern: /^1\d{8,9}$/,      hint: '1XXXXXXXX' }
  ];

  departmentOptions = [
    'Computer Science', 'Software Engineering', 'Information Technology',
    'Artificial Intelligence', 'Data Science', 'Cyber Security',
    'Electrical Engineering', 'Mechanical Engineering', 'Business Administration', 'Mathematics'
  ];

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

  showToastMsg(msg: string, type: 'error' | 'success' = 'error') {
    this.toastMessage.set(msg);
    this.toastType.set(type);
    this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 3000);
  }

  toggleDeptDropdown() { this.showDeptDropdown.update(v => !v); }
  selectDept(dept: string) { this.selectedDeptLabel.set(dept); this.studentForm.patchValue({ department: dept }); this.showDeptDropdown.set(false); }
  toggleCountryDropdown() { this.showCountryDropdown.update(v => !v); }
  selectCountry(country: any) { this.selectedCountry.set(country); this.showCountryDropdown.set(false); this.studentForm.patchValue({ phone: '' }); this.phoneError.set(''); }

  validatePhone(): boolean {
    const phone = (this.studentForm.value.phone || '').trim();
    const country = this.selectedCountry();
    if (!phone) { this.phoneError.set(''); return false; }
    if (!country.pattern.test(phone)) {
      this.phoneError.set(`⚠ Invalid ${country.name} number. Format: ${country.hint}`);
      return false;
    }
    this.phoneError.set(''); return true;
  }

  onPhoneInput() { this.validatePhone(); }

  openModal() {
    this.selectedStudentId.set(null); this.studentForm.reset();
    this.selectedDeptLabel.set(''); this.showDeptDropdown.set(false);
    this.selectedCountry.set(this.countryOptions[0]); this.showCountryDropdown.set(false);
    this.phoneError.set(''); this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false); this.selectedStudentId.set(null);
    this.studentForm.reset(); this.selectedDeptLabel.set('');
    this.showDeptDropdown.set(false); this.showCountryDropdown.set(false); this.phoneError.set('');
  }

  loadStudents() {
    this.http.get<any[]>('http://localhost:3000/students')
      .subscribe(data => this.students.set(data));
  }

  saveStudent() {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      this.showToastMsg('⚠ Please fill all required fields', 'error');
      return;
    }
    if (!this.validatePhone()) {
      this.showToastMsg('⚠ Invalid phone number for selected country', 'error');
      return;
    }

    const formValue = {
      ...this.studentForm.value,
      phone: `${this.selectedCountry().code} ${this.studentForm.value.phone}`
    };
    const url = 'http://localhost:3000/students';

    if (this.selectedStudentId() === null) {
      // ✅ Naya Student add kar rahe hain
      const nextId = this.students().length > 0 
        ? Math.max(...this.students().map(s => Number(s.id))) + 1 
        : 1;
      const newStudent = { ...formValue, id: nextId.toString() };

      this.http.post(url, newStudent).subscribe((createdStudent: any) => {
        
        const studentId = createdStudent.id; 
        
        // ✅ Username aur Password generation
        const safeName = String(newStudent.name || '').trim();
        const nameParts = safeName.split(' ');
        
        // Username: alikhan
        const generatedUsername = nameParts[0].toLowerCase() + 
          (nameParts[1] ? nameParts[1].toLowerCase() : '');
        
        // ✅ Password: Sirf pehla naam (e.g. Shahzad@2026)
        const currentYear = new Date().getFullYear();
        const firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase();
        const generatedPassword = `${firstName}@${currentYear}`;
        
        const generatedRoll = 'F24-' + Math.floor(100 + Math.random() * 900);

        const newUser = {
          id: Date.now().toString(),
          username: generatedUsername,
          roll_number: generatedRoll,
          password: generatedPassword, // ✅ Simple Password (e.g. Shahzad@2026)
          role: 'student',
          name: newStudent.name,
          email: newStudent.email,
          student_id: studentId 
        };

        this.http.post('http://localhost:3000/users', newUser).subscribe(() => {
          this.showToastMsg(`✅ Student Added! User: ${generatedUsername} | Pass: ${generatedPassword}`, 'success');
          this.closeModal();
          this.loadStudents();
        });
      });
      
    } else {
      this.http.put(`${url}/${this.selectedStudentId()}`, formValue)
        .subscribe(() => {
          this.showToastMsg('✅ Student updated successfully!', 'success');
          this.closeModal();
          this.loadStudents();
        });
    }
  }

  editStudent(student: any) {
    this.selectedStudentId.set(student.id);
    let phone = student.phone || ''; let country = this.countryOptions[0];
    for (const c of this.countryOptions) { if (phone.startsWith(c.code)) { country = c; phone = phone.replace(c.code, '').trim(); break; } }
    this.selectedCountry.set(country); this.phoneError.set('');
    this.studentForm.setValue({
      name: student.name, father_name: student.father_name,
      email: student.email, phone: phone,
      address: student.address, department: student.department
    });
    this.selectedDeptLabel.set(student.department);
    this.showModal.set(true);
  }

  // ✅ NAYA FUNCTION: Login details dekhne ke liye
  showLoginDetails(studentId: string, studentName: string) {
    this.http.get<any[]>('http://localhost:3000/users').subscribe(users => {
      const user = users.find(u => String(u.student_id) === String(studentId));
      
      if (user) {
        alert(`🔑 Login Details for ${studentName}\n\nUsername: ${user.username}\nRoll No: ${user.roll_number}\nPassword: ${user.password}\n\n(Note: Password is case-sensitive)`);
      } else {
        alert(`❌ No login account found for ${studentName}. They might not have been added properly.`);
      }
    });
  }

  deleteStudent(id: number) {
    if (!confirm('Are you sure you want to delete this student? This will also delete their user account, enrollments, and payments.')) {
      return;
    }
    const studentIdStr = String(id);

    forkJoin({
      enrollments: this.http.get<any[]>('http://localhost:3000/enrollments'),
      payments: this.http.get<any[]>('http://localhost:3000/payments'),
      users: this.http.get<any[]>('http://localhost:3000/users')
    }).subscribe(({ enrollments, payments, users }) => {

      const studentEnrollments = enrollments.filter(e => String(e.student_id) === studentIdStr);
      const studentPayments = payments.filter(p => String(p.student_id) === studentIdStr);
      const studentUser = users.find(u => String(u.student_id) === studentIdStr);

      const deleteRequests = [
        this.http.delete(`http://localhost:3000/students/${id}`),
        ...studentEnrollments.map(e => this.http.delete(`http://localhost:3000/enrollments/${e.id}`)),
        ...studentPayments.map(p => this.http.delete(`http://localhost:3000/payments/${p.id}`))
      ];
      if (studentUser) {
        deleteRequests.push(this.http.delete(`http://localhost:3000/users/${studentUser.id}`));
      }

      forkJoin(deleteRequests).subscribe({
        next: () => {
          this.showToastMsg('🗑 Student and all related data deleted successfully!', 'success');
          this.loadStudents();
        },
        error: (err) => {
          console.error('Delete error:', err);
          this.showToastMsg('❌ Failed to delete some data. Try again.', 'error');
        }
      });
    });
  }

  isInvalid(field: string): boolean {
    const control = this.studentForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}