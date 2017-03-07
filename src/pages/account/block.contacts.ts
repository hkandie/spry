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
    selector: 'page-block-contacts',
    templateUrl: 'block.contacts.html'
})
export class BlockContact implements OnInit {
    public myForm: FormGroup;
    @ViewChild(Content) content: Content;
    user_id: string;
    createSuccess = false;
    contacts: any;
    contactsfound: any;
    my_secret_contacts:any;
    constructor(public viewCtrl: ViewController, private events: Events, private toastCtrl: ToastController, public navCtrl: NavController, public alertCtrl: AlertController, public storage: Storage, private platform: Platform, private auth: AuthService, private _fb: FormBuilder) {
        this.platform.ready().then(() => {
            this.auth.getUserInfo().subscribe(succ => {
                let info = succ;
                this.user_id = info.user_id;
                this.findContacts('');
                this.fetch_secret_contacts();
            });
        });

    }
    ngOnInit(): void {
        this.myForm = this._fb.group({
            my_secret_contacts: ['',]
        });


    }

    public init_secret_contacts() {
        // initialize our address
        return this._fb.group({
            contact: [''],

        });
    }
    add_secret_contacts() {
        // add address to the list
        const control = <FormArray> this.myForm.controls['secret_contacts'];
        control.push(this.init_secret_contacts());
    }

    remove_secret_contacts(i: number) {
        const control = <FormArray> this.myForm.controls['secret_contacts'];
        control.removeAt(i);
    }

    public save_secret_contacts(model) {
        var secret_contacts = (this.myForm.controls['my_secret_contacts'].value);
        let credentials = {user_id: this.user_id, secret_contacts: secret_contacts}
        this.auth.save_secret_contacts(credentials).subscribe(success => {
            if (success) {
                this.createSuccess = true;
                this.showPopup("Success", "Hidden contacts updated.");
                this.viewCtrl.dismiss();
            } else {

            }
        },
            error => {
                this.showPopup("Error", error);
            });


    }
    public fetch_secret_contacts() {
        let credentials = {user_id: this.user_id}
        this.auth.fetch_secret_contacts(credentials).subscribe(data => {
            this.my_secret_contacts = data.contacts;
            
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
