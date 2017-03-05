import {Component} from '@angular/core';
import {AuthService} from '../../providers/auth-service';
import {PostService} from '../../providers/post-service';
import {LoginPage} from '../login/login';
import {NavController} from 'ionic-angular';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    displayData: {};

    constructor(private navCtrl: NavController, private auth: AuthService, private wall: PostService,) {
        let info = this.auth.getUserInfo();
        this.displayData = this.wall.fetch_posts();

    }
    public logout() {
        this.auth.logout().subscribe(succ => {
            this.navCtrl.setRoot(LoginPage)
        });
    }
    public getItem(event: any) {

    }

}
