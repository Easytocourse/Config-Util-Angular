import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../../services/auth.service';
import { EditJobDialogComponent } from '../edit-job-dialog/edit-job-dialog.component';
import { ScheduledJobService } from '../../services/scheduled-job.service';
import { HttpEventType, HttpHeaders } from '@angular/common/http';
import { FileDialogStreamComponent } from '../file-dialog-stream/file-dialog-stream.component';

export interface ScheduledJob {
  jobId: string;
  jobName: string;
  jobGroup: string;
  jobStatus: string;
  desc: string;
  dateTime: string;
  filepath: string;
  resultfilepath: string | null;
}

@Component({
  selector: 'app-scheduled-jobs-dialog',
  templateUrl: './scheduled-jobs-dialog.component.html',
  styleUrls: ['./scheduled-jobs-dialog.component.css']
})
export class ScheduledJobsDialogComponent implements OnInit {
  displayedColumns: string[] = ['hostname','jobName', 'jobGroup', 'jobStatus', 'desc', 'dateTime', 'filepath','resultfilepath','actions'];
  dataSource =new MatTableDataSource<ScheduledJob>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })sort!: MatSort;

  jobs: any[];
  headers: HttpHeaders;
  fileContent: string = '';
  private buffer: string = '';
  constructor(
    public dialogRef: MatDialogRef<ScheduledJobsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private authservice:AuthService,
    private jobService: ScheduledJobService
  ) {
    this.jobs = data.jobs;
    this.headers = data.headers;
  }

  ngOnInit(): void {
    this.dataSource=new MatTableDataSource(this.jobs);
    this.dataSource.data = this.jobs;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort=this.sort;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  loadJobs(): void {
    // this.jobService.getJobs().subscribe(jobs => {
    //   // Filter or process jobs if needed
    //   this.dataSource = jobs;
    // });
  }
  editJob(job: any): void {
    const dialogRef = this.dialog.open(EditJobDialogComponent, {
      width: '600px',
      data: job
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the updated job result
        this.loadJobs(); // Reload jobs after editing
      }
    });
  }

  deleteJob(job: any): void {

    const apiUrl = "http://"+job.hostname+":8080/jobs";  
    if (confirm('Are you sure you want to delete this job?')) {
      this.jobService.deleteJob(apiUrl, job.jobId,this.headers).subscribe(() => {
        this.loadJobs(); // Reload jobs after deletion
      });
    }
  }

  // viewStatus(job: any): void {
  //   const apiUrl = "http://"+job.hostname+":8080/jobs/status";  
  //   this.jobService.streamFile(apiUrl,job.jobId,this.headers).subscribe(event => {
  //     if (event.type === HttpEventType.DownloadProgress) {
  //     } else if (typeof event === 'string') {
  //       this.buffer += event;
  //       this.fileContent = this.buffer;
  //     }
  //   });
  // }
  
  viewStatus(job: any) {
    const apiUrl = "http://"+job.hostname+":8080/jobs/status"; 
    this.jobService.streamFile(apiUrl,job.jobId,this.headers).subscribe(blob => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result as string;
        this.dialog.open(FileDialogStreamComponent, {
          data: { fileContent, job, apiUrl, headers: this.headers},
          width: '80%',
          height: '80%'
        });
      };
      reader.readAsText(blob);
    });
  }

  isEditable(job: any): boolean {
    console.log(job);
    return job.username === this.authservice.getUser().username;
  }

  isDeletable(job: any): boolean {
    return job.username === this.authservice.getUser().username;
  }

}
