import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, AlertController} from 'ionic-angular';
import {Validators, FormGroup, FormBuilder, FormControl} from '@angular/forms';
import {AuthService} from '../../providers/auth-service';

@Component({
    selector: 'page-add',
    templateUrl: 'edit-profile.html'
})
export class Profile {
    public registerForm: FormGroup; // our form model
    public passwordForm: FormGroup; // our form model
    public avatarForm: FormGroup; // our form model
    createSuccess = false;
    name: string;
    registerCredentials = {username: '', firstname: '', lastname: '', profession: ''};
    passwordCredentials = {password: '', current: '', lastname: '', profession: ''};
    password = new FormControl('', [Validators.required]);
    constructor(private alertCtrl: AlertController, private _fb: FormBuilder, public auth: AuthService, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {}
    ngOnInit(): void {
        this.registerForm = this._fb.group({
            username: ['', [Validators.required, Validators.minLength(6)]],
            firstname: ['', [Validators.required, Validators.minLength(2)]],
            lastname: ['', [Validators.required, Validators.minLength(2)]],
            profession: ['', [Validators.required, Validators.minLength(2)]],
        });
        this.passwordForm = this._fb.group({
            current: ['', [Validators.required, Validators.minLength(6)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            password1: ['', [Validators.required, this.passwordMatch]],
        });
        this.auth.getUserInfo().subscribe(succ => {
            let info = succ;
            this.registerForm.controls['firstname'].setValue(info.firstname);
            this.registerForm.controls['lastname'].setValue(info.lastname);
            this.registerForm.controls['profession'].setValue(info.title);
            this.registerForm.controls['username'].setValue(info.username);
            this.name = info.firstname + ' ' + info.lastname;
        });
    }

    save() {
        this.registerCredentials = {
            username: this.registerForm.controls['username'].value,
            firstname: this.registerForm.controls['firstname'].value,
            lastname: this.registerForm.controls['lastname'].value,
            profession: this.registerForm.controls['profession'].value,
        };
        this.auth.register(this.registerCredentials).subscribe(success => {
            if (success) {
                this.createSuccess = true;
                this.showPopup("Success", "Account created.");
                this.viewCtrl.dismiss();
            } else {

            }
        },
            error => {
                this.showPopup("Error", error);
            });


    }
    public showPopup(title, text) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK',
                    handler: data => {
                        if (this.createSuccess) {
                            this.viewCtrl.dismiss();
                        }
                    }
                }
            ]
        });
        alert.present();
    }
    public closeModal() {
        this.viewCtrl.dismiss();
    }
    private passwordMatch() {
        let that = this;
        return (c: FormControl) => {
            return (c.value == that.password.value) ? null : {'passwordMatch': {valid: false}};
        }
    }

}