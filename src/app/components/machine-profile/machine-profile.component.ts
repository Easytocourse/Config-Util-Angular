import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MachineListComponent } from '../machine-list/machine-list.component';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-machine-profile',
  templateUrl: './machine-profile.component.html',
  styleUrl: './machine-profile.component.css'
})
export class MachineProfileComponent {
  machineRow: any;

  constructor(public dialogRef:MatDialogRef<MachineListComponent>,
    @Inject(MAT_DIALOG_DATA)public data:any) { 
      this.machineRow=data.machinedata;
       console.log(this.machineRow);
    }

}
