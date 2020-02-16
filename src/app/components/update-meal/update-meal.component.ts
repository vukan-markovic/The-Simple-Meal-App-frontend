import { Component, OnInit, Input } from '@angular/core';
import { Meal } from 'src/app/models/meal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MealService } from 'src/app/services/meal.service';
import { MealUpdate } from 'src/app/models/updateMeal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-meal',
  templateUrl: './update-meal.component.html',
  styleUrls: ['./update-meal.component.css']
})
export class UpdateMealComponent implements OnInit {
  @Input() meal: Meal;
  form: FormGroup;
  errorMessage: string = null;
  success: string = null;
  successUpdate: boolean = false;
  closeButton: HTMLButtonElement; 

  constructor(private mealService: MealService,private toastr: ToastrService) { }

  ngOnInit() {
    if (this.meal == null) {
      this.meal = new Meal();
    }
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      earlyOrder: new FormControl(null),
    });
  }

  close(){
    this.form.patchValue(
      {
        'name': this.meal.name,
        'description': this.meal.description,
        'earlyOrder': this.meal.earlyOrder
      }
    )
  }
  onSubmit() {
    if (this.form.invalid) {
      this.errorMessage = "Please enter a valid data.";
      this.toastr.error(  this.errorMessage, 'Update meal');
      return;
    }

    const updateMeal1 = new MealUpdate(
      this.meal.mealId,
      this.form.value.name,
      this.form.value.description,
      this.form.value.earlyOrder
    );

    this.mealService.updateMeal(updateMeal1).subscribe(
      data => {
        this.mealService.successEmitterUpdate.next(updateMeal1);
        this.closeButton =document.getElementById("closeButtonUpdateMeal") as HTMLButtonElement;
        this.closeButton.click();
      },
      message => {
          this.errorMessage = "Error occurred while altering a type.";
          this.toastr.error(  this.errorMessage, 'Update meal');
      }
    );
  }
}