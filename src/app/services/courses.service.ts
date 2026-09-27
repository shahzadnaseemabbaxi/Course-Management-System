import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CoursesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/courses';

  getCourses() {
    return this.http.get<any[]>(this.apiUrl);
  }

  addCourse(data: any) {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateCourse(id: number, data: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteCourse(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}