import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Observable, catchError, last, tap, throwError } from "rxjs";
import { CanActivate,ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Curso } from "../../pages/vercursos/curso.model";
import { ProgresoEstudiantes } from "../../pages/progreso/progreso.model";

@Injectable({
  providedIn: "root",
})
export class AuthService implements CanActivate {
  access_token = "";

  private apiUrllogin = "http://localhost:3000/users/login";
  private apiUrlregister = "http://localhost:3000/users/register";
  private apiUrlperfil = "http://localhost:3000/users/perfil";
  private apiUrlforgot = "http://localhost:3000/users/forgot-password";
  private apiUrlreset = "http://localhost:3000/users/reset-password";
  private apiUlrchange = "http://localhost:3000/users/change-password";
  private apiUrlfoto = "http://localhost:3000/users/upload-profile-picture";
  private apiUrlCurso = "http://localhost:3000/cursos/create";
  private apiUrlBuscarCurso = "http://localhost:3000/cursos/buscar-curso";
  private baseCursos = "http://localhost:3000/users";
  private baseCurso = "http://localhost:3000/cursos";
  private event = "http://localhost:3000/eventos/crear";
  private eventos = "http://localhost:3000/eventos";
  private primerafase = "http://localhost:3000/primerafase/crear";
  private primerafasecheck = "http://localhost:3000/primerafase";
  private obtenerdatos = "http://localhost:3000/primerafase";
  private buscarDatosCursos = "http://localhost:3000/primerafase"
  private subir = "http://localhost:3000/files/upload"


  constructor(private http: HttpClient, private router: Router) {}

  register(
    name: string,
    lastname: string,
    email: string,
    password: string,
    rol: string
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrlregister}`, {
      name,
      email,
      lastname,
      password,
      rol
    });
  }

  crearcurso(
    nombre_curso: string,
    nombre_profesor: string,
    descripcion: string,
    iconocursoNombre: string,
    archivo_pt1Nombre: string,
    descripcionpt1: string,
    pregunta1pt1: string,
    respuesta1p1pt1: string,
    respuesta2p1pt1: string,
    respuesta3p1pt1: string,
    respuesta4p1pt1: string,
    respuestacorrectap1pt1: string,
    pregunta2pt1: string,
    respuesta1p2pt1: string,
    respuesta2p2pt1: string,
    respuesta3p2pt1: string,
    respuesta4p2pt1: string,
    respuestacorrectap2pt1: string,
    pregunta3pt1: string,
    respuesta1p3pt1: string,
    respuesta2p3pt1: string,
    respuesta3p3pt1: string,
    respuesta4p3pt1: string,
    respuestacorrectap3pt1: string,
    pregunta4pt1: string,
    respuesta1p4pt1: string,
    respuesta2p4pt1: string,
    respuesta3p4pt1: string,
    respuesta4p4pt1: string,
    respuestacorrectap4pt1: string,
    pregunta5pt1: string,
    respuesta1p5pt1: string,
    respuesta2p5pt1: string,
    respuesta3p5pt1: string,
    respuesta4p5pt1: string,
    respuestacorrectap5pt1: string,
    archivo_pt2Nombre: string,
    descripcionpt2: string,
    pregunta1pt2: string,
    respuesta1p1pt2: string,
    respuesta2p1pt2: string,
    respuesta3p1pt2: string,
    respuesta4p1pt2: string,
    respuestacorrectap1pt2: string,
    pregunta2pt2: string,
    respuesta1p2pt2: string,
    respuesta2p2pt2: string,
    respuesta3p2pt2: string,
    respuesta4p2pt2: string,
    respuestacorrectap2pt2: string,
    pregunta3pt2: string,
    respuesta1p3pt2: string,
    respuesta2p3pt2: string,
    respuesta3p3pt2: string,
    respuesta4p3pt2: string,
    respuestacorrectap3pt2: string,
    pregunta4pt2: string,
    respuesta1p4pt2: string,
    respuesta2p4pt2: string,
    respuesta3p4pt2: string,
    respuesta4p4pt2: string,
    respuestacorrectap4pt2: string,
    pregunta5pt2: string,
    respuesta1p5pt2: string,
    respuesta2p5pt2: string,
    respuesta3p5pt2: string,
    respuesta4p5pt2: string,
    respuestacorrectap5pt2: string,
    archivo_pt3Nombre: string,
    descripcionpt3: string,
    pregunta1pt3: string,
    respuesta1p1pt3: string,
    respuesta2p1pt3: string,
    respuesta3p1pt3: string,
    respuesta4p1pt3: string,
    respuestacorrectap1pt3: string,
    pregunta2pt3: string,
    respuesta1p2pt3: string,
    respuesta2p2pt3: string,
    respuesta3p2pt3: string,
    respuesta4p2pt3: string,
    respuestacorrectap2pt3: string,
    pregunta3pt3: string,
    respuesta1p3pt3: string,
    respuesta2p3pt3: string,
    respuesta3p3pt3: string,
    respuesta4p3pt3: string,
    respuestacorrectap3pt3: string,
    pregunta4pt3: string,
    respuesta1p4pt3: string,
    respuesta2p4pt3: string,
    respuesta3p4pt3: string,
    respuesta4p4pt3: string,
    respuestacorrectap4pt3: string,
    pregunta5pt3: string,
    respuesta1p5pt3: string,
    respuesta2p5pt3: string,
    respuesta3p5pt3: string,
    respuesta4p5pt3: string,
    respuestacorrectap5pt3: string,
    archivo_pt4Nombre: string,
    descripcionpt4: string,
    pregunta1pt4: string,
    respuesta1p1pt4: string,
    respuesta2p1pt4: string,
    respuesta3p1pt4: string,
    respuesta4p1pt4: string,
    respuestacorrectap1pt4: string,
    pregunta2pt4: string,
    respuesta1p2pt4: string,
    respuesta2p2pt4: string,
    respuesta3p2pt4: string,
    respuesta4p2pt4: string,
    respuestacorrectap2pt4: string,
    pregunta3pt4: string,
    respuesta1p3pt4: string,
    respuesta2p3pt4: string,
    respuesta3p3pt4: string,
    respuesta4p3pt4: string,
    respuestacorrectap3pt4: string,
    pregunta4pt4: string,
    respuesta1p4pt4: string,
    respuesta2p4pt4: string,
    respuesta3p4pt4: string,
    respuesta4p4pt4: string,
    respuestacorrectap4pt4: string,
    pregunta5pt4: string,
    respuesta1p5pt4: string,
    respuesta2p5pt4: string,
    respuesta3p5pt4: string,
    respuesta4p5pt4: string,
    respuestacorrectap5pt4: string,
    archivo_pt5Nombre: string,
    descripcionpt5: string,
    pregunta1pt5: string,
    respuesta1p1pt5: string,
    respuesta2p1pt5: string,
    respuesta3p1pt5: string,
    respuesta4p1pt5: string,
    respuestacorrectap1pt5: string,
    pregunta2pt5: string,
    respuesta1p2pt5: string,
    respuesta2p2pt5: string,
    respuesta3p2pt5: string,
    respuesta4p2pt5: string,
    respuestacorrectap2pt5: string,
    pregunta3pt5: string,
    respuesta1p3pt5: string,
    respuesta2p3pt5: string,
    respuesta3p3pt5: string,
    respuesta4p3pt5: string,
    respuestacorrectap3pt5: string,
    pregunta4pt5: string,
    respuesta1p4pt5: string,
    respuesta2p4pt5: string,
    respuesta3p4pt5: string,
    respuesta4p4pt5: string,
    respuestacorrectap4pt5: string,
    pregunta5pt5: string,
    respuesta1p5pt5: string,
    respuesta2p5pt5: string,
    respuesta3p5pt5: string,
    respuesta4p5pt5: string,
    respuestacorrectap5pt5: string
  ) {
    return this.http.post<any>(`${this.apiUrlCurso}`, {
      nombre_curso,
      nombre_profesor,
      descripcion,
      iconocursoNombre,
      archivo_pt1Nombre,
      descripcionpt1,
      pregunta1pt1,
      respuesta1p1pt1,
      respuesta2p1pt1,
      respuesta3p1pt1,
      respuesta4p1pt1,
      respuestacorrectap1pt1,
      pregunta2pt1,
      respuesta1p2pt1,
      respuesta2p2pt1,
      respuesta3p2pt1,
      respuesta4p2pt1,
      respuestacorrectap2pt1,
      pregunta3pt1,
      respuesta1p3pt1,
      respuesta2p3pt1,
      respuesta3p3pt1,
      respuesta4p3pt1,
      respuestacorrectap3pt1,
      pregunta4pt1,
      respuesta1p4pt1,
      respuesta2p4pt1,
      respuesta3p4pt1,
      respuesta4p4pt1,
      respuestacorrectap4pt1,
      pregunta5pt1,
      respuesta1p5pt1,
      respuesta2p5pt1,
      respuesta3p5pt1,
      respuesta4p5pt1,
      respuestacorrectap5pt1,
      archivo_pt2Nombre,
      descripcionpt2,
      pregunta1pt2,
      respuesta1p1pt2,
      respuesta2p1pt2,
      respuesta3p1pt2,
      respuesta4p1pt2,
      respuestacorrectap1pt2,
      pregunta2pt2,
      respuesta1p2pt2,
      respuesta2p2pt2,
      respuesta3p2pt2,
      respuesta4p2pt2,
      respuestacorrectap2pt2,
      pregunta3pt2,
      respuesta1p3pt2,
      respuesta2p3pt2,
      respuesta3p3pt2,
      respuesta4p3pt2,
      respuestacorrectap3pt2,
      pregunta4pt2,
      respuesta1p4pt2,
      respuesta2p4pt2,
      respuesta3p4pt2,
      respuesta4p4pt2,
      respuestacorrectap4pt2,
      pregunta5pt2,
      respuesta1p5pt2,
      respuesta2p5pt2,
      respuesta3p5pt2,
      respuesta4p5pt2,
      respuestacorrectap5pt2,
      archivo_pt3Nombre,
      descripcionpt3,
      pregunta1pt3,
      respuesta1p1pt3,
      respuesta2p1pt3,
      respuesta3p1pt3,
      respuesta4p1pt3,
      respuestacorrectap1pt3,
      pregunta2pt3,
      respuesta1p2pt3,
      respuesta2p2pt3,
      respuesta3p2pt3,
      respuesta4p2pt3,
      respuestacorrectap2pt3,
      pregunta3pt3,
      respuesta1p3pt3,
      respuesta2p3pt3,
      respuesta3p3pt3,
      respuesta4p3pt3,
      respuestacorrectap3pt3,
      pregunta4pt3,
      respuesta1p4pt3,
      respuesta2p4pt3,
      respuesta3p4pt3,
      respuesta4p4pt3,
      respuestacorrectap4pt3,
      pregunta5pt3,
      respuesta1p5pt3,
      respuesta2p5pt3,
      respuesta3p5pt3,
      respuesta4p5pt3,
      respuestacorrectap5pt3,
      archivo_pt4Nombre,
      descripcionpt4,
      pregunta1pt4,
      respuesta1p1pt4,
      respuesta2p1pt4,
      respuesta3p1pt4,
      respuesta4p1pt4,
      respuestacorrectap1pt4,
      pregunta2pt4,
      respuesta1p2pt4,
      respuesta2p2pt4,
      respuesta3p2pt4,
      respuesta4p2pt4,
      respuestacorrectap2pt4,
      pregunta3pt4,
      respuesta1p3pt4,
      respuesta2p3pt4,
      respuesta3p3pt4,
      respuesta4p3pt4,
      respuestacorrectap3pt4,
      pregunta4pt4,
      respuesta1p4pt4,
      respuesta2p4pt4,
      respuesta3p4pt4,
      respuesta4p4pt4,
      respuestacorrectap4pt4,
      pregunta5pt4,
      respuesta1p5pt4,
      respuesta2p5pt4,
      respuesta3p5pt4,
      respuesta4p5pt4,
      respuestacorrectap5pt4,
      archivo_pt5Nombre,
      descripcionpt5,
      pregunta1pt5,
      respuesta1p1pt5,
      respuesta2p1pt5,
      respuesta3p1pt5,
      respuesta4p1pt5,
      respuestacorrectap1pt5,
      pregunta2pt5,
      respuesta1p2pt5,
      respuesta2p2pt5,
      respuesta3p2pt5,
      respuesta4p2pt5,
      respuestacorrectap2pt5,
      pregunta3pt5,
      respuesta1p3pt5,
      respuesta2p3pt5,
      respuesta3p3pt5,
      respuesta4p3pt5,
      respuestacorrectap3pt5,
      pregunta4pt5,
      respuesta1p4pt5,
      respuesta2p4pt5,
      respuesta3p4pt5,
      respuesta4p4pt5,
      respuestacorrectap4pt5,
      pregunta5pt5,
      respuesta1p5pt5,
      respuesta2p5pt5,
      respuesta3p5pt5,
      respuesta4p5pt5,
      respuestacorrectap5pt5,
    });
  }

  getCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrlBuscarCurso);
  }
  getIdCursos() {
    return this.http.get<{ data: Curso[] }>(`${this.baseCursos}`);
  }

  activateAccount(token: string): Observable<any> {
    return this.http.get<any>(`${this.baseCursos}/activate-account`, { params: { token } }).pipe(
      catchError(this.handleErrors)
    );
  }

  private handleErrors(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  // login(email: string, password: string): Observable<any> {
  //   return this.http.post<any>(this.apiUrllogin, { email, password }).pipe(
  //     tap((response) => {
  //       localStorage.setItem('access_token', response.access_token);
  //       localStorage.setItem('userEmail', response.user.email);
  //       localStorage.setItem('userName', response.user.name);
  //       localStorage.setItem('userLastName', response.user.lastname);
  //     }),
  //     catchError(this.handleError)
  //   );
  // }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrllogin}`, { email, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('userRole', response.user.role);
        localStorage.setItem('userEmail', response.user.email);
        localStorage.setItem('userName', response.user.name);
        localStorage.setItem('userLastName', response.user.lastname);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }

  perfil(
    email: string,
    name: string,
    lastname: string,
    profilePic: string
  ): Observable<any> {
    return this.http.post<any>(this.apiUrlperfil, {
      email,
      name,
      lastname,
      profilePic,
    });
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(this.apiUrlperfil);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrlforgot}`, { email });
  }

  changePassword(
    email: string,
    oldPassword: string,
    newPassword: string
  ): Observable<any> {
    return this.http.put<any>(`${this.apiUlrchange}`, {
       email,
      oldPassword,
      newPassword,
    });
  }

  resetPassword(newPassword: string, resetToken: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrlreset}`, {
      newPassword,
      resetToken,
    });
  }

  uploadProfilePic(file: File): Observable<any> {
    const formData = new FormData();
    formData.append("profilePic", file);

    return this.http.post<any>(`${this.apiUrlfoto}`, formData);
  }

  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userLastName");
    localStorage.removeItem("userProfilePic");

    this.router.navigate(["/login"]);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Obtener el token de acceso del almacenamiento local
    const token = localStorage.getItem("access_token");

    // Verificar si el token existe y no es nulo ni vacío
    if (token && token.trim() !== "") {
      // Si el token existe, verificar el rol del usuario si se ha proporcionado un rol esperado
      const expectedRole = route.data.expectedRole;
      if (expectedRole) {
        const currentUserRole = this.getCurrentUserRole();
        if (currentUserRole !== expectedRole) {
          // Si el rol del usuario no coincide con el rol esperado, redirigir y retornar falso
          console.log(`Acceso denegado. Rol esperado: ${expectedRole}, Rol del usuario: ${currentUserRole}`);
          this.router.navigate(["/inicio"]);
          return false;
        }
      }
      // Si no se ha proporcionado un rol esperado o el rol coincide, permitir el acceso
      console.log("Usuario autenticado. Permitiendo acceso.");
      return true;
    } else {
      // Si no hay token, redirigir al usuario al componente de login y retornar falso
      console.log("No se ha detectado ningún token. Redirigiendo al login.");
      this.router.navigate(["/login"]);
      return false;
    }
  }

  deleteCursoById(cursoId: string): Observable<any> {
    return this.http.delete(`${this.baseCurso}/${cursoId}`);
  }


  getCursoById(cursoId: string): Observable<any> {
    return this.http.get<any>(`${this.baseCurso}/${cursoId}`);
  }

  enrollUserInCurso(userId: string, cursoId: string) {
    return this.http.post<any>(
      `${this.baseCurso}/${userId}/enroll/${cursoId}`,
      { userId, cursoId },
    );
  }

  getEnrolledCursos(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseCursos}/${userId}/cursos-inscritos`);
  }

  getCursosInscritos(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseCursos}/${userId}/cursos-inscritos`);
  }

  updateCurso(id: string, cursoData: any): Observable<any> {
    return this.http.put(`${this.baseCurso}/${id}`, cursoData);
  }

  addEvento(evento: any): Observable<any> {
    const headers = new HttpHeaders(); // Aquí puedes configurar los headers según lo necesites

    return this.http.post<any>(this.event, evento, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Error al agregar evento:", error);
        return throwError(error);
      })
    );
  }

  guardarPosicionCurso(
    cursoId: string,
    userId: string,
    nuevaPosicion: any
  ): Observable<any> {
    return this.http.post<any>(`${this.event}/${userId}/${cursoId}`, {
      userId,
      cursoId,
      nuevaPosicion,
    });
  }

  actualizarPosicionCurso(
    cursoId: string,
    userId: string,
    nuevaPosicion: Date
  ): Observable<any> {
    // Asegúrate de que cursoId y userId estén en el orden correcto según tu backend
    return this.http.put<any>(
      `${this.eventos}/${userId}/${cursoId}/posicion`, // URL con userId, cursoId y 'posicion'
      { nuevaPosicion } // Envía solo la nuevaPosicion si es necesario
    );
  }




  getEventos(): Observable<any[]> {
    return this.http.get<any[]>(this.eventos);
  }

  crearprimerafase(
    userId: string,
    name: string,
    lastname: string,
    cursoId: string,
    Nombre_Curso: string,
    pregunta1: boolean,
    pregunta2: boolean,
    pregunta3: boolean,
    pregunta4: boolean,
    pregunta5: boolean,
    faseId: string
  ) {
    return this.http.post<any>(`${this.primerafase}/${userId}/${cursoId}`, {
      userId,
      name,
      lastname,
      cursoId,
      Nombre_Curso,
      pregunta1,
      pregunta2,
      pregunta3,
      pregunta4,
      pregunta5,
      faseId,
    });
  }

  checkIfCourseCompleted(cursoId: string, userId: string, faseId: string) {
    return this.http.get<boolean>(
      `${this.primerafasecheck}/${cursoId}/${userId}/${faseId}/completed`
    );
  }

  getCursosRealizados(userId: string): Observable<any> {
    return this.http.get(`${this.obtenerdatos}/cursos-realizados/${userId}`);
  }

  getDatos(): Observable<any> {
    return this.http.get<any>(this.buscarDatosCursos);
  }


  uploadDoc(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.subir}`, formData);
  }


  getCurrentUserRole(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.rol || 'estudiante';
  }

}
