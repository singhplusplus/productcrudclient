import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weathermodal',
  templateUrl: './weathermodal.component.html',
  styleUrls: ['./weathermodal.component.scss']
})
export class WeathermodalComponent implements OnInit, OnDestroy {

  @Input() weatherInfo: any;
  @Input() weatherIcon = "";

  newCityName = "";
  isLoading = false;

  weatherSubscription: Observable<any> | any;

  constructor(public activeModal: NgbActiveModal, private weatherService: WeatherService) { }

  ngOnInit(): void {}

  closeModal() {
    this.activeModal.close(this.weatherInfo);
  }
  getWeather() {
    this.isLoading = true;
    const weatherObsvr = {
      next: (res : any) => {
        this.isLoading = false;
        if(!res) {
          console.error("Cannot get Weather information");
        }
        else {
          this.weatherInfo = res;
          // this.activeModal.close(res);
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error("Cannot get Weather information error", err);
      }
    };
    this.weatherSubscription = this.weatherService.getWeather(this.newCityName).subscribe(weatherObsvr);
  }

  ngOnDestroy() {
    if(this.weatherSubscription) {
      this.weatherSubscription.unsubscribe();
    }
  }

}
