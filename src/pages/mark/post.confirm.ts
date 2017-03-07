import {Component, OnInit, ElementRef} from '@angular/core';
import {NavController, Platform, ToastController, Events, ViewController, NavParams} from 'ionic-angular';
import {FormGroup, FormArray, FormBuilder, } from '@angular/forms';
import {Storage} from '@ionic/storage';
import {AlertController} from 'ionic-angular';
import {ViewChild} from '@angular/core';
import {Content} from 'ionic-angular';
import {AuthService} from '../../providers/auth-service';
import {Contacts} from 'ionic-native';
import {Geolocation} from 'ionic-native';
import {IonicGallery} from '../../app/ionic-gallery';
declare var google;

@Component({
    selector: 'page-post.confirm',
    templateUrl: 'post.confirm.html',
    providers: [IonicGallery]
})
export class PostConfirm implements OnInit {
    @ViewChild(Content) content: Content;
    user_id: string;
    createSuccess = false;
    contacts: any;
    contactsfound: any;
    hidden_contacts: any;
    @ViewChild('map') mapElement: ElementRef;
    map: any;
    post_data: any;
    mark_images: any = [];
    mark_address: string;
    mark_long: string;
    mark_lat: string;
    mark_contacts: string;
    mark_message: string;
    mark_as_group: string;
    mark_suprise: string;
    mark_notify: string;
    selectedItem: any;
    icons: string[];
    items: Array<any>;
    options: any;
    constructor(public params: NavParams, public viewCtrl: ViewController, private events: Events, private toastCtrl: ToastController, public navCtrl: NavController, public alertCtrl: AlertController, public storage: Storage, private platform: Platform, private auth: AuthService, private _fb: FormBuilder) {
        this.selectedItem = params.get('item');

        this.options = {
            urlKey: 'URL',
            thumbKey: 'thumb',
            titleKey: 'title',
            contentKey: 'note',
            colWidth: 120,
            thumbnailClickAction: this.thumbnailClick,
            actionClass: this,
            viewActionButtons: [{
                icon: 'download',
                action: this.save
            },
            {
                icon: 'heart',
                action: this.like
            },
            ]
        }

        this.platform.ready().then(() => {
            this.post_data = params.get('post_data');
            console.log(this.post_data);
            this.mark_images = this.post_data.mark_images;
            this.mark_address = this.post_data.mark_address;
            this.mark_long = this.post_data.mark_long;
            this.mark_lat = this.post_data.mark_lat;
            this.mark_contacts = this.post_data.mark_contacts;
            this.mark_message = this.post_data.mark_message;
            this.mark_as_group = this.post_data.mark_as_group;
            this.mark_suprise = this.post_data.mark_suprise;
            this.mark_notify = this.post_data.mark_notify;

            this.loadMap();
            this.auth.getUserInfo().subscribe(succ => {
            });
        });
        this.items = [];
        for (let i = 1; i < 20; i++) {
            let s = {
                title: 'Item ' + i,
                note: 'This is item #' + i,
                thumb: 'http://placehold.it/120X120',
                URL: `http://placehold.it/${i}00X300`,
            }
            this.items.push(s);
        }
    }
    ngOnInit(): void {

    }

    public save_post(model) {


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


        let content = "<h4>" + this.post_data.mark_address + "!</h4>";

        this.addInfoWindow(marker, content);

    }
    public loadMap() {
        let options = {maximumAge: 0, timeout: 10000, enableHighAccuracy: true};
        Geolocation.getCurrentPosition(options).then((position) => {
            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            let mapOptions = {
                center: latLng, zoom: 15, mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
            this.addMarker();


        }, (err) => {
            console.log(err);
        });
    }
    public fetch_update_location_wise_settings() {

    }
    public showPopup(title, text) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK',
                    handler: data => {
                        if (this.createSuccess) {
                            this.viewCtrl.dismiss();
                        }
                    }
                }
            ]
        });
        alert.present();
    }
    public closeModal() {
        this.viewCtrl.dismiss();
    }
    public findContacts(value: any) {
        this.contacts = [{phoneNumber: "0721", displayName: "072x Bacon"},
        {phoneNumber: "0722", displayName: "Black Olives"},
        {phoneNumber: "0723", displayName: "Extra Cheese"},
        {phoneNumber: "0724", displayName: "Green Peppers"},
        {phoneNumber: "mushrooms", displayName: "Mushrooms"},
        {phoneNumber: "onions", displayName: "Onions"},
        {phoneNumber: "pepperoni", displayName: "Pepperoni"},
        {phoneNumber: "pineapple", displayName: "Pineapple"},
        {phoneNumber: "sausage", displayName: "Sausage"},
        {phoneNumber: "Spinach", displayName: "Spinach"}];
        try {
            Contacts.find(['phoneNumbers']).then((contacts) => {
                this.contactsfound = contacts;
                for (let item of this.contactsfound) {
                    if (item.phoneNumbers != null) {
                        this.contacts.push({phoneNumbers: JSON.stringify(item.phoneNumbers[0].value)});
                    }
                }
            }, (err) => {
                //alert("Error:" + err);
            });
        } catch (e) {
            alert("Error:" + e);
        }
    }
    save(item) {
        console.log("in ListPage save()", item, this);
        this.presentToast(`item ${item.title} saved!`)
    }
    thumbnailClick(item) {
        console.log("in ListPage thumbnailClick()", item, this);
        this.presentToast(`item ${item} clicked!`)
    }
    like(item) {
        console.log("in ListPage like()", item, this);
        this.presentToast(`item ${item.title} liked!`)

    }
    presentToast(text) {
        let toast = this.toastCtrl.create({
            message: 'User was added successfully',
            duration: 3000,
            position: 'top'
        });

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });

        toast.present();
    }
}
