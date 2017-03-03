import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AuthService} from '../../providers/auth-service';
@Component({
    selector: 'page-account',
    templateUrl: 'account.html'
})
export class AccountPage {
    name:string;

    constructor(public navCtrl: NavController, private auth: AuthService) {
        let info = this.auth.getUserInfo();
        let name = info.firstname + ' ' + info.lastname;
        console.log(info);
    }
    


}
