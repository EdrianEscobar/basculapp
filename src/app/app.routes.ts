import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './components/product/product.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';



export const routes: Routes = [
    { path: 'employee-form/:id', component: EmployeeFormComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }