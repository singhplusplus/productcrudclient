import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { api } from "./../../app.config";

@Injectable()
export class ProductService {
  
  constructor(private http: HttpClient) {}

  getAllProducts() {
    return this.http.get(api.baseUrl + '/product/all');
  }
  addProduct(product: any) {
    return this.http.post(api.baseUrl + '/product/add', product);
  }
  addMultipleProducts(productsArray: any[]) {
    const productsArrayBody = {productsArray: productsArray};
    return this.http.post(api.baseUrl + '/product/addmultiple', productsArrayBody);
  }
  editProduct(product: any) {
    return this.http.post(api.baseUrl + '/product/edit', product);
  }
  deleteProduct(productId: string) {
    // const deleteBody = {productId: productId};
    return this.http.delete(api.baseUrl + `/product/delete/${productId}`);
  }
  searchProduct(searchText: string, searchBy: string) {
    return this.http.get(api.baseUrl + `/product/search/${searchText}?searchby=${searchBy}`);
  }
  searchProductByDate(startDate: string, endDate: string) {
    return this.http.get(api.baseUrl + `/product/searchbydate/?startdate=${startDate}&enddate=${endDate}`);
  }
}