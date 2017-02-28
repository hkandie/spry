import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {ListPage} from '../pages/list/list';
import {SearchPage} from '../pages/search/search';
import {ChatPage} from '../pages/chat/chat';
import {AccountPage} from '../pages/account/account';
import {TabsPage} from '../pages/tabs/tabs';
import {LoginPage} from '../pages/login/login';
import {AuthService} from '../providers/auth-service';
import {RegisterPage} from '../pages/register/register';

@NgModule({
    declarations: [
        MyApp, TabsPage, ListPage, SearchPage, HomePage, ChatPage, AccountPage,LoginPage,RegisterPage
    ],
    imports: [
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp, TabsPage, ListPage, SearchPage, HomePage, ChatPage, AccountPage,LoginPage,RegisterPage
    ],
    providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},AuthService]
})
export class AppModule {}
