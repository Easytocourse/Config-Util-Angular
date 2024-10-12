import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FileService } from '../../services/file.service';
import { SchedulerJobInfo } from '../../models/SchedulerJobInfo';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { ScheduledJob, ScheduledJobsDialogComponent } from '../scheduled-jobs-dialog/scheduled-jobs-dialog.component';
import { ScheduledJobService } from '../../services/scheduled-job.service';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})
export class OperationsComponent implements OnInit {
  hostname: string;
  apiUrl: string;
  availableApis: { name: string, endpoint: string }[] = [];
  apiCredentials: { [key: string]: { username: string, password: string } } = {};
  responseContent: any = '';
  paramValue: any;
  filePath: string = '';
  sourcePath: string = '';
  selectedFile: File | null = null;
  folderPath: string = '';
  scheduleModel: SchedulerJobInfo = { dateTime: '', desc: '', jobGroup: '', jobName: ''};
  expandedPanels: { [key: string]: boolean } = {};
  @ViewChild('resultContent') resultContent: ElementRef;
  scheduledJobs: ScheduledJob[] = [];
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fileService: FileService,
    private authservice:AuthService,
    private scheduledJobService:ScheduledJobService,
    private dialog: MatDialog,
  ) {

    this.availableApis.forEach(api => {
      this.expandedPanels[api.endpoint] = false;
    });
  }
  scheduledJobData: MatTableDataSource<ScheduledJob> = new MatTableDataSource<ScheduledJob>();
  displayedColumns: string[] = ['jobName', 'jobGroup', 'jobStatus', 'desc', 'dateTime', 'filepath','actions'];
  dataSource =new MatTableDataSource<ScheduledJob>([]);
  hasjobs:boolean=false;
  os: string;
  ngOnInit() {
    this.paramValue = this.route.snapshot.params['hostname'];
    this.route.queryParams.subscribe(params => {
      this.os = params['os'];
    });
    console.log('my os'+this.os);
    this.apiUrl = `http://${this.paramValue}:8080`;
    this.initializeApis();
  }

  initializeApis() {
    if(this.os == 'Windows')
    {
      this.availableApis.push({ name: 'Get Sample Bat File', endpoint: '/getSampleBatFilenew' });
    }
    else
    {
      this.availableApis.push({ name: 'Get Sample Bash File', endpoint: '/getSampleBashFilenew' });
    }
    this.availableApis.push(
      { name: 'Read File', endpoint: '/readFile' },
      { name: 'Upload File', endpoint: '/uploadFile' },
      { name: 'Upload and Schedule', endpoint: '/testuploadAndSchedule' },
      { name: 'showScheduledJobs', endpoint: '/showScheduledJobs' }
    );
    this.availableApis.forEach(api => {
      this.apiCredentials[api.endpoint] = { username: '', password: '' };
    });
  }

  callApi(apiEndpoint: string) {
    const { username, password } = this.apiCredentials[apiEndpoint];
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`${username}:${password}`)
    });

    switch (apiEndpoint) {
      case '/getSampleBatFilenew':
        this.downloadSampleBatFile(headers);
        break;
      case '/getSampleBashFilenew':
          this.downloadSampleBashFile(headers);
          break;
      case '/readFile':
        this.readFile(this.filePath, headers);
        break;
      case '/uploadFile':
        this.uploadFile(this.selectedFile!,this.filePath,headers);
        break;
      case '/testuploadAndSchedule':
          this.uploadAndSchedule(headers);
          break;
      case '/showScheduledJobs':
            this.showScheduledJobs(headers);
            break;
      default:
        console.error('Unsupported API endpoint');
    }
  }
  showScheduledJobs(headers: HttpHeaders) {
      this.scheduledJobService.getScheduledJobs(`${this.apiUrl}/jobs`,headers).subscribe(
        (jobs) => {
          this.scheduledJobData.data=jobs;
          this.hasjobs=(jobs.length>1);
          // Open the dialog and pass the job data
          // this.dialog.open(ScheduledJobsDialogComponent, {
          //   width: '600px',
          //   data: this.scheduledJobs
          // });
          let dialogBoxSettings = {
            height: '79%',
            width: '80%',
            disableClose: false,
            hasBackdrop: true,
            margin: '0 auto',
            panelClass: 'custom-dialog-container2',
            data: {
              jobs: jobs,
              headers: headers
            }
          };
          const dialogRef = this.dialog.open(ScheduledJobsDialogComponent,dialogBoxSettings);

        },
        error => {
          console.error('Error fetching scheduled jobs:', error);
        }
      );
    }

  private downloadSampleBatFile(headers: HttpHeaders) {
    this.fileService.getSampleBatFile(`${this.apiUrl}/files/getSampleBatFilenew`, headers).subscribe(
      data => {
        const blob = new Blob([data], { type: 'application/bat' });
        this.downloadBlob(blob, 'sample.bat');
      },
      error => console.error('Error:', error)
    );
  }

  private downloadSampleBashFile(headers: HttpHeaders) {
    this.fileService.getSampleBatFile(`${this.apiUrl}/files/getSampleBashFilenew`, headers).subscribe(
      data => {
        const blob = new Blob([data], { type: 'application/bat' });
        this.downloadBlob(blob, 'sample.sh');
      },
      error => console.error('Error:', error)
    );
  }

  private readFile(filepath:string,headers: HttpHeaders) {
    if (filepath) {
      this.fileService.readFile(`${this.apiUrl}/files/readFile`,filepath, headers).subscribe(
        data => {
          this.responseContent=new String(data);
        },
        error => console.error('Error:', error)
      );
    }
  }


  uploadFile(file: File, folderpath: string,headers: HttpHeaders) {
    if (this.selectedFile) {
      this.fileService.uploadFile(`${this.apiUrl}/files/uploadFile`,this.selectedFile!, this.filePath,headers).subscribe(
        data => {
          console.log("bharath response:"+data);
          this.responseContent=new String(data);
        },
        error => console.error('Error:', error)
      );
    }

  }

  private downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  copyToClipboard() {
    const content = this.resultContent.nativeElement.textContent;
    navigator.clipboard.writeText(content).then(() => {
      console.log('Copied to clipboard successfully!');
    }).catch(err => {
      console.error('Failed to copy to clipboard', err);
    });
  }

  clearResponse() {
    this.responseContent = ''; // Clear the response content
  }
  onDateTimeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.scheduleModel.dateTime = input.value.replace('T', ' ');
  }

  uploadAndSchedule(headers: HttpHeaders) {
    if (!this.selectedFile) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('model', JSON.stringify(this.scheduleModel)); // Convert model to JSON
    formData.append('file', this.selectedFile); // Append the file
    formData.append('folderpath', this.folderPath); // Append the folder path
    formData.append('username',this.authservice.getUser().username);
    formData.append('hostname',this.paramValue);

    this.fileService.uploadAndSchedule(`${this.apiUrl}/jobs/testuploadAndSchedulenew`,formData, headers).subscribe(
      data => {
        console.log("bharath response:"+data);
        this.responseContent=new String(data);
      },
      error => console.error('Error:', error)
    );

  }

  viewJobDetails(job: ScheduledJob): void {

  }

    // Cancel a scheduled job
  cancelJob(job: ScheduledJob): void {
  }
  closeDialog(): void {
    this.hasjobs=false;
  }
  
}
