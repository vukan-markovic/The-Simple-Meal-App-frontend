import { Component, OnInit, Input } from '@angular/core';
import { Type } from 'src/app/models/type';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TypeService } from 'src/app/services/type.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-type',
  templateUrl: './update-type.component.html',
  styleUrls: ['./update-type.component.css']
})
export class UpdateTypeComponent implements OnInit {

  @Input() type: Type;
  form: FormGroup;

  errorMessage: string = null;
  success: string = null;
  closeButton: HTMLButtonElement;

  constructor(private typeService: TypeService,private toastr: ToastrService) { }

  ngOnInit() {
    if (this.type == null) {
      this.type = new Type();
    }
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      price: new FormControl(null, [Validators.required, Validators.min(1)]),
      regular: new FormControl(null, Validators.nullValidator)
    });
  }
  
  close() {
    this.form.patchValue(
      {
        'name': this.type.name,
        'price': this.type.price,
        'regular': this.type.regular
      }
    );
  }
  onSubmit() {
    if (this.form.invalid) {
      this.errorMessage = "Please enter a valid data.";
      this.toastr.error( this.errorMessage, 'Update type');
      return;
    }

    const type = new Type(this.form.value.name,
      this.form.value.price, this.form.value.regular, this.type.typeId);

    this.typeService.updateType(type).subscribe(
      data => {
        this.typeService.successEmitter.next(type);
        this.closeButton = document.getElementById("closeButtonUpdateType") as HTMLButtonElement;
        this.closeButton.click();
      },
      message => {
        this.errorMessage = "You cann't create two types with same name and price.";
        this.toastr.error( this.errorMessage, 'Update type');
      }
    );
  }
}