import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../components/auth/auth.service';
import { Curso } from './curso.model';
import { Router } from '@angular/router';

@Component({
  selector: 'extra-search-results',
  templateUrl: './buscar-cursos.html',
  styleUrls: ["./buscar-cursos.css"],
})
export class BuscarCursosPage implements OnInit {
  cursos: Curso[] = [];
  cursosInscritos: string[] = []; // Lista de IDs de cursos en los que el usuario está inscrito
  userId: string | null = null; // ID del usuario
  showError: boolean = false; // Mostrar alerta de error
  showSuccess: boolean = false; // Mostrar alerta de éxito
  alertMessage: string = ''; // Mensaje de la alerta
  terminoBusqueda: string = ''; // Término de búsqueda

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('user_Id'); // Obtener el ID del usuario desde localStorage
    if (this.userId) {
      this.getEnrolledCursos(this.userId); // Obtener la lista de cursos inscritos
    }
    this.loadAllCursos(); // Cargar todos los cursos disponibles
  }

  getEnrolledCursos(userId: string): void {
    this.authService.getEnrolledCursos(userId).subscribe(
      (response: any) => {
        this.cursosInscritos = response.cursosInscritos; // Asumimos que la respuesta contiene una lista de IDs de cursos
        console.log('Cursos inscritos del usuario:', this.cursosInscritos);
      },
      (error) => {
        console.error('Error al obtener cursos inscritos:', error);
      }
    );
  }

  loadAllCursos(): void {
    this.authService.getCursos().subscribe(
      (response: any) => {
        if (Array.isArray(response.data)) {
          this.cursos = response.data.map((curso: Curso) => {
            const iconoUrl = `http://localhost:3000/uploads/${encodeURIComponent(curso.iconocursoNombre)}`;
            console.log('URL del icono del curso:', iconoUrl);
            return {
              ...curso,
              iconocursoNombre: iconoUrl
            };
          });
        } else {
          console.error('La respuesta del servidor no contiene un arreglo válido de cursos:', response);
        }
      },
      (error) => {
        console.error('Error al obtener cursos:', error);
      }
    );
  }

  buscarCursos(): void {
    if (this.terminoBusqueda.trim() === '') {
      this.loadAllCursos(); // Cargar todos los cursos si el término de búsqueda está vacío
    } else {
      // Filtrar cursos por término de búsqueda
      this.cursos = this.cursos.filter(curso =>
        curso.nombre_curso.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
      );
    }
  }

  enrollUserInCurso(cursoId: string): void {
    if (this.cursosInscritos.includes(cursoId)) {
      this.showErrorAlert('Ya estás inscrito en este curso.');
    } else {
      if (this.userId) {
        this.authService.enrollUserInCurso(this.userId, cursoId).subscribe(
          (response) => {
            console.log('Usuario inscrito correctamente:', response);
            this.cursosInscritos.push(cursoId); // Añadir el curso a la lista de inscritos
            this.showSuccessAlert('Te has inscrito en el curso exitosamente.');
            this.router.navigate(['/mis-cursos']); // Redirigir al usuario a la página de mis cursos
          },
          (error) => {
            console.error('Error al inscribir usuario:', error);
            this.showErrorAlert('Error al inscribir usuario en el curso.');
          }
        );
      } else {
        console.error('No se encontró el ID del usuario en localStorage.');
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
    this.alertMessage = '';
  }
}
