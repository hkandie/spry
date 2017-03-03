import {Component, ViewChild, ElementRef, OnInit} from '@angular/core';
import {NavController, Platform, NavParams, AlertController, LoadingController} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {Validators, FormGroup, FormBuilder} from '@angular/forms';
import {Contacts} from 'ionic-native';
import {ImagePicker} from 'ionic-native';
declare var google;
declare var navigator;


@Component({
    selector: 'page-mark',
    templateUrl: 'mark.html'
})
export class MarkPage implements OnInit {
    @ViewChild('map') mapElement: ElementRef;
    public myForm: FormGroup; // our form model
    map: any;
    contactsfound: any;
    images: Array<string>;
    contacts: any;
    constructor(private platform: Platform,public navCtrl: NavController, public navParams: NavParams, private _fb: FormBuilder, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {

        this.platform.ready().then(() => {
            this.findContacts('');
        });
    }
    public ngOnInit() {
        this.loadMap();
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
    loadMap() {
        Geolocation.getCurrentPosition().then((position) => {
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
        alert('Found ' + contacts.length + ' contacts.');
        console.log(contacts);
    };



    public onError(contactError) {
        alert('onError!');
    };
    public findContacts(value: any) {
        this.contacts = [{phoneNumber: "bacon", displayName: "071 Bacon"},
        {phoneNumber: "olives", displayName: "Black Olives"},
        {phoneNumber: "xcheese", displayName: "Extra Cheese"},
        {phoneNumber: "peppers", displayName: "Green Peppers"},
        {phoneNumber: "mushrooms", displayName: "Mushrooms"},
        {phoneNumber: "onions", displayName: "Onions"},
        {phoneNumber: "pepperoni", displayName: "Pepperoni"},
        {phoneNumber: "pineapple", displayName: "Pineapple"},
        {phoneNumber: "sausage", displayName: "Sausage"},
        {phoneNumber: "Spinach", displayName: "Spinach"}];
        try {
            Contacts.find(['displayName', 'phoneNumbers']).then((contacts) => {
                this.contactsfound = contacts;
                alert(this.contactsfound);
            }, (err) => {
                alert("Error:" + err);
            });
        } catch (e) {
            alert("Error:" + e);
        }
    }



    public openGallery(): void {
        let options = {
            maximumImagesCount: 3,
            width: 500,
            height: 500,
            quality: 75
        }

        ImagePicker.getPictures(options).then((results) => {
            for (var i = 0; i < results.length; i++) {
                this.images.push(results[i]);
                console.log('Image URI: ' + results[i]);
            }
        }, (err) => {
            alert("Error:" + err);
        });
    }
    public login(myForm: FormGroup) {

        console.log(this.myForm.controls['mark_address'].value);
        console.log(this.myForm.controls['mark_long'].value);
        console.log(this.myForm.controls['mark_lat'].value);
        console.log(this.myForm.controls['mark_contacts'].value);
        console.log(this.myForm.controls['mark_message'].value);
        console.log(this.myForm.controls['mark_as_group'].value);
        console.log(this.myForm.controls['mark_suprise'].value);
        console.log(this.myForm.controls['mark_notify'].value);
        console.log(this.myForm.controls['mark_images'].value);
    }


}
