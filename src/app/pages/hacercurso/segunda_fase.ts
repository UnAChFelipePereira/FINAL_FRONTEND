import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../components/auth/auth.service";
import { NgForm } from "@angular/forms";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Curso } from "../vercursos/curso.model";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-hacer-segundafase",
  templateUrl: "./segunda_fase.html",
  styleUrls: ["./segunda_fase.css"],
})
export class HacerSegundafase implements OnInit {
  curso: any;
  selectedAnswers: { [key: string]: string } = {};
  answeredQuestions: { [key: string]: boolean } = {};
  userId: string;
  cursoId: string;
  name: string;
  lastname: string;
  email: string;
  faseId: "Segunda Fase";
  Nombre_Curso: string;
  showError = false;
  showSuccess = false;
  alertMessage = "";
  showNextPhaseButton = false;
  formSubmitted = false;
  alreadyCompleted = false;
  cursos: Curso[] = [];
  timestampInicio: string;
  totalTimeFormatted: string;
  showConfirmationModal = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem("user_Id");
    this.name = localStorage.getItem("userName");
    this.lastname = localStorage.getItem("userLastName");
    this.email = localStorage.getItem("userEmail");
    const cursoId = this.route.snapshot.paramMap.get("id");
    const faseId = "Segunda Fase";

    if (cursoId) {
      localStorage.setItem("curso_Id", cursoId);
      this.cursoId = cursoId;

      this.authService
        .checkIfCourseCompleted(cursoId, this.userId, faseId)
        .subscribe(
          (completed) => {
            this.alreadyCompleted = completed;
            if (this.alreadyCompleted) {
              this.showNextPhaseButton = true;
              this.disableAnswers();
            } else {
              this.authService
                .checkIfCourseStarted(cursoId, this.userId, faseId)
                .subscribe(
                  (started) => {
                    if (started.started) {
                      this.timestampInicio = started.startTime;
                      this.showConfirmationModal = false;
                    } else {
                      this.openConfirmationModal();
                    }
                  },
                  (error) => {
                    console.error(
                      "Error al verificar si el curso ya fue iniciado:",
                      error
                    );
                  }
                );
            }
          },
          (error) => {
            console.error(
              "Error al verificar si el curso está completado:",
              error
            );
          }
        );

      this.getCursoDetalles(cursoId);
      this.loadAllData(cursoId);
    }
  }

  disableAnswers() {
    this.formSubmitted = true;
  }

  checkIfCourseStarted(cursoId: string, userId: string, faseId: string) {
    return this.authService.checkIfCourseStarted(cursoId, userId, faseId);
  }

  checkIfCourseCompleted(cursoId: string, userId: string, faseId: string) {
    this.authService.checkIfCourseCompleted(cursoId, userId, faseId).subscribe(
      (completed) => {
        this.alreadyCompleted = completed;
        if (this.alreadyCompleted) {
          this.showNextPhaseButton = true;
          this.formSubmitted = true;
        } else {
          this.openConfirmationModal();
        }
      },
      (error) => {
        console.error("Error al verificar si el curso está completado:", error);
      }
    );
  }

  getCursoDetalles(cursoId: string) {
    this.authService.getCursoById(cursoId).subscribe(
      (curso) => {
        this.curso = curso;
        if (!curso.estado) {
          this.showErrorAlert("Curso Inactivo");
          this.disableAnswers();
        }
      },
      (error) => {
        console.error("Error al obtener los detalles del curso:", error);
      }
    );
  }

  loadAllData(cursoId: string): void {
    this.authService.getCursoById(cursoId).subscribe(
      (curso) => {
        const archivo = `http://localhost:3000/uploads/${encodeURIComponent(
          curso.archivo_pt2Nombre
        )}`;
        this.cursos = [
          {
            ...curso,
            archivo_pt2: archivo,
          },
        ];
      },
      (error) => {
        console.error("Error al obtener curso por ID:", error);
      }
    );
  }

  selectAnswer(
    pregunta: string,
    selectedAnswer: string,
    correctAnswer: string
  ) {
    if (!this.alreadyCompleted) {
      this.selectedAnswers[pregunta] = selectedAnswer;
    }
  }

  submitAnswers(f: NgForm) {
    if (this.alreadyCompleted) {
      this.showErrorAlert(
        "El curso ya ha sido completado. No puedes enviar respuestas nuevamente."
      );
      return;
    }

    if (!this.areAllQuestionsAnswered()) {
      this.showErrorAlert(
        "Por favor responde todas las preguntas antes de enviar."
      );
      return;
    }

    const data = {
      userId: this.userId,
      cursoId: this.cursoId,
      faseId: "Segunda Fase",

      pregunta1: (this.answeredQuestions["pregunta1"] =
        this.selectedAnswers["pregunta1"] ===
        this.curso["respuestacorrectap1pt2"]),
      pregunta2: (this.answeredQuestions["pregunta2"] =
        this.selectedAnswers["pregunta2"] ===
        this.curso["respuestacorrectap2pt2"]),
      pregunta3: (this.answeredQuestions["pregunta3"] =
        this.selectedAnswers["pregunta3"] ===
        this.curso["respuestacorrectap3pt2"]),
      pregunta4: (this.answeredQuestions["pregunta4"] =
        this.selectedAnswers["pregunta4"] ===
        this.curso["respuestacorrectap4pt2"]),
      pregunta5: (this.answeredQuestions["pregunta5"] =
        this.selectedAnswers["pregunta5"] ===
        this.curso["respuestacorrectap5pt2"]),

      endTime: new Date(),
    };

    this.authService.endCourse(data).subscribe(
      (response) => {
        this.showSuccessAlert("Respuestas enviadas exitosamente!");
        this.formSubmitted = true;
        this.showNextPhaseButton = true;
        this.alreadyCompleted = true;
      },
      (error) => {
        this.showErrorAlert("Hubo un error al enviar las respuestas.");
        console.error("Error al enviar respuestas:", error);
      }
    );
  }

  areAllQuestionsAnswered(): boolean {
    return Object.keys(this.selectedAnswers).length === 5;
  }

  goToNextPhase(cursoId: string) {
    this.router.navigate(["/tercera_fase", cursoId]);
  }

  showSuccessAlert(message: string) {
    this.alertMessage = message;
    this.showSuccess = true;
    setTimeout(() => {
      this.hideAlerts();
    }, 20000);
  }

  showErrorAlert(message: string) {
    this.alertMessage = message;
    this.showError = true;
    setTimeout(() => {
      this.hideAlerts();
    }, 20000);
  }

  hideAlerts() {
    this.showError = false;
    this.showSuccess = false;
    this.alertMessage = "";
  }

  downloadFile() {
    const url = `http://localhost:3000/uploads/${encodeURIComponent(
      this.curso.archivo_pt2Nombre
    )}`;

    this.http.get(url, { responseType: "blob" }).subscribe(
      (blob: Blob) => {
        const blobUrl = window.URL.createObjectURL(blob);

        const anchor = document.createElement("a");
        anchor.style.display = "none";
        anchor.href = blobUrl;
        anchor.download = this.curso.archivo_pt2Nombre;

        document.body.appendChild(anchor);

        anchor.click();

        document.body.removeChild(anchor);

        window.URL.revokeObjectURL(blobUrl);
      },
      (error) => {
        console.error("Error al descargar el archivo:", error);
      }
    );
  }

  openConfirmationModal() {
    this.showConfirmationModal = true;
  }

  closeConfirmationModal(redirect: boolean = true) {
    if (redirect) {
      this.router.navigate(["/mis-cursos"]);
    } else {
      this.showConfirmationModal = false;
    }
  }

  startCourse() {
    const data = {
      userId: this.userId,
      name: this.name,
      lastname: this.lastname,
      email: this.email,
      cursoId: this.cursoId,
      Nombre_Curso: this.curso.nombre_curso,
      faseId: "Segunda Fase",
      startTime: new Date(),
    };

    this.authService.startCourse(data).subscribe(
      (response) => {
        this.closeConfirmationModal(false);
        this.timestampInicio = data.startTime.toISOString();
      },
      (error) => {
        this.showErrorAlert("Error al iniciar el curso.");
        console.error("Error al iniciar el curso:", error);
      }
    );
  }

  formatTotalTime(totalTime: number): string {
    const hours = Math.floor(totalTime / 3600);
    const minutes = Math.floor((totalTime % 3600) / 60);
    const seconds = Math.floor(totalTime % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  showTotalTime(totalTime: number) {
    this.totalTimeFormatted = this.formatTotalTime(totalTime);
  }
}
