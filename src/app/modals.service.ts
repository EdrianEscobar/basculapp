import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductComponent } from './components/product/product.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { CodigosdespComponent } from './otros-procesos/codigosdesp/codigosdesp.component';
import { OtrosProcesosModule } from './otros-procesos/otros-procesos.module';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductService } from './components/product/product.component';


@Injectable({
  providedIn: 'root'
})
export class ModalsService {
  private apiUrl= "https://centralusdtapp73.epicorsaas.com/SaaS5333/api/v1/BaqSvc/Desperdicio_EABE(ALICO)/";
  private token = 'ZXh0ZXJuYWxfYXBpOjEwMjRtYi0xVA==';
  codigosDespSellado: any;
  employeeId: string | undefined;

  constructor(private dialog: MatDialog, private httpClient: HttpClient,private productService: ProductService) {}


  openEmployeeForm(employeeId: string, jobNum: string, basicName: string, machine: string): void {
      
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '700px',
      data: {
        id: employeeId,
        jobNum: jobNum,
        basicName: basicName,
        machine: machine,
        codigosDespSellado: this.codigosDespSellado  
      },
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      
    });
  }


  openOtrosProcesos(): void {  
    const dialogRef = this.dialog.open(CodigosdespComponent, {
      width: '700px',
      data: {
        employeeId: this.employeeId,
        jobNum: '',
        basicName: '',
        operation: '',
        typeLabor: '',
        machine: '',
      },
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');   
    });
  }


  searchEmployee(id: string): void {
    this.productService.getEmployeeById(id).subscribe({
      next: (api_url: "https://centralusdtpilot73.epicorsaas.com/SaaS5333pilot/api/v1/BaqSvc/EABE_desp(ALICO)/", token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIxNzEyOTA1ODM1IiwiaWF0IjoiMTcxMjg0NTgzNSIsImlzcyI6ImVwaWNvciIsImF1ZCI6ImVwaWNvciIsInVzZXJuYW1lIjoicHJhY3Rfc2lzdGVtYXMxIn0.9dFDuilroPXdDEDDIXK6Ss07KYfPY2j9vaZE-leqtBQ') => {
        this.employeeId = api_url;
      },
      error: (err: any) => {
        console.error('Error fetching employee:', err);
        
      }
    });
  }


}
