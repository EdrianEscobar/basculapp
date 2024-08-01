import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Console, error, log } from 'console';
import { ProductInterface } from '../../interfaces/product.interface';
import { CommonModule, provideImgixLoader } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { EmployeeFormComponent } from '../../employee-form/employee-form.component';
import { MatDialog } from '@angular/material/dialog';
import { NgOptimizedImage } from '@angular/common';
import { ModalsService } from '../../modals.service';


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
  
})
export class ProductComponent implements OnInit{
  public productList: any[] = [];
  public filteredProducts: any[] = [];
  public employeeId: string = '';
  public trabajo: string = '';
  public datosApi: any[] = [];
  public pesoBascula: any;
  public active: boolean = false;
  public codigosDespSellado: any[] = [];
  public selectedScrapCode: any;
  selectedDescription: string = '';
  employeeSelected:any [] = [];
  employeeIds: string[] = [];
  selectedEmployeeId: string = '';
 
  


  constructor(private productService: ProductService , private http:HttpClient, private router: Router, public dialog: MatDialog,
    private modalsService: ModalsService) { }

    ngOnInit(): void {
      this.getProducts();
      this.loadCodes();
    }


    getProducts(): void {
      this.productService.getProducts().subscribe(
        (response) => {
          this.productList = response.value;
          this.datosApi = response.value;
        },
        (err) => console.error('Error fetching products:', err)
      );
    }

    loadCodes(): void {
      this.productService.codesDespSellado().subscribe(
        (codes) => {
          this.codigosDespSellado = codes;
        },
        (err) => console.error('Error fetching scrap codes:', err)
      );
    }

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

    activeEmployee(): void {
      if(this.filteredProducts.length > 0){
        this.active = true;
      }
    }

    onScrapCodeChange(): void {
      if (this.selectedScrapCode) {
        this.selectedDescription = this.selectedScrapCode.Reason_Description;
      }
    }

    selectEmployee(employeeId: string) {
    
      this.router.navigate(['/employee-form', employeeId]);
    }

    
    public openEmployeeForm(employeeId: string, jobNum: string, basicName: string, machine: string): void {
      this.modalsService.openEmployeeForm(employeeId, jobNum, basicName, machine);
    }

    public openOtherProcesses(): void {
      this.modalsService.openOtrosProcesos();
    }

}

export { ProductService };
