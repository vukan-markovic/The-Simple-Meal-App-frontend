import { Component, OnInit } from '@angular/core';
import { WeeklyMenuService } from 'src/app/services/weekly-menu.service';
import { WeeklyMenu } from 'src/app/models/weeklyMenu';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { environment } from 'src/app/environment';
import { FlashMessagesService } from 'angular2-flash-messages';
import { WeeklyMenuWithId } from 'src/app/models/WeeklyMenuWithId';
import { MatSnackBar } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.css'], 
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'ja-JP'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {strict: true}}
  ],
})
export class AddMenuComponent implements OnInit {
  form: FormGroup;
  errorMessage: string = null;
  success: string = null;
  message: string = "";
  weeklyMenu: WeeklyMenu = new WeeklyMenu();
  pipe = new DatePipe('en-US');
  minDate = new Date();
  minDateOut = this.pipe.transform(this.minDate, 'yyyy-MM-dd');
  baseurl = environment.baseUrl;

  constructor(private weeklyMenuService: WeeklyMenuService, private router: Router,
    private _snackBar: MatSnackBar, private toastr: ToastrService, private _adapter: DateAdapter<any>) { }

  ngOnInit() {

    this._adapter.setLocale('en-GB');

    this.form = new FormGroup({
      dateFrom: new FormControl(null, Validators.required),
      dateTo: new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.errorMessage = "Please enter a valid data.";
      this.toastr.error(  this.errorMessage, 'Add menu');
      return;
    }

    if (this.form.value.dateFrom > this.form.value.dateTo) {
    
      this.errorMessage = "Date from must be before date to.";
      this.toastr.error(  this.errorMessage, 'Add menu');
      return;
    }

    this.weeklyMenu.from = this.form.value.dateFrom,
    this.weeklyMenu.to = this.form.value.dateTo,

      this.weeklyMenuService.addWeeklyMenu(this.weeklyMenu).subscribe(
        (data:WeeklyMenuWithId) => {
          this.errorMessage = null;
          this.form.reset();
          this.success = "Successfully added a new weekly menu.";
          this.toastr.success(this.success, 'Add menu');
          this.router.navigate(['/updateWeeklyMenu/',data.weaklyMenuId]);
        },
        message => {
            this.toastr.error("Already exist weekly menu for this week or day.", 'Add menu');
        }
      );;
  }

  onSelectFile(event: { target: HTMLInputElement; }) {
    if (event.target.files && event.target.files[0]) {
      var mimeType = event.target.files[0].type;

      if (mimeType.match(/image\/*/) == null) {
        this.errorMessage = "Only images are supported.";
        this.toastr.error(  this.errorMessage, 'Add menu');
        return;
      }
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      let formdata: FormData = new FormData();
      formdata.append('file', event.target.files[0]);

      this.weeklyMenuService.addImage(formdata).subscribe(imageFile => {
        if (imageFile) {
          this.weeklyMenu.image = this.baseurl + '/file?imagePath=' + imageFile.image;
        }
      });
    }
  }
}