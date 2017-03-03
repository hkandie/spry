import {Component, ViewChild, ElementRef, OnInit} from '@angular/core';
import {NavController, Modal, NavParams, AlertController, LoadingController, Loading} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {Validators, FormGroup, FormControl, FormBuilder} from '@angular/forms';
import {Contacts, Contact, ContactField} from 'ionic-native';
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
    private customColor: string[] = ["#f44336", "#3f51b5", "#2196f3", "#009688", "#4caf50"];
    private indexColor: number = 0;
    public allContacts: Contact[];
    public searchedContact: string;
    constructor(public navCtrl: NavController, public navParams: NavParams, private _fb: FormBuilder, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
        this.findContacts('');
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
            mark_suprise: ['', [Validators.required,]],
            mark_notify: ['', [Validators.required,]],
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
            this.getMarkAddress(position.coords.latitude, position.coords.longitude,this.myForm);
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
    public getMarkAddress(latitude, longitude,form) {
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
    public findContacts(value: any) {
        let fn = value === undefined ? '' : value;

        Contacts.find(['displayName', 'phoneNumbers'], {
            filter: fn,
            hasPhoneNumber: true
        }).then(data => {
            this.allContacts = data;
        });
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
        }, (err) => {});
    }
    public login(myForm: FormGroup) {
        console.log(this.myForm.controls['mark_address'].value);
        console.log(this.myForm.controls['mark_long'].value);
        console.log(this.myForm.controls['mark_contacts'].value)
        console.log(this.myForm.controls['mark_lat'].value);
    }


}
