import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AppVariablesService } from "../../service/app-variables.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "mi_progreso",
  templateUrl: "./mi_progreso.html",
  styleUrls: ["./mi_progreso.css"],
})
export class MiProgreso implements OnInit {
  appVariables = this.appVariablesService.getAppVariables();
  userId: string;
  cursoId: string;
  cursos: any[] = [];
  nombreCurso: string = "";

  chartOptions: any[] = [];

  totalTime: number = 0;
  totalCorrectas: number = 0;
  totalIncorrectas: number = 0;
  selectedCursoData: any[] = [];
  nota: number = 0;

  constructor(
    private http: HttpClient,
    private appVariablesService: AppVariablesService,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.cursoId = this.route.snapshot.paramMap.get("cursoId");
    this.loadData();
  }

  loadData() {
    this.userId = localStorage.getItem("user_Id");

    this.http
      .get<any[]>(
        `http://localhost:3000/primerafase/${this.userId}?cursoId=${this.cursoId}`
      )
      .subscribe((data) => {
        this.cursos = data.filter((curso) => curso.cursoId === this.cursoId);

        if (this.cursos.length > 0) {
          this.nombreCurso = this.cursos[0].Nombre_Curso;
        } else {
          this.getCursoNombre();
        }

        this.selectedCursoData = this.cursos;
        this.chartOptions = this.generateCharts();
        this.calculateStats();
      });
  }

  getCursoNombre() {
    this.http
      .get<any>(`http://localhost:3000/cursos/${this.cursoId}`)
      .subscribe((curso) => {
        this.nombreCurso = curso
          ? curso.Nombre_Curso
          : "Nombre del curso no disponible";
      });
  }

  generateCharts(): any[] {
    const groupedCursos = this.groupBy(this.cursos, "cursoId");
    const chartOptionsArray = [];

    for (const cursoId in groupedCursos) {
      if (groupedCursos.hasOwnProperty(cursoId)) {
        const cursos = groupedCursos[cursoId];
        const nombreCurso = cursos[0].Nombre_Curso;
        chartOptionsArray.push(this.getChartOptions(cursos, nombreCurso));
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

    cursos.forEach((curso) => {
      let totalRespuestasCorrectas = 0;
      let totalRespuestasIncorrectas = 0;

      totalRespuestasCorrectas += this.countRespuestasCorrectas(
        curso.pregunta1
      );
      totalRespuestasCorrectas += this.countRespuestasCorrectas(
        curso.pregunta2
      );
      totalRespuestasCorrectas += this.countRespuestasCorrectas(
        curso.pregunta3
      );
      totalRespuestasCorrectas += this.countRespuestasCorrectas(
        curso.pregunta4
      );
      totalRespuestasCorrectas += this.countRespuestasCorrectas(
        curso.pregunta5
      );

      totalRespuestasIncorrectas += this.countRespuestasIncorrectas(
        curso.pregunta1
      );
      totalRespuestasIncorrectas += this.countRespuestasIncorrectas(
        curso.pregunta2
      );
      totalRespuestasIncorrectas += this.countRespuestasIncorrectas(
        curso.pregunta3
      );
      totalRespuestasIncorrectas += this.countRespuestasIncorrectas(
        curso.pregunta4
      );
      totalRespuestasIncorrectas += this.countRespuestasIncorrectas(
        curso.pregunta5
      );

      seriesData[0].data.push(totalRespuestasCorrectas);
      seriesData[1].data.push(totalRespuestasIncorrectas);

      fases.push(curso.faseId);
    });

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

  calculateStats() {
    this.totalCorrectas = 0;
    this.totalIncorrectas = 0;
    this.totalTime = 0;

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

      this.totalCorrectas += correctasFase;
      this.totalIncorrectas += incorrectasFase;
      this.totalTime += curso.totalTime;
    });
  }
}
