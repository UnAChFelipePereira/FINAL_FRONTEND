import { Component, OnDestroy, Renderer2 } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { AppSettings } from "../../service/app-settings.service";
import { AuthService } from "../../components/auth/auth.service";

@Component({
  selector: "resetPassword-v1",
  templateUrl: "./resetPassword-v1.html",
})
export class ResetPasswordV1Page implements OnDestroy {
  userData = {
    name: "",
    lastname: "",
    email: "",
    reemail: "",
    password: "",
    repassword: "",
    resetToken: "",
    newPassword: "",
  };
  newPassword: string;
  showPassword: boolean = false;
  showError = false;
  showSuccess = false;

  alertMessage = "";

  constructor(
    private router: Router,
    private renderer: Renderer2,
    public appSettings: AppSettings,
    private authService: AuthService
  ) {
    this.appSettings.appEmpty = true;
    this.renderer.addClass(document.body, "bg-white");
  }

  ngOnDestroy() {
    this.appSettings.appEmpty = false;
    this.renderer.removeClass(document.body, "bg-white");
  }

  formSubmit(f: NgForm) {
    const formData = f.value;
    if (!formData.newPassword || !formData.repassword) {
      this.showErrorAlert("Por favor, complete todos los campos.");
      return;
    }

    if (f.valid) {
      if (formData.newPassword !== formData.repassword) {
        this.showErrorAlert("Las claves no coinciden");
        return;
      } else {
        if (!formData.resetToken) {
          this.showErrorAlert("Código de recuperanción no válido.");
          return;
        }

        this.authService
          .resetPassword(formData.newPassword, formData.resetToken)
          .subscribe(
            (response) => {
              this.showSuccessAlert(
                "Se restableció tu contraseña exitosamente!"
              );
            },
            (error) => {
              console.error("Error al reestablecer tu contraseña:", error);
              this.showErrorAlert("Error al reestablecer tu contraseña.");
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
      this.router.navigate(["/login"]);
    }, 3000);
  }

  hideAlerts() {
    this.showError = false;
    this.showSuccess = false;
    this.alertMessage = "";
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
