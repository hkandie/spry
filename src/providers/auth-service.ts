import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {AlertController, LoadingController} from 'ionic-angular';
declare var navigator: any;

export class User {
    is_logged_in: string;
    user_id: number;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    token: string;
    mobile: string;
    name:string;

    constructor(is_logged_in: string, user_id: number, username: string, email: string, firstname: string, lastname: string, token: string, mobile: string) {
        this.is_logged_in = is_logged_in;
        this.user_id = user_id;
        this.username = username;
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.token = token;
        this.mobile = mobile;
        this.name=firstname+' '+lastname;
    }
}

@Injectable()
export class AuthService {
    url = "http://localhost/finacc/nyuba/webservice/";
    currentUser: User;
    loadingPopup: any;
    constructor(private loadingCtrl: LoadingController, public http: Http, public alertCtrl: AlertController, ) {


    }

    public login(credentials) {
        if (credentials.username === null || credentials.password === null) {
            return Observable.throw("Please insert credentials");
        } else {
            return Observable.create(observer => {
                this.loadingPopup = this.loadingCtrl.create({content: 'Please wait...'});
                var bodyString = JSON.stringify(credentials);
                console.log(bodyString);
                let headers = new Headers({'Content-Type': 'application/json'}); // ... Set content type to JSON
                let options = new RequestOptions({headers: headers}); // Create a request option
                this.loadingPopup.present();
                this.http.post(this.url + 'login', bodyString, options)
                    .subscribe(data => {
                        let records = data.json().records;
                        let access = false;
                        if (records.is_logged_in == '1') {
                            access = true;
                            this.currentUser = new User(records.is_logged_in, records.user_id, records.username, records.email, records.firstname, records.lastname,
                                records.token, records.mobile);
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
                        }else{
                            let errors=records.error1;
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

    public getUserInfo(): User {
        return this.currentUser;
    }

    public logout() {
        return Observable.create(observer => {
            this.currentUser = null;
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