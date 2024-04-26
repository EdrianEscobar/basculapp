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


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
  
})
export class ProductComponent implements OnInit{
  //productList: ProductInterface [] = [];
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
  


  constructor(private productService: ProductService , private http:HttpClient, private router: Router, public dialog: MatDialog) { }

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
          //console.log(this.codigosDespSellado);
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


    openDialog(employeeId: string, jobNum: string, basicName: string, machine: string): void {
      const dialogRef = this.dialog.open(EmployeeFormComponent, {
        width: '700px',
        data: {
          id: employeeId,
          jobNum: jobNum,
          basicName: basicName,
          machine: machine,
          codigosDespSellado: this.codigosDespSellado  
        }
      });
    
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        
      });
    }

    
    
}

export { ProductService };
