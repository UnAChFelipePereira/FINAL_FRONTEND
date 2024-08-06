import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../components/auth/auth.service';
import { AppSettings } from '../../../service/app-settings.service';

@Component({
  selector: 'activate',
  templateUrl: './activate.html'
})
export class Activate implements OnInit {
    activationMessage: string = '';
    isActivated: boolean = false;
    showError: boolean = false;
    isLoading: boolean = true;
  
    constructor(
      private route: ActivatedRoute,
      private authService: AuthService,
      private router: Router,
      private renderer: Renderer2,
      public appSettings: AppSettings,
    ) {

      this.appSettings.appEmpty = true;
      this.renderer.addClass(document.body, 'bg-white');

    }
  
    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        const token = params['token'];
        if (token) {
          this.activateAccount(token);
        } else {
          this.showErrorMessage('Token de activación no encontrado.');
          this.isLoading = false;
        }
      });
    }
  
    activateAccount(token: string): void {
      this.authService.activateAccount(token).subscribe(
        response => {
          this.showSuccessMessage('Cuenta activada con éxito. Redirigiendo al inicio de sesión...');
          this.isLoading = false;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 5000); // Espera 5 segundos antes de redirigir al login
        },
        error => {
          this.showErrorMessage('Error al activar la cuenta. El token es inválido o la cuenta ya está activada.');
          console.error('Error al activar la cuenta:', error);
          this.isLoading = false;
        }
      );
    }
  
    showErrorMessage(message: string) {
      this.activationMessage = message;
      this.showError = true;
    }
  
    showSuccessMessage(message: string) {
      this.activationMessage = message;
      this.isActivated = true;
    }
  }