import { Component, OnInit } from '@angular/core';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { UtilsService } from '../utils.service';
import { EngineType } from '../engine-type';
import { CarModel } from '../car-model';
import { Car } from '../car';

@Component({
  selector: 'app-managecars',
  templateUrl: './managecars.component.html',
  styleUrls: ['./managecars.component.css']
})
export class ManagecarsComponent implements OnInit {
  engineTypes: EngineType[] = [];
  models: CarModel[] = [];
  engineTypeFilter: number = 0;
  newCar: Car;
  isValidNewCar: boolean;
  isValidPlatenum: boolean;

  constructor(private srv: UtilsService) {  }

  ngOnInit(): void {

    if (sessionStorage["engineTypes"] == null) {
      this.srv.getEngineTypeList().subscribe(data => { this.loadEngineTypes(data); this.getModels();}, error => console.log(error));
    }
    else {
      this.engineTypes = JSON.parse(sessionStorage["engineTypes"]);
      if (this.engineTypes.length > 0 && this.engineTypes[0].id == 0) {
        this.engineTypes[0].name = "-Select-";
      }
      this.getModels();
    }

    this.isValidNewCar = true;

    
    
    
  }

  getModels() {
    
    if (sessionStorage["carModels"] == null) {
      this.srv.getModels().subscribe(response => { this.loadModels(response); }, err => console.log(err));
    }
    else {
      this.models = JSON.parse(sessionStorage["carModels"]);
    }
    
  }

  loadEngineTypes(data: any[]) {

    this.engineTypes = [];


    var engineType = new EngineType();
    engineType.id = 0;
    engineType.name = "-Select-";
    this.engineTypes.push(engineType);


    for (var i = 0; i < data.length; i++) {
      engineType = new EngineType();
      engineType.id = data[i].id;
      engineType.name = data[i].name;
      this.engineTypes.push(engineType);
    }

    sessionStorage["engineTypes"] = JSON.stringify(this.engineTypes);
 
  }

  @HostListener('keyup', ['$event']) onKeyPress(event) {

    if (event.target.value.trim() == "")
      this.isValidPlatenum = false;
    else
      this.isValidPlatenum = true;
  }

  
  @HostListener('keydown', ['$event']) onKeyDown(event) {
    this.isValidNewCar = true;
    let e = <KeyboardEvent>event;
    
      if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+C
        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+V
        (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+X
        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39))
      {
       
        // don't do anything
        return;
      }
      // Check that it is a number
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
   
  }

  addCar(enginetype: number, platenum: string, modelid:number) {
    
    //only number:
    var pattern = /^\d+$/;
    if (this.isValidEngineType(enginetype) && this.isValidModel(modelid) && platenum.trim() != "" && pattern.test(platenum)) {
      this.isValidNewCar = true;
      var carEntity = new Car();
      carEntity.engine = this.getEngineTypeName(enginetype);
      carEntity.markerAndModel = this.getModelName(modelid);
      carEntity.plate = platenum;
      this.newCar = carEntity;
    }
    else {
      this.isValidNewCar = false;
    }
    
  }

  engineTypeChange(enginetype: number) {
    this.engineTypeFilter = enginetype;
    this.setModelsByChangeEngineType(enginetype);
    this.isValidNewCar = true;
  }

  setModelsByChangeEngineType(enginetype: number) {
    this.models = [];
    var allModels = JSON.parse(sessionStorage["carModels"]);

    if (allModels != null) {
      if (enginetype != 0) {
        this.models = allModels.filter(x => x.engineType == enginetype);
      }
      else {
        this.models = allModels;
      }

    }
  }

  loadModels(data: any[]) {

    this.models = [];

    var carmodel = null;
    

    for (var i = 0; i < data.length; i++) {
      if (this.isValidEngineType(data[i].engineType) == true) {
        carmodel = new CarModel();
        carmodel.id = data[i].id;
        carmodel.name = data[i].name;
        carmodel.engineType = data[i].engineType;
        this.models.push(carmodel);
      }
      
    }

    sessionStorage["carModels"] = JSON.stringify(this.models);
  }

  isValidEngineType(engineid: number) {
    for (var i = 0; i < this.engineTypes.length; i++) {
      if (this.engineTypes[i].id == engineid)
        return true;
    }
    return false;
  }

  isValidModel(modelid: number) {
    for (var i = 0; i < this.models.length; i++) {
      if (this.models[i].id == modelid)
        return true;
    }
    return false;
  }

  getModelName(modelid: number) {
    for (var i = 0; i < this.models.length; i++) {
      if (this.models[i].id == modelid)
        return this.models[i].name;
    }
    return "";
  }

  getEngineTypeName(engineid: number) {
    for (var i = 0; i < this.engineTypes.length; i++) {
      if (this.engineTypes[i].id == engineid)
        return this.engineTypes[i].name;
    }
    return "";
  }



}
