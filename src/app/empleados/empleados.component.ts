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
    // Eliminar la validación de fecha futura
    this.empleadoService.crearEmpleado(this.nuevoEmpleado).subscribe({
      next: () => {
        this.cargarEmpleados();
        this.resetFormulario();
        alert('Empleado creado exitosamente');
      },
      error: (err) => {
        console.error('Error al crear empleado:', err);
        alert('Error al crear empleado');
      }
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

    const payload: any = {};
    const original = this.empleados.find(e => e.id === this.empleadoEditando?.id);
    
    if (original) {
      (Object.keys(this.empleadoEditando) as Array<keyof Empleado>).forEach(key => {
        if (JSON.stringify(this.empleadoEditando![key]) !== JSON.stringify(original[key])) {
          const backendKey = key.charAt(0).toUpperCase() + key.slice(1);
          payload[backendKey] = key === 'fechaIngreso' && this.empleadoEditando![key]
            ? new Date(this.empleadoEditando![key]).toISOString().split('T')[0]
            : this.empleadoEditando![key];
        }
      });
    }

    if (Object.keys(payload).length > 0) {
      this.empleadoService.actualizarEmpleado(this.empleadoEditando.id, payload).subscribe({
        next: (response) => {
          this.cargarEmpleados();
          this.cancelarEdicion();
          alert('Cambios guardados exitosamente');
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          alert('Error al guardar cambios');
        }
      });
    } else {
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
