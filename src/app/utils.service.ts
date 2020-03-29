import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  carListUrl: string = "https://raw.githubusercontent.com/alelase/cars/master/carList.json";
  engineTypeUrl: string = "https://raw.githubusercontent.com/alelase/cars/master/engineTypes.json";
  modelsUrl: string = "https://raw.githubusercontent.com/alelase/cars/master/models.json";

  constructor(private http: HttpClient) { }

  getCarList(): Observable<any> {
    return this.http.get(this.carListUrl);
  }

  getEngineTypeList(): Observable<any> {
    return this.http.get(this.engineTypeUrl);
  }

  getModels(): Observable<any> {
  return this.http.get(this.modelsUrl);
  }

}
