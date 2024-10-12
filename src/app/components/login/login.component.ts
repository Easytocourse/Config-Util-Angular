import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitted = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,private toaster:ToastrService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get formControls() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.authService.loginnew(this.loginForm.value).subscribe({
      next: (response) => {
        localStorage.setItem('user', JSON.stringify(response));
        this.router.navigate(['/machines']);
      },
      error: (error) => {
        this.errorMessage = 'Invalid username or password';
        this.toaster.error(error.error.message,'ConfigUtil');
      }
    });
  }
}
