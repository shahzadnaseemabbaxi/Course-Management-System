import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
     providedIn: 'root'
})
export class Students {
    private http = inject(HttpClient);

    private apiUrl = 'http://localhost:3000/students';

    getStudents() {
        return this.http.get<any[]>(this.apiUrl);
    }

    addStudent(data: any) {
        return this.http.post<any>(this.apiUrl, data)
    }   

    updateStudent(id: number, data: any) {
        return this.http.put<any>(`${this.apiUrl}/${id}`, data);
    }

    deleteStudent(id: number) {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}
