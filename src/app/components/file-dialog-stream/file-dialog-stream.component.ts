import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ScheduledJobService } from '../../services/scheduled-job.service';

@Component({
  selector: 'app-file-dialog-stream',
  templateUrl: './file-dialog-stream.component.html',
  styleUrl: './file-dialog-stream.component.css'
})
export class FileDialogStreamComponent {
  fileContent: string;
  job: any;
  apiUrl: string;
  headers: any;

  constructor(
    private dialogRef: MatDialogRef<FileDialogStreamComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { fileContent: string, job: any, apiUrl: string, headers: any },
    private jobService: ScheduledJobService  // Inject JobService for API calls
  ) {
    this.fileContent = data.fileContent;
    this.job = data.job;
    this.apiUrl = data.apiUrl;
    this.headers = data.headers;
  }

  // Close the dialog
  closeDialog(): void {
    this.dialogRef.close();
  }

  // Refresh the job output by hitting the API again
  refresh(): void {
    const apiUrl = `${this.apiUrl}/${this.job.jobId}/status`;  // Construct the API URL

    // Call the API to get the latest job status and update the file content
    this.jobService.streamFile(apiUrl, this.job.jobId, this.headers).subscribe(blob => {
      const reader = new FileReader();
      reader.onload = () => {
        this.fileContent = reader.result as string;  // Update the file content with the fresh data
      };
      reader.readAsText(blob);
    });
  }
}