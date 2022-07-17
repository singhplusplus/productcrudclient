import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { api } from "./../../app.config";

@Injectable()
export class ProductService {

  constructor(private http: HttpClient) {}

  getAllProducts() {
    return this.http.get(api.baseUrl + '/product/all');
  }
  addProduct(product: any) {
    // return this.http.get(api.baseUrl + '/product/all');
    return this.http.post(api.baseUrl + '/product/add', product);
  }
  editProduct(product: any) {
    // return this.http.get(api.baseUrl + '/product/all');
    return this.http.post(api.baseUrl + '/product/edit', product);
  }

}