import { Component, OnInit } from '@angular/core';
import { AdminService, User } from '../../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  roles: string[] = ['ROLE_ADMIN', 'ROLE_DEV', 'ROLE_QA']; // List of roles
  displayedColumns: string[] = ['username', 'role', 'actions'];

  constructor(private adminService: AdminService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  selectUser(user: User): void {
    this.selectedUser = { ...user };
  }

  onRoleChange(role: string): void {
    if (this.selectedUser) {
      this.selectedUser.role = role;
    }
  }

  updateUser(): void {
    if (this.selectedUser) {
      this.adminService.updateUser(this.selectedUser).subscribe({
        next: (response) => {
        this.loadUsers();
        this.clearForm();
        this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
      }, error:(error) => {
        this.snackBar.open('Error updating user', 'Close', { duration: 3000 });
      }
    });
    }
  }

  deleteUser(id: number): void {
    this.adminService.deleteUser(id).subscribe(() => {
      this.loadUsers();
      this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
    }, error => {
      this.snackBar.open('Error deleting user', 'Close', { duration: 3000 });
    });
  }

  clearForm(): void {
    this.selectedUser = null;
  }
}
