import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { api } from "./../app.config";

@Injectable()
export class WeatherService {

  constructor(private http: HttpClient) { }

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  getWeather(cityName: string) {
    return this.http.post(api.weatherUrl + cityName, this.noAuthHeader);
  }

}