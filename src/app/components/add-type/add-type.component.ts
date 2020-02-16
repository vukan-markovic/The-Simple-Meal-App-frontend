import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Type } from 'src/app/models/type';
import { TypeService } from 'src/app/services/type.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-type',
  templateUrl: './add-type.component.html',
  styleUrls: ['./add-type.component.css']
})
export class AddTypeComponent implements OnInit {
  typeForm: FormGroup;
  newType: Type;
  errorMessage: string = null;
  success: string = null;
  closeButton: HTMLButtonElement;

  constructor(private addTypeService: TypeService,private toastr: ToastrService) { }

  displayedColumns: string[] = ['name', 'price', 'regular'];

  ngOnInit() {
    this.typeForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      price: new FormControl(null, [Validators.required, Validators.min(1)]),
      regular: new FormControl(null, Validators.nullValidator)
    });
  }
  
  onSubmit() {
    if (this.typeForm.invalid) {
      this.errorMessage = "Please enter a valid data.";
      return;
    }
    var name = this.typeForm.value.name;
    if(this.typeForm.value.regular){
      name= "Regular " + this.typeForm.value.name;
    }
    var typeForInsert: Type = new Type(name, this.typeForm.value.price, this.typeForm.value.regular);

    this.addTypeService.addType(typeForInsert).subscribe(
          data => {
            this.errorMessage = null;
            this.typeForm.reset();
            this.addTypeService.addTypeSuccessEmitter.next(typeForInsert);
            this.closeButton = document.getElementById("closeAddType") as HTMLButtonElement;
            this.closeButton.click();

          },
          message => {
            this.errorMessage = "There is already a type with a given name and price.";
            this.toastr.error( this.errorMessage, 'Add type');
          }
        );
  }
}