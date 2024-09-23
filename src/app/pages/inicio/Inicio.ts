import { Component } from "@angular/core";
import { AppMenuService } from "../../service/app-menus.service";

@Component({
  selector: "Inicio",
  templateUrl: "./Inicio.html",
  styleUrls: ["./Inicio.css"],
})
export class InicioPage {
  menus: any[] = [];
  userName: string;
  userLastName: string;
  userRol: string;
  user_Id: string;

  ngOnInit() {
    this.menus = this.appMenuService.miMenu();
    this.userName = localStorage.getItem("userName");
    this.userLastName = localStorage.getItem("userLastName");
    this.userRol = localStorage.getItem("userRol");
    this.user_Id = localStorage.getItem("user_Id");

    console.log(this.userRol);
  }

  constructor(private appMenuService: AppMenuService) {}
}
