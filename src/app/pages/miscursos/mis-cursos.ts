import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../components/auth/auth.service";
import { Router } from "@angular/router";
import { Curso } from "../vercursos/curso.model";

@Component({
  selector: "mis-cursos",
  templateUrl: "./mis-cursos.html",
  styleUrls: ["./mis-cursos.css"],
})
export class MisCursosPage implements OnInit {
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
  getEnrolledCursos(userId: string): void {
    this.authService.getEnrolledCursos(userId).subscribe(
      (response) => {
        const cursoIds = response.cursosInscritos;

        cursoIds.forEach((cursoId: string) => {
          this.authService.getCursoById(cursoId).subscribe(
            (curso) => {
              if (curso.estado) {
                const iconoUrl = `http://localhost:3000/uploads/${encodeURIComponent(
                  curso.iconocursoNombre
                )}`;
                curso.iconocursoNombre = iconoUrl;
                this.cursosInscritos.push(curso);
              }
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
      this.cursosInscritos = this.cursosInscritos.filter(
        (curso) =>
          curso.nombre_curso
            .toLowerCase()
            .includes(this.terminoBusqueda.toLowerCase()) && curso.estado
      );
    }
  }

  realizarCurso(cursoId: string) {
    this.router.navigate(["/primera_fase", cursoId]);
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
