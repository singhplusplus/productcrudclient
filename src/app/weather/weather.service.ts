import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { api } from "./../app.config";

@Injectable()
export class WeatherService {

  constructor(private http: HttpClient) { }

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  getWeather(cityName: string): Observable<any> {
    return this.http.get(api.weatherUrl + cityName, this.noAuthHeader);
  }

}