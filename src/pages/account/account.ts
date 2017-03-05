import {Component} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
import {AuthService} from '../../providers/auth-service';
import {Profile} from './profile';
@Component({
    selector: 'page-account',
    templateUrl: 'account.html'
})
export class AccountPage {
    name: string;
    proffession: string;

    constructor(public navCtrl: NavController, public auth: AuthService, public modalCtrl: ModalController) {

    }
    ionViewDidLoad() {
        this.loadProfile();
    }
    public loadProfile() {
        this.auth.getUserInfo().subscribe(succ => {
            let info = succ;
            this.name = info.firstname + ' ' + info.lastname;
            this.proffession = info.title;
        });
    }
    editProfile() {
        let addWeatherModal = this.modalCtrl.create(Profile);

        addWeatherModal.present();
        addWeatherModal.onDidDismiss(data => { 
            this.loadProfile();
        })
    }




}
