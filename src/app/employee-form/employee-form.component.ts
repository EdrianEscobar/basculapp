import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductComponent } from '../components/product/product.component'; 
import { ProductService } from '../services/product.service';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { json } from 'stream/consumers';
import { OtrosProcesosModule } from '../otros-procesos/otros-procesos.module';

import { routes } from '../app.routes';
import { provideRouter } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ModalsService } from '../modals.service';
import { CodigosdespComponent } from '../otros-procesos/codigosdesp/codigosdesp.component';



interface Reporte {
  employeeId: string;
  jobNum: string;
  scrapCode: string;
  description: string;
  machine: string;
  pesoBascula: string;
  basicName: string;
  notes: string;
}

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [FormsModule, ProductComponent, CommonModule, RouterModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
  providers: [   ]
  
})


export class EmployeeFormComponent implements OnInit {
  employeeId: string | null = null;
  jobNum: string | null = null;
  basicName: string | null = null;
  machine: string | null = null;
  notes: string | null = null;
  public selectedScrapCode: any;
  public selectedDescription: string = '';
  public active: boolean = false;
  public codigosDespSellado: any[] = [];
  private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIxNzE0NDU2ODM1IiwiaWF0IjoiMTcxNDM5NjgzNSIsImlzcyI6ImVwaWNvciIsImF1ZCI6ImVwaWNvciIsInVzZXJuYW1lIjoicHJhY3Rfc2lzdGVtYXMxIn0.ZDeevJ0i60ZWV_X4sTdFv5QXywdlRC0QPHiPnzsQiSg';
  private api_urlcodes= "https://centralusdtapp73.epicorsaas.com/SaaS5333/api/v1/BaqSvc/jgrc_codigos_scrap(ALICO)/";
  public filteredProducts: any[] = [];
  public productList: any[] = [];
  public datosApi: any[] = [];
  public isPesoBasculaActive: boolean = false;
  public pesoBascula: any;
  reportes: Reporte[] = [];
  registroSeleccionado: any;
  private editIndex: number | null = null;
  jsonData: any;
  url: any;
  convertJson: any;
 

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private productService: ProductService, private httpClient: HttpClient, @Inject(MatDialogRef) public dialogRef: MatDialogRef<EmployeeFormComponent>,public dialog: MatDialog,
  private router: Router, private modalsService: ModalsService) {
    this.employeeId = data.id;
    this.jobNum = data.jobNum;
    this.basicName = data.basicName;
    this.machine = data.machine;
    console.log(data.id, data.jobNum); 
    if (data.codigosDespSellado) {
      this.codigosDespSellado = data.codigosDespSellado;
    }
  }

  ngOnInit(): void {  
    this.loadCodes();
  };
  
    searchEmployee(id: string): void {
      this.productService.getEmployeeById(id).subscribe({
        next: (data) => {
          this.employeeId = data;
          this.productService.setEmployeeData(data); // Almacena los datos en el servicio
        },
        error: (err) => {
          console.error('Error fetching employee:', err);
        }
      });
    }

  
    onScrapCodeChange(): void {
      if (this.selectedScrapCode) {
        this.selectedDescription = this.selectedScrapCode.Reason_Description;
        this.isPesoBasculaActive = true;
      } else {
        this.isPesoBasculaActive = false;
      }
    }

    private getHeaders(): HttpHeaders {
      return new HttpHeaders().set('Authorization', 'Bearer ' + this.token);
    }
  

    loadCodes(): void {
      this.productService.codesDespSellado().subscribe(
        (codes) => {
          this.codigosDespSellado = codes;
          //console.log(this.codigosDespSellado);
        },
        (err) => console.error('Error fetching scrap codes:', err)
      );
    }

    codesDespSellado(): Observable<any> {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      });
  
      return this.httpClient.get(this.api_urlcodes, { headers: headers }).pipe(
        map((response: any) => { 
          const codes = response['value'];
          return codes.map((scrapCode: any) => ({
            Reason_Company: scrapCode.Reason_Company,
            Reason_ReasonType: scrapCode.Reason_ReasonType,
            Reason_ReasonCode: scrapCode.Reason_ReasonCode,
            Reason_Description: scrapCode.Reason_Description
          }));
        }),
        catchError(error => {
          console.error('Error fetching scrap codes:', error);
          return throwError(() => new Error('Error fetching scrap codes'));
          
        }))
    }

    guardarReporte(): void {
        const nuevoReporte: Reporte = {
          employeeId: this.employeeId!,
          jobNum: this.jobNum!,
          machine: this.machine!,
          scrapCode: this.selectedScrapCode.Reason_ReasonCode,
          description: this.selectedDescription,
          pesoBascula: this.pesoBascula,
          basicName: this.basicName!,
          notes: this.notes!
        };
      if (this.editIndex !== null && this.editIndex !== undefined) {
        // Estamos en modo de edición, actualizamos el reporte existente
        this.reportes[this.editIndex] = nuevoReporte;
        this.editIndex = null;  // Reseteamos el índice de edición
      } else {
        // Estamos añadiendo un nuevo reporte
        this.reportes.push(nuevoReporte);
      }
      console.log(this.reportes);
      this.convertJson = JSON.stringify(this.reportes);
      console.log(this.convertJson);   
  }


  
  accionSeleccionada(event: Event, index: number): void {
    const target = event.target as HTMLSelectElement;
    const accion = target.value;
    
    if (accion === 'editar') {
        this.cargarDatosParaEditar(index);
    } else if (accion === 'eliminar') {
        this.eliminarReporte(index);
    }
  }

cargarDatosParaEditar(index: number): void {
    const reporte = this.reportes[index];
    this.employeeId = reporte.employeeId;
    this.jobNum = reporte.jobNum;
    this.selectedScrapCode = { Reason_ReasonCode: reporte.scrapCode };
    this.selectedDescription = reporte.description;
    this.pesoBascula = reporte.pesoBascula;
    this.machine = reporte.machine;
    this.editIndex = index; // Guarda el índice del reporte que se está editando
}
    
    
    eliminarReporte(index: number): void {
        if (confirm("¿Estás seguro de que deseas eliminar este reporte?")) {
            this.reportes.splice(index, 1);
        }
    }
    


    postReporte(jsonData: string, url: string): Observable<any> {
      const apiUrl = `https://centralusdtpilot73.epicorsaas.com/saas5333pilot/api/v2/efx/ALICO/JGRCud06/${url}`;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'X-API-Key': 'vMGRf6ryrOBOttpzlyBi60qviKImvIMW6Dnsb5GeJewpn',
        'Authorization': 'Basic ZXh0ZXJuYWxfYXBpOjEwMjRtYi0xVA=='
      });

      return this.httpClient.post<any>(apiUrl, jsonData, { headers });
    }

    onClose(): void {
      this.dialogRef.close();
      this.router.navigate(['/']);
    }
    openOtherProcesses(): void {
      const dialogRef = this.dialog.open(CodigosdespComponent, {
        width: '1100px',
        disableClose: false,
        data: { employeeId: this.employeeId, jobNum: this.jobNum, basicName: this.basicName, machine: this.machine }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('Otros Procesos modal closed');
      });
    }

  
    public openEmployeeForm(employeeId: string, jobNum: string, basicName: string, machine: string): void {
      this.modalsService.openEmployeeForm(employeeId, jobNum, basicName, machine);
    }
  
}
  
  

