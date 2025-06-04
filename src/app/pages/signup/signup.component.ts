import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, FormsModule, NgIf], 
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {

  myForm: FormGroup;
  readonly PARAM_KEY: string = 'redirectTo';
  private redirectTo: string = null;

  constructor(private formBuilder: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  
  ) {
    this.myForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    },
      { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    const queryParams = this.activatedRoute.snapshot.queryParamMap;

    if (queryParams.has(this.PARAM_KEY)) {
      this.redirectTo = queryParams.get(this.PARAM_KEY);
    }
  }

  // Validator 
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPasswordControl = form.get('confirmPassword');
    const confirmPassword = confirmPasswordControl?.value;

    if (password !== confirmPassword && confirmPasswordControl) {
      confirmPasswordControl.setErrors({ mismatch: true });
    } else if (confirmPasswordControl) {
      confirmPasswordControl.setErrors(null);
    }
  }

  async submit() {
    if (this.myForm.valid) {
      const formData = this.myForm.value;
      const signupResult = await this.authService.signup(formData); // Registro

      if (signupResult.success) {
        //console.log('Registro exitoso', signupResult);      

        const authData = { email: formData.email, password: formData.password };
        const loginResult = await this.authService.login(authData, false);

        if (loginResult.success) {
          //console.log('Inicio de sesión exitoso', loginResult);


          const user = this.authService.getUser();
          const name = user ? user.name : null;

          Swal.fire({ // Cuadro de diálogo
            title: "Te has registrado con éxito",
            text: `¡Hola, ${name}!`,
            icon: 'success',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didClose: () => this.redirect()
          });

        } else {
          this.throwError("Error en el inicio de sesión");
        }

      } else {
        this.throwError("Error en el registro");
      }

    } else {
      this.throwError("Formulario no válido");
    }

  }

  // redirigir al usuario
  redirect() {
    if (this.redirectTo != null) {
      this.router.navigateByUrl(this.redirectTo);
    } else {
      this.router.navigate(['/polls-list']);
    }
  }

  throwError(error: string) {
    Swal.fire({ // Cuadro de diálogo
      title: "Se ha producido un error",
      text: error,
      icon: "error",
      confirmButtonText: "Vale"
    });
  }
}