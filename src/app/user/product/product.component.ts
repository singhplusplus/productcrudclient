import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { DeletemodalComponent } from './deletemodal/deletemodal.component';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {

  productList : any[] = [];
  loggedUser: any;
  addProductForm !: FormGroup;
  editProductForm !: FormGroup;
  searchProductQuery = "";

  addProductEnabled : boolean = false;
  editProductEnabled : boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService, 
    private prodService: ProductService, private router: Router, private modalService: NgbModal
  ) {

    this.addProductForm = this.fb.group({
      productName: '',
      productCategory: '',
      dateOfManufacture: ''
    });
    this.editProductForm = this.fb.group({
      productId: '',
      productName: '',
      productCategory: '',
      dateOfManufacture: ''
    });
  }

  ngOnInit(): void {
    this.prodService.getAllProducts().subscribe(
      (res : any) => {
        if(!res.success) {
          console.error("Products not found", res);
        }
        else {
          this.productList = res.items;
        }
      },
      err => {
        console.error("Products not found error", err);
      }
    );

    this.userService.getProfile(this.userService.getEmail()).subscribe(
      (res : any) => {
        if(!res.success) {
          console.error("User not found", res);
        }
        else {
          this.loggedUser = res.user;
        }
      },
      err => {
        console.error("User not found error", err);
      }
    )
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
    console.log(this.addProductForm.value);
    this.addProductEnabled = false;
    this.prodService.addProduct(this.addProductForm.value).subscribe(
      (res : any) => {
        if(!res.success) {
          console.error("Product not added", res);
        }
        else {
          console.log("product added res", res);
          this.reloadPage();
        }
      },
      err => {
        console.error("Product cannot be added", err);
      }
    );
  }

  enableEditProduct(productId: string): void {
    this.addProductEnabled = false;
    this.editProductEnabled = true;
    const editableProduct = this.productList.find(
      (product) => {
        return product.productId == productId;
      }
    );

    this.editProductForm.setValue({
      productId: editableProduct.productId,
      productName: editableProduct.productName,
      productCategory: editableProduct.productCategory,
      dateOfManufacture: editableProduct.dateOfManufacture
    });
  }

  submitEditProduct(): void {
    console.log(this.editProductForm.value);
    this.editProductEnabled = false;
    this.prodService.editProduct(this.editProductForm.value).subscribe(
      (res : any) => {
        if(!res.success) {
          console.error("Product not edited", res);
        }
        else {
          console.log("product edited res", res);
          this.reloadPage();
        }
      },
      err => {
        console.error("Product not updated error", err);
      }
    );
  }

  deleteProduct(productId: string, productName: string): void {
    const modalRef = this.modalService.open(DeletemodalComponent, {backdrop: 'static'});
    modalRef.componentInstance.productName = productName;
    modalRef.result
      .then(res => {
        console.log("res modal closed", res);
        this.prodService.deleteProduct(productId).subscribe(
          (res : any) => {
            if(!res.success) {
              console.error("Product not deleted", res);
            }
            else {
              console.log("product deleted", res);
              this.reloadPage();
            }
          },
          err => {
            console.error("Product not deleted error", err);
          }
        );
      })
      .catch(err => {
        console.log("res modal dismissed", err);
      }
    );
  }

  submitSearchProduct(): void {
    console.log(this.searchProductQuery);
    if(!this.searchProductQuery) {
      this.prodService.getAllProducts().subscribe(
        (res : any) => {
          if(!res.success) {
            console.error("Products not found", res);
          }
          else {
            this.productList = res.items;
          }
        },
        err => {
          console.error("Products not found error", err);
        }
      )
    }
    else {
      this.prodService.searchProduct(this.searchProductQuery).subscribe(
        (res : any) => {
          if(!res.success) {
            console.error("Product not searched", res);
          }
          else {
            console.log("product searched res", res);
            this.productList = res.items;
            // this.reloadPage();
          }
        },
        err => {
          console.error("Product not searched error", err);
        }
      );
    }
  }

  uploadProducts(): void {}
  downloadProducts(): void {}

  isUserAdmin(): boolean {
    return this.loggedUser && this.loggedUser.role === "Admin";
  }
}
