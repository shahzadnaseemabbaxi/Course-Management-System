import { Component, output, input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../core/services/theme';
import { AuthService } from '../../core/services/auth'; // ✅ AuthService import kiya

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  styleUrl: './sidebar.css',
  templateUrl: './sidebar.html',
})
export class Sidebar {

  collapsed = input<boolean>(false);
  linkClicked = output<void>();

  public themeService = inject(ThemeService);
  public authService = inject(AuthService); // ✅ Inject kiya

  // ✅ Admin Menu
  adminMenu = [
    { name: 'Dashboard',  icon: '📊', route: '/dashboard' },
    { name: 'Student',    icon: '👨‍🎓', route: '/students' },
    { name: 'Courses',    icon: '📚', route: '/courses' },
    { name: 'Enrollment', icon: '📝', route: '/enrollments' },
    { name: 'Fees',       icon: '💰', route: '/fees' },
    { name: 'Settings',   icon: '⚙️', route: '/settings' }
  ];

  // ✅ Student Menu (Naya)
  studentMenu = [
    { name: 'My Dashboard', icon: '📊', route: '/student/dashboard' },
    { name: 'My Courses',   icon: '📚', route: '/student/courses' },
    { name: 'My Fees',      icon: '💰', route: '/student/fees' }
  ];

  // ✅ Dynamic Menu (Role ke hisaab se select hoga)
  menuItems = computed(() => {
    if (this.authService.isAdmin()) {
      return this.adminMenu;
    } else if (this.authService.isStudent()) {
      return this.studentMenu;
    }
    return [];
  });

  onLinkClick() {
    this.linkClicked.emit();
  }
}