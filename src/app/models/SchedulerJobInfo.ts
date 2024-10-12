export interface SchedulerJobInfo {
  dateTime: string; // Use appropriate type for date-time
  desc: string;
  jobGroup: string;
  jobName: string;
  filepath?: string; // Optional, used after file upload

}
