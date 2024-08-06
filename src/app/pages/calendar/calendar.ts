import { Component, ViewChild, ElementRef } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap'; 
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { AuthService } from '../../components/auth/auth.service'; 

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.html',
})
export class CalendarPage {
  @ViewChild('externalEvents') externalEvents!: ElementRef;
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  cursosInscritos: any[] = [];
  calendarOptions: CalendarOptions;
  newEvento: any = {}; // Objeto para almacenar los datos del nuevo evento

  constructor(private authService: AuthService) {
    this.calendarOptions = this.getCalendarOptions();
  }

  ngOnInit() {
    this.loadCursosInscritos(); // Cargar cursos inscritos al inicializar
  }

  loadCursosInscritos() {
    const userId = localStorage.getItem('user_Id'); // Obtener el ID del usuario desde localStorage

    if (userId) {
      this.authService.getCursosInscritos(userId).subscribe(
        (response: any) => {
          const cursoIds: string[] = response.cursosInscritos || [];

          cursoIds.forEach(cursoId => {
            this.authService.getCursoById(cursoId).subscribe(
              (curso: any) => {
                this.cursosInscritos.push({
                  id: curso._id, // Guarda el ID del curso
                  nombre_curso: curso.nombre_curso,
                  color: '#00acac', // Puedes ajustar el color según tus necesidades
                  userId: userId // Guarda el ID del usuario
                });
                this.refreshCalendar(); // Actualiza el calendario con los nuevos eventos
              },
              (error) => {
                console.error('Error al obtener los detalles del curso:', error);
              }
            );
          });
        },
        (error) => {
          console.error('Error al obtener cursos inscritos:', error);
        }
      );
    } else {
      console.error('No se encontró el ID del usuario en localStorage.');
    }
  }

  saveEventsToBackend() {
    // Guardar eventos en el backend
    this.cursosInscritos.forEach(curso => {
      this.authService.guardarPosicionCurso(curso.id, curso.userId, curso.nuevaPosicion).subscribe(
        (response) => {
          console.log('Posición del curso actualizada correctamente.');
        },
        (error) => {
          console.error('Error al actualizar la posición del curso:', error);
        }
      );
    });
  }

  getCalendarOptions(): CalendarOptions {
    const savedEvents = JSON.parse(localStorage.getItem('cursosInscritos') || '[]');

    return {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, bootstrapPlugin, interactionPlugin],
      headerToolbar: {
        left: 'dayGridMonth,timeGridWeek,timeGridDay',
        center: 'title',
        right: 'prev,next today'
      },
      buttonText: {
        today: 'Today',
        month: 'Month',
        week: 'Week',
        day: 'Day'
      },
      editable: true,
      droppable: true, 
      themeSystem: 'bootstrap',
      events: savedEvents.map(event => ({
        title: event.nombre_curso,
        start: event.nuevaPosicion,
        color: event.color
      }))
    };
  }

  refreshCalendar() {
    this.calendarOptions = { ...this.calendarOptions }; 
  }

  async onSubmit() {
    try {
      await this.authService.addEvento(this.newEvento).toPromise();
      console.log('Evento agregado correctamente.');
      this.loadCursosInscritos(); 
    } catch (error) {
      console.error('Error al agregar evento:', error);
    }
  }

  guardarCambios() {

	this.cursosInscritos.forEach(curso => {
	  this.authService.guardarPosicionCurso(curso.id, curso.userId, curso.nuevaPosicion).subscribe(
		(response) => {
		  console.log('Posición del curso actualizada correctamente.');

		},
		(error) => {
		  console.error('Error al actualizar la posición del curso:', error);
		}
	  );
	});
  }

  ngAfterViewInit() {
    const containerEl = this.externalEvents.nativeElement;
    new Draggable(containerEl, {
      itemSelector: '.fc-event',
      eventData: (eventEl: HTMLElement) => ({
        title: eventEl.innerText,
        color: eventEl.getAttribute('data-color')
      })
    });
  
    const calendarApi = this.calendarComponent.getApi();
  
    // Configura el evento de soltar en el calendario
	calendarApi.on('eventDrop', (info) => {
		const evento = info.event;
		const cursoId = evento.extendedProps.id; // Asegúrate de obtener correctamente el ID del curso desde el evento
		const userId = localStorage.getItem('user_Id'); // Obtener el ID del usuario desde localStorage
		const nuevaPosicion = evento.start; // Captura la nueva posición del evento
	  
		if (userId) {
		  // Actualiza la posición del curso en la lista local
		  const curso = this.cursosInscritos.find(curso => curso.id === cursoId);
		  if (curso) {
			curso.nuevaPosicion = nuevaPosicion;
			console.log('Nueva posición del curso:', nuevaPosicion); // Verifica en la consola que capturas correctamente la posición
			this.guardarCambios(); // Llama al método para guardar automáticamente al soltar el evento en el calendario
		  }
		} else {
		  console.error('No se encontró el ID del usuario en localStorage.');
		}
	  });
  }
}
