import {Component,ViewChild} from '@angular/core';
import {Platform,Nav,} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {LoginPage} from '../pages/login/login';
import {MarkPage} from '../pages/mark/mark';
import {TabsPage} from '../pages/tabs/tabs';
import {BuyPage} from '../pages/buy/buy';
import {SellPage} from '../pages/sell/sell';
import {ViewPage} from '../pages/view/view';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    rootPage = TabsPage;
    pages: Array<{title: string, component: any}>;

    constructor(platform: Platform ) {
        this.pages = [
            {title: 'Mark', component: MarkPage},
            {title: 'Buy', component: BuyPage},
            {title: 'Sell', component: SellPage},
            {title: 'View', component: ViewPage},
            {title: 'Sign Out', component: MarkPage},
        ];
        platform.ready().then(() => {
            StatusBar.styleDefault();
            Splashscreen.hide();
        });
    }
    openPage(page) {
        this.nav.setRoot(page.component);
    }
}