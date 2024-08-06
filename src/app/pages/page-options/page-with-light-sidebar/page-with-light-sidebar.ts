import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppSettings } from '../../../service/app-settings.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-with-light-sidebar',
  templateUrl: './page-with-light-sidebar.html'
})

export class PageSidebarLight implements OnDestroy {
  code: any;

  constructor(public appSettings: AppSettings, private http: HttpClient) {
    this.appSettings.appSidebarLight = true;
    this.appSettings.appHeaderInverse = true;
  }
  
  ngOnInit() {
  	this.http.get('assets/data/page-with-light-sidebar/code-1.json', { responseType: 'text' }).subscribe(data => {
    	this.code = data;
		});
  }

  ngOnDestroy() {
    this.appSettings.appSidebarLight = false;
    this.appSettings.appHeaderInverse = false;
  }
}
