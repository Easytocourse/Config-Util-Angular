export interface DatabaseDto {
    id: number;
    typeOfDb: string;
    port: number;
    schemas: string[];
    machineName: string;
    ipAddress: string;
  }
  