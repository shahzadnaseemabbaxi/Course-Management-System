import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';              // 👈 ye add
import { Navbar } from './layout/navbar/navbar';
import { Sidebar } from './layout/sidebar/sidebar';
import { ThemeService } from './services/theme';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar, Sidebar],     // 👈 RouterOutlet add
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App{
  constructor(public themeService: ThemeService) {}
}