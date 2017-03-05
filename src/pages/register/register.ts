import {Component, OnInit} from '@angular/core';
import {NavController, AlertController, } from 'ionic-angular';
import {AuthService} from '../../providers/auth-service';
import {Validators, FormGroup, FormControl, FormBuilder} from '@angular/forms';

@Component({
    selector: 'page-register',
    templateUrl: 'register.html'
})
export class RegisterPage implements OnInit {
    public registerForm: FormGroup; // our form model
    createSuccess = false;
    registerCredentials = {username: '', firstname: '', lastname: '', password: '',profession:''};

    constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, private _fb: FormBuilder) {}
    ngOnInit(): void {
        this.registerForm = this._fb.group({
            username: ['', [Validators.required, Validators.minLength(6)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            firstname: ['', [Validators.required, Validators.minLength(2)]],
            lastname: ['', [Validators.required, Validators.minLength(2)]],
            profession: ['', [Validators.required, Validators.minLength(2)]],
        });
    }
    public register() {
        this.registerCredentials = {
            username: this.registerForm.controls['username'].value,
            firstname: this.registerForm.controls['firstname'].value,
            lastname: this.registerForm.controls['lastname'].value,
            password: this.registerForm.controls['password'].value,
            profession: this.registerForm.controls['profession'].value,
        };
        this.auth.register(this.registerCredentials).subscribe(success => {
            if (success) {
                this.createSuccess = true;
                this.showPopup("Success", "Account created.");
            } else {

            }
        },
            error => {
                this.showPopup("Error", error);
            });
    }

    showPopup(title, text) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK',
                    handler: data => {
                        if (this.createSuccess) {
                            this.nav.popToRoot();
                        }
                    }
                }
            ]
        });
        alert.present();
    }
}