import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import {AuthServiceService} from '../auth/auth-service.service'
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  showPassword = false;
  passwordToggleIcon = 'eye-outline';

  get email(){
    return this.loginForm.get('email');
  }

  get senha(){
    return this.loginForm.get('senha');
  }

  public errorMessages ={
    email: [
      {type: 'required', message: 'Email é obrigatório'},
      {type: 'pattern', message: 'Por favor insira um email válido'}
    ],
    senha: [
      {type: 'required', message: 'Senha é obrigatória'},
      {type: 'minlength', message: 'Senha não poder ter menos que 6 caracteres'}
    ]
  }

  loginForm = this.FormBuilder.group({
    email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
    senha:  ['', [Validators.required, Validators.minLength(6)]]
  })

  constructor(
    private router: Router,
    private FormBuilder: FormBuilder,
    private auth:AuthServiceService
  ) { }

  ngOnInit() {
  }

  btnVoltar(){
    this.router.navigate(['home']);
  }

  btnShowHide(): void{
    this.showPassword = !this.showPassword;

    if(this.passwordToggleIcon == 'eye-outline'){
      this.passwordToggleIcon = 'eye-off-outline';
    }
    else{
      this.passwordToggleIcon = 'eye-outline';
    }

  }

  btnRecuperarSenha(){
    this.router.navigate(['esqueceu-senha']);
  }

  btnSemConta(){
    this.router.navigate(['cadastro']);
  }

  public submit(){
    if(this.loginForm.valid){
      //this.auth.login(this.loginForm.value).subscribe(res=>{
        //if(res.user)
          this.router.navigate(['tabs'])
        //else
        //alert('Preencha os campos corretamente!')
      //})

    }else {
      alert("Preencha os campos corretamente!");
    }
  }

}
