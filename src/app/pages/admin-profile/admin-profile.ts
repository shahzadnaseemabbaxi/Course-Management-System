import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ThemeService } from '../../core/services/theme';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-profile.html',
  styleUrl: './admin-profile.css'
})
export class AdminProfile implements OnInit {
  

  private fb = inject(FormBuilder);
  public themeService = inject(ThemeService);
  
// ✅ Open full image
openImagePreview() {
  if (this.profilePicture()) {
    this.showImagePreview.set(true);
  }
}

// ✅ Close preview
closeImagePreview() {
  this.showImagePreview.set(false);
}
// ✅ Full image preview
showImagePreview = signal<boolean>(false);
  // Toast
  showToast = signal<boolean>(false);
  toastMessage = signal<string>('');
  toastType = signal<'error' | 'success'>('error');

  // Edit mode
  isEditing = signal<boolean>(false);

  // ✅ Profile picture
  profilePicture = signal<string>('');
  

  // Profile data
  profile = signal<any>({
    id: 'A1',
    name: 'Shahzad Naseem',
    email: 'admin@cms.com',
    phone: '03001234567',
    role: 'Super Admin',
    joinedDate: '2026-01-01',
    lastLogin: new Date().toISOString().slice(0, 16).replace('T', ' ')
  });

  profileForm = this.fb.group({
    name:  ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required]
  });

  ngOnInit() {
    // Load from localStorage
    const saved = localStorage.getItem('admin_profile');
    if (saved) {
      // ye Parse localStorage se saved data read karte waqt use hota hai.
      const data = JSON.parse(saved);
      this.profile.update(p => ({ ...p, ...data }));
    }

    // ✅ Load profile picture
    const savedPic = localStorage.getItem('admin_profile_picture');
    if (savedPic) {
      this.profilePicture.set(savedPic);
    }

    // Fill form
    this.profileForm.patchValue({
      name: this.profile().name,
      email: this.profile().email,
      phone: this.profile().phone
    });
      // ✅ Escape key se preview ko close karna k liyay
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      this.showImagePreview.set(false);
    }
  });
  }

  showToastMsg(msg: string, type: 'error' | 'success' = 'error') {
    this.toastMessage.set(msg);
    this.toastType.set(type);
    this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 3000);
  }

  // ✅ Photo upload
  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // Size check (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      this.showToastMsg('⚠ Image must be less than 2MB', 'error');
      return;
    }

    // image ki type check karta ha
    if (!file.type.startsWith('image/')) {
      this.showToastMsg('⚠ Please select an image file', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.profilePicture.set(base64);
      localStorage.setItem('admin_profile_picture', base64);
      this.showToastMsg('✅ Profile picture updated!', 'success');
    };
    reader.readAsDataURL(file);
  }

  // ✅ Remove photo
  removePhoto() {
    if (!confirm('Remove profile picture?')) return;
    this.profilePicture.set('');
    localStorage.removeItem('admin_profile_picture');
    this.showToastMsg('🗑 Profile picture removed', 'success');
  }

  // ✅ Trigger file input
  triggerFileInput() {
    const input = document.getElementById('photoInput') as HTMLInputElement;
    input?.click();
  }

  toggleEdit() {
    this.isEditing.update(v => !v);
    if (!this.isEditing()) {
      this.profileForm.patchValue({
        name: this.profile().name,
        email: this.profile().email,
        phone: this.profile().phone
      });
    }
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.showToastMsg('⚠ Please fill all fields correctly', 'error');
      return;
    }

    this.profile.update(p => ({ ...p, ...this.profileForm.value }));
    localStorage.setItem('admin_profile', JSON.stringify(this.profileForm.value));

    this.showToastMsg('✅ Profile updated successfully!', 'success');
    this.isEditing.set(false);
  }

  isInvalid(field: string): boolean {
    const c = this.profileForm.get(field);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }
}