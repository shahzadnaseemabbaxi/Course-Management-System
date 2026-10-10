import { Component, signal, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './layout/navbar/navbar';
import { Sidebar } from './layout/sidebar/sidebar';
import { ThemeService } from './core/services/theme';
import { AuthService } from './core/services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  sidebarExpanded = signal<boolean>(false);
  isMobile = signal<boolean>(false);

  // ✅ Public services — HTML ke liye zaroori
  public themeService = inject(ThemeService);
  public authService = inject(AuthService);

  constructor() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    const mobile = window.innerWidth <= 768;
    this.isMobile.set(mobile);
    this.sidebarExpanded.set(!mobile);
  }

  toggleSidebar() {
    if (this.isMobile()) {
      this.sidebarExpanded.update(v => !v);
    }
  }

  closeSidebar() {
    if (this.isMobile()) {
      this.sidebarExpanded.set(false);
    }
  }

  isCollapsed(): boolean {
    return this.isMobile() && !this.sidebarExpanded();
  }
}