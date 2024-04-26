import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductComponent, ProductService } from './components/product/product.component';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, ProductComponent ,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor(private productService: ProductService) { }
  ngOnInit(): void {
    this.searchEmployee(this.employeeId);
  }

  searchEmployee(id: string): void {
    this.productService.getEmployeeById(id).subscribe({
      next: (api_url: "https://centralusdtpilot73.epicorsaas.com/SaaS5333pilot/api/v1/BaqSvc/EABE_desp(ALICO)/", token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIxNzEyOTA1ODM1IiwiaWF0IjoiMTcxMjg0NTgzNSIsImlzcyI6ImVwaWNvciIsImF1ZCI6ImVwaWNvciIsInVzZXJuYW1lIjoicHJhY3Rfc2lzdGVtYXMxIn0.9dFDuilroPXdDEDDIXK6Ss07KYfPY2j9vaZE-leqtBQ') => {
        this.employee = api_url;
      },
      error: (err: any) => {
        console.error('Error fetching employee:', err);
        this.editable = false;
      }
    });
  }
  
onSubmit() {
throw new Error('Method not implemented.');
}
  title = 'basculapp';
  name:string = "Edrian";
  pesoRegistrado: string = "";
  editable: boolean = false;
  codigosDesperdicio: string = "";
  codigoSeleccionado: string = "";
  employeeId: string = ""; 
  employee: any = {
    Id: '',
    jobNum: '',
    Name: '',
    Part: '',
    Shift: '',
    Date: '',
    Resource: '',
  };

  
  
}
