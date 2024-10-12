import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScheduledJobService } from '../../services/scheduled-job.service';

@Component({
  selector: 'app-edit-job-dialog',
  templateUrl: './edit-job-dialog.component.html',
  styleUrls: ['./edit-job-dialog.component.css']
})
export class EditJobDialogComponent {
  jobForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private jobService: ScheduledJobService,
    public dialogRef: MatDialogRef<EditJobDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.jobForm = this.fb.group({
      jobName: [data.jobName, Validators.required],
      jobGroup: [data.jobGroup, Validators.required],
      jobStatus: [data.jobStatus],
      desc: [data.desc],
      dateTime: [data.dateTime],
      filepath: [data.filepath],
      resultfilepath: [data.resultfilepath]
    });
  }

  onSave(): void {
    if (this.jobForm.valid) {
      const updatedJob = this.jobForm.value;
      this.jobService.updateJob(this.data.id, updatedJob).subscribe(() => {
        this.dialogRef.close(updatedJob);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
