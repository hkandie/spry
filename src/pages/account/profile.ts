import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, AlertController, ActionSheetController, ToastController, Loading, Platform, LoadingController} from 'ionic-angular';
import {Validators, FormGroup, FormBuilder, FormControl} from '@angular/forms';
import {AuthService} from '../../providers/auth-service';
import {Camera, File, Transfer, FilePath} from 'ionic-native';
import {MY_CONFIG_TOKEN, MY_CONFIG, ApplicationConfig} from '../app/app-config';
declare var cordova: any;
@Component({
    selector: 'page-add',
    templateUrl: 'edit-profile.html'
})
export class Profile {
    public registerForm: FormGroup; // our form model
    public passwordForm: FormGroup; // our form model
    public avatarForm: FormGroup; // our form model
    lastImage: string = null;
    loading: Loading;
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
    public takePicture(sourceType) {
        // Create options for the Camera Dialog
        var options = {
            quality: 100,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };

        // Get the data of an image
        Camera.getPicture(options).then((imagePath) => {
            // Special handling for Android library
            if (this.platform.is('android') && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
                FilePath.resolveNativePath(imagePath)
                    .then(filePath => {
                        let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                        let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                    });
            } else {
                var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            }
        }, (err) => {
            this.presentToast('Error while selecting image.');
        });
    }
    private createFileName() {
        var d = new Date(),
            n = d.getTime(),
            newFileName = n + ".jpg";
        return newFileName;
    }

    // Copy the image to a local folder
    private copyFileToLocalDir(namePath, currentName, newFileName) {
        File.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
            this.lastImage = newFileName;
        }, error => {
            this.presentToast('Error while storing file.');
        });
    }

    private presentToast(text) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }

    // Always get the accurate path to your apps folder
    public pathForImage(img) {
        if (img === null) {
            return '';
        } else {
            return cordova.file.dataDirectory + img;
        }
    }
    public uploadImage() {
        // Destination URL
        var url = this.auth.endPoint + "avatar-upload";

        // File for Upload
        var targetPath = this.pathForImage(this.lastImage);

        // File name only
        var filename = this.lastImage;

        var options = {
            fileKey: "file",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: {'fileName': filename, user_id: this.user_id, username: this.username}
        };

        const fileTransfer = new Transfer();

        this.loading = this.loadingCtrl.create({
            content: 'Uploading...',
        });
        this.loading.present();

        // Use the FileTransfer to upload the image
        fileTransfer.upload(targetPath, url, options).then(data => {
            this.loading.dismissAll()
            this.presentToast('Image succesful uploaded.');
        }, err => {
            this.loading.dismissAll()
            this.presentToast('Error while uploading file.');
        });
    }

}