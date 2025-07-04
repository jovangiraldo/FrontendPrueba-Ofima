import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Empleado, EmpleadoService } from '../services/empleado';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-empleados',
  standalone: true,
  templateUrl: './empleados.component.html',
  imports: [CommonModule, FormsModule],
})
export class EmpleadosComponent implements OnInit, AfterViewInit {
  empleados: Empleado[] = [];
  nuevoEmpleado: Empleado = {
    nombre: '',
    correo: '',
    cargo: '',
    departamento: '',
    telefono: '',
    fechaIngreso: '',
    activo: true
  };
  
  empleadoSeleccionado: Empleado | null = null;
  edicionMode = false;
  show: boolean = false;
  empleadoEditando: Empleado | null = null;
  private modal: any;

  constructor(private empleadoService: EmpleadoService) {}

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  ngAfterViewInit(): void {
    const modalElement = document.getElementById('confirmModal');
    if (modalElement) {
      this.modal = new bootstrap.Modal(modalElement, {
        keyboard: false
      });
      console.log('Modal inicializado correctamente');
    } else {
      console.error('Elemento del modal no encontrado');
    }
  }

  cargarEmpleados() {
    this.empleadoService.getEmpleados().subscribe({
      next: (data) => this.empleados = data,
      error: (err) => console.error('Error cargando empleados:', err)
    });
  }

  crearEmpleado() {
    this.empleadoService.crearEmpleado(this.nuevoEmpleado).subscribe({
      next: () => {
        this.cargarEmpleados();
        this.resetFormulario();
      },
      error: (err) => console.error('Error creando empleado:', err)
    });
  }

  confirmarEliminacion(empleado: Empleado) {
    console.log('Preparando eliminación para:', empleado.id);
    this.empleadoSeleccionado = empleado;
    this.modal.show();
  }

  eliminarEmpleadoConfirmado() {
    console.log('Función eliminarEmpleadoConfirmado() ejecutada');
    console.log('Empleado seleccionado:', this.empleadoSeleccionado);
    
    if (!this.empleadoSeleccionado?.id) {
      console.error('Error: No hay empleado seleccionado');
      return;
    }
    
    console.log('Eliminando empleado ID:', this.empleadoSeleccionado.id);
    
    this.empleadoService.eliminarEmpleado(this.empleadoSeleccionado.id).subscribe({
      next: () => {
        console.log('Eliminación exitosa');
        this.cargarEmpleados();
        this.modal.hide();
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        this.modal.hide();
      }
    });
  }
  

  iniciarEdicion(empleado: Empleado) {
    console.log('Iniciando edición para:', empleado.id);
    this.edicionMode = true;
    this.empleadoEditando = {...empleado};
    this.show = true;
  }

  cancelarEdicion() {
    console.log('Edición cancelada');
    this.edicionMode = false;
    this.empleadoEditando = null;
  }

  actualizarEmpleado() {
    if (!this.empleadoEditando?.id) {
      console.error('Error: No hay empleado seleccionado para editar');
      return;
    }

    // Preparar cambios
    const cambios: any = {};
    const empleadoOriginal = this.empleados.find(e => e.id === this.empleadoEditando?.id);
    
    if (empleadoOriginal) {
      (Object.keys(this.empleadoEditando) as Array<keyof Empleado>).forEach(key => {
        if (this.empleadoEditando![key] !== empleadoOriginal[key]) {
          // Mapear al formato del backend (propiedades capitalizadas)
          const backendKey = key.charAt(0).toUpperCase() + key.slice(1);
          cambios[backendKey] = this.empleadoEditando![key];
        }
      });
    }

    console.log('Enviando cambios:', cambios);
    
    if (Object.keys(cambios).length > 0) {
      this.empleadoService.actualizarEmpleado(this.empleadoEditando.id, cambios).subscribe({
        next: (response) => {
          console.log('Actualización exitosa:', response);
          this.cargarEmpleados();
          this.cancelarEdicion();
        },
        error: (err) => {
          console.error('Error actualizando empleado:', err);
        }
      });
    } else {
      console.log('No hay cambios para guardar');
      this.cancelarEdicion();
    }
  }

  private resetFormulario() {
    this.nuevoEmpleado = {
      nombre: '',
      correo: '',
      cargo: '',
      departamento: '',
      telefono: '',
      fechaIngreso: '',
      activo: true
    };
  }
}
