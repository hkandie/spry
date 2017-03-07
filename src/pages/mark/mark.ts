import {Component, ViewChild, ElementRef, OnInit} from '@angular/core';
import {NavController, Platform, NavParams, AlertController, LoadingController, ModalController} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {Validators, FormGroup, FormBuilder} from '@angular/forms';
import {Contacts} from 'ionic-native';
import {ImagePicker} from 'ionic-native';
import {TabsPage} from '../tabs/tabs';
import {PostConfirm} from './post.confirm';
import {AuthService} from '../../providers/auth-service';
import {PostService} from '../../providers/post-service';
import {File, Camera, Transfer} from 'ionic-native';
declare var google;


@Component({
    selector: 'page-mark',
    templateUrl: 'mark.html'
})
export class MarkPage implements OnInit {
    @ViewChild('map') mapElement: ElementRef;
    public myForm: FormGroup; // our form model
    map: any;
    contactsfound: any;
    images: any = [];
    contacts: any;
    user_id: string;
    username: string;
    constructor(public postService: PostService, public modalCtrl: ModalController, public auth: AuthService, private platform: Platform, public navCtrl: NavController, public navParams: NavParams, private _fb: FormBuilder, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {

        this.platform.ready().then(() => {
            this.findContacts('');
            this.loadMap();
            this.auth.getUserInfo().subscribe(succ => {
                let info = succ;
                this.user_id = info.user_id;
                this.username = info.username;
            });
        });
    }
    public goBack() {
        this.navCtrl.setRoot(TabsPage);
    }
    public ngOnInit() {

        this.myForm = this._fb.group({
            mark_address: ['', [Validators.required, Validators.minLength(6)]],
            mark_long: ['', [Validators.required, Validators.minLength(6)]],
            mark_lat: ['', [Validators.required, Validators.minLength(6)]],
            mark_contacts: ['', [Validators.required,]],
            mark_message: ['', [Validators.required, Validators.minLength(6)]],
            mark_as_group: ['false', [Validators.required,]],
            mark_suprise: ['true', [Validators.required,]],
            mark_notify: ['true', [Validators.required,]],
            mark_images: ['',],
        });
    }
    public loadMap() {
        let options = {maximumAge: 0, timeout: 10000, enableHighAccuracy: true};
        Geolocation.getCurrentPosition(options).then((position) => {
            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            let mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }

            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

            this.myForm.controls['mark_long'].setValue(position.coords.latitude);
            this.myForm.controls['mark_lat'].setValue(position.coords.longitude);
            this.getMarkAddress(position.coords.latitude, position.coords.longitude, this.myForm);
            this.addMarker();


        }, (err) => {
            console.log(err);
        });
    }
    public addInfoWindow(marker, content) {
        let infoWindow = new google.maps.InfoWindow({
            content: content
        });

        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.map, marker);
        });

    }
    public addMarker() {

        let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: this.map.getCenter()
        });


        let content = "<h4>Information!</h4>";

        this.addInfoWindow(marker, content);

    }
    public getMarkAddress(latitude, longitude, form) {
        var geocoder;
        geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(latitude, longitude);
        geocoder.geocode({'latLng': latlng},
            function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        let add = results[0].formatted_address;
                        console.log(add);
                        form.controls['mark_address'].setValue(add);
                    } else {
                        console.log("address not found");
                    }
                } else {
                    console.log("Geocoder failed due to: " + status);
                }
            }
        );
    }
    public onSuccess(contacts) {
        console.log("Success");
    };



    public onError(contactError) {
        alert('onError!');
    };
    public findContacts(value: any) {
        this.contacts = [{phoneNumbers: "0721", displayName: "072x Bacon"},
        {phoneNumbers: "0722", displayName: "Black Olives"},
        {phoneNumbers: "0723", displayName: "Extra Cheese"},
        {phoneNumbers: "0724", displayName: "Green Peppers"},
        {phoneNumbers: "mushrooms", displayName: "Mushrooms"},
        {phoneNumbers: "onions", displayName: "Onions"},
        {phoneNumbers: "pepperoni", displayName: "Pepperoni"},
        {phoneNumbers: "pineapple", displayName: "Pineapple"},
        {phoneNumbers: "sausage", displayName: "Sausage"},
        {phoneNumbers: "Spinach", displayName: "Spinach"}];
        try {
            Contacts.find(['displayName', 'phoneNumbers']).then((contacts) => {
                this.contactsfound = contacts;
                for (let item of this.contactsfound) {
                    if (item.phoneNumbers != null) {
                        this.contacts.push({phoneNumbers: item.phoneNumbers[0].value});
                    }
                }
            }, (err) => {
                //alert("Error:" + err);
            });
        } catch (e) {
            alert("Error:" + e);
        }
    }



    public openGallery(): void {
        let options = {maximumImagesCount: 3, width: 500, height: 500, quality: 75}

        ImagePicker.getPictures(options).then((results) => {
            console.log(results);
            for (var i = 0; i < results.length; i++) {
                console.log('Image URI: ' + results[i]);
                this.images.push(results[i]);

            }
        }, (err) => {
            console.log("Error:" + err);
        });
    }
    public save_post(myForm: FormGroup, i: any) {
        let post_data = {
            mark_address: this.myForm.controls['mark_address'].value,
            mark_long: this.myForm.controls['mark_long'].value,
            mark_lat: this.myForm.controls['mark_lat'].value,
            mark_contacts: this.myForm.controls['mark_contacts'].value,
            mark_message: this.myForm.controls['mark_message'].value,
            mark_as_group: this.myForm.controls['mark_as_group'].value,
            mark_suprise: this.myForm.controls['mark_suprise'].value,
            mark_notify: this.myForm.controls['mark_notify'].value,
            mark_images: this.images
        };
        if (i == 1) {
            let confirmPage = this.modalCtrl.create(PostConfirm,{post_data:post_data});
            confirmPage.present();
            confirmPage.onDidDismiss(data => {

            })
        }
    }


}
