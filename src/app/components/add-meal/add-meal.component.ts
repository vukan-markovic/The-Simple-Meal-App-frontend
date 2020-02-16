import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Type } from 'src/app/models/type';
import { MealService } from 'src/app/services/meal.service';
import { TypeService } from 'src/app/services/type.service';
import { InsertMealDTO } from 'src/app/models/inserMealDTO';
import { Meal } from 'src/app/models/meal';
import { MatSnackBar } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-meal',
  templateUrl: './add-meal.component.html',
  styleUrls: ['./add-meal.component.css']
})
export class AddMealComponent implements OnInit {
  form: FormGroup;
  types: Type[] = [];
  showPrice: boolean;
  isRegular: boolean = true;
  earlyorder: boolean;
  errorMessage: string = null;
  success: string = null;
  currentType: Type;
  price: number;
  typesEmpty: boolean = true;
  length: number;
  closeButton: HTMLButtonElement; 

  regularTypes: Type[] = [];

  constructor(private typeService: TypeService, private mealService: MealService, private _snackBar: MatSnackBar,private toastr: ToastrService) { }

  ngOnInit() {
  
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      earlyOrder: new FormControl(null),
      nameType: new FormControl(null, Validators.required),
      price: new FormControl()
    });

    this.getTypes();
  }

  getTypes(){
    this.typeService.getAllType().subscribe(types => {
      if (types != null && types.length != 0) {
        this.types = types;
        this.typesEmpty = false;

        this.regularTypes = this.types.filter(type => type.regular);

        this.types = this.types.filter(type => !type.regular);
        this.length = this.types.push(new Type("regular",1,true));
        
        this.form.patchValue(
          {
            'nameType':this.types[this.length-1]
          }
        );
        this.currentType=this.types[this.length-1];
        this.onChange(this.currentType);
      }
    });
  }

  onChange(type: Type) {

    if (this.form.value.nameType.name != "regular") {
      this.showPrice = true;
      this.isRegular = false;
    } else {
      this.showPrice = false;
      this.isRegular = true;
    }
  }

  onSubmit() {

    if (this.form.invalid) {
      this.errorMessage = "Please enter a valid data.";
      this.toastr.error(  this.errorMessage, 'Add meal');
      return;
    }

    if (!this.isRegular && (this.form.value.price == null || this.form.value.price < 0)) {
      this.errorMessage = "Please enter a price.";
      this.toastr.error(  this.errorMessage, 'Add meal');
      return;
    }

    if (this.isRegular) {
      this.price = 0;
    } else {
      this.price = this.form.value.price;
    }
    if (this.form.value.earlyOrder == null) {
      this.earlyorder = false;
    } else {
      this.earlyorder = true;
    }

    var insertMealDTO: InsertMealDTO;

    if(this.currentType.name==="regular"){

      var  meal: Meal =  new Meal();
      meal.setName(this.form.value.name);
      meal.setDescription(this.form.value.description);
      meal.setEarlyOrder(this.earlyorder);
      meal.setRegular(true);

      insertMealDTO = new InsertMealDTO(meal,
           this.regularTypes);
    }else{
      var  meal: Meal =  new Meal();
      meal.setName(this.form.value.name);
      meal.setDescription(this.form.value.description);
      meal.setEarlyOrder(this.earlyorder);
      meal.setRegular(false);
      insertMealDTO = new InsertMealDTO( meal,
        [this.currentType]);
    }
    
    this.mealService.addMeal(insertMealDTO).subscribe(
      data => {
        this.form.reset();
        this.showPrice = false;
        this.isRegular = true;  
        this.mealService.successEmitter.next(insertMealDTO);
        this.closeButton =document.getElementById("closeButtonAddMeal") as HTMLButtonElement;
        this.closeButton.click();
       },
      message => {
          this.errorMessage = "Error occurred while making a meal.";
          this.toastr.error(this.errorMessage, 'Add meal');
        }
      
    );
  }


}