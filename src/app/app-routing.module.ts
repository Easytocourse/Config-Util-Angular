import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MachineListComponent } from './components/machine-list/machine-list.component';
import { AddMachineComponent } from './components/add-machine/add-machine.component';
import { EditMachineComponent } from './components/edit-machine/edit-machine.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AuthGuard } from './auth.guard';
import { RedirectGuard } from './redirect.guard';
import { DatabaseListComponent } from './components/database-list/database-list.component';
import { OperationsComponent } from './components/operations/operations.component';
import { SignupComponent } from './components/signup/signup.component';
import { AdminComponent } from './components/admin/admin.component';
import { ScheduledJobsDialogComponent } from './components/scheduled-jobs-dialog/scheduled-jobs-dialog.component';

const routes: Routes = [
  { path: '', redirectTo: '/machines', pathMatch: 'full' },
  { path: 'login', component: LoginComponent,canActivate: [RedirectGuard] },
  { path: 'signup', component: SignupComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'machines', component: MachineListComponent, canActivate: [AuthGuard] },
  { path: 'machines/:action', component: MachineListComponent, canActivate: [AuthGuard] },
  { path: 'databases', component: DatabaseListComponent, canActivate: [AuthGuard] },
  { path: 'addmachine', component: AddMachineComponent, canActivate: [AuthGuard] },
  { path: 'machines/:id/edit', component: EditMachineComponent, canActivate: [AuthGuard] },
  { path: 'operations/:hostname', component: OperationsComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'scheduler-jobs', component: ScheduledJobsDialogComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
