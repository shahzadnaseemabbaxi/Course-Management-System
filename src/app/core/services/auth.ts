import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000';

  // ✅ Default: Logged OUT
  currentUser = signal<any>(null);
  isLoggedIn = signal<boolean>(false);

  constructor() {
    this.loadUserFromStorage();
  }

  // ✅ STRICT: sirf valid user hone pe hi login
  loadUserFromStorage() {
    const user = localStorage.getItem('cms_user');

    // Kuch nahi hai → logout
    if (!user || user === 'null' || user === 'undefined') {
      this.isLoggedIn.set(false);
      this.currentUser.set(null);
      return;
    }

    try {
      const data = JSON.parse(user);

      // ✅ Strict check
      if (data && data.id && data.role && data.username) {
        this.currentUser.set(data);
        this.isLoggedIn.set(true);
        console.log('✅ User loaded:', data.name);
      } else {
        localStorage.removeItem('cms_user');
        this.isLoggedIn.set(false);
        this.currentUser.set(null);
      }
    } catch (e) {
      localStorage.removeItem('cms_user');
      this.isLoggedIn.set(false);
      this.currentUser.set(null);
    }
  }

  login(username: string, password: string, role: 'admin' | 'student'): Observable<any> {
    return this.http.get<any[]>(
      `${this.apiUrl}/users?username=${username}&password=${password}&role=${role}`
    ).pipe(
      tap(users => {
        if (users && users.length > 0) {
          const user = users[0];
          this.currentUser.set(user);
          this.isLoggedIn.set(true);
          localStorage.setItem('cms_user', JSON.stringify(user));
          console.log('✅ Login:', user);
        }
      })
    );
  }

  logout() {
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    localStorage.removeItem('cms_user');
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  isStudent(): boolean {
    return this.currentUser()?.role === 'student';
  }

  getUser() {
    return this.currentUser();
  }

  getStudentId(): string {
    return this.currentUser()?.student_id || '';
  }
}