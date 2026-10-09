import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './layout/navbar/navbar';
import { Sidebar } from './layout/sidebar/sidebar';
import { ThemeService } from './core/services/theme';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {

  // ✅ Sidebar expanded state (mobile pe)
  sidebarExpanded = signal<boolean>(false);

  // ✅ Mobile detection
  isMobile = signal<boolean>(false);

  constructor(public themeService: ThemeService) {}

  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.checkScreenSize);
  }

  // ✅ Arrow function — `this` bind rahe
  checkScreenSize = () => {
    const mobile = window.innerWidth <= 768;
    this.isMobile.set(mobile);

    // Mobile pe default: collapsed (false)
    // Desktop pe: expanded (true)
    this.sidebarExpanded.set(!mobile);
  };

  toggleSidebar() {
    this.sidebarExpanded.update(v => !v);
  }

  closeSidebar() {
    if (this.isMobile()) {
      this.sidebarExpanded.set(false);
    }
  }

  // ✅ Collapsed state determine karo
  isCollapsed(): boolean {
    if (this.isMobile()) {
      // Mobile: expanded ho to full, warna collapsed
      return !this.sidebarExpanded();
    } else {
      // Desktop: always full
      return false;
    }
  }
}