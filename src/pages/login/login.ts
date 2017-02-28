import {Component,  OnInit} from '@angular/core';
import {NavController, AlertController, LoadingController, Loading} from 'ionic-angular';
import {AuthService} from '../../providers/auth-service';
import {RegisterPage} from '../register/register';
import {HomePage} from '../home/home';
import {Validators, FormGroup, FormControl, FormBuilder} from '@angular/forms';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage  implements OnInit{
    public myForm: FormGroup; // our form model
    loading: Loading;
    registerCredentials = {username: '', password: ''};

    constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private _fb: FormBuilder) {}

    public createAccount() {
        this.nav.push(RegisterPage);
    }
    ngOnInit(): void {
        this.myForm = this._fb.group({
            username: ['', [Validators.required, Validators.minLength(6)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });



    }

    public login(myForm:FormGroup) {
        this.showLoading();
        this.registerCredentials = {username: this.myForm.controls['username'].value, password: this.myForm.controls['password'].value};
        this.auth.login(this.registerCredentials).subscribe(allowed => {
            if (allowed) {
                setTimeout(() => {
                    this.loading.dismiss();
                    this.nav.setRoot(HomePage)
                });
            } else {
                this.showError("Access Denied");
            }
        },
            error => {
                this.showError(error);
            });
    }

    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.loading.present();
    }

    showError(text) {
        setTimeout(() => {
            this.loading.dismiss();
        });

        let alert = this.alertCtrl.create({
            title: 'Fail',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present(prompt);
    }
}