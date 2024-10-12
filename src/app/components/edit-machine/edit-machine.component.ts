import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MachineService } from '../../services/machine.service';
import { Machine } from '../../models/machine';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-machine',
  templateUrl: './edit-machine.component.html',
  styleUrls: ['./edit-machine.component.css']
})
export class EditMachineComponent implements OnInit {
  machineForm: FormGroup;
  dbTypes: string[] = ['MySQL', 'PostgreSQL', 'Oracle', 'SQL Server', 'SQLite', 'MongoDB', 'MariaDB'];
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private machineService: MachineService,
    private toaster:ToastrService,
    public router:Router
  ) {
    this.machineForm = this.fb.group({
      machineName: [''],
      ipAddress: [''],
      status: [''],
      type: [''],
      databases: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.createForm();
    // Retrieve machineId from route params
    const machineId = +this.route.snapshot.params['id']; // Assuming 'id' is the parameter name
    this.fetchMachineData(machineId);
  }
  createForm(): void {
    this.machineForm = this.fb.group({
      machineName: ['', Validators.required],
      ipAddress: ['', Validators.required],
      status: ['', Validators.required],
      type: ['', Validators.required],
      databases: this.fb.array([]) 
    });
  }
  private fetchMachineData(machineId: number): void {
    this.machineService.getMachineById(machineId).subscribe(
      (machine) => {
        // Patch form values once data is fetched
        this.machineForm.patchValue({
          machineName: machine.machineName || '',
          ipAddress: machine.ipAddress || '',
          status: machine.status || '',
          type: machine.type || ''
        });

        // Clear existing databases FormArray
        const databasesArray = this.databases;
        databasesArray.clear();

    // Add database details to the form array
      machine.databases.forEach((database: any) => {
      // const schemasFormArray = this.fb.array(
      //   database.schemas.map((schema: string) => this.fb.control(schema, Validators.required))
      // );
      const schemasString = database.schemas.join(', ');
      const databaseGroup = this.fb.group({
        id:[database.id, Validators.required],
        typeOfDb: [database.typeOfDb, Validators.required],
        port: [database.port, Validators.required],
        schemas: [schemasString, Validators.required]
      });

      databasesArray.push(databaseGroup);
    });
      },
      (error) => {
        console.error('Error fetching machine data:', error);
      }
    );
  }

  addDatabase(): void {
    const databaseGroup = this.fb.group({
      typeOfDb: [''],
      port: [''],
      schemas: ['']
    });
    this.databases.push(databaseGroup);
  }

  removeDatabase(index: number): void {
    this.databases.removeAt(index);
  }

  get databases(): FormArray {
    return this.machineForm.get('databases') as FormArray;
  }

  onSubmit(): void {
    if (this.machineForm.valid) {
      const updatedMachine = this.machineForm.value;
      console.log('Updated Machine:', updatedMachine);
      // Convert schemas to array if it's a string
      updatedMachine.databases = updatedMachine.databases.map((db: { schemas: string }) => ({
        ...db,
        schemas: !Array.isArray(db.schemas) ? db.schemas.split(',').map(schema => schema.trim()) : db.schemas
      }));


      // Send updated data to the service for update
      const machineId = +this.route.snapshot.params['id']; // Assuming 'id' is the parameter name
      this.machineService.updateMachine(machineId, updatedMachine).subscribe(
        response => {
          console.log('Machine updated successfully:', response);
          this.toaster.success('Machine updated Successfully','ConfigUtil');
          this.router.navigate(['/machines', { action: 'refresh' }]);
        },
        error => {
          this.toaster.error('Error updating machine:', error);
        }
      );
    }
  }
}
