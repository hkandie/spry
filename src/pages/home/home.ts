import {Component} from '@angular/core';
import {AuthService} from '../../providers/auth-service';
import {LoginPage} from '../login/login';
import {NavController} from 'ionic-angular';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    displayData: {};

    constructor(private navCtrl: NavController, private auth: AuthService) {
        this.displayData = [
            {
                "name": "Macbook Pro Retina 2012",
                "amount": 85000,
                "description": "Because I was looking for mac book pro in my buying list",
                "image": "img1.jpg",
                "likes": 2,
                "distance": "3 km",
                "users":
                [
                    {"profilepic": "profile1.jpg", "username": "Shapnah Shar", "profile": "Product Manager, Nestle"},
                    {"profilepic": "profile2.jpg", "username": "Shapnah Shar Junior", "profile": "IT Manager, Nestle"},
                    {"profilepic": "profile3.jpg", "username": "Junior Shapnah Shar Junior", "profile": "In Charge Design, Nestle"},
                ],

            },
            {
                "name": "Microsoft Surface Pro 4 - Microsoft",
                "amount": 199999,
                "description": "Run creative programs side-by-side, or just kick back",
                "image": "img3.jpg",
                "likes": 14,
                "distance": "0.5 km",
                "users":
                [
                    {"profilepic": "profile1.jpg", "username": "Shapnah Shar", "profile": "Product Manager, Nestle"},
                    {"profilepic": "profile3.jpg", "username": "Junior Shapnah Shar Junior", "profile": "In Charge Design, Nestle"},
                ],

            },{
                "name": "Used Macbook Pro Retina 2012",
                "amount": 59999,
                "description": "Run creative programs side-by-side, or just kick back",
                "image": "img2.jpg",
                "likes": 1,
                "distance": "0.5 km",
                "users":
                [
                    {"profilepic": "profile3.jpg", "username": "Junior Shapnah Shar Junior", "profile": "In Charge Design, Nestle"},
                ],

            }
            
        ];
    }
    public logout() {
        this.auth.logout().subscribe(succ => {
            this.navCtrl.setRoot(LoginPage)
        });
    }

}
