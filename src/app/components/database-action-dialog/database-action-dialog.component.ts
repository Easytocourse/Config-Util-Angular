import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DatabaseService } from '../../services/DatabaseService';

@Component({
  selector: 'app-database-action-dialog',
  templateUrl: './database-action-dialog.component.html',
  styleUrl: './database-action-dialog.component.css'
})
export class DatabaseActionDialogComponent {


  dbInfoForm: FormGroup;
  dbInfo: any;
  showDbInfoSection: { [key: string]: boolean } = {};
  showspinner=false; 
  dbDetails: any;
  clearResult: any;
  errorMessage: any;
  errorRootCause:any;
  constructor(private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DatabaseActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private fb: FormBuilder,
    private databaseService: DatabaseService
  ) {
    this.dbInfoForm = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  toggleShowDbInfo(schema: string): void {
    this.showDbInfoSection[schema] = !this.showDbInfoSection[schema];
  }

  fetchDbInfo(schema: string): void {
    this.showspinner=true;
    const { username, password } = this.dbInfoForm.value;
    const dbDetails = {
      ipAddress: this.data.ipAddress,
      typeOfDb: this.data.typeOfDb,
      port: this.data.port,
      schema,
      username,
      password
    };

    this.databaseService.getDbInfo(dbDetails).subscribe(info => {
      this.showspinner=false;
      this.dbDetails = info;
      this.errorMessage = null;
      this.errorRootCause = null;
    }, 
      error => {
        this.showspinner=false;
        this.errorMessage = error.error.message;
        this.errorRootCause = error.error.rootCause;
        this.snackBar.open('Failed to fetch database details', 'Close', {
        duration: 2000
      });
    });
  }

  clearDbDetails(): void {
    this.dbDetails = null; // Clear dbDetails when Clear button is clicked
  }
  clearDbDetailsresults() {
    this.clearResult = null;
  }

  clearSchema(schema: string): void {
    const { username, password } = this.dbInfoForm.value;
    const dbDetails = {
      ipAddress: this.data.ipAddress,
      typeOfDb: this.data.typeOfDb,
      port: this.data.port,
      schema,
      username,
      password
    };
    // Implement logic to clear schema
    this.showspinner=true;
    this.databaseService.clearschema(dbDetails).subscribe(response => {
      this.showspinner=false;
      this.clearResult = response;
      this.errorMessage = null;
      this.errorRootCause = null;
      this.snackBar.open('Schema cleared successfully!', 'Close', {
        duration: 2000
      });
    }, error => {
      this.showspinner=false;
      this.errorMessage = error.error.message;
      this.errorRootCause = error.error.rootCause;
      this.snackBar.open('Failed to clear schema', 'Close', {
        duration: 2000
      });
    });
  }

  }

