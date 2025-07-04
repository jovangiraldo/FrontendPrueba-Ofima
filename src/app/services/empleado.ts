import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
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
  private apiUrl = 'https://localhost:7291/api/Empleados'; // URL del API actualizada
  show: boolean = true;

  
  constructor(private http: HttpClient) { }

  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error GET empleados:', error);
        return throwError(() => error);
      })
    );
  }

  crearEmpleado(empleado: Empleado): Observable<Empleado> {
    return this.http.post<Empleado>(this.apiUrl, empleado).pipe(
      catchError(error => {
        console.error('Error POST empleado:', error);
        return throwError(() => error);
      })
    );
  }

  eliminarEmpleado(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${Math.floor(id)}`, {
      observe: 'response'
    }).pipe(
      tap(response => {
        if (response.status === 204) {
          console.log('Eliminación exitosa');
        }
      }),
      catchError(error => {
        console.error('Error al eliminar:', error);
        return throwError(() => error);
      })
    );
  }

  actualizarEmpleado(id: number, cambios: any): Observable<any> {
    // Asegurar formato correcto para el backend
    const payload = {
      ...cambios,
      FechaIngreso: cambios.fechaIngreso || cambios.FechaIngreso
    };

    return this.http.patch(`${this.apiUrl}/${Math.floor(id)}`, payload, {
      observe: 'response'
    }).pipe(
      tap(response => console.log('Actualización exitosa')),
      catchError(error => {
        console.error('Error al actualizar:', error);
        return throwError(() => error);
      })
    );
  }
}
