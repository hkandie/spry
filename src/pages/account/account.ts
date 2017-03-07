import {Component} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
import {AuthService} from '../../providers/auth-service';
import {Profile} from './profile';
import {LocationPage} from './location';
import {BlockContact} from './block.contacts';
@Component({
    selector: 'page-account',
    templateUrl: 'account.html'
})
export class AccountPage {
    name: string;
    proffession: string;
    profilePic: string;

    constructor(public navCtrl: NavController,
        public auth: AuthService,
        public modalCtrl: ModalController) {

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
        this.auth.getProfilePicInfo().subscribe(succ => {
            this.profilePic = succ;
            console.log(this.profilePic );
        });
    }
    editProfile() {
        let addWeatherModal = this.modalCtrl.create(Profile);

        addWeatherModal.present();
        addWeatherModal.onDidDismiss(data => {
            this.loadProfile();
        })
    }
    editLocationWise() {
        let addWeatherModal = this.modalCtrl.create(LocationPage);

        addWeatherModal.present();
        addWeatherModal.onDidDismiss(data => {

        })
    }
    editHiddenContacts() {
        let addWeatherModal = this.modalCtrl.create(BlockContact);

        addWeatherModal.present();
        addWeatherModal.onDidDismiss(data => {

        })
    }




}
