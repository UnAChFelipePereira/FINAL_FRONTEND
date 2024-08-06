import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AppSettings } from '../../service/app-settings.service';
import { AuthService } from '../../components/auth/auth.service';

@Component({
  selector: 'forgot-password-v1',
  templateUrl: './forgot-password-v1.html'
})

export class ForgotV1Page implements OnDestroy {
  userData = { name: '', lastname: '', email: '', reemail: '', password: '' };
  showPassword = false;
  showError = false;
  showSuccess = false;
  alertMessage = '';

  constructor(private router: Router, private renderer: Renderer2, public appSettings: AppSettings, private authService: AuthService) {
      this.appSettings.appEmpty = true;
      this.renderer.addClass(document.body, 'bg-white');
  }

  ngOnDestroy() {
      this.appSettings.appEmpty = false;
      this.renderer.removeClass(document.body, 'bg-white');
  }

  formSubmit(f: NgForm) {
      const formData = f.value;

      // Verificar si hay campos vacíos
      if (!formData.email || !formData.reemail) {
          this.showErrorAlert('Por favor, complete todos los campos.');
          return;
      }

      if (f.valid) {
          if (formData.email !== formData.reemail) {
              this.showErrorAlert('Los correos no coinciden');
              return;
          } else {
                  this.authService.forgotPassword(formData.email).subscribe(
                      response => {
                          this.showSuccessAlert(`Correo para restablecer clave enviado a ${formData.email}`);
                          //this.router.navigate(['/login']);
                      },
                      error => {
                          console.error('Error:', error);
                          this.showErrorAlert('Este correo no está registrado.');
                      }
                  );
              }
          }
      }
  

  showErrorAlert(message: string) {
      this.alertMessage = message;
      this.showError = true;
      setTimeout(() => {
          this.hideAlerts();
      }, 20000);
  }

  showSuccessAlert(message: string) {
    this.alertMessage = message;
    this.showSuccess = true;
    setTimeout(() => {
      this.hideAlerts();
      this.router.navigate(['/login']);
    }, 8000); // 5000 milisegundos = 5 segundos
  }

  hideAlerts() {
      this.showError = false;
      this.showSuccess = false;
      this.alertMessage = '';
  }


}
