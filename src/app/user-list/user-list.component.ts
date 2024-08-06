import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  user: any; // Solo un usuario individual, no un arreglo

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    const userId = 'ID_DEL_USUARIO_A_OBTENER'; // Reemplaza con el ID del usuario específico que deseas obtener
    this.userService.getUser(userId).subscribe(
      data => {
        this.user = data;
      },
      error => {
        console.error('Error fetching user', error);
      }
    );
  }
}
