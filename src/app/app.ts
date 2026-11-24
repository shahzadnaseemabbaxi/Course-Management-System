import { Component, signal, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
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

  public themeService = inject(ThemeService);
  public authService = inject(AuthService);
  private router = inject(Router); 

  constructor() {
    this.checkScreenSize();
    
    // ✅ Browser history mein state add karein taake back button catch ho sake
    window.history.pushState(null, '', window.location.href);
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  // ✅ Browser ka Back Button catch karne ke liye
  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    // Agar user logged in hai
    if (this.authService.isLoggedIn()) {
      // Pop-up show karein
      const confirmLogout = confirm('Are you sure you want to logout?');
      
      if (confirmLogout) {
        this.authService.logout(); // Logout kar do (login page par bhej dega)
      } else {
        // Agar Cancel dabaya, to user ko wapas usi page par rok lo
        window.history.pushState(null, '', window.location.href);
      }
    }
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