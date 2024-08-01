import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OtrosProcesosModule } from '../otros-procesos.module';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { NgForOf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table'; // Importa MatTableModule
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ChangeDetectorRef } from '@angular/core';

interface OtrosProcesosDatos {
  employeeId: string;
  jobNum: string;
  scrapCode: string;
  description: string;
  machine: string;
  pesoBascula: string;
  basicName: string;
  notes: string;
  typeLabor: string;
  operation: string;
}


@Component({
  selector: 'app-codigosdesp',
  standalone: true,
  imports: [ MatDialogModule, FormsModule, CommonModule, MatTableModule, MatCheckboxModule],
  templateUrl: './codigosdesp.component.html',
  styleUrl: './codigosdesp.component.css'
})
export class CodigosdespComponent implements OnInit{

  employeeId: string | null = null;
  jobNum: string | null = null;
  basicName: string | null = null;
  operation: string | null = null;
  typeLabor: string | null = null;
  machine: string | null = null;
  scrapCode: string | null = null;
  description: string | null = null;
  public selectedScrapCode: any;
  public selectedOperation: any;
  public selectedDescription: string = '';
  public active: boolean = false;
  public pesoBascula: any;
  notes: string | null = null;
  operaciones: any[] = [];
  dataSource: any[] = [];
  esExtruder: boolean = false;
  scrapCodes: any[] = [];
  motivos: [] | undefined;  
  displayedColumns: string[] = [
    'LaborDtl_Company',
    'LaborDtl_EmployeeNum',
    'EmpBasic_Name',
    'LaborDtl_OpCode', 
    'LaborDtl_ResourceID',
    'OpMaster_OpDesc',
    'Resource_Description',
    'LaborDtl_JobNum',
    'LaborDtl_LaborHedSeq',
    'LaborDtl_LaborDtlSeq',
    'JobHead_PartNum',
    'LaborDtl_OprSeq', 
    'LaborDtl_LaborType',
    'Calculated_Tipo_Labor',
    'LaborDtl_ClockInDate'  
  ]
  dataSourceOriginal: any[] = [];
  selectedMotivo: string = '';
  motivoDescripcion: string = '';
  selectedProceso: string | null = null;

  ;


  constructor(@Inject(MAT_DIALOG_DATA) public data: OtrosProcesosDatos,
  private router: Router,
  @Inject(MatDialogRef) public dialogRefOtrosProc: MatDialogRef<CodigosdespComponent>,
  public dialog: MatDialog,
  private productService: ProductService,
  private cdr: ChangeDetectorRef)
  { }
  
  
  ngOnInit(): void {
    console.log('Open Otros Procesos')
    if (this.data) {
      this.employeeId = this.data.employeeId;
      this.jobNum = this.data.jobNum;
      this.basicName = this.data.basicName;
      this.operation = this.data.operation;
      this.typeLabor = this.data.typeLabor;
      this.machine = this.data.machine;
      this.notes = this.data.notes;
      this.fetchComboBoxOperaciones(this.data.jobNum); 
      this.loadInitialData();
      this.fetchMotivos();
      console.log(this.data.jobNum, this.data.operation, this.data.typeLabor, this.data.machine, this.data.employeeId);
    } else {
      console.error('No data provided to the dialog');
    }
    
  }

  /* loadInitialData() {
    if (this.jobNum) {
      const baqString = 'RDLR-TyG_btnSearch_Click'; // Cambia este string a tu consulta real
      this.productService.getOperaciones(baqString, this.jobNum).subscribe(
        response => {
          this.dataSource = response;        
        },
        error => {
          console.error('Error fetching operaciones:', error);
        }
      );
    }
  } */


    loadInitialData() {
      if (this.jobNum) {
        const baqString = 'RDLR-TyG_btnSearch_Click'; // Cambia este string a tu consulta real
        this.productService.getOperaciones(baqString, this.jobNum).subscribe(
          response => {
            console.log('Operaciones response:', response); // Log para verificar los datos recibidos
            this.dataSourceOriginal = response; // Almacenar los datos originales
            this.dataSource = response; // Mostrar los datos inicialmente
            this.cdr.detectChanges(); // Forzar detección de cambios
          },
          error => {
            console.error('Error fetching operaciones:', error);
          }
        );
      }
    }

  fetchComboBoxOperaciones(jobNum: string): void {
    const baqString = 'RDLR-TyG_btnSearch_Click';
    this.productService.getOperaciones(baqString, jobNum).subscribe(response => {
      try {
        if (!response || !Array.isArray(response)) {
          throw new Error('Invalid response format');
        }
  
        this.operaciones = response
          .map((item: any) => item.OpMaster_OpDesc)
          .filter((value: any, index: number, self: any[]) => self.indexOf(value) === index);
  
        this.operaciones.unshift('Todos');
        
        // Verificar los datos recibidos
        console.log('Operaciones obtenidas:', this.operaciones);
  
      } catch (error) {
        console.error('Error processing operaciones response:', error);
      }
    }, error => {
      console.error('Error fetching operaciones:', error);
      if (error.status === 200 && error.error && typeof error.error.text === 'string') {
        console.error('Error: Server returned HTML instead of JSON');
      }
    });
  }
  

onClose(): void {
  this.dialogRefOtrosProc.close();
}

onCheckboxChange() {
  if (this.jobNum) {
    const baqString = this.esExtruder ? 'RDLR-TyG_btnSearch_Click2' : 'RDLR-TyG_btnSearch_Click';
    this.fetchData(baqString);
  }
}


fetchData(baqString: string) {
  if (this.jobNum) {
    this.productService.getOperaciones(baqString, this.jobNum).subscribe(response => {
      console.log('Fetched data:', response); // Log para verificar los datos recibidos
      this.dataSource = response; // Cargar filas en la tabla
    }, error => {
      console.error('Error fetching operaciones:', error);
    });
  }
}


accionSeleccionada(event: Event, index: number): void {
  const target = event.target as HTMLSelectElement;
  const accion = target.value;
  
  if (accion === 'editar') {
      console.log('Editar', index);
  } else if (accion === 'eliminar') {
      console.log('Eliminar', index);
  }
}


fetchScrapCodes(scrapType: string) {
  this.productService.fetchScrapCodes(scrapType).subscribe(
    codes => {
      console.log('Scrap codes response:', codes); // Log para verificar los datos recibidos
      this.dataSource = codes;
      
    },
    error => {
      console.error('Failed to load scrap codes', error);
    }
  );
}




fetchMotivos(): void {
  const baqString = 'YLSV_SetReason';
  this.productService.getMotivos(baqString, 'someReasonCode').subscribe(
    response => {
      console.log('Motivos response:', response);
      this.motivos = response;
    },
    error => {
      console.error('Error fetching motivos:', error);
    }
  );
}

onProcesoChange() {
  if (this.selectedProceso === 'Todos' || !this.selectedProceso) {
    this.dataSource = this.dataSourceOriginal;
  } else {
    this.dataSource = this.dataSourceOriginal.filter(item => item.OpMaster_OpDesc === this.selectedProceso);
  }
  this.cdr.detectChanges();
}


onMotivoChange() {
  if (this.selectedMotivo && this.selectedMotivo.length === 3) { // Verifica que el motivo tenga 3 dígitos
    this.productService.getMotivos('YLSV_SetReason', this.selectedMotivo).subscribe(
      motivos => {
        console.log('Motivo descripción:', motivos);
        if (motivos && motivos.length > 0) {
          this.motivoDescripcion = motivos[0].Description;
        } else {
          this.motivoDescripcion = '';
        }
      },
      error => {
        console.error('Error fetching motivo descripción:', error);
        this.motivoDescripcion = '';
      }
    );
  } else {
    this.motivoDescripcion = '';
  }
}


}
