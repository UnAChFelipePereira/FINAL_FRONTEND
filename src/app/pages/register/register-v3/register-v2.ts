// register-v2.component.ts

import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AppSettings } from '../../../service/app-settings.service';
import { AuthService } from '../../../components/auth/auth.service';

@Component({
  selector: 'register-v2',
  templateUrl: './register-v2.html'
})
export class RegisterV2Page implements OnDestroy {
  userData = { name: '', lastname: '', email: '', reemail: '', password: '' };
  showPassword = false;
  showError = false;
  showSuccess = false;
  alertMessage = '';

  constructor(
    private router: Router,
    private renderer: Renderer2,
    public appSettings: AppSettings,
    private authService: AuthService
  ) {
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
    if (!formData.name || !formData.lastname || !formData.email || !formData.reemail || !formData.password) {
      this.showErrorAlert('Por favor, complete todos los campos.');
      return;
    }

    if (f.valid) {
      if (formData.email !== formData.reemail) {
        this.showErrorAlert('Los correos no coinciden');
        return;
      } else {
        if (!this.validarDominio(formData.email)) {
          this.showErrorAlert('El correo debe ser de dominio @alu.unach.cl o @unach.cl');
          return;
        } else {
          const rol = formData.email.endsWith('@alu.unach.cl') ? 'estudiante' : 'docente';

          this.authService.register(formData.name, formData.lastname, formData.email, formData.password, rol).subscribe(
            response => {
              this.showSuccessAlert('¡Te hemos enviado un correo para confirmar tu cuenta!');
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 5000);
            },
            error => {
              console.error('Error al registrar:', error);
              this.showErrorAlert('Este correo ya está registrado.');
            }
          );
        }
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
    }, 20000);
  }

  hideAlerts() {
    this.showError = false;
    this.showSuccess = false;
    this.alertMessage = '';
  }

  validarDominio(email: string): boolean {
    if (email && email.indexOf('@') !== -1) {
      const domain = email.split('@')[1];
      return domain === 'alu.unach.cl' || domain === 'unach.cl';
    }
    return false;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
