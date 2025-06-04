import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../../components/footer/footer.component";
import { NavComponent } from "../../components/nav/nav.component";
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [FooterComponent, NavComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent implements OnInit {

  userForm: FormGroup;

  user: any | null = null; //datos del usuario
  isEditing = false; //modo edición


  constructor(private formBuild: FormBuilder, private authService: AuthService,
    private router: Router, private apiService: ApiService) {

    this.userForm = this.formBuild.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['']
    });

    
  }

  async ngOnInit() {

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    this.actualizarUser();
  }

  
  actualizarUser() {
    this.user = this.authService.getUser();

    // poner los datos en el formulario
    if (this.user) {
      this.userForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        address: this.user.address,
      });
    }
  }


  //logica para habilitar la edición solo en el campo necesario
  edit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) { // restaura los datos
      this.userForm.reset(this.user);
    }
  }

 


  // envia cambios para mofidicar el usuario
  onSubmit(): void {
    if (this.userForm.valid) {

      this.apiService.updateUser(this.userForm.value).subscribe(
        () => {
          this.isEditing = false;
          this.authService.updateUserData(this.userForm.value);
        }
      );
      Swal.fire({ // Cuadro de diálogo
        title: "Perfil actualizado correctamente.",
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didClose: () => this.actualizarUser()
      });
    }
  }
}

