import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../components/auth/auth.service";
import { Curso } from "./curso.model";
import { Router } from "@angular/router";

@Component({
  selector: "extra-search-results",
  templateUrl: "./ver_progreso_estudiante.html",
  styleUrls: ["./ver_progreso_estudiante.css"],
})
export class VerProgresoEstudiante implements OnInit {
  cursosInscritos: Curso[] = [];
  user_Id: string;
  userEmail: string | null = null;
  userRol: string | null = null;
  terminoBusqueda: string = "";
  showError: boolean = false;
  showSuccess: boolean = false;
  alertMessage: string = "";

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user_Id = localStorage.getItem("user_Id");
    this.userEmail = localStorage.getItem("userEmail");
    this.userRol = localStorage.getItem("userRol");

    if (this.userRol) {
      if (this.userRol === "admin") {
        this.loadAllCursos();
      } else if (this.userRol === "docente" && this.userEmail) {
        this.loadCursosByEmail(this.userEmail);
      }
    } else {
      console.error("No se encontró el rol del usuario en localStorage.");
    }
  }

  loadAllCursos(): void {
    this.authService.getAllCursos().subscribe(
      (response: any) => {
        if (Array.isArray(response)) {
          this.cursosInscritos = response
            .map((curso: Curso) => {
              const iconoUrl = `http://localhost:3000/uploads/${encodeURIComponent(
                curso.iconocursoNombre
              )}`;
              return {
                ...curso,
                iconocursoNombre: iconoUrl,
              };
            })
            .sort((a, b) => {
              return a.estado === b.estado ? 0 : a.estado ? -1 : 1;
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
          this.cursosInscritos = response
            .map((curso: Curso) => {
              const iconoUrl = `http://localhost:3000/uploads/${encodeURIComponent(
                curso.iconocursoNombre
              )}`;
              return {
                ...curso,
                iconocursoNombre: iconoUrl,
              };
            })
            .sort((a, b) => {
              return a.estado === b.estado ? 0 : a.estado ? -1 : 1;
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

  buscarCursos(): void {
    if (this.terminoBusqueda.trim() === "") {
      if (this.userRol === "admin") {
        this.loadAllCursos();
      } else if (this.userRol === "docente" && this.userEmail) {
        this.loadCursosByEmail(this.userEmail);
      }
    } else {
      this.cursosInscritos = this.cursosInscritos.filter((curso) =>
        curso.nombre_curso
          .toLowerCase()
          .includes(this.terminoBusqueda.toLowerCase())
      );
    }
  }

  realizarCurso(cursoId: string) {
    this.router.navigate(["/progreso_estudiante", cursoId]);
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
    this.alertMessage = "";
  }
}
