import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weathermodal',
  templateUrl: './weathermodal.component.html',
  styleUrls: ['./weathermodal.component.scss']
})
export class WeathermodalComponent implements OnInit {

  @Input() weatherInfo: any;
  @Input() weatherIcon = "";

  newCityName = "";

  constructor(public activeModal: NgbActiveModal, private weatherService: WeatherService) { }

  ngOnInit(): void {}

  closeModal() {
    this.activeModal.close(this.weatherInfo);
  }
  getWeather() {
    const weatherObsvr = {
      next: (res : any) => {
        if(!res) {
          console.error("Cannot get Weather information");
        }
        else {
          this.weatherInfo = res;
          // this.activeModal.close(res);
        }
      },
      error: (err: any) => {
        console.error("Cannot get Weather information error", err);
      }
    };
    this.weatherService.getWeather(this.newCityName).subscribe(weatherObsvr);
  }
}
