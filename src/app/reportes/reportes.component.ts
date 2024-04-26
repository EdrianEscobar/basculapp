import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';



export interface Reporte {
  employeeId: string;
  jobNum: string;
  scrapCode: string;
  description: string;
  pesoBascula: string;
}


@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [NgFor],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent {
  @Input() reportes: Reporte[] = [];
}
