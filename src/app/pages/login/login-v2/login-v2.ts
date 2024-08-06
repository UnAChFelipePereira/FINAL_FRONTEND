import { Component } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../components/auth/auth.service';

//import { access } from 'fs';


@Component({
  selector: 'login-v2',
  templateUrl: './login-v2.html'
})
export class LoginV2Page {

  constructor(private authService: AuthService, private router: Router) {}

  formSubmit(f: NgForm) {
    if (f.valid) {
      const formData = f.value;
      
      this.authService.login(formData.email, formData.password).subscribe(
        response => {
          console.log('Respuesta del inicio de sesión:', response);
          

          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
          localStorage.setItem('user_Id', response.user._id);

          console.log(response.access_token)
          console.log(response.refresh_token)
          
          this.router.navigate(['dashboard']);
          return true;
        },
        error => {
          console.error('Error al iniciar sesión:', error);
        }
      );
    }
  }
}
