import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {

  productList : any[] = [];
  addProductForm !: FormGroup;
  editProductForm !: FormGroup;

  addProductEnabled : boolean = false;
  editProductEnabled : boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private prodService: ProductService
    , private router: Router, private activeRoute: ActivatedRoute) {

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
        console.error("Login error", err);
      }
    )
  }

  reloadPage(): void {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  addProductEnable(): void {
    this.addProductEnabled = true;
    this.editProductEnabled = false;
  }
  addProductSubmit(): void {
    console.log(this.addProductForm.value);
    this.addProductEnabled = false;
    this.prodService.addProduct(this.addProductForm.value).subscribe(
      (res : any) => {
        if(!res.success) {
          console.error("Product not added", res);
        }
        else {
          console.log("product added res", res);
          // this.router.navigateByUrl("product");
          this.reloadPage();
          // this.productList.splice(this.productList.length, 0, res.item);
          // this.productList = res.items;
        }
      },
      err => {
        console.error("Login error", err);
      }
    );
  }

  editProductEnable(productId: string): void {
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

  editProductSubmit(): void {
    console.log(this.editProductForm.value);
    this.editProductEnabled = false;
    // const editedProduct = this.editProductForm.value;
    // editedProduct.productId = productId;
    this.prodService.editProduct(this.editProductForm.value).subscribe(
      (res : any) => {
        if(!res.success) {
          console.error("Product not edited", res);
        }
        else {
          console.log("product edited res", res);
          // this.router.navigateByUrl("product");
          this.reloadPage();
          // this.productList.splice(this.productList.length, 0, res.item);
          // this.productList = res.items;
        }
      },
      err => {
        console.error("Login error", err);
      }
    );
  }
  deleteProduct(productId: string): void {

  }

  isUserAdmin(): boolean {
    return 5>4;
  }
}
