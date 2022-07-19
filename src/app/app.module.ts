import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductComponent } from './user/product/product.component';
import { LoginComponent } from './login/login.component';
import { AgGridModule } from 'ag-grid-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SignupComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from './user/user.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth.interceptor';
import { NotfoundComponent } from './notfound/notfound.component';
import { ProductService } from './user/product/product.service';
import { DeletemodalComponent } from './user/product/deletemodal/deletemodal.component';
import { UploadmodalComponent } from './user/product/uploadmodal/uploadmodal.component';

const AuthInterceptorConfig = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true
}

@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    LoginComponent,
    SignupComponent,
    NotfoundComponent,
    DeletemodalComponent,
    UploadmodalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    NgbModule
  ],
  providers: [AuthGuard, AuthInterceptorConfig, UserService, ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
