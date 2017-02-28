import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {AlertController, LoadingController} from 'ionic-angular';
declare var navigator: any;

export class Search {
    property_type: number;
    start_date: string;
    end_date: string;
    unit_type: string;
    lowest_amount: number;
    highest_amount: number;

    constructor(property_type: number, start_date: string, end_date: string, unit_type: string, lowest_amount: number,
        highest_amount: number) {
        this.property_type = property_type;
        this.start_date = start_date;
        this.end_date = end_date;
        this.unit_type = unit_type;
        this.lowest_amount = lowest_amount;
        this.highest_amount = highest_amount;
    }
}

@Injectable()
export class SearchService {
    url = "http://localhost/finacc/nyuba/webservice/";
    current_search: Search;
    loadingPopup: any;
    constructor(private loadingCtrl: LoadingController, public http: Http, public alertCtrl: AlertController, ) {


    }

    public search_property(search: Search) {
        if (search.property_type === null || search.unit_type === null) {
            return Observable.throw("Please insert credentials");
        } else {
            return Observable.create(observer => {
                this.loadingPopup = this.loadingCtrl.create({content: 'Please wait...'});
                var bodyString = JSON.stringify(search);
                console.log(bodyString);
                let headers = new Headers({'Content-Type': 'application/json'}); // ... Set content type to JSON
                let options = new RequestOptions({headers: headers}); // Create a request option
                this.loadingPopup.present();
                this.http.post(this.url + 'search', bodyString, options)
                    .subscribe(data => {
                        let records = data.json().records;
                        let access = false;
                        if (records.is_logged_in == '1') {
                            access = true;
                            this.current_search = new Search(
                            search.property_type,
                                search.start_date,
                                search.end_date,
                                search.unit_type,
                                search.lowest_amount,
                                search.highest_amount);
                        }
                        observer.next(access);
                        observer.complete();
                        this.loadingPopup.dismiss();
                    }, error => {
                        observer.next(false);
                        observer.complete();
                        this.loadingPopup.dismiss();
                        this.showAlert("Please check", "There is a problem.");

                    });

            });
        }
    }
    public checkNetwork() {
        let networkState = navigator.connection.type;
        if (networkState == "Unknown connection" || networkState == "none" || networkState == "No network connection") {
            console.log("Error:" + networkState);
            this.showAlert("Please check", "No internet connection.");
            return;
        }
    }

    public register(credentials) {
        if (credentials.email === null || credentials.password === null) {
            return Observable.throw("Please insert credentials");
        } else {
            return Observable.create(observer => {

                this.loadingPopup = this.loadingCtrl.create({content: 'Please wait...'});
                var bodyString = JSON.stringify(credentials);

                console.log(bodyString);
                let headers = new Headers({'Content-Type': 'application/json'}); // ... Set content type to JSON
                let options = new RequestOptions({headers: headers}); // Create a request option
                this.loadingPopup.present();
                this.http.post(this.url + 'register', bodyString, options)
                    .subscribe(data => {
                        let records = data.json().records;
                        console.log(records);
                        let access = false;
                        if (records.created == '1') {
                            access = true;
                        } else {
                            let errors = records.error1;
                            this.showAlert("Please check", errors);
                        }
                        observer.next(access);
                        observer.complete();
                        this.loadingPopup.dismiss();
                    }, error => {
                        observer.next(false);
                        observer.complete();
                        this.loadingPopup.dismiss();
                        this.showAlert("Please check", "There is a problem.");

                    });


            });
        }
    }

    public getUserInfo(): Search {
        return this.current_search;
    }

    public logout() {
        return Observable.create(observer => {
            this.current_search = null;
            observer.next(true);
            observer.complete();
        });
    }
    public showAlert(title: string, messge: string) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: messge,
            buttons: ['OK']
        });
        alert.present();
    }
}