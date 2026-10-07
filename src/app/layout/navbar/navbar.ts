import { Component, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {

  // ✅ Output event
  toggleSidebar = output<void>();

  isAdminMenuOpen = signal<boolean>(false);

  constructor(public themeService: ThemeService) {}

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