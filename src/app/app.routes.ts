import { Routes } from '@angular/router';
import { EmpleadosComponent } from './empleados/empleados.component';
import { TableEmployees } from './table-employees/table-employees';


export const routes: Routes = [
    {
        path: 'employees',
        component: EmpleadosComponent
    },
    {
        path: 'table-employees',
        component: TableEmployees
    }
];
