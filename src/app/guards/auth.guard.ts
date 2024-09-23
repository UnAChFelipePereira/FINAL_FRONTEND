import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem("access_token");
    if (token && token.trim() !== "") {
      console.log("Usuario autenticado. Permitiendo acceso.");
      return true;
    } else {
      console.log("No se ha detectado ningún token. Redirigiendo al login.");
      this.router.navigate(["/login"]);
      return false;
    }
  }
}
