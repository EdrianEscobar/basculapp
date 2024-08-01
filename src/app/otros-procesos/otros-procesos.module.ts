import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CodigosdespComponent } from '../otros-procesos/codigosdesp/codigosdesp.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table'; 
import { MatCheckboxModule } from '@angular/material/checkbox'; 
import { FormsModule } from '@angular/forms';



const routes: Routes = [
  { path: '', component: CodigosdespComponent }
];

@NgModule({
  declarations: [
   
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    CodigosdespComponent,
    MatDialogModule,
    MatTableModule,
    FormsModule,
    MatCheckboxModule
  ],
  exports: []
})
export class OtrosProcesosModule { }
