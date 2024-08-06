import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppSettings } from '../../service/app-settings.service';
import { AuthService } from '../../components/auth/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'settings-page',
  templateUrl: './settings-page.html',
  styleUrls:['./settings-page.css'],
})

export class SettingsPageV1 implements OnInit {
	//menus: any[] = [];
	@ViewChild('modalEdit') modalEdit: ElementRef;
	userData = { email: '', oldPassword: '', newPassword: '' };
	userName: string;
	userLastName: string;
	userEmail: string;
	showError = false;
	showSuccess = false;
	alertMessage = '';
	selectedFile: File | null = null;
	userProfile: any;
	fotoData: any ={fotoperfil:''}
	user_Id: string;
  
  constructor(public appSettings: AppSettings, private authService: AuthService,private router: Router) {
  }
  
  ngOnInit() {
		const sections = document.querySelectorAll('#bsSpyContent > div');
		const navLinks = document.querySelectorAll('#bsSpyTarget > a');
		const lastElHeight = sections[sections.length - 1].getBoundingClientRect().height;
		this.userName = localStorage.getItem('userName');
		this.userLastName = localStorage.getItem('userLastName');
		this.userEmail = localStorage.getItem('userEmail');
		this.user_Id = localStorage.getItem("user_Id");
		//localStorage.setItem('userProfilePic', response.user.profilePic);
		this.userProfile = localStorage.getItem('userProfilePic');
		


		console.log(this.userEmail);

		function activateNavLink(id) {
			navLinks.forEach((link) => {
				if (link && link.classList) {
					link.classList.remove('active');
				}
			});
			var target = document.querySelector(`nav a[href*='${id}']`);
			if (target) {
				target.classList.add('active');
			}
		}

		function isElementInViewport(el) {
			const rect = el.getBoundingClientRect();
			return (
				rect.top >= 0 &&
				rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
			);
		}

		function handleViewport() {
			let activeSection = null;
			for (let i = sections.length - 1; i >= 0; i--) {
				if (isElementInViewport(sections[i])) {
					activeSection = sections[i].getAttribute('id');
					activateNavLink(activeSection);
					break;
				}
			}

			let combinedHeight = 0;
			let sectionIndex = Array.from(sections).findIndex((section) => section.getAttribute('id') === activeSection);
			for (let i = sectionIndex; i < sections.length; i++) {
				combinedHeight += (sections[i] as HTMLElement).offsetHeight;
			}
			if (combinedHeight <= window.innerHeight) {
				activateNavLink(activeSection);
			}
		}

		window.onscroll = handleViewport;
		
		
		var elmTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="scroll-to"]'));
		var elmList = elmTriggerList.map(function(elm) {
			elm.onclick = function(e) {
				e.preventDefault();
		
				var targetAttr = (elm.getAttribute('data-target')) ? this.getAttribute('data-target') : this.getAttribute('href');
				var targetElm = document.querySelectorAll(targetAttr)[0];
				var targetHeader = document.querySelectorAll('.app-header')[0];
				var targetHeight = (targetHeader as HTMLElement).offsetHeight;
				var targetContent = document.querySelector('.app-content');
				var targetContentStyle = window.getComputedStyle(targetContent);
				var targetContentPadding = (targetContentStyle) ? parseInt(targetContentStyle.getPropertyValue('padding-top')) : 0;
			
				if (targetElm) {
					var targetTop = targetElm.offsetTop - targetHeight - targetContentPadding;
					window.scrollTo({top: targetTop, behavior: 'smooth'});
				}
			}
		});
  }
  validateFile(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }

  submitPhoto(fPhoto: NgForm) {
    const userId = localStorage.getItem("user_Id");

    if (!userId) {
      this.alertMessage = 'No se encontró el email del usuario.';
      return;
    }

    if (this.fotoData.fotoperfil instanceof File) {
      if (this.validateFile(this.fotoData.fotoperfil, ['image/jpeg'])) {
        const fileExtension = this.fotoData.fotoperfil.name.split('.').pop();
        const fileName = `${userId}.${fileExtension}`;
        this.uploadFile(this.fotoData.fotoperfil, fileName).then(
          () => {
            this.showSuccessAlert('Tu foto fue cambiada con éxito');
          },
          (error) => {
            console.error('Error al subir la imagen de perfil:', error);
            this.alertMessage = 'Error al guardar la imagen de perfil. Inténtalo de nuevo.';
          }
        );
      } else {
        this.alertMessage = 'Archivo en otro formato. La imagen de perfil debe ser JPG.';
      }
    } else {
      this.alertMessage = 'Por favor, selecciona un archivo para subir.';
    }
  }

  formSubmit(f: NgForm) {

	const formData = f.value;

	// Verificar si hay campos vacíos
	if (!formData.oldPassword || !formData.newPassword) {
		this.showErrorAlert('Por favor, complete los campos.');
		return;
	}

	if (f.valid) {
		if (formData.oldPassword == formData.newPassword) {
			this.showErrorAlert('Las contraseñas no pueden ser iguales');
			return;
		} else {
				this.authService.changePassword(this.userEmail, formData.oldPassword, formData.newPassword).subscribe(
					response => {

							this.showSuccessAlert('Tu clave fue cambiada con éxito');
					},
					error => {
						console.error('Error:', error);
						this.showErrorAlert('No se puede cambiar contraseña en este momento.');
					}
				);
			}
		}
	}




	uploadFile(file: File, fileName: string): Promise<any> {
		return new Promise((resolve, reject) => {
		  this.authService.uploadDoc(file).subscribe(
			response => {
			  console.log(`Archivo ${fileName} subido con éxito.`+ response);
			  resolve(fileName);
			},
			error => {

			}
		  );
		});
	  }
	
	  onFileChange(event: any, field: string, fileName: string) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
		  const file = input.files[0];
		  if (file instanceof File) {
			const fileExtension = file.name.split('.').pop();
			const finalFileName = `${fileName}.${fileExtension}`;
			const newFile = new File([file], finalFileName, { type: file.type });
			this.fotoData[field] = newFile;
			this.fotoData[`${field}Nombre`] = finalFileName; // Guardar nombre del archivo
			// this.saveToLocalStorage();
		  } else {
			console.error('El archivo seleccionado no es válido.');
		  }
		}
	  }
	

showErrorAlert(message: string) {
	this.alertMessage = message;
	this.showError = true;
	setTimeout(() => {
		this.hideAlerts();
	}, 20000);
}

showSuccessAlert(message: string) {
  this.alertMessage = message;
  this.showSuccess = true;
  setTimeout(() => {
	this.hideAlerts();
	this.router.navigate(['/settings-page']);
	window.location.reload();
  }, 4000); 
}

hideAlerts() {
	this.showError = false;
	this.showSuccess = false;
	this.alertMessage = '';
}


}

