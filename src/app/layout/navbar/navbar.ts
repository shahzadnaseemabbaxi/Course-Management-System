import { Component, signal, output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../core/services/theme';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit {

  toggleSidebar = output<void>();
  isAdminMenuOpen = signal<boolean>(false);

  // ✅ Profile data signals
  profilePicture = signal<string>('');
  adminName = signal<string>('Admin');
  adminEmail = signal<string>('admin@cms.com');
  adminRole = signal<string>('Super Admin');

  constructor(public themeService: ThemeService) {}

  ngOnInit() {
    this.loadProfileData();
  }

  // ✅ Profile data load karo from localStorage
  loadProfileData() {
    // Photo
    const savedPic = localStorage.getItem('admin_profile_picture');
    if (savedPic) {
      this.profilePicture.set(savedPic);
    }

    // Name, Email
    const savedProfile = localStorage.getItem('admin_profile');
    if (savedProfile) {
      try {
        const data = JSON.parse(savedProfile);
        if (data.name) this.adminName.set(data.name);
        if (data.email) this.adminEmail.set(data.email);
      } catch (e) {
        console.error('Profile parse error:', e);
      }
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.clear();
      window.location.href = '/';
    }
  }
}