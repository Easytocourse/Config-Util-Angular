import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MachineListComponent } from './components/machine-list/machine-list.component';
import { AddMachineComponent } from './components/add-machine/add-machine.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HeaderComponent } from './components/header/header.component';
import { MatCardModule } from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import {EditMachineComponent } from './components/edit-machine/edit-machine.component';
import {MachineService } from './services/machine.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import { MachineProfileComponent } from './components/machine-profile/machine-profile.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './services/AuthInterceptor';
import { MatTooltip } from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DatabaseListComponent } from './components/database-list/database-list.component';
import { DatabaseActionDialogComponent } from './components/database-action-dialog/database-action-dialog.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { DatabaseService } from './services/DatabaseService';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { OperationsComponent } from './components/operations/operations.component';
import { FileService } from './services/file.service';
import { SignupComponent } from './components/signup/signup.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminService } from './services/admin.service';
import { MatOption } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ScheduledJobsDialogComponent } from './components/scheduled-jobs-dialog/scheduled-jobs-dialog.component';
import { ScheduledJobService } from './services/scheduled-job.service';
import { EditJobDialogComponent } from './components/edit-job-dialog/edit-job-dialog.component';
import { FileDialogStreamComponent } from './components/file-dialog-stream/file-dialog-stream.component';


@NgModule({
  declarations: [
    AppComponent,
    MachineListComponent,
    AddMachineComponent,
    HeaderComponent,
    EditMachineComponent,
    MachineProfileComponent,
    LoginComponent,
    LogoutComponent,
    DatabaseListComponent,
    DatabaseActionDialogComponent,
    OperationsComponent,
    SignupComponent,
    AdminComponent,
    ScheduledJobsDialogComponent,
    EditJobDialogComponent,
    FileDialogStreamComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatIconModule,
    MatGridListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatCardModule,
    MatDividerModule,
    MatDialogModule,
    MatExpansionModule,
    ToastrModule.forRoot(), 
    MatTooltip,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatOption,
    MatSelectModule,
    MatDatepickerModule
  ],
  providers: [
    provideAnimationsAsync(),
    MachineService,
    DatabaseService,
    AuthService,
    AuthInterceptor,
    FileService,
    AdminService,
    MatDatepickerModule,
    ScheduledJobService,
     { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
