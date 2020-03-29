import { Component, OnInit,Output, EventEmitter,Input,OnChanges,SimpleChanges } from '@angular/core';
import { UtilsService } from '../utils.service';
import { Car } from '../car';
import { EngineType } from '../engine-type';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit {

  cars: Car[] = [];
  engineTypes: EngineType[] = [];

  engineFilter: string;


  @Input()
  carFromParent: Car = new Car();

  constructor(private srv: UtilsService) { this.engineFilter = "All"; }

  ngOnInit(): void {
    if (sessionStorage["engineTypes"] == null || sessionStorage["engineTypes"]==undefined) {
      this.srv.getEngineTypeList().subscribe(data => { this.loadEngineTypes(data); this.getCarList();}, error => console.log(error));
    }
    else {
      this.engineTypes = JSON.parse(sessionStorage["engineTypes"]); this.getCarList();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.carFromParent && sessionStorage["allCars"] !=undefined) {
      var allCars = JSON.parse(sessionStorage["allCars"]);
      //only if car doesn't already exist- add it
      if (this.isCarExist(this.carFromParent, allCars) == false) {
        allCars.push(changes.carFromParent.currentValue);
        sessionStorage["allCars"] = JSON.stringify(allCars);
        this.setCarsByChangeEngineType(this.engineFilter);
      }
      
    }
  }
  isCarExist(carFromParent: Car, allCars:Car[]):boolean {
    for (var i = 0; i < allCars.length; i++) {
      if (allCars[i].plate == carFromParent.plate) {
        return true;
      }
    }
    return false;
  }

  getCarList() {
    
    this.srv.getCarList().subscribe(resp => {
      this.loadCars(resp); 
    }, err => { console.log(err); });
  }
  loadCars(resp: any[]) {
    this.cars = [];
    for (var i = 0; i < resp.length; i++) {
      if (this.isValidEngineType(resp[i].engine)){
        var carTemp = new Car();
        carTemp.engine = resp[i].engine;
        carTemp.markerAndModel = resp[i].makerAndModel;
        carTemp.plate = resp[i].plate;
        this.cars.push(carTemp);
      }
      
    }
    sessionStorage["allCars"] = JSON.stringify(this.cars);
  }

  isValidEngineType(enginename: string) {
    for (var i = 0; i < this.engineTypes.length; i++) {
      if (this.engineTypes[i].name == enginename)
        return true;
    }
    return false;
  }

  

  setCarsByChangeEngineType(engineName: string) {

    this.engineFilter = engineName;
    this.cars = [];
    var allCars = JSON.parse(sessionStorage["allCars"]);

    if (allCars != null) {
      if (engineName != "All") {
        this.cars = allCars.filter(x => x.engine == engineName);
      }
      else {
        this.cars = allCars;
      }
      
    }
  }

  loadEngineTypes(data: any[]) {

    this.engineTypes = [];


    var engineType = new EngineType();
    engineType.id = 0;
    engineType.name = "All";
    this.engineTypes.push(engineType);
    

    for (var i = 0; i < data.length; i++) {
      engineType = new EngineType();
      engineType.id = data[i].id;
      engineType.name = data[i].name;
      this.engineTypes.push(engineType);
    }

    sessionStorage["engineTypes"] = JSON.stringify(this.engineTypes);


  }

 

}
