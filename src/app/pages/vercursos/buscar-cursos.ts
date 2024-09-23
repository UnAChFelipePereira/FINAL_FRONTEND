import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../components/auth/auth.service";
import { Curso } from "./curso.model";
import { Router } from "@angular/router";

@Component({
  selector: "extra-search-results",
  templateUrl: "./buscar-cursos.html",
  styleUrls: ["./buscar-cursos.css"],
})
export class BuscarCursosPage implements OnInit {
  cursos: Curso[] = [];
  cursosInscritos: string[] = [];
  userId: string | null = null;
  showError: boolean = false;
  showSuccess: boolean = false;
  alertMessage: string = "";
  terminoBusqueda: string = "";

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem("user_Id");
    if (this.userId) {
      this.getEnrolledCursos(this.userId);
    }
    this.loadAllCursos();
  }

  getEnrolledCursos(userId: string): void {
    this.authService.getEnrolledCursos(userId).subscribe(
      (response: any) => {
        this.cursosInscritos = response.cursosInscritos;
      },
      (error) => {
        console.error("Error al obtener cursos inscritos:", error);
      }
    );
  }
  loadAllCursos(): void {
    this.authService.getCursos().subscribe(
      (response: any) => {
        if (Array.isArray(response.data)) {
          this.cursos = response.data
            .filter((curso: Curso) => curso.estado === true)
            .map((curso: Curso) => {
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
        console.error("Error al obtener cursos:", error);
      }
    );
  }

  buscarCursos(): void {
    if (this.terminoBusqueda.trim() === "") {
      this.loadAllCursos();
    } else {
      this.cursos = this.cursos.filter((curso) =>
        curso.nombre_curso
          .toLowerCase()
          .includes(this.terminoBusqueda.toLowerCase())
      );
    }
  }

  enrollUserInCurso(cursoId: string): void {
    if (this.cursosInscritos.includes(cursoId)) {
      this.showErrorAlert("Ya estás inscrito en este curso.");
    } else {
      if (this.userId) {
        this.authService.enrollUserInCurso(this.userId, cursoId).subscribe(
          (response) => {
            this.cursosInscritos.push(cursoId);
            this.showSuccessAlert("Te has inscrito en el curso exitosamente.");
            this.router.navigate(["/mis-cursos"]);
          },
          (error) => {
            console.error("Error al inscribir usuario:", error);
            this.showErrorAlert("Error al inscribir usuario en el curso.");
          }
        );
      } else {
        console.error("No se encontró el ID del usuario en localStorage.");
      }
    }
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
