import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService,private toaster:ToastrService, private router: Router) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.signupForm.valid) {
      console.log('Signup form value:', this.signupForm.value);
      const { confirmPassword, ...signupData } = this.signupForm.value;
      console.log('Signup form value to send:', signupData);
      this.authService.signup(signupData).subscribe({
        next: (response) => {
          this.toaster.success('Registered Successfully','ConfigUtil');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.log(error);
          this.toaster.error(error.error.message,'ConfigUtil');
        }
      });
      
    }
  }
}
