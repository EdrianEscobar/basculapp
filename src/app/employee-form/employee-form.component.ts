import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import e from 'express';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductComponent } from '../components/product/product.component'; 
import { ProductService } from '../services/product.service';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { trigger } from '@angular/animations';

interface Reporte {
  employeeId: string;
  jobNum: string;
  scrapCode: string;
  description: string;
  machine: string;
  pesoBascula: string;
}


@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ FormsModule, ProductComponent, CommonModule ],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})


export class EmployeeFormComponent implements OnInit {
  employeeId: string | null = null;
  jobNum: string | null = null;
  basicName: string | null = null;
  machine: string | null = null;
  public selectedScrapCode: any;
  public selectedDescription: string = '';
  public active: boolean = false;
  public codigosDespSellado: any[] = [];
  private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIxNzEzOTM2Njk1IiwiaWF0IjoiMTcxMzg3NjY5NSIsImlzcyI6ImVwaWNvciIsImF1ZCI6ImVwaWNvciIsInVzZXJuYW1lIjoicHJhY3Rfc2lzdGVtYXMxIn0.dBDrdeT-nPy5xvtvraAaIgqYowa3A_khNnLLPulLgQQ';
  private api_urlcodes= "https://centralusdtapp73.epicorsaas.com/SaaS5333/api/v1/BaqSvc/jgrc_codigos_scrap(ALICO)/";
  public filteredProducts: any[] = [];
  public productList: any[] = [];
  public datosApi: any[] = [];
  public isPesoBasculaActive: boolean = false;
  public pesoBascula: any;
  reportes: Reporte[] = [];
  registroSeleccionado: any;
  private editIndex: number | null = null;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private productService: ProductService, private httpClient: HttpClient) {
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
  

    searchEmployee(): void {
      if (Array.isArray(this.productList)) {
        this.filteredProducts = this.productList.filter((item: any) => 
          item.LaborDtl_EmployeeNum === this.employeeId
        );
        console.log(this.datosApi);
        console.log(this.filteredProducts); 
        this.datosApi = this.filteredProducts;
        this.active = this.filteredProducts.length > 0; 
      } else {
        console.error('productList is not an array:', this.productList);
      }
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
          pesoBascula: this.pesoBascula
      };
      if (this.editIndex !== null && this.editIndex !== undefined) {
        // Estamos en modo de edición, actualizamos el reporte existente
        this.reportes[this.editIndex] = nuevoReporte;
        this.editIndex = null;  // Reseteamos el índice de edición
      } else {
        // Estamos añadiendo un nuevo reporte
        this.reportes.push(nuevoReporte);
      }
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
    
  
}
