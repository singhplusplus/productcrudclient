import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridReadyEvent } from 'ag-grid-community';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent {
  
  constructor(private http: HttpClient) {}
  
  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  
  columnDefs: ColDef[] = [
    { field: 'name' },
    { field: 'category' },
    { field: 'date' },
  ];
  // rowData !: Observable<any[]>;

  rowData = [
        { name: 'Toyota', category: 'Celica', date: new Date() },
        { name: 'Ford', category: 'Mondeo', date: 32000 },
        { name: 'Porsche', category: 'Boxster', date: 72000 }
    ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  // Example load data from sever
  // onGridReady(params: GridReadyEvent) {
  //   this.rowData = this.http.get<any[]>(
  //     'https://www.ag-grid.com/example-assets/row-data.json'
  //   );
  // }

  // Example of consuming Grid Event
  // onCellClicked(e: CellClickedEvent): void {
  //   console.log('cellClicked', e);
  // }

  // Example using Grid's API
  clearSelection(): void {
    this.agGrid.api.deselectAll();
  }
}
