import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { pluck } from 'rxjs';
import { UserService } from './user/user.service';
import { WeatherService } from './weather/weather.service';
import { WeathermodalComponent } from './weather/weathermodal/weathermodal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  weatherIconObs: any;
  defaultCityName = 'Indore';
  weatherInfo: any;

  constructor(private router: Router, private userService: UserService,
     private weatherService: WeatherService, private modalService: NgbModal) {}

  ngOnInit() {
    this.getWeatherInfo(this.defaultCityName);
  }

  onLogout() {
    this.userService.deleteToken();
    this.userService.deleteEmail();
    this.router.navigateByUrl('/login');
  }

  userLoggedIn() : boolean {
    return this.userService.isLoggedIn();
  }

  openWeatherModal(icon: string) {
    console.log("modal opened", icon);
    const modalRef = this.modalService.open(WeathermodalComponent, {backdrop: 'static'});
    modalRef.componentInstance.weatherInfo = this.weatherInfo;
    modalRef.componentInstance.weatherIcon = icon;
    modalRef.result
      .then(
        res => {
          console.log("res modal closed", res);
          this.weatherInfo = res;
        }
      )
      .catch(
        err => {
          console.log("res modal dismissed", err);
        }
      );
  }

  private getWeatherInfo(cityName: string) {
    const res = this.weatherService.getWeather(cityName);
    res.subscribe({
        next: (res : any) => {
          if(!res) {
            console.error("Cannot get Weather information");
          }
          else {
            console.log(res);
            this.weatherInfo = res;
          }
        },
        error: (err: any) => {
          console.error("Cannot get Weather information error", err);
        }
      }
    );
    this.weatherIconObs = res.pipe(
      pluck("current", "condition", "icon")
    );
  }
}
