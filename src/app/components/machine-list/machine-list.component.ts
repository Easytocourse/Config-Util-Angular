import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Machine } from '../../models/machine';
import { ActivatedRoute, RouteReuseStrategy, Router } from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { MachineProfileComponent } from '../machine-profile/machine-profile.component';
import { catchError, forkJoin, interval, map, of, Subscription, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { MachineService } from '../../services/machine.service';

@Component({
  selector: 'app-machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.css']
})
export class MachineListComponent implements OnInit {
  private apiUrl = 'http://localhost:7070';
  machines: any[] | undefined;
  showActions: boolean[] = [];
  searchkey:string | undefined;
  showspinner=false; 
  isAdmin: boolean = false;
  // private cache: any = null;
  // dataSource =new MatTableDataSource();
  dataSource =new MatTableDataSource<Machine>([]);
  displayedColumns: string[] = ['machineName', 'ipAddress', 'status', 'type','actions'];
  isGridView: boolean=false;
  constructor(private http: HttpClient,private router:Router,public dialog: MatDialog,private authService:AuthService,private route: ActivatedRoute,private machineserveice:MachineService) { }
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  private paramSubscription: Subscription;
  refreshIntervals = [30, 60, 120, 300]; // Interval options in seconds
  refreshInterval: number = 60; // Default interval
  private refreshSubscription: Subscription;
  paramValue: string | undefined;
  filterWithDatabases: boolean = true;
  filterWithApplications: boolean = false;
  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }
  ngOnInit(): void {

        this.paramValue = this.route.snapshot.params['action'];
        this.showspinner=true;
        this.getMachines();
        this.startAutoRefresh();
        this.isAdmin = this.authService.isAdmin();
        
  }

  toggleView(): void {
    this.isGridView = !this.isGridView;
  }
  refreshNow(): void {
    this.paramValue='refresh';
    this.getMachines();
    this.paramValue=undefined;
  }
  updateRefreshInterval(): void {
    this.stopAutoRefresh();
    this.startAutoRefresh();
  }
  stopAutoRefresh(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  startAutoRefresh(): void {
    
    this.refreshSubscription = interval(this.refreshInterval * 1000).pipe(
      switchMap(() => this.http.get<Machine[]>(`${this.apiUrl}/api/machines/refresh`))
    ).subscribe(data => {
      this.dataSource.data = data;
      console.log('refresed');
    });
  }
  pingAllMachines(): void {
    const pingObservables = this.dataSource.data.map(machine => this.pingMachine(machine));
    forkJoin(pingObservables).subscribe(results => {
      results.forEach((result, index) => {
        this.dataSource.data[index].status = result ? 'Active' : 'Inactive';
      });
    });
  }
  pingMachine(machine: any) {
    return this.http.get(`${this.apiUrl}/api/machines/ping/${machine.ipAddress}`).pipe(
      map(response => response['status'] === 'success'),
      catchError(error => of(false))
    );
  }
  getMachines() {
    if (this.machineserveice.cache && this.paramValue=== undefined) {
      console.log('inside if'+this.machineserveice.cache)
      this.dataSource=new MatTableDataSource(this.machineserveice.cache);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.showspinner=false;
      this.dataSource.data=this.machineserveice.cache;
    }
    else 
    {  
      console.log('inside else'+this.paramValue)
      this.http.get<any[]>(`${this.apiUrl}/api/machines/refresh`)
      .subscribe(machines =>{
      this.dataSource=new MatTableDataSource(machines);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.showspinner=false;
      this.dataSource.data=machines;
      this.machineserveice.cache=machines;
       });
    }
  // this.pingAllMachines();
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

  deleteMachine(id: number): void {
    if (confirm('Are you sure you want to delete this machine?')) {
      this.http.delete(`http://localhost:7070/api/machines/${id}`).subscribe(
        () => {
          this.refreshNow();
        },
        error => {
          console.error('Error deleting machine:', error);
        }
      );
    }
  }

  showOperations(machine: any) {
    // Navigate to operations page with machine details
    this.router.navigate(['/operations',machine.ipAddress ], {
      queryParams: { os: machine.type}});
  }
}
