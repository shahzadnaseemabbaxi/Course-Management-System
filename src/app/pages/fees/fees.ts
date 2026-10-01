import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-fees',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fees.html',
  styleUrl: './fees.css'
})
export class Fees implements OnInit {

  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  public themeService = inject(ThemeService);

  showModal = signal<boolean>(false);
  payments = signal<any[]>([]);
  enrollments = signal<any[]>([]);
  selectedPaymentId = signal<number | null>(null);

  // Toast
  showToast = signal<boolean>(false);
  toastMessage = signal<string>('');
  toastType = signal<'error' | 'success'>('error');

  // Enrollment Dropdown
  showEnrollDropdown = signal<boolean>(false);
  selectedEnrollLabel = signal<string>('');

  // Auto calculation signals
  totalFee = signal<number>(0);
  previouslyPaid = signal<number>(0);
  remainingBalance = signal<number>(0);

  // Payment methods
  paymentMethods = ['Cash', 'Bank Transfer', 'Online', 'Cheque'];

  form = this.fb.group({
    enrollment_id:  ['', Validators.required],
    student_name:   [''],
    course_name:    [''],
    total_fee:      ['', Validators.required],
    paid_amount:    ['', Validators.required],
    payment_method: ['Cash', Validators.required],
    payment_date:   [new Date().toISOString().slice(0, 10), Validators.required]
  });

  ngOnInit() {
    this.loadPayments();
    this.loadEnrollments();
  }

  showToastMsg(msg: string, type: 'error' | 'success' = 'error') {
    this.toastMessage.set(msg);
    this.toastType.set(type);
    this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 3000);
  }

  loadPayments() {
    this.http.get<any[]>('http://localhost:3000/payments')
      .subscribe(data => this.payments.set(data));
  }

  loadEnrollments() {
    this.http.get<any[]>('http://localhost:3000/enrollments')
      .subscribe(data => this.enrollments.set(data));
  }

  toggleEnrollDropdown() {
    this.showEnrollDropdown.update(v => !v);
  }

  selectEnrollment(e: any) {
    this.selectedEnrollLabel.set(`E${e.id} — ${e.student_name || ''} (${e.course_name || ''})`);

    this.form.patchValue({
      enrollment_id: e.id,
      student_name: e.student_name || '',
      course_name: e.course_name || '',
      total_fee: e.course_fee
    });

    this.totalFee.set(Number(e.course_fee) || 0);

    const paid = this.payments()
      .filter(p => p.enrollment_id === e.id)
      .reduce((sum, p) => sum + Number(p.paid_amount || 0), 0);
    this.previouslyPaid.set(paid);
    this.remainingBalance.set((Number(e.course_fee) || 0) - paid);

    this.showEnrollDropdown.set(false);
  }

  onPaidChange(event: Event) {
    const val = Number((event.target as HTMLInputElement).value) || 0;
    const remaining = this.totalFee() - this.previouslyPaid() - val;
    this.remainingBalance.set(remaining);
  }

  openModal() {
    this.selectedPaymentId.set(null);
    this.form.reset({
      payment_method: 'Cash',
      payment_date: new Date().toISOString().slice(0, 10)
    });
    this.selectedEnrollLabel.set('');
    this.totalFee.set(0);
    this.previouslyPaid.set(0);
    this.remainingBalance.set(0);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedPaymentId.set(null);
    this.form.reset();
    this.selectedEnrollLabel.set('');
    this.totalFee.set(0);
    this.previouslyPaid.set(0);
    this.remainingBalance.set(0);
  }

  savePayment() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showToastMsg('⚠ Please fill all required fields', 'error');
      return;
    }

    const url = 'http://localhost:3000/payments';

    if (this.selectedPaymentId() === null) {
      this.http.post(url, this.form.value).subscribe(() => {
        this.showToastMsg('✅ Payment submitted successfully!', 'success');
        this.closeModal();
        this.loadPayments();
      });
    } else {
      this.http.put(`${url}/${this.selectedPaymentId()}`, this.form.value)
        .subscribe(() => {
          this.showToastMsg('✅ Payment updated!', 'success');
          this.closeModal();
          this.loadPayments();
        });
    }
  }

  editPayment(p: any) {
    this.selectedPaymentId.set(p.id);
    this.form.setValue({
      enrollment_id: p.enrollment_id,
      student_name: p.student_name || '',
      course_name: p.course_name || '',
      total_fee: p.total_fee,
      paid_amount: p.paid_amount,
      payment_method: p.payment_method,
      payment_date: p.payment_date
    });
    this.selectedEnrollLabel.set(`E${p.enrollment_id}`);
    this.totalFee.set(p.total_fee || 0);
    this.previouslyPaid.set(0);
    this.remainingBalance.set((p.total_fee || 0) - (p.paid_amount || 0));
    this.showModal.set(true);
  }

  deletePayment(id: number) {
    if (!confirm('Delete this payment?')) return;

    this.http.delete(`http://localhost:3000/payments/${id}`)
      .subscribe(() => {
        this.showToastMsg('🗑 Payment deleted', 'success');
        this.loadPayments();
      });
  }

  getStatus(paid: number, total: number): string {
    const p = Number(paid) || 0;
    const t = Number(total) || 0;
    if (p <= 0) return 'Unpaid';
    if (p >= t) return 'Paid';
    return 'Partial';
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }
}