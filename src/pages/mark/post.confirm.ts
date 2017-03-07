import {Component, OnInit} from '@angular/core';
import {NavController, Platform, ToastController, Events, ViewController} from 'ionic-angular';
import {FormGroup, FormArray, FormBuilder, } from '@angular/forms';
import {Storage} from '@ionic/storage';
import {AlertController} from 'ionic-angular';
import {ViewChild} from '@angular/core';
import {Content} from 'ionic-angular';
import {AuthService} from '../../providers/auth-service';
import {Contacts} from 'ionic-native';
@Component({
    selector: 'page-post.confirm',
    templateUrl: 'post.confirm.html'
})
export class PostConfirm implements OnInit {
    public myForm: FormGroup;
    @ViewChild(Content) content: Content;
    user_id: string;
    createSuccess = false;
    contacts: any;
    contactsfound: any;
    hidden_contacts:any;
    constructor(public viewCtrl: ViewController, private events: Events, private toastCtrl: ToastController, public navCtrl: NavController, public alertCtrl: AlertController, public storage: Storage, private platform: Platform, private auth: AuthService, private _fb: FormBuilder) {
        this.platform.ready().then(() => {
            this.auth.getUserInfo().subscribe(succ => {
                let info = succ;
                this.user_id = info.user_id;
            });
        });

    }
    ngOnInit(): void {

    }

    public save_post(model) {
        var hide_me_from_contacts = (this.myForm.controls['hide_me_from_contacts'].value);
        var is_contact_hidden = (this.myForm.controls['is_contact_hidden'].value);
        let credentials = {user_id: this.user_id, is_contact_hidden: is_contact_hidden, hide_me_from_contacts: hide_me_from_contacts}
        this.auth.save_update_location_wise_settings(credentials).subscribe(success => {
            if (success) {
                this.createSuccess = true;
                this.showPopup("Success", "Location wise settings updated.");
                this.viewCtrl.dismiss();
            } else {

            }
        },
            error => {
                this.showPopup("Error", error);
            });


    }
    public fetch_update_location_wise_settings() {
        let credentials = {user_id: this.user_id}
        this.auth.fetch_update_location_wise_settings(credentials).subscribe(data => {
            let is_contact_hidden = data.is_contact_hidden;
            this.hidden_contacts = data.contacts;
            console.log(this.hidden_contacts);
            if (data.success == '1') {
                this.myForm.controls['is_contact_hidden'].setValue('1' == is_contact_hidden ? true : false);
                let contacts = data.contacts;

            } else {

            }
        },
            error => {
                this.showPopup("Error", error);
            });


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
}
