import { Component, Input, Output, EventEmitter, Renderer2, OnDestroy } from '@angular/core';
import { AppSettings } from '../../service/app-settings.service';
import { AppMenuService } from '../../service/app-menus.service';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

declare var slideToggle: any;

@Component({
  selector: 'header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnDestroy {

	icono: string = ''; 
	menus: any[] = [];
	userName: string;
  	userLastName: string;
	userEmail: string;
	user_Id: string;

  @Input() appSidebarTwo;
	@Output() appSidebarEndToggled = new EventEmitter<boolean>();
	@Output() appSidebarMobileToggled = new EventEmitter<boolean>();
	@Output() appSidebarEndMobileToggled = new EventEmitter<boolean>();
	
  toggleAppSidebarMobile() {
		this.appSidebarMobileToggled.emit(true);
  }
  
	toggleAppSidebarEnd() {
		this.appSidebarEndToggled.emit(true);
	}
	
  toggleAppSidebarEndMobile() {
		this.appSidebarEndMobileToggled.emit(true);
  }

	toggleAppTopMenuMobile() {
		var target = document.querySelector('.app-top-menu');
		if (target) {
			slideToggle(target);
		}
	}

	toggleAppHeaderMegaMenuMobile() {
	  this.appSettings.appHeaderMegaMenuMobileToggled = !this.appSettings.appHeaderMegaMenuMobileToggled;
	}

	ngOnDestroy() {
	  this.appSettings.appHeaderMegaMenuMobileToggled = false;
	}


	ngOnInit() {
		this.menus = this.appMenuService.miMenu(); 
		this.userName = localStorage.getItem('userName');
		this.userLastName = localStorage.getItem('userLastName');
		this.userLastName = localStorage.getItem('userLastName');
		this.userEmail = localStorage.getItem('userEmail');
		this.user_Id = localStorage.getItem("user_Id");

		this.getFile();
	  }


	//   getFile() {
	// 	if (this.user_Id) {
	// 	  const extensions = ['png', 'jpg', 'jpeg']; 
	  

	// 	  let perfil = '';
	// 	  for (const ext of extensions) {
	// 		const url = `http://localhost:3000/uploads/${encodeURIComponent(this.user_Id)}.jpg`;
	// 		if (this.urlExists(url)) { 
	// 		  perfil = url;
	// 		  break;
	// 		}
	// 	  }

	// 	  if (perfil === '') {
	// 		perfil = `http://localhost:3000/uploads/${encodeURIComponent(this.user_Id)}`;
	// 	  }
	  
	// 	  this.icono = perfil;
	// 	}
	//   }
	
	getFile() {
		if (this.user_Id) {
		  const extensions = ['jpg'];
		  let perfil = '';
	  
		  const checkFileExists = async (url: string) => {
			try {
			  const response = await this.http.head(url, { observe: 'response' }).toPromise();
			  return response.status === 200;
			} catch {
			  return false;
			}
		  };
	  
		  (async () => {
			for (const ext of extensions) {
			  const url = `http://localhost:3000/uploads/${encodeURIComponent(this.user_Id)}.${ext}`;
			  if (await checkFileExists(url)) {
				perfil = url;
				break;
			  }
			}
	  
			if (perfil === '') {
			  perfil = `http://localhost:3000/uploads/${encodeURIComponent('perfil')}.jpg`;
			}
	  
			this.icono = perfil;
		  })();
		}
	  }

	  urlExists(url: string): boolean {
		return true; 
	  }

	  cerrarSesion() {
		this.authService.logout();
	  }
  constructor(private renderer: Renderer2, public appSettings: AppSettings,private appMenuService: AppMenuService, private authService: AuthService, private http: HttpClient) {
  }
}
