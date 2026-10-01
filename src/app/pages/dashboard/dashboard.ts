import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {

  constructor(public themeService: ThemeService) {}

  // Summary Cards
  totalStudents = signal<number>(120);
  totalCourses = signal<number>(12);
  totalEnrollments = signal<number>(180);
  totalFee = signal<number>(5000);

  // Monthly Target
  monthlyTarget = signal<number>(72);
  targetGrowth = signal<number>(10);

  // Monthly Sales Chart
  salesData = [
    { month: 'Jan', value: 160 },
    { month: 'Feb', value: 350 },
    { month: 'Mar', value: 200 },
    { month: 'Apr', value: 280 },
    { month: 'May', value: 180 },
    { month: 'Jun', value: 190 },
    { month: 'Jul', value: 270 },
    { month: 'Aug', value: 100 },
    { month: 'Sep', value: 210 },
    { month: 'Oct', value: 380 },
    { month: 'Nov', value: 260 },
    { month: 'Dec', value: 110 }
  ];

  maxSales = 400;

  getBarHeight(value: number): number {
    return (value / this.maxSales) * 100;
  }
}