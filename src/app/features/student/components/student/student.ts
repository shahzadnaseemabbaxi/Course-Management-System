import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ThemeService } from '../../../../core/services/theme';

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

  // ✅ Country signals
  showCountryDropdown = signal<boolean>(false);
  selectedCountry = signal<any>({
    code: '+92',
    iso: 'pk',
    name: 'Pakistan',
    pattern: /^3\d{9}$/,
    hint: '3XXXXXXXXX (10 digits starting with 3)'
  });

  // ✅ Phone error signal
  phoneError = signal<string>('');

  // ✅ Country options with pattern (validation rules)
countryOptions = [
  // ✅ Pakistan: 3XXXXXXXXX (10 digits starting with 3)
  { code: '+92',  iso: 'pk', name: 'Pakistan',      pattern: /^3\d{9}$/,        hint: '3XXXXXXXXX (10 digits)' },

  // ✅ India: 6-9 se start, 10 digits
  { code: '+91',  iso: 'in', name: 'India',         pattern: /^[6-9]\d{9}$/,    hint: '9XXXXXXXXX (10 digits)' },

  // ✅ USA: Area code 2-9, 10 digits — aur specific format
  { code: '+1',   iso: 'us', name: 'USA',           pattern: /^[2-9]\d{2}[2-9]\d{6}$/, hint: 'XXX-XXX-XXXX (10 digits)' },

  // ✅ UK: 7 se start, 10 digits
  { code: '+44',  iso: 'gb', name: 'UK',            pattern: /^7\d{9}$/,        hint: '7XXXXXXXXX (10 digits)' },

  // ✅ UAE: 5 se start, 9 digits
  { code: '+971', iso: 'ae', name: 'UAE',           pattern: /^5\d{8}$/,        hint: '5XXXXXXXX (9 digits)' },

  // ✅ Saudi: 5 se start, 9 digits
  { code: '+966', iso: 'sa', name: 'Saudi Arabia',  pattern: /^5\d{8}$/,        hint: '5XXXXXXXX (9 digits)' },

  // ✅ China: 1 se start, 11 digits
  { code: '+86',  iso: 'cn', name: 'China',         pattern: /^1\d{10}$/,       hint: '1XXXXXXXXXX (11 digits)' },

  // ✅ Japan: 10 digits
  { code: '+81',  iso: 'jp', name: 'Japan',         pattern: /^[7-9]0\d{8}$/,   hint: '90XXXXXXXX (10 digits)' },

  // ✅ Germany: 10-11 digits
  { code: '+49',  iso: 'de', name: 'Germany',       pattern: /^1[5-7]\d{8,9}$/, hint: '15XXXXXXXX' },

  // ✅ Australia: 4 se start, 9 digits
  { code: '+61',  iso: 'au', name: 'Australia',     pattern: /^4\d{8}$/,        hint: '4XXXXXXXX (9 digits)' },

  // ✅ Turkey: 5 se start, 10 digits
  { code: '+90',  iso: 'tr', name: 'Turkey',        pattern: /^5\d{9}$/,        hint: '5XXXXXXXXX (10 digits)' },

  // ✅ Malaysia: 1 se start, 9-10 digits
  { code: '+60',  iso: 'my', name: 'Malaysia',      pattern: /^1\d{8,9}$/,      hint: '1XXXXXXXX' }
];

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

  toggleDeptDropdown() {
    this.showDeptDropdown.update(v => !v);
  }

  selectDept(dept: string) {
    this.selectedDeptLabel.set(dept);
    this.studentForm.patchValue({ department: dept });
    this.showDeptDropdown.set(false);
  }

  // ✅ Country dropdown
  toggleCountryDropdown() {
    this.showCountryDropdown.update(v => !v);
  }

  selectCountry(country: any) {
    this.selectedCountry.set(country);
    this.showCountryDropdown.set(false);
    // ✅ Phone clear karo aur error hatao jab country change ho
    this.studentForm.patchValue({ phone: '' });
    this.phoneError.set('');
  }

  // ✅ Phone validation — country ke hisaab se
  validatePhone(): boolean {
    const phone = (this.studentForm.value.phone || '').trim();
    const country = this.selectedCountry();

    if (!phone) {
      this.phoneError.set('');
      return false;
    }

    if (!country.pattern.test(phone)) {
      this.phoneError.set(`⚠ Invalid ${country.name} number. Format: ${country.hint}`);
      return false;
    }

    this.phoneError.set('');
    return true;
  }

  onPhoneInput() {
    this.validatePhone();
  }

  openModal() {
    this.selectedStudentId.set(null);
    this.studentForm.reset();
    this.selectedDeptLabel.set('');
    this.showDeptDropdown.set(false);
    this.selectedCountry.set(this.countryOptions[0]);   // Pakistan default
    this.showCountryDropdown.set(false);
    this.phoneError.set('');
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedStudentId.set(null);
    this.studentForm.reset();
    this.selectedDeptLabel.set('');
    this.showDeptDropdown.set(false);
    this.showCountryDropdown.set(false);
    this.phoneError.set('');
  }

  loadStudents() {
    this.http.get<any[]>('http://localhost:3000/students')
      .subscribe(data => this.students.set(data));
  }

  saveStudent() {
    // ✅ Step 1: Form validation
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      this.showToastMsg('⚠ Please fill all required fields', 'error');
      return;
    }

    // ✅ Step 2: Phone validation (country-specific)
    if (!this.validatePhone()) {
      this.showToastMsg('⚠ Invalid phone number for selected country', 'error');
      return;
    }

    // ✅ Step 3: Save with country code
    const formValue = {
      ...this.studentForm.value,
      phone: `${this.selectedCountry().code} ${this.studentForm.value.phone}`
    };

    const url = 'http://localhost:3000/students';

    if (this.selectedStudentId() === null) {
      this.http.post(url, formValue).subscribe(() => {
        this.showToastMsg('✅ Student added successfully!', 'success');
        this.closeModal();
        this.loadStudents();
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

    // ✅ Extract country code from saved phone
    let phone = student.phone || '';
    let country = this.countryOptions[0];   // Default Pakistan

    for (const c of this.countryOptions) {
      if (phone.startsWith(c.code)) {
        country = c;
        phone = phone.replace(c.code, '').trim();
        break;
      }
    }

    this.selectedCountry.set(country);
    this.phoneError.set('');

    this.studentForm.setValue({
      name: student.name,
      father_name: student.father_name,
      email: student.email,
      phone: phone,
      address: student.address,
      department: student.department
    });
    this.selectedDeptLabel.set(student.department);
    this.showModal.set(true);
  }

  deleteStudent(id: number) {
    this.http.delete(`http://localhost:3000/students/${id}`)
      .subscribe(() => {
        this.showToastMsg('🗑 Student deleted', 'success');
        this.loadStudents();
      });
  }

  isInvalid(field: string): boolean {
    const control = this.studentForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}