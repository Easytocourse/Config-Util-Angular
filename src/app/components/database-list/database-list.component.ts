import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Database, Machine } from '../../models/machine';
import { MachineService } from '../../services/machine.service';
import {MatSort} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MachineProfileComponent } from '../machine-profile/machine-profile.component';
import { DatabaseDto } from '../../models/DatabaseDto';
import { DatabaseActionDialogComponent } from '../database-action-dialog/database-action-dialog.component';
@Component({
  selector: 'app-databases',
  templateUrl: './database-list.component.html',
  styleUrls: ['./database-list.component.css']
})
export class DatabaseListComponent implements OnInit {
  
  private apiUrl = 'http://localhost:7070';
  machines: any[] | undefined;
  showActions: boolean[] = [];
  searchkey:string | undefined;
  showspinner=false; 
  isAdmin: boolean = false;
  dataSource =new MatTableDataSource<DatabaseDto>([]);
  displayedColumns: string[] = ['machineName', 'ipAddress', 'typeofDb', 'schemas','port', 'actions'];
  constructor(private http: HttpClient,private router:Router,public dialog: MatDialog,private authService:AuthService) { }
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  refreshIntervals = [30, 60, 120, 300]; // Interval options in seconds
  refreshInterval: number = 60; // Default interval
  showAllTooltip: boolean = false;
  ngOnDestroy(): void {
  }
  ngOnInit(): void {
    this.showspinner=true;
    this.getDatabases();
    this.isAdmin = this.authService.isAdmin();  // Determine if the user is an admin   
  }


  // Method to toggle the tooltip displaying all schemas
  showAllSchemas(event: MouseEvent, element: any): void {
    event.stopPropagation(); // Prevents the click event from bubbling up
    this.showAllTooltip = !this.showAllTooltip;
  }
  getDatabases() {
    this.http.get<any[]>(`${this.apiUrl}/api/databases`)
    .subscribe(databases =>{
    this.dataSource=new MatTableDataSource(databases);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.showspinner=false;
  });
  }

  openActionDialog(database: any) {
    const dialogRef = this.dialog.open(DatabaseActionDialogComponent, {
      height: '79%',
      width: '70%',
      disableClose: false,
      hasBackdrop: true,
      data: database
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        this.getDatabases();
      }
    });
  }

  fetchMachines() {
    this.http.get<any[]>('http://localhost:7070/api/machines')
      .subscribe(machines => {
        this.machines = machines;
      });
  }

  editMachine(machine: Machine): void {
    this.router.navigate(['/machines', machine.id, 'edit']);
  }

  searchclear()
   {
     this.searchkey='';
     this.applyFilter();
   }
   applyFilter() 
   {
      this.dataSource.filter = this.searchkey!.trim().toLowerCase();
            
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
   }
  
   onAdd()
  {

  }
  showfull(machine: any)
  {
    let dialogBoxSettings = {
      height: '79%',
      width: '70%',
      disableClose: false,
      hasBackdrop: true,
      margin: '0 auto',
      panelClass: 'custom-dialog-container2',
      data:{
              // machineName:machine.fullName,
              // ipAddress:machine.ipAddress,
              // status:machine.status,
              // type:machine.type
              machinedata:machine
            }
    };
    const dialogRef = this.dialog.open(MachineProfileComponent,dialogBoxSettings);
   
  }
}
