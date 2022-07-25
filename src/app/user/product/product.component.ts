import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct, NgbInputDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { DeletemodalComponent } from './deletemodal/deletemodal.component';
import { ProductService } from './product.service';
import * as XLSX from 'xlsx';
import { UploadmodalComponent } from './uploadmodal/uploadmodal.component';
import { NgbdSortableHeaderDirective } from './../../ngbd/ngbd-sortable-header.directive';
import { DateStringNoFormValidator, DateValidator } from './../../common/date.validator';
import { acceptedDateFormats, convertDatepickerToMomentDate, minDateString } from './../../common/date.utils';
import * as moment from 'moment';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [NgbInputDatepickerConfig]
})
export class ProductComponent implements OnInit {

  productList : any[] = [];
  loggedUser: any;

  addProductForm !: FormGroup;
  editProductForm !: FormGroup;
  addProductEnabled : boolean = false;
  editProductEnabled : boolean = false;
  
  searchProductQuery = "";
  searchDateStartQuery: NgbDateStruct | any;
  searchDateEndQuery: NgbDateStruct | any;
  searchBy = "name"; // initial value of radio button
  searchDateModel: NgbDateStruct | any;
  dateInvalidMsg = "";


  @ViewChildren(NgbdSortableHeaderDirective) headers: QueryList<NgbdSortableHeaderDirective> | any;

  constructor(private fb: FormBuilder, private userService: UserService, private calendar: NgbCalendar,
    private prodService: ProductService, private router: Router, private modalService: NgbModal,
    private config: NgbInputDatepickerConfig
  ) {

    config.autoClose = 'outside';
    
    this.addProductForm = this.fb.group({
      productName: ['', [Validators.required]],
      productCategory: ['', [Validators.required]],
      dateOfManufacture: ['', [
        Validators.required, DateValidator(acceptedDateFormats),
      ]]
    });
    this.editProductForm = this.fb.group({
      productId: '',
      productName: ['', [Validators.required]],
      productCategory: ['', [Validators.required]],
      dateOfManufacture: ['', [
        Validators.required, DateValidator(acceptedDateFormats),
      ]]
    });
  }

  get addProdName() {return this.addProductForm.get('productName')}
  get addProdCategory() {return this.addProductForm.get('productCategory')}
  get addManufactureDate() {return this.addProductForm.get('dateOfManufacture')}

  get editProdName() {return this.editProductForm.get('productName')}
  get editProdCategory() {return this.editProductForm.get('productCategory')}
  get editManufactureDate() {return this.editProductForm.get('dateOfManufacture')}

  ngOnInit(): void {
    this.getProductsList();
    // Get complete User profile for "role" using "userEmail" from storage
    this.userService.getProfile(this.userService.getEmail()).subscribe({
      next: (res : any) => {
        if(!res.success) {
          console.error("User not found", res);
        }
        else {
          this.loggedUser = res.user;
        }
      },
      error: (err: any) => {
        console.error("User not found error", err);
      }
    })
  }

  private getProductsList() {
    this.prodService.getAllProducts().subscribe({
      next: (res : any) => {
        if(!res.success) {
          console.error("Products not found", res);
        }
        else {
          this.productList = res.items;
        }
      },
      error: (err: any) => {
        console.error("Products not found error", err);
      }
    })
  }

  reloadPage(): void {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  enableAddProduct(): void {
    this.addProductEnabled = true;
    this.editProductEnabled = false;
  }
  submitAddProduct(): void {
    if(this.addProductForm.valid) {
      const addDate = moment(this.addManufactureDate?.value, acceptedDateFormats, true);
      this.addProductForm.patchValue({
        dateOfManufacture: addDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ")
      });
      this.prodService.addProduct(this.addProductForm.value).subscribe({
        next: (res : any) => {
          if(!res.success) { // Add product failed
            console.error("Product not added", res);
          }
          else {
            // disable the Add product form on success
            this.addProductEnabled = false;
            this.reloadPage();
          }
        },
        error: (err: any) => {
          console.error("Product cannot be added", err);
        }
      });
    }
    else {
      this.addProductForm.markAllAsTouched();
    }
  }

  enableEditProduct(productId: string): void {
    this.addProductEnabled = false;
    this.editProductEnabled = true;
    const editableProduct = this.productList.find(
      (product) => {
        return product.productId == productId;
      }
    );

    const editDate = moment(editableProduct.dateOfManufacture, acceptedDateFormats, true);

    this.editProductForm.setValue({
      productId: editableProduct.productId,
      productName: editableProduct.productName,
      productCategory: editableProduct.productCategory,
      dateOfManufacture: editDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ")
    });
  }

  submitEditProduct(): void {
    if(this.editProductForm.valid) {
      const editDate = moment(this.editManufactureDate?.value, acceptedDateFormats, true);
      this.editProductForm.patchValue({
        dateOfManufacture: editDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ")
      });
      this.prodService.editProduct(this.editProductForm.value).subscribe({
        next: (res : any) => {
          if(!res.success) { // Edit product failed
            console.error("Product not edited", res);
          }
          else {
            // disable the Edit product form on success
            this.editProductEnabled = false;
            this.reloadPage();
          }
        },
        error: (err: any) => {
          console.error("Product not updated error", err);
        }
      });
    }
    else {
      this.editProductForm.markAllAsTouched();
    }
  }

  deleteProduct(productId: string, productName: string): void {
    const modalRef = this.modalService.open(DeletemodalComponent, {backdrop: 'static'});
    modalRef.componentInstance.productName = productName;
    modalRef.result
      .then(res => {
        this.prodService.deleteProduct(productId).subscribe({
          next: (res : any) => {
            if(!res.success) {
              console.error("Product not deleted", res);
            }
            else {
              this.reloadPage();
            }
          },
          error: (err: any) => {
            console.error("Product not deleted error", err);
          }
        });
      })
      .catch(err => {
        console.error("modal dismissed", err);
      }
    );
  }

  submitSearch() {
    if(this.searchBy === "dateRange") {
      this.submitSearchProductByDate();    
    }
    else {
      this.submitSearchProduct();
    }
  }

  submitSearchProductByDate(): void {
    const momentStartDate = convertDatepickerToMomentDate(this.searchDateStartQuery);
    const momentEndDate = convertDatepickerToMomentDate(this.searchDateEndQuery);
    if(!(this.isDateValid(momentStartDate) && this.isDateValid(momentEndDate))) {
      this.dateInvalidMsg = "Date(s) invalid, must be like YYYY-MM-DD";
      return;
    }
    if(minDateString(momentStartDate, momentEndDate, moment.HTML5_FMT.DATE) !== momentStartDate) {
      this.dateInvalidMsg = "Start date must be greater then end date";
      return;
    }
    this.dateInvalidMsg = ""; // all invalid cases are out, msg gets back to empty
    this.prodService.searchProductByDate(momentStartDate, momentEndDate).subscribe({
      next: (res : any) => {
        if(!res.success) {
          console.error("Product not searched", res);
        }
        else {
          this.productList = res.items;
        }
      },
      error: (err: any) => {
        console.error("Product not searched error", err);
      }
    });
  }
  private isDateValid(dateString = ""): boolean {
    if(dateString.length > 0) {
      return ! DateStringNoFormValidator(moment.HTML5_FMT.DATE)(dateString);
    }
    return false;
  }

  submitSearchProduct(): void {
    if(!this.searchProductQuery) {
      this.getProductsList();
    }
    else {
      this.prodService.searchProduct(this.searchProductQuery, this.searchBy).subscribe({
        next: (res : any) => {
          if(!res.success) {
            console.error("Product not searched", res);
          }
          else {
            this.productList = res.items;
            // this.reloadPage();
          }
        },
        error: (err: any) => {
          console.error("Product not searched error", err);
        }
      });
    }
  }
  clearSearch(): void {
    this.getProductsList();
    this.searchProductQuery = "";
    this.searchDateStartQuery = undefined;
    this.searchDateEndQuery = undefined;
  }
  onSortDate({column, direction} : any ) {
    // resetting other headers
    this.headers.forEach((header:any) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    // sorting products
    if (direction === '' || column === '') {
      this.getProductsList();
    }
    else {
      this.productList = [...this.productList].sort((a, b) => {
        const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  uploadProducts(): void {
    const modalRef = this.modalService.open(UploadmodalComponent, {backdrop: 'static'});
    let productsArray: any[] = [];
    modalRef.result
      .then(modalRes => {
        productsArray = modalRes;
        this.prodService.addMultipleProducts(productsArray).subscribe({
          next: (res : any) => {
            // res - array of all the responses (success / error) from adding individual product
            if(!res) {
              console.error("Products not uploaded", res);
            }
            else {
              this.reloadPage();
            }
          },
          error: (err: any) => {
            console.error("Products not uploaded error", err);
          }
        });
      })
      .catch(err => {
        console.log("modal dismissed", err);
      }
    );
  }

  downloadProducts(): void {
    const prodWorkbook = XLSX.utils.book_new();
    // filter productList data to remove irrelevant DB fields
    const productDataToWrite = [];
    for (let index = 0; index < this.productList.length; index++) {
      const prod = this.productList[index];
      productDataToWrite.push({
        productName: prod.productName,
        productCategory: prod.productCategory,
        dateOfManufacture: prod.dateOfManufacture
      })
    }
    const prodWorksheet = XLSX.utils.json_to_sheet(productDataToWrite);
    XLSX.utils.book_append_sheet(prodWorkbook, prodWorksheet, "Products");
    const prodFile = this.writeToExcel(prodWorkbook);
  }
  private async writeToExcel(workbook: any) {
    const prodFile = await XLSX.writeFile(workbook, "Products.xlsx");
  }

  isUserAdmin(): boolean {
    return this.loggedUser && this.loggedUser.role === "Admin";
  }
}
