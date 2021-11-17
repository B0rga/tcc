import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from  '@angular/common/http'
import { tap } from  'rxjs/operators'
import { Observable, BehaviorSubject } from  'rxjs'
import {User} from './user'
import { AuthResponse } from  './auth-response'
import { Storage } from '@ionic/storage-angular'
import {Router} from '@angular/router'
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus'
import {Login} from './login'
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  AUTH_SERVER_ADDRESS:  string  =  'http://localhost:8081'
  authSubject  =  new  BehaviorSubject(false)
  cookie:string
  private user:User
  constructor(
    private router: Router,
    private  httpClient:  HttpClient,
    private storage:Storage,
    private fb:Facebook
    ) { 
  }
  login(user: Login): Observable<AuthResponse>  {
    console.log(user)
    return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/user/login`, user).pipe(
      tap(async (res:  AuthResponse ) => {
        if(res.acesstoken){
          await this.storage.create()
          await this.storage.set("ACCESS_TOKEN", res.acesstoken)
          await this.storage.set("EXPIRES_IN", res.expiresin)
          await this.storage.set("USER", res.user)
          this.clearUser()
          this.authSubject.next(true)
        }
      },err=>this.errorHandling(err))

    )
  }
  clearUser(){
    this.user = null
  }
  errorHandling(err:HttpErrorResponse){
    if(err.status == 404){
      alert('Servidor indisponivel')
    }
  }
  createUser(user:User){
    this.user = user
  }
  singIn(): Observable<AuthResponse>  {
    return this.httpClient.post<AuthResponse>(`${this.AUTH_SERVER_ADDRESS}/user/create`, this.user).pipe(
      tap(async (res:  AuthResponse ) => {
        if(res.acesstoken){
            await this.storage.create()
            await this.storage.set("ACCESS_TOKEN", res.acesstoken)
            await this.storage.set("EXPIRES_IN", res.expiresin)
            this.authSubject.next(true)
        }
      },err=>this.errorHandling(err))

    )
  }
  sendMail(code){
    
    return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/user/emailVerification`,{Email: this.user.Email, Code: code})
    .pipe(
      tap(async (res)=>{
        
    }, err=>this.errorHandling(err)))
    
  }
  loginWithFacebook(){
    this.fb.login(['email','public_profile']).then(async (res:FacebookLoginResponse)=>{
      //this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/loginFb`,res).subscribe()
      await this.storage.create()
      await this.storage.set('ACESS_TOKEN',res.authResponse.accessToken)
      await this.storage.set('EXPIRES_IN',res.authResponse.expiresIn)
      this.router.navigate(['tabs'])
    })
  }
  getUser(username){
    this.httpClient.get(`${this.AUTH_SERVER_ADDRESS}/api/user/`)
  }
  loginWithGoogle(){
    GooglePlus.login({'webClientId':'251518684476-md8hta1ij3eqceu459mumbflf48n5l8v.apps.googleusercontent.com', 'offiline':true})
    .then(res=>console.log(res)).catch(err=>console.log(err))
  }
  async logado(){
    await this.storage.create()
    let token =  await this.storage.get("ACCESS_TOKEN")
    alert(token)
    if(token){
      this.router.navigate(['tabs'])
    }else{
      
      this.router.navigate(['home'])
    }
      
  }
  async logout(){
    await this.storage.create()
    await this.storage.remove("ACCESS_TOKEN")
    await this.storage.remove("EXPIRES_IN")
    this.authSubject.next(false)  
  }
 
}
