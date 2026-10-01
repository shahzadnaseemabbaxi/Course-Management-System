import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(true);

  toggleTheme() {
    this.isDarkMode.update(v => !v);
  }
}