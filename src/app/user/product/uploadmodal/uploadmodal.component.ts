import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { xlsxDateFormat } from './../../../common/date.utils';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-uploadmodal',
  templateUrl: './uploadmodal.component.html',
  styleUrls: ['./uploadmodal.component.scss']
})
export class UploadmodalComponent implements OnInit {

  productsArray: any[] = [];
  confirmError = "";

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  clearFile(event: any) {
    event.target.value = '';
  }
  uploadProducts(fileInput: any, event: any) {
    const files: File[] = fileInput.files;
    if (files.length < 1) {
      return;
    }
    const file = files[0];

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async (e) => {
      const loadResult = e.target?.result;
      if(loadResult && typeof loadResult != "string") {
        try {
          const fileBuffer = new Uint8Array(loadResult);
          const wb = await XLSX.read(fileBuffer, {type: "buffer", dateNF: xlsxDateFormat});
          const sheetList = wb.SheetNames;

          const ws = wb.Sheets[sheetList[0]];

          const sheetData = XLSX.utils.sheet_to_json(ws, {raw: false});

          const incompleteRowNums : any = [];
          const filteredSheet = sheetData.filter(
            (row: any) => {
              const isRowComplete = row.productName && row.productCategory && row.dateOfManufacture;
              if(!isRowComplete)
                incompleteRowNums.push(row["__rowNum__"] + 1);
              return isRowComplete;
            }
          )
          if(filteredSheet.length < sheetData.length) {
            this.confirmError = `${incompleteRowNums.length > 1 ? 'Some': 'One'} of the file's rows #${JSON.stringify(incompleteRowNums)} will not be saved, due to data not present in all the required columns.`
              + "Press 'Save' to continue anyways. Or check the file and upload again.";
          }
          this.productsArray = filteredSheet;
          
        } catch (err) {
          console.error("File must have a sheet with columns productName, productCategory, dateOfManufacture", err);
        }
      }
    }
  }

  closeWithoutUpload() {
    this.activeModal.dismiss('Close');
  }

  saveUploadedData() {
    if(this.productsArray.length > 0) {
      this.activeModal.close(this.productsArray);
    }
    else {
      this.confirmError = "Wrong";
    }
  }

}
