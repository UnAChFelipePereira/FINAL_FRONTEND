import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../components/auth/auth.service';
import { Curso } from './curso.model';
import { Router } from '@angular/router';

@Component({
  selector: 'extra-search-results',
  templateUrl: './configuracion_curso.html',
  styleUrls: ["./configuracion_curso.css"],
})
export class ConfiguracionCurso implements OnInit {
  cursos: Curso[] = [];
  userId: string | null = null;
  showError: boolean = false; 
  showSuccess: boolean = false; 
  alertMessage: string = ''; 
  cursoAEliminar: string | null = null; 
  showConfirmation: boolean = false; 
  terminoBusqueda: string = ''; 

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadAllCursos(); 
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
      this.loadAllCursos();
    } else {
      this.cursos = this.cursos.filter(curso =>
        curso.nombre_curso.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
      );
    }
  }

  confirmarEliminacion(cursoId: string): void {
    this.cursoAEliminar = cursoId;
    this.showConfirmation = true; 
  }
  
  eliminarCurso(): void {
    if (this.cursoAEliminar) {
      this.authService.deleteCursoById(this.cursoAEliminar).subscribe(
        () => {
          console.log(`Curso con ID ${this.cursoAEliminar} eliminado correctamente.`);
          this.cursos = this.cursos.filter(curso => curso._id !== this.cursoAEliminar);
          this.showSuccessAlert('Curso eliminado correctamente.');
        },
        (error) => {
          console.error(`Error al eliminar curso con ID ${this.cursoAEliminar}:`, error);
          this.showErrorAlert('Error al eliminar curso.');
        }
      );
      this.showConfirmation = false; // Ocultar la alerta de confirmación después de iniciar la eliminación
      this.cursoAEliminar = null; // Limpiar ID del curso a eliminar
    }
  }

  editarCurso(cursoId: string){
      this.router.navigate(["/editar_curso", cursoId]);  
  }
  // confirmarEliminacion(cursoId: string): void {
  //   this.cursoAEliminar = cursoId;
  //   this.showConfirmation = true; // Mostrar la alerta de confirmación
  // }

  // eliminarCurso(): void {
  //   if (this.cursoAEliminar) {
  //     this.authService.deleteCursoById(this.cursoAEliminar).subscribe(
  //       () => {
  //         console.log(`Curso con ID ${this.cursoAEliminar} eliminado correctamente.`);
  //         this.showSuccessAlert('Curso eliminado correctamente.');
  //         this.cursos = this.cursos.filter(curso => curso._id !== this.cursoAEliminar);
  //       },
  //       (error) => {
  //         console.error(`Error al eliminar curso con ID ${this.cursoAEliminar}:`, error);
  //         this.showErrorAlert('Error al eliminar curso.');
  //       }
  //     );
  //     this.cursoAEliminar = null; 
  //   }
  // }

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
      this.loadAllCursos(); // Recargar la lista de cursos después de 5 segundos
      this.hideAlerts();
    }, 5000);
  }

  hideAlerts() {
    this.showError = false;
    this.showSuccess = false;
    this.showConfirmation = false;
    this.alertMessage = '';
  }
}
  // Método para

// import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../../components/auth/auth.service';
// import { Curso } from './curso.model';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'extra-search-results',
//   templateUrl: './configuracion_curso.html',
//   styleUrls: ["./configuracion_curso.css"],
// })
// export class ConfiguracionCurso implements OnInit {
//   cursos: Curso[] = [];
//   cursosInscritos: string[] = []; 
//   userId: string | null = null; 
//   showError: boolean = false; 
//   showSuccess: boolean = false; 
//   alertMessage: string = ''; 
//   terminoBusqueda: string = ''; 
//   cursoAEliminar: string | null = null;
//   showConfirmation: boolean = false;
//   constructor(private authService: AuthService, private router: Router) {}

//   ngOnInit(): void {
//     this.userId = localStorage.getItem('user_Id'); 
//     if (this.userId) {
//       this.getEnrolledCursos(this.userId); 
//     }
//     this.loadAllCursos(); 
//   }

//   getEnrolledCursos(userId: string): void {
//     this.authService.getEnrolledCursos(userId).subscribe(
//       (response: any) => {
//         this.cursosInscritos = response.cursosInscritos; 
//         console.log('Cursos inscritos del usuario:', this.cursosInscritos);
//       },
//       (error) => {
//         console.error('Error al obtener cursos inscritos:', error);
//       }
//     );
//   }

//   loadAllCursos(): void {
//     this.authService.getCursos().subscribe(
//       (response: any) => {
//         if (Array.isArray(response.data)) {
//           this.cursos = response.data.map((curso: Curso) => {
//             const iconoUrl = `http://localhost:3000/uploads/${encodeURIComponent(curso.iconocursoNombre)}`;
//             console.log('URL del icono del curso:', iconoUrl);
//             return {
//               ...curso,
//               iconocursoNombre: iconoUrl
//             };
//           });
//         } else {
//           console.error('La respuesta del servidor no contiene un arreglo válido de cursos:', response);
//         }
//       },
//       (error) => {
//         console.error('Error al obtener cursos:', error);
//       }
//     );
//   }

//   buscarCursos(): void {
//     if (this.terminoBusqueda.trim() === '') {
//       this.loadAllCursos();
//     } else {
     
//       this.cursos = this.cursos.filter(curso =>
//         curso.nombre_curso.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
//       );
//     }
//   }

//   enrollUserInCurso(cursoId: string): void {
//     if (this.cursosInscritos.includes(cursoId)) {
//       this.showErrorAlert('Ya estás inscrito en este curso.');
//     } else {
//       if (this.userId) {
//         this.authService.enrollUserInCurso(this.userId, cursoId).subscribe(
//           (response) => {
//             console.log('Usuario inscrito correctamente:', response);
//             this.cursosInscritos.push(cursoId); 
//             this.showSuccessAlert('Te has inscrito en el curso exitosamente.');
//             this.router.navigate(['/mis-cursos']); 
//           },
//           (error) => {
//             console.error('Error al inscribir usuario:', error);
//             this.showErrorAlert('Error al inscribir usuario en el curso.');
//           }
//         );
//       } else {
//         console.error('No se encontró el ID del usuario en localStorage.');
//       }
//     }
//   }

//   confirmarEliminacion(cursoId: string): void {
//     this.cursoAEliminar = cursoId;
//     this.alertMessage = '¿Estás seguro de que quieres eliminar este curso?';
//     this.showConfirmation = true; 
//   }


//   eliminarCurso(): void {
//     if (this.cursoAEliminar) {
//       this.authService.deleteCursoById(this.cursoAEliminar).subscribe(
//         () => {
//           console.log(`Curso con ID ${this.cursoAEliminar} eliminado correctamente.`);
//           this.cursos = this.cursos.filter(curso => curso._id !== this.cursoAEliminar);
//           this.showSuccessAlert('Curso eliminado correctamente.');
//         },
//         (error) => {
//           console.error(`Error al eliminar curso con ID ${this.cursoAEliminar}:`, error);
//           this.showErrorAlert('Error al eliminar curso.');
//         }
//       );
//       this.cursoAEliminar = null; // Limpiar ID del curso a eliminar
//     }
//   }
  
//   showErrorAlert(message: string) {
//     this.alertMessage = message;
//     this.showError = true;
//     setTimeout(() => {
//       this.hideAlerts();
//     }, 5000);
//   }

//   showSuccessAlert(message: string) {
//     this.alertMessage = message;
//     this.showSuccess = true;
//     setTimeout(() => {
//       this.hideAlerts();
//     }, 5000);
//   }

//   hideAlerts() {
//     this.showError = false;
//     this.showSuccess = false;
//     this.alertMessage = '';
//   }


// }