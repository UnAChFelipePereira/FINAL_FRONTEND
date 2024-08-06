import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../components/auth/auth.service";
import { NgForm } from "@angular/forms";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Curso } from "../vercursos/curso.model";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-hacer-primerafase",
  templateUrl: "./primera_fase.html",
  styleUrls: ["./primera_fase.css"],
})
export class HacerPrimerafase implements OnInit {
  curso: any;
  selectedAnswers: { [key: string]: string } = {};
  answeredQuestions: { [key: string]: boolean } = {};
  userId: string;
  cursoId: string;
  name: string;
  lastname: string;
  faseId:"Primera Fase";
  Nombre_Curso:string;
  showError = false;
  showSuccess = false;
  alertMessage = "";
  showNextPhaseButton = false;
  formSubmitted = false;
  alreadyCompleted = false;
  cursos: Curso[] = [];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('user_Id');
    const cursoId = this.route.snapshot.paramMap.get("id");
    const faseId = "Primera Fase";

    if (cursoId) {
      localStorage.setItem('curso_Id', cursoId);
      this.cursoId = cursoId;
      this.checkIfCourseCompleted(cursoId, this.userId,faseId);
      this.getCursoDetalles(cursoId);
      this.loadAllData(cursoId);
    }

  }

  checkIfCourseCompleted(cursoId: string, userId: string, faseId: string) {
    this.authService.checkIfCourseCompleted(cursoId, userId, faseId).subscribe(
      (completed) => {
        this.alreadyCompleted = completed;
        if (this.alreadyCompleted) {
          this.showNextPhaseButton = true;
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
      },
      (error) => {
        console.error("Error al obtener los detalles del curso:", error);
      }
    );
  }
  loadAllData(cursoId: string): void {
    this.authService.getCursoById(cursoId).subscribe(
      (curso) => {
        const archivo = `http://localhost:3000/uploads/${encodeURIComponent(curso.archivo_pt1Nombre)}`;
        console.log('URL del archivo es:', archivo);
        // Asignar curso con el archivo_pt1 asignado correctamente
        this.cursos = [{
          ...curso,
          archivo_pt1: archivo // Usar la URL del archivo directamente aquí
        }];
      },
      (error) => {
        console.error('Error al obtener curso por ID:', error);
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
    if (!this.areAllQuestionsAnswered()) {
      this.showErrorAlert("Por favor responde todas las preguntas antes de enviar.");
      return;
    }

    this.cursoId = localStorage.getItem('curso_Id');
    this.userId = localStorage.getItem('user_Id');
    this.name = localStorage.getItem('userName');
    this.lastname = localStorage.getItem('userLastName');
    this.faseId = "Primera Fase";
    this.Nombre_Curso = this.curso.nombre_curso;

    // Comparar las respuestas seleccionadas con las correctas
    this.answeredQuestions['pregunta1'] = this.selectedAnswers['pregunta1'] === this.curso['respuestacorrectap1pt1'];
    this.answeredQuestions['pregunta2'] = this.selectedAnswers['pregunta2'] === this.curso['respuestacorrectap2pt1'];
    this.answeredQuestions['pregunta3'] = this.selectedAnswers['pregunta3'] === this.curso['respuestacorrectap3pt1'];
    this.answeredQuestions['pregunta4'] = this.selectedAnswers['pregunta4'] === this.curso['respuestacorrectap4pt1'];
    this.answeredQuestions['pregunta5'] = this.selectedAnswers['pregunta5'] === this.curso['respuestacorrectap5pt1'];

    const formData = f.value;

    if (f.valid) {
      this.authService.crearprimerafase(
        this.userId,
        this.name,
        this.lastname,
        this.cursoId,
        this.Nombre_Curso,
        this.answeredQuestions['pregunta1'],
        this.answeredQuestions['pregunta2'],
        this.answeredQuestions['pregunta3'],
        this.answeredQuestions['pregunta4'],
        this.answeredQuestions['pregunta5'],
        this.faseId,
      ).subscribe(
        response => {
          this.showSuccessAlert('Respuestas enviadas exitosamente!');
          this.formSubmitted = true;
          this.showNextPhaseButton = true;
          this.alreadyCompleted = true;
          // Opcional: aquí podrías actualizar el estado de las preguntas y respuestas para mantenerlas visibles
        },
        error => {
          this.showErrorAlert('Hubo un error al enviar las respuestas.');
        }
      );
    }
  }

  areAllQuestionsAnswered(): boolean {
    return Object.keys(this.selectedAnswers).length === 5;
  }

  goToNextPhase(cursoId: string) {
    this.router.navigate(['/segunda_fase', cursoId]);
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
    const url = `http://localhost:3000/uploads/${encodeURIComponent(this.curso.archivo_pt1Nombre)}`;
    
    // Realizar la solicitud HTTP para obtener el archivo como un blob
    this.http.get(url, { responseType: 'blob' }).subscribe((blob: Blob) => {
      // Crear un objeto URL del blob
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Crear un enlace temporal en el documento
      const anchor = document.createElement('a');
      anchor.style.display = 'none';
      anchor.href = blobUrl;
      anchor.download = this.curso.archivo_pt1Nombre;

      // Agregar el enlace al cuerpo del documento
      document.body.appendChild(anchor);

      // Simular clic en el enlace para iniciar la descarga
      anchor.click();

      // Eliminar el enlace del cuerpo del documento
      document.body.removeChild(anchor);

      // Liberar el objeto URL del blob
      window.URL.revokeObjectURL(blobUrl);
    }, error => {
      console.error('Error al descargar el archivo:', error);
    });
  }  

}
