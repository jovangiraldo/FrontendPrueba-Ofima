import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpBackend, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, tap } from 'rxjs';

export interface Empleado {
  id?: number;
  nombre: string;
  correo: string;
  cargo: string;
  departamento: string;
  telefono: string;
  fechaIngreso: string; // ISO date string: 'YYYY-MM-DD'
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private baseUrl = 'https://localhost:7291/api/Empleados'; // URL del API actualizada
  show: boolean = true;

  
  constructor(private http: HttpClient) { }

  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.baseUrl).pipe(
      catchError(error => {
        console.error('Error GET empleados:', error);
        return throwError(() => error);
      })
    );
  }

  crearEmpleado(empleado: Empleado): Observable<Empleado> {
    return this.http.post<Empleado>(this.baseUrl, empleado).pipe(
      catchError(error => {
        console.error('Error POST empleado:', error);
        return throwError(() => error);
      })
    );
  }

  eliminarEmpleado(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      observe: 'response'
    }).pipe(
      tap(response => {
        console.log('Eliminación exitosa', response);
      }),
      catchError(error => {
        console.error('Error al eliminar:', error);
        return throwError(() => error);
      })
    );
  }

  actualizarEmpleado(id: number, cambios: any): Observable<any> {
    console.log('Enviando PATCH a:', `${this.baseUrl}/${id}`, 'con:', cambios);
    return this.http.patch(`${this.baseUrl}/${id}`, cambios, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error en PATCH:', error);
        if (error.error) {
          console.error('Detalles del error:', error.error);
        }
        return throwError(() => error);
      })
    );
  }
}
