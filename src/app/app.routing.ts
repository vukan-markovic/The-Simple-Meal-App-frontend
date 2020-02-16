import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { AddMenuComponent } from './components/add-menu/add-menu.component';
import { AddTypeComponent } from './components/add-type/add-type.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { CanDeactivateGuard } from './services/can-deactivate-guard.service';
import { WeeklyMenuComponent } from './components/weekly-menu/weekly-menu.component';
import { AuthGuard } from './_helpers/auth.guard';
import { AdminGuard } from './_helpers/admin.guard';
import { TodayOrders } from './components/todayOrders/todayOrders.component';
import { TableTypesComponent } from './components/table-types/table-types.component';
import { AdminOrders } from './components/admin-all-orders/admin-orders.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UsersComponent } from './components/users/users.component';
import { TableMealsComponent } from './components/table-meals/table-meals.component';

import { UpdateWeeklyMenuComponent } from './components/update-weekly-menu/update-weekly-menu.component';

import { OrderCancelingComponent } from './components/order-canceling/order-canceling.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { EmailInputComponent } from './components/email-input/email-input.component';


const routes: Routes = [
    { path: '', component: HomePageComponent, pathMatch: 'full', canActivate: [AuthGuard] },
    { path: 'types', component: TableTypesComponent, canActivate: [AdminGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegistrationComponent, canDeactivate: [CanDeactivateGuard] },
    { path: 'addMenu', component: AddMenuComponent, canActivate: [AdminGuard] },
    { path: 'addType', component: AddTypeComponent, canActivate: [AdminGuard] },
    { path: 'weeklyMenu', component: WeeklyMenuComponent, canActivate: [AuthGuard] },
    { path: 'meals', component: TableMealsComponent, canActivate: [AuthGuard] },
    { path: 'todayOrders', component: TodayOrders, canActivate: [AuthGuard] },
    { path: 'admin/seeAllOrders', component: AdminOrders, canActivate: [AuthGuard] },
    { path: 'updateWeeklyMenu', component: UpdateWeeklyMenuComponent, canActivate: [AuthGuard] },
    { path: 'updateWeeklyMenu/:id', component: UpdateWeeklyMenuComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
    { path: 'users', component: UsersComponent, canActivate: [AdminGuard] },
    { path: 'orderCanceling', component: OrderCancelingComponent, canActivate: [AuthGuard] },
    { path: 'resetPassword', component: ResetPasswordComponent },
    { path: 'email', component: EmailInputComponent },
    { path: '**', redirectTo: '' }
];

export const appRoutes = RouterModule.forRoot(routes);