import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Machine } from '../../models/machine';
import { MachineService } from '../../services/machine.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-machine',
  templateUrl: './add-machine.component.html',
  styleUrls: ['./add-machine.component.css']
})
export class AddMachineComponent implements OnInit {
  machineForm!: FormGroup;
  dbTypes: string[] = ['MySQL', 'PostgreSQL', 'Oracle', 'SQLServer', 'SQLite', 'MongoDB', 'MariaDB'];
  ldapTypes:string[]=['OPENLDAP','OTDS','MSAD'];
  constructor(private fb: FormBuilder, private http: HttpClient,private machineservice:MachineService,private toaster:ToastrService
    ,public router:Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.machineForm = this.fb.group({
      machineName: ['', Validators.required],
      ipAddress: ['', [Validators.required, Validators.pattern('^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')]],
      status: ['', Validators.required],
      type: ['', Validators.required],
      databases: this.fb.array([]),
      ldaps: this.fb.array([])
    });
  }

  get schemas() {
    return this.machineForm.get('schemas') as FormArray;
  }
  get databases(): FormArray {
    return this.machineForm.get('databases') as FormArray;
  }
  get ldaps(): FormArray {
    return this.machineForm.get('ldaps') as FormArray;
  }

  // Method to remove a schema control from the schemas FormArray
  removeSchema(index: number): void {
    this.schemas.removeAt(index);
  }

  addDatabase(): void {
    const databaseFormGroup = this.fb.group({
      typeOfDb: ['', Validators.required],
      port: ['', Validators.required],
      schemas: ['']  // String to accept comma-separated schemas
    });
    this.databases.push(databaseFormGroup);
  }

  removeDatabase(index: number): void {
    this.databases.removeAt(index);
  }

  addLdap(): void {
    const LdapFormGroup = this.fb.group({
      typeOfLdap: ['', Validators.required],
      port: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.ldaps.push(LdapFormGroup);
  }

  removeLdap(index: number): void {
    this.ldaps.removeAt(index);
  }
  
  onSubmit() {
    if (this.machineForm.valid) {
      const machineData = this.machineForm.value;
      machineData.databases = machineData.databases.map((db: { schemas: string; }) => ({
        ...db,
        schemas: db.schemas.split(',').map(schema => schema.trim())
      }));
      this.machineservice.saveMachine(machineData).subscribe(response => {
        console.log('Machine created successfully:', response);
        this.toaster.success('Machine Saved Successfully','ConfigUtil');
        this.router.navigate(['/machines', 'refresh']);
        // this.router.navigate(['machines']);
      },
      error => {
        console.error('Error Saving machine:', error);
        this.toaster.error('Failed to Save Machine','ConfigUtil');
      }
    );
    } else {
      // Mark all form fields as touched to display validation errors
      this.machineForm.markAllAsTouched();
    }
  }
  //checking machine status from ip address
  checkStatus() {
    const ipAddress = this.machineForm.get('ipAddress')?.value;
    if (ipAddress) {
      this.machineservice.checkStatus(ipAddress).subscribe(status => {
        this.machineForm.get('status')?.setValue(status);
      });
    }
  }

}
