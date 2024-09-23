import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../components/auth/auth.service";
import { Curso } from "./curso.model";
import { Router } from "@angular/router";

@Component({
  selector: "extra-search-results",
  templateUrl: "./ver_mi_progreso.html",
  styleUrls: ["./ver_mi_progreso.css"],
})
export class VerMiProgreso implements OnInit {
  cursosInscritos: Curso[] = [];
  user_Id: string;
  terminoBusqueda: string = "";
  showError: boolean = false;
  showSuccess: boolean = false;
  alertMessage: string = "";

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user_Id = localStorage.getItem("user_Id");
    if (this.user_Id) {
      this.getEnrolledCursos(this.user_Id);
    } else {
      console.error("No se encontró el ID del usuario en localStorage.");
    }
  }

  getEnrolledCursos(userId: string) {
    this.authService.getEnrolledCursos(userId).subscribe(
      (response) => {
        const cursoIds = response.cursosInscritos;

        cursoIds.forEach((cursoId: string) => {
          this.authService.getCursoById(cursoId).subscribe(
            (curso) => {
              const iconoUrl = `http://localhost:3000/uploads/${encodeURIComponent(
                curso.iconocursoNombre
              )}`;
              curso.iconocursoNombre = iconoUrl;

              this.cursosInscritos.push(curso);

              this.cursosInscritos.sort((a, b) => {
                return a.estado === b.estado ? 0 : a.estado ? -1 : 1;
              });
            },
            (error) => {
              console.error("Error al obtener los detalles del curso:", error);
            }
          );
        });
      },
      (error) => {
        console.error("Error al obtener cursos inscritos:", error);
      }
    );
  }

  buscarCursos(): void {
    if (this.terminoBusqueda.trim() === "") {
      this.cursosInscritos = [];
      this.getEnrolledCursos(this.user_Id);
    } else {
      this.cursosInscritos = this.cursosInscritos.filter((cursosInscritos) =>
        cursosInscritos.nombre_curso
          .toLowerCase()
          .includes(this.terminoBusqueda.toLowerCase())
      );
    }
  }

  realizarCurso(cursoId: string) {
    this.router.navigate(["/mi_progreso", cursoId]);
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
