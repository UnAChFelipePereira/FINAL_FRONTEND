import {
  Component,
  AfterViewInit,
  OnInit,
  ViewEncapsulation,
  HostListener,
} from "@angular/core";
import { Editor } from "ngx-editor";
import Tagify from "@yaireo/tagify";
import { FormGroup, NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AppSettings } from "../../service/app-settings.service";
import { AuthService } from "../../components/auth/auth.service";

@Component({
  selector: "crear_curso",
  templateUrl: "./crear_curso.html",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./crear_curso.css"],
})
export class Crear_curso implements OnInit, AfterViewInit {
  editor: Editor;
  completedSections: string[] = [];
  html = "";
  isProfesorEditable: boolean = true;
  userName: string;
  userLastName: string;
  user_Id: string;
  userRol: string;
  userEmail: string;
  emailusuario: string;

  cursoArchivos: any = {
    iconocurso: "",
    archivo_pt1: "",
    archivo_pt2: "",
    archivo_pt3: "",
    archivo_pt4: "",
    archivo_pt5: "",
  };

  cursoData: any = {
    nombre_curso: "",
    nombre_profesor: "",
    descripcion: "",
    tiempoestimado: "",
    iconocursoNombre: "",
    // archivo_pt1Nombre: null,
    archivo_pt1Nombre: "",
    descripcionpt1: "",
    pregunta1pt1: "",
    respuesta1p1pt1: "",
    respuesta2p1pt1: "",
    respuesta3p1pt1: "",
    respuesta4p1pt1: "",
    respuestacorrectap1pt1: null,
    pregunta2pt1: "",
    respuesta1p2pt1: "",
    respuesta2p2pt1: "",
    respuesta3p2pt1: "",
    respuesta4p2pt1: "",
    respuestacorrectap2pt1: null,
    pregunta3pt1: "",
    respuesta1p3pt1: "",
    respuesta2p3pt1: "",
    respuesta3p3pt1: "",
    respuesta4p3pt1: "",
    respuestacorrectap3pt1: null,
    pregunta4pt1: "",
    respuesta1p4pt1: "",
    respuesta2p4pt1: "",
    respuesta3p4pt1: "",
    respuesta4p4pt1: "",
    respuestacorrectap4pt1: null,
    pregunta5pt1: "",
    respuesta1p5pt1: "",
    respuesta2p5pt1: "",
    respuesta3p5pt1: "",
    respuesta4p5pt1: "",
    respuestacorrectap5pt1: null,
    // archivo_pt2Nombre: null,
    archivo_pt2Nombre: "",
    descripcionpt2: "",
    pregunta1pt2: "",
    respuesta1p1pt2: "",
    respuesta2p1pt2: "",
    respuesta3p1pt2: "",
    respuesta4p1pt2: "",
    respuestacorrectap1pt2: null,
    pregunta2pt2: "",
    respuesta1p2pt2: "",
    respuesta2p2pt2: "",
    respuesta3p2pt2: "",
    respuesta4p2pt2: "",
    respuestacorrectap2pt2: null,
    pregunta3pt2: "",
    respuesta1p3pt2: "",
    respuesta2p3pt2: "",
    respuesta3p3pt2: "",
    respuesta4p3pt2: "",
    respuestacorrectap3pt2: null,
    pregunta4pt2: "",
    respuesta1p4pt2: "",
    respuesta2p4pt2: "",
    respuesta3p4pt2: "",
    respuesta4p4pt2: "",
    respuestacorrectap4pt2: null,
    pregunta5pt2: "",
    respuesta1p5pt2: "",
    respuesta2p5pt2: "",
    respuesta3p5pt2: "",
    respuesta4p5pt2: "",
    respuestacorrectap5pt2: null,
    // archivo_pt3Nombre: null,
    archivo_pt3Nombre: "",
    descripcionpt3: "",
    pregunta1pt3: "",
    respuesta1p1pt3: "",
    respuesta2p1pt3: "",
    respuesta3p1pt3: "",
    respuesta4p1pt3: "",
    respuestacorrectap1pt3: null,
    pregunta2pt3: "",
    respuesta1p2pt3: "",
    respuesta2p2pt3: "",
    respuesta3p2pt3: "",
    respuesta4p2pt3: "",
    respuestacorrectap2pt3: null,
    pregunta3pt3: "",
    respuesta1p3pt3: "",
    respuesta2p3pt3: "",
    respuesta3p3pt3: "",
    respuesta4p3pt3: "",
    respuestacorrectap3pt3: null,
    pregunta4pt3: "",
    respuesta1p4pt3: "",
    respuesta2p4pt3: "",
    respuesta3p4pt3: "",
    respuesta4p4pt3: "",
    respuestacorrectap4pt3: null,
    pregunta5pt3: "",
    respuesta1p5pt3: "",
    respuesta2p5pt3: "",
    respuesta3p5pt3: "",
    respuesta4p5pt3: "",
    respuestacorrectap5pt3: null,
    // archivo_pt4Nombre: null,
    archivo_pt4Nombre: "",
    descripcionpt4: "",
    pregunta1pt4: "",
    respuesta1p1pt4: "",
    respuesta2p1pt4: "",
    respuesta3p1pt4: "",
    respuesta4p1pt4: "",
    respuestacorrectap1pt4: null,
    pregunta2pt4: "",
    respuesta1p2pt4: "",
    respuesta2p2pt4: "",
    respuesta3p2pt4: "",
    respuesta4p2pt4: "",
    respuestacorrectap2pt4: null,
    pregunta3pt4: "",
    respuesta1p3pt4: "",
    respuesta2p3pt4: "",
    respuesta3p3pt4: "",
    respuesta4p3pt4: "",
    respuestacorrectap3pt4: null,
    pregunta4pt4: "",
    respuesta1p4pt4: "",
    respuesta2p4pt4: "",
    respuesta3p4pt4: "",
    respuesta4p4pt4: "",
    respuestacorrectap4pt4: null,
    pregunta5pt4: "",
    respuesta1p5pt4: "",
    respuesta2p5pt4: "",
    respuesta3p5pt4: "",
    respuesta4p5pt4: "",
    respuestacorrectap5pt4: null,
    // archivo_pt5Nombre: null,
    archivo_pt5Nombre: "",
    descripcionpt5: "",
    pregunta1pt5: "",
    respuesta1p1pt5: "",
    respuesta2p1pt5: "",
    respuesta3p1pt5: "",
    respuesta4p1pt5: "",
    respuestacorrectap1pt5: null,
    pregunta2pt5: "",
    respuesta1p2pt5: "",
    respuesta2p2pt5: "",
    respuesta3p2pt5: "",
    respuesta4p2pt5: "",
    respuestacorrectap2pt5: null,
    pregunta3pt5: "",
    respuesta1p3pt5: "",
    respuesta2p3pt5: "",
    respuesta3p3pt5: "",
    respuesta4p3pt5: "",
    respuestacorrectap3pt5: null,
    pregunta4pt5: "",
    respuesta1p4pt5: "",
    respuesta2p4pt5: "",
    respuesta3p4pt5: "",
    respuesta4p4pt5: "",
    respuestacorrectap4pt5: null,
    pregunta5pt5: "",
    respuesta1p5pt5: "",
    respuesta2p5pt5: "",
    respuesta3p5pt5: "",
    respuesta4p5pt5: "",
    respuestacorrectap5pt5: null,
    estado: true,
  };
  courseForm: FormGroup;
  showError = false;
  showSuccess = false;
  alertMessage = "";

  constructor(
    private router: Router,
    public appSettings: AppSettings,
    private authService: AuthService
  ) {
    this.emailusuario = this.userEmail;
  }

  ngOnInit() {
    this.userRol = localStorage.getItem("userRol");
    this.userEmail = localStorage.getItem("userEmail");

    if (this.userRol === "docente") {
      this.userName = localStorage.getItem("userName");
      this.userLastName = localStorage.getItem("userLastName");
      this.user_Id = localStorage.getItem("user_Id");
      this.cursoData.nombre_profesor = `${this.userName} ${this.userLastName}`;
      this.cursoData.profesorEmail = this.userEmail;
      this.isProfesorEditable = false;
    } else if (this.userRol === "admin") {
      this.isProfesorEditable = true;
    }
  }

  validateFile(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }

  validateCursoData(): boolean {
    const requiredFields = [
      "nombre_curso",
      "nombre_profesor",
      "descripcion",
      "tiempoestimado",
      // 'iconocursoNombre',
      // 'archivo_pt1Nombre',
      "descripcionpt1",
      "pregunta1pt1",
      "respuesta1p1pt1",
      "respuesta2p1pt1",
      "respuesta3p1pt1",
      "respuesta4p1pt1",
      // 'respuestacorrectap1pt1',
      "pregunta2pt1",
      "respuesta1p2pt1",
      "respuesta2p2pt1",
      "respuesta3p2pt1",
      "respuesta4p2pt1",
      // 'respuestacorrectap2pt1',
      "pregunta3pt1",
      "respuesta1p3pt1",
      "respuesta2p3pt1",
      "respuesta3p3pt1",
      "respuesta4p3pt1",
      // 'respuestacorrectap3pt1',
      "pregunta4pt1",
      "respuesta1p4pt1",
      "respuesta2p4pt1",
      "respuesta3p4pt1",
      "respuesta4p4pt1",
      // 'respuestacorrectap4pt1',
      "pregunta5pt1",
      "respuesta1p5pt1",
      "respuesta2p5pt1",
      "respuesta3p5pt1",
      "respuesta4p5pt1",
      // 'respuestacorrectap5pt1',
      // 'archivo_pt2Nombre',
      "descripcionpt2",
      "pregunta1pt2",
      "respuesta1p1pt2",
      "respuesta2p1pt2",
      "respuesta3p1pt2",
      "respuesta4p1pt2",
      // 'respuestacorrectap1pt2',
      "pregunta2pt2",
      "respuesta1p2pt2",
      "respuesta2p2pt2",
      "respuesta3p2pt2",
      "respuesta4p2pt2",
      // 'respuestacorrectap2pt2',
      "pregunta3pt2",
      "respuesta1p3pt2",
      "respuesta2p3pt2",
      "respuesta3p3pt2",
      "respuesta4p3pt2",
      // 'respuestacorrectap3pt2',
      "pregunta4pt2",
      "respuesta1p4pt2",
      "respuesta2p4pt2",
      "respuesta3p4pt2",
      "respuesta4p4pt2",
      // 'respuestacorrectap4pt2',
      "pregunta5pt2",
      "respuesta1p5pt2",
      "respuesta2p5pt2",
      "respuesta3p5pt2",
      "respuesta4p5pt2",
      // 'respuestacorrectap5pt2',
      // 'archivo_pt3Nombre',
      "descripcionpt3",
      "pregunta1pt3",
      "respuesta1p1pt3",
      "respuesta2p1pt3",
      "respuesta3p1pt3",
      "respuesta4p1pt3",
      // 'respuestacorrectap1pt3',
      "pregunta2pt3",
      "respuesta1p2pt3",
      "respuesta2p2pt3",
      "respuesta3p2pt3",
      "respuesta4p2pt3",
      // 'respuestacorrectap2pt3',
      "pregunta3pt3",
      "respuesta1p3pt3",
      "respuesta2p3pt3",
      "respuesta3p3pt3",
      "respuesta4p3pt3",
      // 'respuestacorrectap3pt3',
      "pregunta4pt3",
      "respuesta1p4pt3",
      "respuesta2p4pt3",
      "respuesta3p4pt3",
      "respuesta4p4pt3",
      // 'respuestacorrectap4pt3',
      "pregunta5pt3",
      "respuesta1p5pt3",
      "respuesta2p5pt3",
      "respuesta3p5pt3",
      "respuesta4p5pt3",
      // 'respuestacorrectap5pt3',
      // 'archivo_pt4Nombre',
      "descripcionpt4",
      "pregunta1pt4",
      "respuesta1p1pt4",
      "respuesta2p1pt4",
      "respuesta3p1pt4",
      "respuesta4p1pt4",
      // 'respuestacorrectap1pt4',
      "pregunta2pt4",
      "respuesta1p2pt4",
      "respuesta2p2pt4",
      "respuesta3p2pt4",
      "respuesta4p2pt4",
      // 'respuestacorrectap2pt4',
      "pregunta3pt4",
      "respuesta1p3pt4",
      "respuesta2p3pt4",
      "respuesta3p3pt4",
      "respuesta4p3pt4",
      // 'respuestacorrectap3pt4',
      "pregunta4pt4",
      "respuesta1p4pt4",
      "respuesta2p4pt4",
      "respuesta3p4pt4",
      "respuesta4p4pt4",
      // 'respuestacorrectap4pt4',
      // 'pregunta5pt4',
      "respuesta1p5pt4",
      "respuesta2p5pt4",
      "respuesta3p5pt4",
      "respuesta4p5pt4",
      // 'respuestacorrectap5pt4',
      // 'archivo_pt5Nombre',
      "descripcionpt5",
      "pregunta1pt5",
      "respuesta1p1pt5",
      "respuesta2p1pt5",
      "respuesta3p1pt5",
      "respuesta4p1pt5",
      // 'respuestacorrectap1pt5',
      "pregunta2pt5",
      "respuesta1p2pt5",
      "respuesta2p2pt5",
      "respuesta3p2pt5",
      "respuesta4p2pt5",
      // 'respuestacorrectap2pt5',
      "pregunta3pt5",
      "respuesta1p3pt5",
      "respuesta2p3pt5",
      "respuesta3p3pt5",
      "respuesta4p3pt5",
      // 'respuestacorrectap3pt5',
      "pregunta4pt5",
      "respuesta1p4pt5",
      "respuesta2p4pt5",
      "respuesta3p4pt5",
      "respuesta4p4pt5",
      // 'respuestacorrectap4pt5',
      "pregunta5pt5",
      "respuesta1p5pt5",
      "respuesta2p5pt5",
      "respuesta3p5pt5",
      "respuesta4p5pt5",
      // 'respuestacorrectap5pt5'
    ];

    for (const field of requiredFields) {
      if (!this.cursoData[field] || this.cursoData[field].trim() === "") {
        return false;
      }
    }

    return true;
  }

  formSubmit(f: NgForm) {
    if (this.userRol === "admin" && this.cursoData.profesorEmail) {
      this.userEmail = this.cursoData.profesorEmail;
    }

    if (!this.validateCursoData()) {
      this.showErrorAlert(
        "Por favor, completa todos los campos para crear el curso."
      );
      return;
    }

    const uploadTasks: Promise<any>[] = [];

    if (this.cursoArchivos.iconocurso instanceof File) {
      if (this.validateFile(this.cursoArchivos.iconocurso, ["image/jpeg"])) {
        uploadTasks.push(
          this.uploadFile(this.cursoArchivos.iconocurso, "iconocursoNombre")
        );
      } else {
        this.showErrorAlert(
          "El icono del curso debe ser una imagen en formato JPG."
        );
        return;
      }
    }

    [
      "archivo_pt1",
      "archivo_pt2",
      "archivo_pt3",
      "archivo_pt4",
      "archivo_pt5",
    ].forEach((archivo, index) => {
      if (this.cursoArchivos[archivo] instanceof File) {
        const fileNameKey = `archivo_pt${index + 1}Nombre`;
        uploadTasks.push(
          this.uploadFile(this.cursoArchivos[archivo], fileNameKey)
        );
      }
    });

    Promise.all(uploadTasks)
      .then(() => {
        if (f.valid) {
          this.authService
            .crearcurso(
              this.cursoData.nombre_curso,
              this.cursoData.nombre_profesor,
              this.userEmail,
              this.cursoData.descripcion,
              this.cursoData.tiempoestimado,
              this.cursoData.iconocursoNombre,
              this.cursoData.archivo_pt1Nombre,
              this.cursoData.descripcionpt1,
              this.cursoData.pregunta1pt1,
              this.cursoData.respuesta1p1pt1,
              this.cursoData.respuesta2p1pt1,
              this.cursoData.respuesta3p1pt1,
              this.cursoData.respuesta4p1pt1,
              this.cursoData.respuestacorrectap1pt1,
              this.cursoData.pregunta2pt1,
              this.cursoData.respuesta1p2pt1,
              this.cursoData.respuesta2p2pt1,
              this.cursoData.respuesta3p2pt1,
              this.cursoData.respuesta4p2pt1,
              this.cursoData.respuestacorrectap2pt1,
              this.cursoData.pregunta3pt1,
              this.cursoData.respuesta1p3pt1,
              this.cursoData.respuesta2p3pt1,
              this.cursoData.respuesta3p3pt1,
              this.cursoData.respuesta4p3pt1,
              this.cursoData.respuestacorrectap3pt1,
              this.cursoData.pregunta4pt1,
              this.cursoData.respuesta1p4pt1,
              this.cursoData.respuesta2p4pt1,
              this.cursoData.respuesta3p4pt1,
              this.cursoData.respuesta4p4pt1,
              this.cursoData.respuestacorrectap4pt1,
              this.cursoData.pregunta5pt1,
              this.cursoData.respuesta1p5pt1,
              this.cursoData.respuesta2p5pt1,
              this.cursoData.respuesta3p5pt1,
              this.cursoData.respuesta4p5pt1,
              this.cursoData.respuestacorrectap5pt1,
              this.cursoData.archivo_pt2Nombre,
              this.cursoData.descripcionpt2,
              this.cursoData.pregunta1pt2,
              this.cursoData.respuesta1p1pt2,
              this.cursoData.respuesta2p1pt2,
              this.cursoData.respuesta3p1pt2,
              this.cursoData.respuesta4p1pt2,
              this.cursoData.respuestacorrectap1pt2,
              this.cursoData.pregunta2pt2,
              this.cursoData.respuesta1p2pt2,
              this.cursoData.respuesta2p2pt2,
              this.cursoData.respuesta3p2pt2,
              this.cursoData.respuesta4p2pt2,
              this.cursoData.respuestacorrectap2pt2,
              this.cursoData.pregunta3pt2,
              this.cursoData.respuesta1p3pt2,
              this.cursoData.respuesta2p3pt2,
              this.cursoData.respuesta3p3pt2,
              this.cursoData.respuesta4p3pt2,
              this.cursoData.respuestacorrectap3pt2,
              this.cursoData.pregunta4pt2,
              this.cursoData.respuesta1p4pt2,
              this.cursoData.respuesta2p4pt2,
              this.cursoData.respuesta3p4pt2,
              this.cursoData.respuesta4p4pt2,
              this.cursoData.respuestacorrectap4pt2,
              this.cursoData.pregunta5pt2,
              this.cursoData.respuesta1p5pt2,
              this.cursoData.respuesta2p5pt2,
              this.cursoData.respuesta3p5pt2,
              this.cursoData.respuesta4p5pt2,
              this.cursoData.respuestacorrectap5pt2,
              this.cursoData.archivo_pt3Nombre,
              this.cursoData.descripcionpt3,
              this.cursoData.pregunta1pt3,
              this.cursoData.respuesta1p1pt3,
              this.cursoData.respuesta2p1pt3,
              this.cursoData.respuesta3p1pt3,
              this.cursoData.respuesta4p1pt3,
              this.cursoData.respuestacorrectap1pt3,
              this.cursoData.pregunta2pt3,
              this.cursoData.respuesta1p2pt3,
              this.cursoData.respuesta2p2pt3,
              this.cursoData.respuesta3p2pt3,
              this.cursoData.respuesta4p2pt3,
              this.cursoData.respuestacorrectap2pt3,
              this.cursoData.pregunta3pt3,
              this.cursoData.respuesta1p3pt3,
              this.cursoData.respuesta2p3pt3,
              this.cursoData.respuesta3p3pt3,
              this.cursoData.respuesta4p3pt3,
              this.cursoData.respuestacorrectap3pt3,
              this.cursoData.pregunta4pt3,
              this.cursoData.respuesta1p4pt3,
              this.cursoData.respuesta2p4pt3,
              this.cursoData.respuesta3p4pt3,
              this.cursoData.respuesta4p4pt3,
              this.cursoData.respuestacorrectap4pt3,
              this.cursoData.pregunta5pt3,
              this.cursoData.respuesta1p5pt3,
              this.cursoData.respuesta2p5pt3,
              this.cursoData.respuesta3p5pt3,
              this.cursoData.respuesta4p5pt3,
              this.cursoData.respuestacorrectap5pt3,
              this.cursoData.archivo_pt4Nombre,
              this.cursoData.descripcionpt4,
              this.cursoData.pregunta1pt4,
              this.cursoData.respuesta1p1pt4,
              this.cursoData.respuesta2p1pt4,
              this.cursoData.respuesta3p1pt4,
              this.cursoData.respuesta4p1pt4,
              this.cursoData.respuestacorrectap1pt4,
              this.cursoData.pregunta2pt4,
              this.cursoData.respuesta1p2pt4,
              this.cursoData.respuesta2p2pt4,
              this.cursoData.respuesta3p2pt4,
              this.cursoData.respuesta4p2pt4,
              this.cursoData.respuestacorrectap2pt4,
              this.cursoData.pregunta3pt4,
              this.cursoData.respuesta1p3pt4,
              this.cursoData.respuesta2p3pt4,
              this.cursoData.respuesta3p3pt4,
              this.cursoData.respuesta4p3pt4,
              this.cursoData.respuestacorrectap3pt4,
              this.cursoData.pregunta4pt4,
              this.cursoData.respuesta1p4pt4,
              this.cursoData.respuesta2p4pt4,
              this.cursoData.respuesta3p4pt4,
              this.cursoData.respuesta4p4pt4,
              this.cursoData.respuestacorrectap4pt4,
              this.cursoData.pregunta5pt4,
              this.cursoData.respuesta1p5pt4,
              this.cursoData.respuesta2p5pt4,
              this.cursoData.respuesta3p5pt4,
              this.cursoData.respuesta4p5pt4,
              this.cursoData.respuestacorrectap5pt4,
              this.cursoData.archivo_pt5Nombre,
              this.cursoData.descripcionpt5,
              this.cursoData.pregunta1pt5,
              this.cursoData.respuesta1p1pt5,
              this.cursoData.respuesta2p1pt5,
              this.cursoData.respuesta3p1pt5,
              this.cursoData.respuesta4p1pt5,
              this.cursoData.respuestacorrectap1pt5,
              this.cursoData.pregunta2pt5,
              this.cursoData.respuesta1p2pt5,
              this.cursoData.respuesta2p2pt5,
              this.cursoData.respuesta3p2pt5,
              this.cursoData.respuesta4p2pt5,
              this.cursoData.respuestacorrectap2pt5,
              this.cursoData.pregunta3pt5,
              this.cursoData.respuesta1p3pt5,
              this.cursoData.respuesta2p3pt5,
              this.cursoData.respuesta3p3pt5,
              this.cursoData.respuesta4p3pt5,
              this.cursoData.respuestacorrectap3pt5,
              this.cursoData.pregunta4pt5,
              this.cursoData.respuesta1p4pt5,
              this.cursoData.respuesta2p4pt5,
              this.cursoData.respuesta3p4pt5,
              this.cursoData.respuesta4p4pt5,
              this.cursoData.respuestacorrectap4pt5,
              this.cursoData.pregunta5pt5,
              this.cursoData.respuesta1p5pt5,
              this.cursoData.respuesta2p5pt5,
              this.cursoData.respuesta3p5pt5,
              this.cursoData.respuesta4p5pt5,
              this.cursoData.respuestacorrectap5pt5,
              this.cursoData.estado
            )
            .subscribe(
              (response) => {
                this.showSuccessAlert("Curso creado exitosamente.");
                localStorage.removeItem("cursoData");
                localStorage.removeItem("cursoArchivos");
                this.router.navigate(["/buscar-cursos"]);
              },
              (error) => {
                console.error("Error al crear el curso:", error);
                this.showErrorAlert(
                  "Error al crear el curso. Inténtalo de nuevo."
                );
              }
            );
        }
      })
      .catch((error) => {
        this.showErrorAlert(
          "Error al guardar los archivos. Inténtalo de nuevo."
        );
      });
  }

  ngAfterViewInit() {
    new Tagify(document.querySelector("input[name=tags]"));
  }

  uploadFile(file: File, fileNameKey: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.authService.uploadDoc(file).subscribe(
        (response: any) => {
          if (response && response.file && response.file.filename) {
            this.cursoData[fileNameKey] = response.file.filename;
            resolve(response.file.filename);
          } else {
            reject("No se devolvió el nombre del archivo.");
          }
        },
        (error) => {
          console.error(`Error al subir archivo ${fileNameKey}:`, error);
          reject(error);
        }
      );
    });
  }

  onFileChange(event: any, field: string, fileName: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file instanceof File) {
        const fileExtension = file.name.split(".").pop();
        const finalFileName = `${fileName}.${fileExtension}`;
        const newFile = new File([file], finalFileName, { type: file.type });
        this.cursoArchivos[field] = newFile;
        this.cursoArchivos[`${field}Nombre`] = finalFileName;
        this.saveToLocalStorage();
      } else {
        console.error("El archivo seleccionado no es válido.");
      }
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem("cursoData", JSON.stringify(this.cursoData));
  }

  marcarComoCompletada(sectionId: string) {
    if (!this.completedSections.includes(sectionId)) {
      this.completedSections.push(sectionId);
    }
  }

  isSectionCompleted(sectionId: string): boolean {
    return this.completedSections.includes(sectionId);
  }

  isSectionActive(sectionId: string): boolean {
    const section = document.getElementById(sectionId);
    if (section) {
      const rect = section.getBoundingClientRect();
      return rect.top <= 0 && rect.bottom > 0;
    }
    return false;
  }

  validateNumberInput(event: KeyboardEvent): void {
    const inputChar = String.fromCharCode(event.keyCode);

    if (!/^\d+$/.test(inputChar)) {
      event.preventDefault();
    }
  }

  removeNegativeNumbers(): void {
    if (this.cursoData.tiempoestimado && this.cursoData.tiempoestimado < 0) {
      this.cursoData.tiempoestimado = this.cursoData.tiempoestimado.replace(
        /-/g,
        ""
      );
    }
  }

  @HostListener("window:scroll", ["$event"])
  onScroll(event: Event): void {
    const sectionIds = [
      "datos-curso",
      "primera-fase",
      "segunda-fase",
      "tercera-fase",
      "cuarta-fase",
      "quinta-fase",
    ];

    for (const sectionId of sectionIds) {
      if (this.isSectionActive(sectionId)) {
        this.marcarComoCompletada(sectionId);
        break;
      }
    }
  }

  private showErrorAlert(message: string) {
    this.showError = true;
    this.alertMessage = message;
    setTimeout(() => {
      this.showError = false;
      this.alertMessage = "";
    }, 5000);
  }

  private showSuccessAlert(message: string) {
    this.showSuccess = true;
    this.alertMessage = message;
    setTimeout(() => {
      this.showSuccess = false;
      this.alertMessage = "";
    }, 5000);
  }
}
