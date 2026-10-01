import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme';

@Component({
  imports: [CommonModule],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {
  constructor(public themeService: ThemeService) {}

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}