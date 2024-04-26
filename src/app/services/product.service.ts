import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
 

  private api_url= "https://centralusdtapp73.epicorsaas.com/SaaS5333/api/v1/BaqSvc/Desperdicio_EABE(ALICO)/";
  private api_urlcodes= "https://centralusdtapp73.epicorsaas.com/SaaS5333/api/v1/BaqSvc/jgrc_codigos_scrap(ALICO)/";
  private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIxNzE0MTk3NTY4IiwiaWF0IjoiMTcxNDEzNzU2OCIsImlzcyI6ImVwaWNvciIsImF1ZCI6ImVwaWNvciIsInVzZXJuYW1lIjoicHJhY3Rfc2lzdGVtYXMxIn0.veK9_Kdxzu6_FBiAM6tjiTh93HBr-Qej_TZtrSiKOUA';
  private tokencodes = 'ZXh0ZXJuYWxfYXBpOjEwMjRtYi0xVA==';
  headers: HttpHeaders | { [header: string]: string | string[]; } | undefined;

  constructor(private httpClient: HttpClient) { }

  getEmployees(): Observable<any> {
    return this.httpClient.get(`${this.api_url}`, {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    });
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Bearer ' + this.token);
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

}
