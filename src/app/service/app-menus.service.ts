import { Injectable } from "@angular/core";
import { AuthService } from '../../../src/app/components/auth/auth.service'; // Asegúrate de importar AuthService

@Injectable({
  providedIn: "root",
})
export class AppMenuService {
  constructor(private authService: AuthService) {}

  miMenu() {
    const currentUserRole = this.authService.getCurrentUserRole();

    const menu = [
      {
        icon: "fas fa-pencil-alt fa-fw",
        title: "Mis Cursos",
        url: "/mis-cursos",
        caret: "true",
        roles: ["estudiante", "docente"], // Ambos roles pueden ver este menú
      },
      {
        icon: "fa fa-chart-line",
        title: "Mi Progreso",
        url: "/mi_progreso",
        caret: "true",
        roles: ["estudiante", "docente"], // Ambos roles pueden ver este menú
      },
      {
        icon: "fas fa-book fa-fw",
        title: "Buscar Cursos Disponibles",
        url: "/buscar-cursos",
        caret: "true",
        roles: ["estudiante", "docente"], // Ambos roles pueden ver este menú
      },
      {
        icon: "fa fa-chart-bar",
        title: "Progreso estudiantes",
        url: "/progreso_estudiante",
        caret: "true",
        roles: ["docente"], // Solo docentes pueden ver este menú
      },
      {
        icon: "fa fa-plus",
        title: "Crear Curso",
        url: "/crear_curso",
        caret: "true",
        roles: ["docente"], // Solo docentes pueden ver este menú
      },
      {
        icon: "fa fa-eraser",
        title: "Configuración de Cursos",
        url: "/configuracion_curso",
        caret: "true",
        roles: ["docente"], // Solo docentes pueden ver este menú
      },
    ];

    // Filtrar el menú basado en el rol del usuario
    return menu.filter(item => item.roles.includes(currentUserRole));
  }
}
