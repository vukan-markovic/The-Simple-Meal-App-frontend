import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { UserDTO } from 'src/app/models/userDTO';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/app/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html'
})
export class UserProfileComponent implements OnInit {
  userDTO: UserDTO;
  userForm: FormGroup;
  message: string = "";
  enabled: boolean;
  isEnabled: boolean;
  baseurl = environment.baseUrl;

  constructor(private userService: UsersService, private router: Router, private authService: AuthenticationService,
    private toastr: ToastrService) { }

  ngOnInit() {

    this.userService.getUser(this.authService.currentUserValue.email).subscribe(data => {
      this.userDTO = data
    });

    this.userForm = new FormGroup({
      email: new FormControl(null, Validators.email)
    });
  }

  onSubmit() {
    this.userService.updateUserEmail(this.userDTO.userId, this.userDTO.email).subscribe(
      data => {
        this.toastr.success(data, 'User profile');
        this.authService.logout();
        this.router.navigate(['/']);
      }, message => {
        if (message.status != 200)
        this.toastr.error( "This email already exist!", 'User profile');
      }
    );
  }

  emailChange(event: { target: HTMLInputElement; }) {
    if (this.enabled) this.isEnabled = true;
    this.enabled = true;
  }

  onSelectFile(event: { target: HTMLInputElement; }) {
    if (event.target.files && event.target.files[0]) {
      var mimeType = event.target.files[0].type;

      if (mimeType.match(/image\/*/) == null) {
        this.message = "Only images are supported.";
        return;
      }

      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      let formdata: FormData = new FormData();
      formdata.append('file', event.target.files[0]);

      this.userService.addImage(formdata).subscribe(imageFile => {
        if (imageFile) {
          this.userDTO.pathImage = this.baseurl + '/file?imagePath=' + imageFile.image;
          this.userService.updateUserImage(this.userDTO.userId, this.userDTO.pathImage).subscribe(
            data => {
              this.toastr.success(data, 'User profile');
            }, message => {
              if (message.status != 200) 
                 this.toastr.error( "Error!", 'User profile');
            }
          );
        }
      });
    }
  }
}