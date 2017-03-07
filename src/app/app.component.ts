import {Component,ViewChild} from '@angular/core';
import {Platform,Nav,} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {LoginPage} from '../pages/login/login';
import {MarkPage} from '../pages/mark/mark';
import {TabsPage} from '../pages/tabs/tabs';
import {BuyPage} from '../pages/buy/buy';
import {SellPage} from '../pages/sell/sell';
import {ViewPage} from '../pages/view/view';
import {AuthService} from '../providers/auth-service';
@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    rootPage = MarkPage;
    pages: Array<{title: string, component: any}>;

    constructor(public platform: Platform,public auth: AuthService ) {
        this.pages = [
            {title: 'Mark', component: MarkPage},
            {title: 'Buy', component: BuyPage},
            {title: 'Sell', component: SellPage},
            {title: 'View', component: ViewPage},
        ];
        platform.ready().then(() => {
            StatusBar.styleDefault();
            Splashscreen.hide();
        });
    }
    openPage(page:any) {
        this.nav.setRoot(page.component);
    }
    public logout() {
        this.auth.logout().subscribe(succ => {
            this.nav.setRoot(LoginPage)
        });
    }
}