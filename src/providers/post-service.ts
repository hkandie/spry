import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {AlertController, LoadingController} from 'ionic-angular';
import {MY_CONFIG_TOKEN, MY_CONFIG, ApplicationConfig} from '../app/app-config';
import {Storage} from '@ionic/storage';
declare var navigator: any;

/*
  Generated class for the PostProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PostService {
    public endPoint: string;
    loadingPopup: any;
    constructor(public storage: Storage, @Inject(MY_CONFIG_TOKEN) config: ApplicationConfig, private loadingCtrl: LoadingController, public http: Http, public alertCtrl: AlertController, ) {
        this.endPoint = config.apiEndpoint;

    }

    public fetch_posts() {
        return [
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

            }, {
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
    public post_mark(credentials) {
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
                this.http.post(this.endPoint + 'login', bodyString, options)
                    .subscribe(data => {
                        let records = data.json().records;
                        let access = false;
                        if (records.is_posted == '1') {
                            access = true;
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
    public showAlert(title: string, messge: string) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: messge,
            buttons: ['OK']
        });
        alert.present();
    }

}
