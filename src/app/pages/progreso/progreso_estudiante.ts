import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppVariablesService } from '../../service/app-variables.service';
import { AuthService } from '../../components/auth/auth.service';

@Component({
  selector: 'progreso_estudiante',
  templateUrl: './progreso_estudiante.html',
  styleUrls: ["./progreso_estudiante.css"],
})
export class ProgresoEstudiantes implements OnInit {
  appVariables = this.appVariablesService.getAppVariables();
  userId: string;
  cursos: any[] = [];  
  chartOptions: any[] = [];  
  cursoIds: any[];

  constructor(private http: HttpClient, private appVariablesService: AppVariablesService, private authService: AuthService) {}

  ngOnInit() {
    this.loadData();  // Cargar datos al inicializar el componente
  }

  loadData(): void {
    this.authService.getDatos().subscribe(
      (response: any) => {
        if (response && response.data) {
          this.cursos = response.data;
          this.chartOptions = this.generateCharts();  // Generar gráficos
        } else {
          console.error('La respuesta del servidor no contiene datos:', response);
        }
      },
      (error) => {
        console.error('Error al obtener datos:', error);
      }
    );
  }

  generateCharts(): any[] {
    const groupedCursos = this.groupBy(this.cursos, 'cursoId');
    const chartOptionsArray = [];

    for (const cursoId in groupedCursos) {
      if (groupedCursos.hasOwnProperty(cursoId)) {
        const cursos = groupedCursos[cursoId];
        const nombreCurso = cursos[0].Nombre_Curso;  // Asumimos que todos los cursos tienen el mismo nombre
        chartOptionsArray.push({
          chart: this.getChartOptions(cursos, nombreCurso),
          tableData: cursos
        });
      }
    }

    return chartOptionsArray;
  }

  getChartOptions(cursos: any[], nombreCurso: string): any {
    const seriesData = [
        { name: 'Correctas', data: [] },
        { name: 'Incorrectas', data: [] }
    ]; // Para almacenar las series de datos
    const fases = [];  // Para almacenar los nombres de las fases

    // Agrupar las respuestas por fase
    const respuestasPorFase = this.groupBy(cursos, 'faseId');

    for (const faseId in respuestasPorFase) {
      if (respuestasPorFase.hasOwnProperty(faseId)) {
        const respuestas = respuestasPorFase[faseId];
        let totalRespuestasCorrectas = 0;
        let totalRespuestasIncorrectas = 0;

        // Sumar las respuestas correctas e incorrectas en cada fase
        respuestas.forEach(respuesta => {
          totalRespuestasCorrectas += this.countRespuestasCorrectas(respuesta.pregunta1);
          totalRespuestasCorrectas += this.countRespuestasCorrectas(respuesta.pregunta2);
          totalRespuestasCorrectas += this.countRespuestasCorrectas(respuesta.pregunta3);
          totalRespuestasCorrectas += this.countRespuestasCorrectas(respuesta.pregunta4);
          totalRespuestasCorrectas += this.countRespuestasCorrectas(respuesta.pregunta5);

          totalRespuestasIncorrectas += this.countRespuestasIncorrectas(respuesta.pregunta1);
          totalRespuestasIncorrectas += this.countRespuestasIncorrectas(respuesta.pregunta2);
          totalRespuestasIncorrectas += this.countRespuestasIncorrectas(respuesta.pregunta3);
          totalRespuestasIncorrectas += this.countRespuestasIncorrectas(respuesta.pregunta4);
          totalRespuestasIncorrectas += this.countRespuestasIncorrectas(respuesta.pregunta5);
        });

        seriesData[0].data.push(totalRespuestasCorrectas);
        seriesData[1].data.push(totalRespuestasIncorrectas);

        fases.push(faseId); // Asumiendo que faseId es el nombre de las fases
      }
    }

    return {
        series: seriesData,
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true,
                    customIcons: []
                },
                autoSelected: 'zoom'
            }
        },
        title: {
            text: 'Progreso en el curso ' + nombreCurso,
            align: 'center',
            style: {
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: this.appVariables.font.bodyFontFamily,
                color: this.appVariables.color.bodyColor
            }
        },
        colors: [this.appVariables.color.theme, this.appVariables.color.indigo, this.appVariables.color.inverse],
        xaxis: {
            categories: fases,  // Nombres de las fases en el eje X
            labels: {
                style: {
                    colors: this.appVariables.color.bodyColor,
                    fontSize: '12px',
                    fontFamily: this.appVariables.font.bodyFontFamily,
                    fontWeight: this.appVariables.font.bodyFontWeight
                }
            }
        },
        yaxis: {
            tickAmount: 5, // Ajusta esto según la cantidad de ticks que desees
            min: 0, // El valor mínimo en el eje Y
            title: {
                text: 'Respuestas',
                style: {
                    color: 'rgba(' + this.appVariables.color.bodyColorRgb + ', .5)',
                    fontSize: '12px',
                    fontFamily: this.appVariables.font.bodyFontFamily,
                    fontWeight: this.appVariables.font.bodyFontWeight
                }
            },
            labels: {
                style: {
                    colors: this.appVariables.color.bodyColor,
                    fontSize: '12px',
                    fontFamily: this.appVariables.font.bodyFontFamily,
                    fontWeight: this.appVariables.font.bodyFontWeight
                },
                formatter: function (val: number) {
                    return Math.floor(val); // Asegura que los ticks sean números enteros
                }
            }
        },
        legend: {
            fontFamily: this.appVariables.font.bodyFontFamily,
            labels: { colors: this.appVariables.color.bodyColor }
        },
        tooltip: {
            style: {
                fontSize: '12px',
                fontFamily: this.appVariables.font.bodyFontFamily
            }
        },
        grid: { borderColor: this.appVariables.color.borderColor },
        dataLabels: { enabled: false },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            }
        },
        fill: { opacity: 1 }
    };
  }

  countRespuestasCorrectas(respuesta: boolean): number {
    return respuesta ? 1 : 0;  // Convertir booleano en 1 o 0 para contar respuestas correctas
  }

  countRespuestasIncorrectas(respuesta: boolean): number {
    return respuesta ? 0 : 1;  // Convertir booleano en 0 o 1 para contar respuestas incorrectas
  }

  groupBy(array: any[], key: string): any {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
      return result;
    }, {});
  }
}

// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { AppVariablesService } from '../../service/app-variables.service';
// import { AuthService } from '../../components/auth/auth.service';

// @Component({
//   selector: 'progreso-estudiante',
//   templateUrl: './progreso_estudiante.html'
// })
// export class ProgresoEstudiantes implements OnInit {
//   appVariables = this.appVariablesService.getAppVariables();
//   userId: string;
//   cursos: any[] = [];  
//   chartOptions: any[] = [];  

//   constructor(
//     private http: HttpClient, 
//     private appVariablesService: AppVariablesService, 
//     private authService: AuthService
//   ) {}

//   ngOnInit() {
//     this.loadData();
//   }

//   loadData(): void {
//     this.authService.getDatos().subscribe(
//       (response: any) => {
//         if (response && response.data) {
//           this.cursos = response.data;
//           this.chartOptions = this.generateCharts();  // Generar gráficos
//         } else {
//           console.error('La respuesta del servidor no contiene datos:', response);
//         }
//       },
//       (error) => {
//         console.error('Error al obtener datos:', error);
//       }
//     );
//   }

//   generateCharts(): any[] {
//     const groupedCursos = this.groupBy(this.cursos, 'faseId');
//     const chartOptionsArray = [];

//     for (const faseId in groupedCursos) {
//       if (groupedCursos.hasOwnProperty(faseId)) {
//         const cursos = groupedCursos[faseId];
//         chartOptionsArray.push(this.getChartOptions(cursos, faseId));
//       }
//     }

//     return chartOptionsArray;
//   }

//   getChartOptions(cursos: any[], faseId: string): any {
//     let totalRespuestasCorrectas = 0;
//     let totalRespuestasIncorrectas = 0;

//     // Iterar sobre los cursos y sumar las respuestas correctas e incorrectas
//     cursos.forEach(curso => {
//       totalRespuestasCorrectas += this.countRespuestasCorrectas(curso.pregunta1);
//       totalRespuestasCorrectas += this.countRespuestasCorrectas(curso.pregunta2);
//       totalRespuestasCorrectas += this.countRespuestasCorrectas(curso.pregunta3);
//       totalRespuestasCorrectas += this.countRespuestasCorrectas(curso.pregunta4);
//       totalRespuestasCorrectas += this.countRespuestasCorrectas(curso.pregunta5);

//       totalRespuestasIncorrectas += this.countRespuestasIncorrectas(curso.pregunta1);
//       totalRespuestasIncorrectas += this.countRespuestasIncorrectas(curso.pregunta2);
//       totalRespuestasIncorrectas += this.countRespuestasIncorrectas(curso.pregunta3);
//       totalRespuestasIncorrectas += this.countRespuestasIncorrectas(curso.pregunta4);
//       totalRespuestasIncorrectas += this.countRespuestasIncorrectas(curso.pregunta5);
//     });

//     return {
//       series: [
//         { name: 'Correctas', data: [totalRespuestasCorrectas] },
//         { name: 'Incorrectas', data: [totalRespuestasIncorrectas] }
//       ],
//       chart: {
//         type: 'bar',
//         height: 350,
//         toolbar: {
//           show: true,
//           tools: {
//             download: true,
//             selection: true,
//             zoom: true,
//             zoomin: true,
//             zoomout: true,
//             pan: true,
//             reset: true,
//             customIcons: []
//           },
//           autoSelected: 'zoom'
//         }
//       },
//       title: {
//         text: 'Progreso en ' + faseId,
//         align: 'center',
//         style: {
//           fontSize: '14px',
//           fontWeight: '600',
//           fontFamily: this.appVariables.font.bodyFontFamily,
//           color: this.appVariables.color.bodyColor
//         }
//       },
//       colors: [this.appVariables.color.theme, this.appVariables.color.indigo, this.appVariables.color.inverse],
//       xaxis: {
//         categories: [faseId],  // Nombre de la fase en el eje X
//         labels: {
//           style: {
//             colors: this.appVariables.color.bodyColor,
//             fontSize: '12px',
//             fontFamily: this.appVariables.font.bodyFontFamily,
//             fontWeight: this.appVariables.font.bodyFontWeight
//           }
//         }
//       },
//       yaxis: {
//         tickAmount: 5, // Ajusta esto según la cantidad de ticks que desees
//         min: 0, // El valor mínimo en el eje Y
//         title: {
//           text: 'Respuestas',
//           style: {
//             color: 'rgba(' + this.appVariables.color.bodyColorRgb + ', .5)',
//             fontSize: '12px',
//             fontFamily: this.appVariables.font.bodyFontFamily,
//             fontWeight: this.appVariables.font.bodyFontWeight
//           }
//         },
//         labels: {
//           style: {
//             colors: this.appVariables.color.bodyColor,
//             fontSize: '12px',
//             fontFamily: this.appVariables.font.bodyFontFamily,
//             fontWeight: this.appVariables.font.bodyFontWeight
//           },
//           formatter: function (val: number) {
//             return Math.floor(val); // Asegura que los ticks sean números enteros
//           }
//         }
//       },
//       legend: {
//         fontFamily: this.appVariables.font.bodyFontFamily,
//         labels: { colors: this.appVariables.color.bodyColor }
//       },
//       tooltip: {
//         style: {
//           fontSize: '12px',
//           fontFamily: this.appVariables.font.bodyFontFamily
//         }
//       },
//       grid: { borderColor: this.appVariables.color.borderColor },
//       dataLabels: { enabled: false },
//       stroke: {
//         show: true,
//         width: 2,
//         colors: ['transparent']
//       },
//       plotOptions: {
//         bar: {
//           horizontal: false,
//           columnWidth: '55%',
//           endingShape: 'rounded'
//         }
//       },
//       fill: { opacity: 1 }
//     };
//   }

//   countRespuestasCorrectas(respuesta: boolean): number {
//     return respuesta ? 1 : 0;  // Convertir booleano en 1 o 0 para contar respuestas correctas
//   }

//   countRespuestasIncorrectas(respuesta: boolean): number {
//     return respuesta ? 0 : 1;  // Convertir booleano en 0 o 1 para contar respuestas incorrectas
//   }

//   groupBy(array: any[], key: string): any {
//     return array.reduce((result, currentValue) => {
//       (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
//       return result;
//     }, {});
//   }
// }
