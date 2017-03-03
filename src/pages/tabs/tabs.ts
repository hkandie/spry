import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {HomePage} from '../home/home';
import {ListPage} from '../list/list';
import {SearchPage} from '../search/search';
import {ChatPage} from '../chat/chat';
import {AccountPage} from '../account/account';
import {AuthService} from '../../providers/auth-service';
import {LoginPage} from '../login/login';

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    tab1Root: any = HomePage;
    tab2Root: any = ListPage;
    tab3Root: any = SearchPage;
    tab4Root: any = ChatPage;
    tab5Root: any = AccountPage;

    constructor(private nav: NavController, private auth: AuthService, ) {
        let info = this.auth.getUserInfo();
        if (null==info){
           this.nav.setRoot(LoginPage)
        }

    }
}
