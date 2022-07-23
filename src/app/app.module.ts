import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductComponent } from './user/product/product.component';
import { LoginComponent } from './login/login.component';
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
import { WeatherService } from './weather/weather.service';
import { WeathermodalComponent } from './weather/weathermodal/weathermodal.component';
import { WeathernowcardComponent } from './weather/weathernowcard/weathernowcard.component';
import { NgbdSortableHeaderDirective } from './ngbd/ngbd-sortable-header.directive';
import { LazyLoadImageModule } from 'ng-lazyload-image';

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
    UploadmodalComponent,
    WeathermodalComponent,
    WeathernowcardComponent,
    NgbdSortableHeaderDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LazyLoadImageModule,
    NgbModule
  ],
  providers: [AuthGuard, AuthInterceptorConfig, UserService, WeatherService, ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
