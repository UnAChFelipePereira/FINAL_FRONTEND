import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AppVariablesService } from "../../service/app-variables.service";
import { AuthService } from "../../components/auth/auth.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "progreso_estudiante",
  templateUrl: "./progreso_estudiante.html",
  styleUrls: ["./progreso_estudiante.css"],
})
export class ProgresoEstudiantes implements OnInit {
  appVariables = this.appVariablesService.getAppVariables();
  userId: string;
  cursos: any[] = [];
  chartOptions: any[] = [];
  selectedCursoData: any[] = [];
  cursoIds: any[];
  cursoId: string;
  nombreCurso: string = "";
  fases: string[] = [];
  filteredCursoData: any[] = [];
  selectedFase: string;

  constructor(
    private http: HttpClient,
    private appVariablesService: AppVariablesService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.cursoId = this.route.snapshot.paramMap.get("cursoId");
    this.loadData();
  }

  loadData(): void {
    this.authService.getDatos().subscribe(
      (response: any) => {
        if (response && response.data) {
          this.cursos = response.data.filter(
            (curso) => curso.cursoId === this.cursoId
          );

          if (this.cursos.length > 0) {
            this.nombreCurso = this.cursos[0].Nombre_Curso;
          }

          this.selectedCursoData = this.cursos;
          this.fases = this.getUniqueFases(this.selectedCursoData);
          this.selectedFase = this.fases[0];
          this.filterDataByFase();
          this.calculateStats();
          this.chartOptions = this.generateCharts();
        } else {
          console.error(
            "La respuesta del servidor no contiene datos:",
            response
          );
        }
      },
      (error) => {
        console.error("Error al obtener datos:", error);
      }
    );
  }

  filterDataByFase(): void {
    this.filteredCursoData = this.selectedCursoData.filter(
      (item) => item.faseId === this.selectedFase
    );
  }

  selectFase(fase: string): void {
    this.selectedFase = fase;
    this.filterDataByFase();
  }

  getUniqueFases(data: any[]): string[] {
    const fasesSet = new Set(data.map((item) => item.faseId));
    return Array.from(fasesSet);
  }

  downloadCSV(): void {
    const headers = [
      "Nombre",
      "Apellido",
      "Email",
      "Tiempo en la fase",
      "Nota",
      "Pregunta 1",
      "Pregunta 2",
      "Pregunta 3",
      "Pregunta 4",
      "Pregunta 5",
    ];
    const rows = this.filteredCursoData.map((item) => [
      item.name,
      item.lastname,
      item.email,
      `${item.totalTime} minutos`,
      item.nota,
      item.pregunta1 ? "Correcta" : "Incorrecta",
      item.pregunta2 ? "Correcta" : "Incorrecta",
      item.pregunta3 ? "Correcta" : "Incorrecta",
      item.pregunta4 ? "Correcta" : "Incorrecta",
      item.pregunta5 ? "Correcta" : "Incorrecta",
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `fase_${this.selectedFase}_datos.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  generateCharts(): any[] {
    const groupedCursos = this.groupBy(this.cursos, "cursoId");
    const chartOptionsArray = [];

    for (const cursoId in groupedCursos) {
      if (groupedCursos.hasOwnProperty(cursoId)) {
        const cursos = groupedCursos[cursoId];
        const nombreCurso = cursos[0].Nombre_Curso;
        chartOptionsArray.push({
          chart: this.getChartOptions(cursos, nombreCurso),
          tableData: cursos,
        });
      }
    }

    return chartOptionsArray;
  }

  getChartOptions(cursos: any[], nombreCurso: string): any {
    const seriesData = [
      { name: "Correctas", data: [] },
      { name: "Incorrectas", data: [] },
    ];
    const fases = [];
    const respuestasPorFase = this.groupBy(cursos, "faseId");

    for (const faseId in respuestasPorFase) {
      if (respuestasPorFase.hasOwnProperty(faseId)) {
        const respuestas = respuestasPorFase[faseId];
        let totalRespuestasCorrectas = 0;
        let totalRespuestasIncorrectas = 0;
        respuestas.forEach((respuesta) => {
          totalRespuestasCorrectas += this.countRespuestasCorrectas(
            respuesta.pregunta1
          );
          totalRespuestasCorrectas += this.countRespuestasCorrectas(
            respuesta.pregunta2
          );
          totalRespuestasCorrectas += this.countRespuestasCorrectas(
            respuesta.pregunta3
          );
          totalRespuestasCorrectas += this.countRespuestasCorrectas(
            respuesta.pregunta4
          );
          totalRespuestasCorrectas += this.countRespuestasCorrectas(
            respuesta.pregunta5
          );

          totalRespuestasIncorrectas += this.countRespuestasIncorrectas(
            respuesta.pregunta1
          );
          totalRespuestasIncorrectas += this.countRespuestasIncorrectas(
            respuesta.pregunta2
          );
          totalRespuestasIncorrectas += this.countRespuestasIncorrectas(
            respuesta.pregunta3
          );
          totalRespuestasIncorrectas += this.countRespuestasIncorrectas(
            respuesta.pregunta4
          );
          totalRespuestasIncorrectas += this.countRespuestasIncorrectas(
            respuesta.pregunta5
          );
        });

        seriesData[0].data.push(totalRespuestasCorrectas);
        seriesData[1].data.push(totalRespuestasIncorrectas);

        fases.push(faseId);
      }
    }

    return {
      series: seriesData,
      chart: {
        type: "bar",
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
            customIcons: [],
          },
          autoSelected: "zoom",
        },
      },
      title: {
        text: "Progreso en el curso " + nombreCurso,
        align: "center",
        style: {
          fontSize: "14px",
          fontWeight: "600",
          fontFamily: this.appVariables.font.bodyFontFamily,
          color: this.appVariables.color.bodyColor,
        },
      },
      colors: [
        this.appVariables.color.theme,
        this.appVariables.color.indigo,
        this.appVariables.color.inverse,
      ],
      xaxis: {
        categories: fases,
        labels: {
          style: {
            colors: this.appVariables.color.bodyColor,
            fontSize: "12px",
            fontFamily: this.appVariables.font.bodyFontFamily,
            fontWeight: this.appVariables.font.bodyFontWeight,
          },
        },
      },
      yaxis: {
        tickAmount: 5,
        min: 0,
        title: {
          text: "Respuestas",
          style: {
            color: "rgba(" + this.appVariables.color.bodyColorRgb + ", .5)",
            fontSize: "12px",
            fontFamily: this.appVariables.font.bodyFontFamily,
            fontWeight: this.appVariables.font.bodyFontWeight,
          },
        },
        labels: {
          style: {
            colors: this.appVariables.color.bodyColor,
            fontSize: "12px",
            fontFamily: this.appVariables.font.bodyFontFamily,
            fontWeight: this.appVariables.font.bodyFontWeight,
          },
          formatter: function (val: number) {
            return Math.floor(val);
          },
        },
      },
      legend: {
        fontFamily: this.appVariables.font.bodyFontFamily,
        labels: { colors: this.appVariables.color.bodyColor },
      },
      tooltip: {
        style: {
          fontSize: "12px",
          fontFamily: this.appVariables.font.bodyFontFamily,
        },
      },
      grid: { borderColor: this.appVariables.color.borderColor },
      dataLabels: { enabled: false },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      fill: { opacity: 1 },
    };
  }

  getDataByFase(fase: string): any[] {
    return this.selectedCursoData.filter((item) => item.faseId === fase);
  }

  calculateStats() {
    this.selectedCursoData.forEach((curso) => {
      let correctasFase = 0;
      let incorrectasFase = 0;

      correctasFase += this.countRespuestasCorrectas(curso.pregunta1);
      correctasFase += this.countRespuestasCorrectas(curso.pregunta2);
      correctasFase += this.countRespuestasCorrectas(curso.pregunta3);
      correctasFase += this.countRespuestasCorrectas(curso.pregunta4);
      correctasFase += this.countRespuestasCorrectas(curso.pregunta5);

      incorrectasFase += this.countRespuestasIncorrectas(curso.pregunta1);
      incorrectasFase += this.countRespuestasIncorrectas(curso.pregunta2);
      incorrectasFase += this.countRespuestasIncorrectas(curso.pregunta3);
      incorrectasFase += this.countRespuestasIncorrectas(curso.pregunta4);
      incorrectasFase += this.countRespuestasIncorrectas(curso.pregunta5);

      curso.correctas = correctasFase;
      curso.incorrectas = incorrectasFase;
      curso.totalTime = curso.totalTime || 0;

      const totalPreguntasFase = correctasFase + incorrectasFase;
      curso.nota =
        totalPreguntasFase > 0 ? (correctasFase / totalPreguntasFase) * 100 : 0;
    });
  }

  countRespuestasCorrectas(respuesta: boolean): number {
    return respuesta ? 1 : 0;
  }

  countRespuestasIncorrectas(respuesta: boolean): number {
    return respuesta ? 0 : 1;
  }

  groupBy(array: any[], key: string): any {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      return result;
    }, {});
  }
}
