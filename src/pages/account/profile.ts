import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, AlertController, ActionSheetController, ToastController, Platform, LoadingController} from 'ionic-angular';
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
    registerCredentials = {username: '', firstname: '', lastname: '', profession: '', user_id: ''};
    passwordCredentials = {username: '', oldpassword: '', password: '', newpassword: '', user_id: ''};
    avatarCredentials = {current: '', password: '', password1: '', user_id: ''};
    password = new FormControl('', [Validators.required]);
    user_id: string;
    username: string;
    constructor(public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController, private alertCtrl: AlertController, private _fb: FormBuilder, public auth: AuthService, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {}
    ngOnInit(): void {
        this.registerForm = this._fb.group({
            username: ['', [Validators.required, Validators.minLength(6)]],
            firstname: ['', [Validators.required, Validators.minLength(2)]],
            lastname: ['', [Validators.required, Validators.minLength(2)]],
            profession: ['', [Validators.required, Validators.minLength(2)]],
        });
        this.passwordForm = this._fb.group({
            oldpassword: ['', [Validators.required, Validators.minLength(6)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            newpassword: ['', [Validators.required, Validators.minLength(6)]],
        });
        this.auth.getUserInfo().subscribe(succ => {
            let info = succ;
            this.registerForm.controls['firstname'].setValue(info.firstname);
            this.registerForm.controls['lastname'].setValue(info.lastname);
            this.registerForm.controls['profession'].setValue(info.title);
            this.registerForm.controls['username'].setValue(info.username);
            this.name = info.firstname + ' ' + info.lastname;
            this.user_id = info.user_id;
            this.username = info.username;
        });
    }

    public reset_password() {
        this.passwordCredentials = {
            oldpassword: this.passwordForm.controls['oldpassword'].value,
            password: this.passwordForm.controls['password'].value,
            newpassword: this.passwordForm.controls['newpassword'].value,
            user_id: this.user_id,
            username: this.username,
        };
        this.auth.reset_password(this.passwordCredentials).subscribe(success => {
            if (success) {
                this.createSuccess = true;
                this.showPopup("Success", "Password updated.");
                this.viewCtrl.dismiss();
            } else {

            }
        },
            error => {
                this.showPopup("Error", error);
            });


    }
    public save_profile() {
        this.registerCredentials = {
            username: this.registerForm.controls['username'].value,
            firstname: this.registerForm.controls['firstname'].value,
            lastname: this.registerForm.controls['lastname'].value,
            profession: this.registerForm.controls['profession'].value,
            user_id: this.user_id,
        };
        this.auth.edit_profile(this.registerCredentials).subscribe(success => {
            if (success) {
                this.createSuccess = true;
                this.showPopup("Success", "Profile updated.");
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
    public presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Select Image Source',
            buttons: [
                {
                    text: 'Load from Library',
                    handler: () => {
                        this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
                    }
                },
                {
                    text: 'Use Camera',
                    handler: () => {
                        this.takePicture(Camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
        actionSheet.present();
    }

}