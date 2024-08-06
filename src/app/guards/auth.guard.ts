import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Obtener el token de acceso del almacenamiento local
    const token = localStorage.getItem('access_token');

    // Verificar si el token existe y no es nulo ni vacío
    if (token && token.trim() !== '') {
      // Si el token existe, permite el acceso a la ruta protegida
      console.log("Usuario autenticado. Permitiendo acceso.");
      return true;
    } else {
      // Si no hay token, redirigir al usuario al componente de login y retornar falso
      console.log("No se ha detectado ningún token. Redirigiendo al login.");
      this.router.navigate(['/login']);
      return false;
    }
  }
}
