import { Component, signal, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  styleUrl: './sidebar.css',
  templateUrl: './sidebar.html',
})
export class Sidebar {

  // ✅ Output — mobile pe link click hone pe parent ko batane ke liye
  linkClicked = output<void>();

  constructor(public themeService: ThemeService) {}

  menuItems = [
    { name: 'Dashboard',  icon: '📊', route: '/dashboard' },
    { name: 'Student',    icon: '👨‍🎓', route: '/students' },
    { name: 'Courses',    icon: '📚', route: '/courses' },
    { name: 'Enrollment', icon: '📝', route: '/enrollments' },
    { name: 'Fees',       icon: '💰', route: '/fees' },
    { name: 'Settings',   icon: '⚙️', route: '/settings' }
  ];

  onLinkClick() {
    this.linkClicked.emit();
  }
}