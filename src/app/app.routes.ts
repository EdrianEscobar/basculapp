import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductComponent } from './components/product/product.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { CodigosdespComponent } from '../app/otros-procesos/codigosdesp/codigosdesp.component';

export const routes: Routes = [
    { path: '', redirectTo: '/product', pathMatch: 'full' },
    { path: 'product', component: ProductComponent },
    { path: 'employee-form/:id', component: EmployeeFormComponent },
    { path: 'codigos-desp', component: CodigosdespComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }