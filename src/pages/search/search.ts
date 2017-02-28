import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

/*
  Generated class for the Search page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-search',
    templateUrl: 'search.html'
})
export class SearchPage {
    items: {};
    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.items = [];
    }
    public getItem(event: any) {

    }

}
