import { Component, OnInit } from '@angular/core';
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

  uploadProducts(fileInput: any, extra: any) {
    console.log("fileInput, extra", fileInput, extra);
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
          const data = XLSX.utils.sheet_to_json(ws);
          // TODO: Filter the data for it to contain 3 fields for all its entries :
          // TODO: - productName, productCategory, dateOfManufacture
          console.log(data);
          this.productsArray = data;
        } catch (err) {
          console.error("File not uploaded. The file must have a sheet named Products", err);
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
