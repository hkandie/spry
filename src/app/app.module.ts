import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {ListPage} from '../pages/list/list';
import {SearchPage} from '../pages/search/search';
import {ChatPage} from '../pages/chat/chat';
import {AccountPage} from '../pages/account/account';
import {TabsPage} from '../pages/tabs/tabs';

@NgModule({
    declarations: [
        MyApp, TabsPage, ListPage, SearchPage, HomePage, ChatPage, AccountPage
    ],
    imports: [
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp, TabsPage, ListPage, SearchPage, HomePage, ChatPage, AccountPage
    ],
    providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
