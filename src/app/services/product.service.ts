import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ScrapCode } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})


export class ProductService {
 

  private api_url= "https://centralusdtapp73.epicorsaas.com/SaaS5333/api/v1/BaqSvc/Desperdicio_EABE(ALICO)/";
  private api_urlcodes= "https://centralusdtapp73.epicorsaas.com/SaaS5333/api/v1/BaqSvc/jgrc_codigos_scrap(ALICO)/";
  private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIxNzE0NDU2ODM1IiwiaWF0IjoiMTcxNDM5NjgzNSIsImlzcyI6ImVwaWNvciIsImF1ZCI6ImVwaWNvciIsInVzZXJuYW1lIjoicHJhY3Rfc2lzdGVtYXMxIn0.ZDeevJ0i60ZWV_X4sTdFv5QXywdlRC0QPHiPnzsQiSg';
  private tokencodes = 'ZXh0ZXJuYWxfYXBpOjEwMjRtYi0xVA==';
  private storedEmployeeData: any;
  headers: HttpHeaders | { [header: string]: string | string[]; } | undefined;
  private api_urlextr = "jgrc_codigos_oth(ALICO)";

  constructor(private httpClient: HttpClient) { }

  getEmployees(): Observable<any> {
    return this.httpClient.get(`${this.api_url}`, {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    });
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Basic ' + this.tokencodes);
  }

  getProducts(): Observable<any> {
    return this.httpClient.get(`${this.api_url}`, { headers: this.getHeaders() });
  }

  getEmployeeById(id: string): Observable<any> {
    const url = `${this.api_url}${id}`; 
    return this.httpClient.get(url, { headers: this.getHeaders()});
  }

  codesDespSellado(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + this.tokencodes
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
  
  // Método existente
  getOperaciones(baqString: string, jobNum: string): Observable<any> {
    const url = `${this.api_url.replace('Desperdicio_EABE(ALICO)', baqString)}?JobNum=${jobNum}`;
    console.log(url);
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + this.tokencodes
    });

    return this.httpClient.get(url, { headers }).pipe(
      map((response: any) => response['value']),
      catchError(error => {
        console.error('Error fetching operaciones:', error);
        return throwError(() => new Error('Error fetching operaciones'));
      })
    );
  }

  getProcesos(baqString: string, jobNum: string): Observable<any> {
    return this.httpClient.get<any>(`${this.api_urlextr}/operaciones?baqString=${baqString}&jobNum=${jobNum}`);
  }



  fetchScrapCodes(scrapType: string): Observable<ScrapCode[]> {
    const url = `${this.api_urlextr}Scrap/${scrapType}`;
    const headers = new HttpHeaders({
      'Authorization': `Basic ${this.tokencodes}`
    });
  
    return this.httpClient.get<{data: ScrapCode[]}>(url, { headers }).pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error('Error fetching scrap codes:', error);
        return throwError(() => new Error('Error fetching scrap codes'));
      })
    );
  }

  

  setEmployeeData(data: any): void {
    this.storedEmployeeData = data;
  }

  getEmployeeData(): any {
    return this.storedEmployeeData;
  }


 // Nuevo método para obtener los motivos
 /* getMotivos(baqString: string): Observable<any> {
  const url = `${this.api_url}${baqString}`;
  console.log(url);
  const headers = new HttpHeaders({
    'Authorization': 'Basic ' + this.tokencodes
  });

  return this.httpClient.get(url, { headers }).pipe(
    map((response: any) => response['value']),
    catchError(error => {
      console.error('Error fetching motivos:', error);
      return throwError(() => new Error('Error fetching motivos'));
    })
  );
} */

  
  getMotivos(baqString: string, motivo: string): Observable<any> {
    const url = `${this.api_url.replace('YLSV_SetReason', baqString)}?Motivo=${motivo}`;
    console.log(url);
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + this.tokencodes
    });
  
    return this.httpClient.get(url, { headers }).pipe(
      map((response: any) => response['value']),
      catchError(error => {
        console.error('Error fetching motivos:', error);
        return throwError(() => new Error('Error fetching motivos'));
      })
    );
  }
  


}
