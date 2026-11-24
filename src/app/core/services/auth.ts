import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000';

  currentUser = signal<any>(null);
  isLoggedIn = signal<boolean>(false);

  constructor() {
    this.loadUserFromStorage();
  }

  loadUserFromStorage() {
    const user = sessionStorage.getItem('cms_user');
    if (!user || user === 'null' || user === 'undefined') {
      this.isLoggedIn.set(false);
      this.currentUser.set(null);
      localStorage.removeItem('cms_user'); 
      return;
    }
    try {
      const data = JSON.parse(user);
      if (data && data.id && data.role && data.username) {
        this.currentUser.set(data);
        this.isLoggedIn.set(true);
      } else {
        sessionStorage.removeItem('cms_user');
        this.isLoggedIn.set(false);
        this.currentUser.set(null);
      }
    } catch (e) {
      sessionStorage.removeItem('cms_user');
      this.isLoggedIn.set(false);
      this.currentUser.set(null);
    }
  }

  // ✅ Flexible Login Function
  login(usernameOrRoll: string, password: string, role: 'admin' | 'student'): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/users`).pipe(
      map(users => {
        const matchedUser = users.find(u => {
          const isRoleMatch = u.role === role;
          const isUserMatch = 
            (u.username && u.username.toLowerCase() === usernameOrRoll.toLowerCase()) || 
            (u.roll_number && u.roll_number.toLowerCase() === usernameOrRoll.toLowerCase()) ||
            (u.student_id && String(u.student_id) === String(usernameOrRoll));
          const isPassMatch = String(u.password) === String(password);
          return isRoleMatch && isUserMatch && isPassMatch;
        });

        if (matchedUser) {
          this.currentUser.set(matchedUser);
          this.isLoggedIn.set(true);
          sessionStorage.setItem('cms_user', JSON.stringify(matchedUser));
          return [matchedUser]; 
        }
        return []; 
      })
    );
  }

  logout() {
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    sessionStorage.removeItem('cms_user'); 
    localStorage.removeItem('cms_user'); 
    this.router.navigate(['/login']); 
  }

  isAdmin(): boolean { return this.currentUser()?.role === 'admin'; }
  isStudent(): boolean { return this.currentUser()?.role === 'student'; }
  getUser() { return this.currentUser(); }
  
  // ✅ Yahan humne ID ko fix kiya hai (String mein convert karke)
  getStudentId(): string { 
    const user = this.currentUser();
    return user ? String(user.student_id || '') : ''; 
  }
}