import { FormGroup, FormControl } from "@angular/forms";

export class Machine {
    id: number;
    machineName: string;
    ipAddress: string;
    status: string;
    type: string;
    databases!: Database[];
    ldaps!:Ldap[];
  
    constructor(id: number, machineName: string, ipAddress: string, status: string, type: string, databases?: Database[]) {
      this.id = id;
      this.machineName = machineName;
      this.ipAddress = ipAddress;
      this.status = status;
      this.type = type;
      this.databases = databases || [];
    }
  }
  
  export class Database {

    id?: number;
    typeOfDb: string;
    schemas: string[];
    port:string;
  
    constructor(id: number, typeOfDb: string, schemas: string[],port:string) {
      this.id = id;
      this.typeOfDb = typeOfDb;
      this.schemas = schemas;
      this.port=port;
    }
  }

  export class Ldap {

    id?: number;
    typeOfLdap: string;
    username: string;
    password:string;
    port:string;
  
    constructor(id: number, typeOfLdap: string, username: string,password: string,port:string) {
      this.id = id;
      this.typeOfLdap = typeOfLdap;
      this.username = username;
      this.password=password;
      this.port=port;
    }
  }
  