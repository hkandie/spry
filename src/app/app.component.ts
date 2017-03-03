import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {LoginPage} from '../pages/login/login';
import {MarkPage} from '../pages/mark/mark';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage = MarkPage;

    constructor(platform: Platform) {
        platform.ready().then(() => {
            StatusBar.styleDefault();
            Splashscreen.hide();
        });
    }
}