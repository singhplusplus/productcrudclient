import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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

    // if(this.productsArray.length > 0) {

    // }
    console.log("fileInput, extra", fileInput, event);
    const files: File[] = fileInput.files;
    if (files.length < 1) {
      return;
    }
    const file = files[0];
    console.log("file", file);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async (e) => {
      const loadResult = e.target?.result;
      if(loadResult && typeof loadResult != "string") {
        try {
          const fileBuffer = new Uint8Array(loadResult);
          const wb = await XLSX.read(fileBuffer, {type: "buffer", cellDates: true});
          const sheetList = wb.SheetNames;

          const ws = wb.Sheets[sheetList[0]];
          // console.log("ws", ws);
          const sheetData = XLSX.utils.sheet_to_json(ws);
          console.log("sheetData", sheetData);
          const incompleteRowNums : any = [];
          const filteredSheet = sheetData.filter(
            (row: any) => {
              const isRowComplete = row.productName && row.productCategory && row.dateOfManufacture;
              if(!isRowComplete)
                incompleteRowNums.push(row["__rowNum__"] + 1);
              return isRowComplete;
            }
          )
          console.log("filteredSheet", filteredSheet);
          if(filteredSheet.length < sheetData.length) {
            console.log("Some data records are not parsed");
            this.confirmError = `${incompleteRowNums.length > 1 ? 'Some': 'One'} of the file's rows #${JSON.stringify(incompleteRowNums)} will not be saved, due to data not present in all the required columns.`
              + "Press 'Save' to continue anyways. Or check the file and upload again.";
            
          }
          // TODO: Filter the data for it to contain 3 fields for all its entries :
          // TODO: - productName, productCategory, dateOfManufacture
          // console.log(data);
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
      // this.activeModal.close('Confirm');
      this.activeModal.close(this.productsArray);
    }
    else {
      this.confirmError = "Wrong";
    }
  }

}
