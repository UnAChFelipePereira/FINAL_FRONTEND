import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../components/auth/auth.service";
import { Curso } from "./curso.model";
import { Router } from "@angular/router";

@Component({
  selector: "extra-search-results",
  templateUrl: "./configuracion_curso.html",
  styleUrls: ["./configuracion_curso.css"],
})
export class ConfiguracionCurso implements OnInit {
  cursos: Curso[] = [];
  userId: string | null = null;
  userEmail: string | null = null;
  userRol: string | null = null;
  showError: boolean = false;
  showSuccess: boolean = false;
  alertMessage: string = "";
  cursoAEliminar: string | null = null;
  showConfirmation: boolean = false;
  terminoBusqueda: string = "";

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userRol = localStorage.getItem("userRol");
    this.userEmail = localStorage.getItem("userEmail");

    if (this.userRol === "admin") {
      this.loadAllCursos();
    } else if (this.userRol === "docente") {
      this.loadCursosByEmail(this.userEmail);
    }
  }

  loadAllCursos(): void {
    this.authService.getAllCursos().subscribe(
      (response: any) => {
        if (Array.isArray(response)) {
          this.cursos = response.map((curso: Curso) => {
            const iconoUrl = `http://localhost:3000/uploads/${encodeURIComponent(
              curso.iconocursoNombre
            )}`;
            return {
              ...curso,
              iconocursoNombre: iconoUrl,
            };
          });
        } else {
          console.error(
            "La respuesta del servidor no contiene un arreglo válido de cursos:",
            response
          );
        }
      },
      (error) => {
        console.error("Error al obtener todos los cursos:", error);
      }
    );
  }

  loadCursosByEmail(userEmail: string): void {
    this.authService.getCursosByEmail(userEmail).subscribe(
      (response: any) => {
        if (Array.isArray(response)) {
          this.cursos = response.map((curso: Curso) => {
            const iconoUrl = `http://localhost:3000/uploads/${encodeURIComponent(
              curso.iconocursoNombre
            )}`;
            return {
              ...curso,
              iconocursoNombre: iconoUrl,
            };
          });
        } else {
          console.error(
            "La respuesta del servidor no contiene un arreglo válido de cursos:",
            response
          );
        }
      },
      (error) => {
        console.error("Error al obtener cursos por email:", error);
      }
    );
  }

  toggleCursoEstado(cursoId: string, estadoActual: boolean): void {
    const nuevoEstado = !estadoActual;
    this.authService.updateCursoEstado(cursoId, nuevoEstado).subscribe(
      () => {
        this.showSuccessAlert(
          `Curso ${nuevoEstado ? "activado" : "desactivado"} correctamente.`
        );
        if (this.userRol === "admin") {
          this.loadAllCursos();
        } else if (this.userRol === "docente") {
          this.loadCursosByEmail(this.userEmail);
        }
      },
      (error) => {
        console.error(
          `Error al ${nuevoEstado ? "activar" : "desactivar"} el curso:`,
          error
        );
        this.showErrorAlert(
          `Error al ${nuevoEstado ? "activar" : "desactivar"} el curso.`
        );
      }
    );
  }

  buscarCursos(): void {
    if (this.terminoBusqueda.trim() === "") {
      if (this.userRol === "admin") {
        this.loadAllCursos();
      } else if (this.userRol === "docente") {
        this.loadCursosByEmail(this.userEmail);
      }
    } else {
      this.cursos = this.cursos.filter((curso) =>
        curso.nombre_curso
          .toLowerCase()
          .includes(this.terminoBusqueda.toLowerCase())
      );
    }
  }

  editarCurso(cursoId: string) {
    this.router.navigate(["/editar_curso", cursoId]);
  }

  showErrorAlert(message: string) {
    this.alertMessage = message;
    this.showError = true;
    setTimeout(() => {
      this.hideAlerts();
    }, 5000);
  }

  showSuccessAlert(message: string) {
    this.alertMessage = message;
    this.showSuccess = true;
    setTimeout(() => {
      this.hideAlerts();
    }, 5000);
  }

  hideAlerts() {
    this.showError = false;
    this.showSuccess = false;
    this.showConfirmation = false;
    this.alertMessage = "";
  }
}
