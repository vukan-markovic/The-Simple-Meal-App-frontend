import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { JwtInterceptor } from './_helpers/jwt.interrceptor';
import { appRoutes } from './app.routing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { environment } from '../environments/environment';
import { MessagingService } from './services/messaging.service';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireModule } from '@angular/fire'
import { RemoveQuotes } from './_helpers/replace.pipe';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { MatInputModule } from '@angular/material/input';
import { MaterialModule } from './material-module';
import { MatButtonModule, MatCheckboxModule, MatNativeDateModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { WeeklyMenuService } from './services/weekly-menu.service';
import { DailyMenuService } from './services/daily-menu.service';
import { MealService } from './services/meal.service';
import { TypeService } from './services/type.service';
import { RegistrationService } from './services/registration.service';
import { OrderService } from './services/order.service';
import { UsersService } from './services/users.service';

import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';
import { WeeklyMenuComponent } from './components/weekly-menu/weekly-menu.component';
import { AddMealComponent } from './components/add-meal/add-meal.component';
import { LoginComponent } from './components/login/login.component';
import { AppComponent } from './app.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AddMenuComponent } from './components/add-menu/add-menu.component';
import { AddTypeComponent } from './components/add-type/add-type.component';
import { CanDeactivateGuard } from './services/can-deactivate-guard.service';
import { HeaderComponent } from './components/header/header.component';
import { TodayOrders } from './components/todayOrders/todayOrders.component';
import { ChosenOneService } from './services/chosenOne.service';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { TableTypesComponent } from './components/table-types/table-types.component';
import { AdminOrders } from './components/admin-all-orders/admin-orders.component';
import { UsersComponent } from './components/users/users.component';

import { FilterPipe } from './pipes/filter.pipe';
import { TableMealsComponent } from './components/table-meals/table-meals.component';
import { UpdateTypeComponent } from './components/update-type/update-type.component';
import { UpdateMealComponent } from './components/update-meal/update-meal.component';
import { OrderCancelingComponent } from './components/order-canceling/order-canceling.component';
import { UpdateWeeklyMenuComponent } from './components/update-weekly-menu/update-weekly-menu.component';
import { UpdateDailyMenuComponent } from './components/update-daily-menu/update-daily-menu.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { EmailInputComponent } from './components/email-input/email-input.component';
import { ToastrModule } from 'ngx-toastr';

import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ErrorInterceptor } from './_helpers/error.interceptor';


export const firebaseConfig = {
  apiKey: "AIzaSyAHLwr7Z1H8P-E0i1HXdpg3ZsArjdjaUYQ",
  authDomain: "food-delivery-app-c755a.firebaseapp.com",
  databaseURL: "https://food-delivery-app-c755a.firebaseio.com",
  projectId: "food-delivery-app-c755a",
  storageBucket: "",
  messagingSenderId: "346187148064",
  appId: "1:346187148064:web:5194f7eb67d56c788b4545"
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      tapToDismiss: true
    }),
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatMomentDateModule,
    MatNativeDateModule,
    MatFormFieldModule,
    HttpClientModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    appRoutes,
    FlashMessagesModule.forRoot(),
    MaterialModule
  ],
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginComponent,
    AddMenuComponent,
    AddMealComponent,
    AddTypeComponent,
    RegistrationComponent,
    HeaderComponent,
    ModalDialogComponent,
    WeeklyMenuComponent,
    RemoveQuotes,
    TodayOrders,
    UserProfileComponent,
    TableTypesComponent,
    AdminOrders,
    UsersComponent,
    TableMealsComponent,
    UpdateTypeComponent,
    UpdateMealComponent,
    TableTypesComponent,
    FilterPipe,
    OrderCancelingComponent,
    UpdateWeeklyMenuComponent,
    UpdateDailyMenuComponent,
    ResetPasswordComponent,
    EmailInputComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    WeeklyMenuService, DailyMenuService, MealService, TypeService, RegistrationService, CanDeactivateGuard, OrderService, MessagingService,
    ChosenOneService, UsersService
  ],
  exports: [
    FilterPipe
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }