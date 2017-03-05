import {Component, OnInit} from '@angular/core';
import {NavController, Platform, ToastController, Events, ViewController} from 'ionic-angular';
import {FormGroup, FormArray, FormBuilder, } from '@angular/forms';
import {Storage} from '@ionic/storage';
import {AlertController} from 'ionic-angular';
import {ViewChild} from '@angular/core';
import {Content} from 'ionic-angular';
import {AuthService} from '../../providers/auth-service';
import {LocationContact} from './location-contacts';
@Component({
    selector: 'page-location',
    templateUrl: 'location.html'
})
export class ReportPage implements OnInit {
    public myForm: FormGroup;
    @ViewChild(Content) content: Content;
    user_id: string;
    createSuccess = false;
    constructor(public lc:LocationContact,public viewCtrl: ViewController, private events: Events, private toastCtrl: ToastController, public navCtrl: NavController, public alertCtrl: AlertController, public storage: Storage, private platform: Platform, private auth: AuthService, private _fb: FormBuilder) {
        this.platform.ready().then(() => {
            this.auth.getUserInfo().subscribe(succ => {
                let info = succ;
                this.user_id = info.user_id;
            });
        });

    }
    ngOnInit(): void {
        this.myForm = this._fb.group({
            is_contact_hidden: ['false',],
            hidden_contact_details: this._fb.array([
                this.init_hidden_contact_details()
            ])
        });


    }

    public init_hidden_contact_details() {
        // initialize our address
        return this._fb.group({
            contact: [''],

        });
    }
    add_hidden_contact_details() {
        // add address to the list
        const control = <FormArray> this.myForm.controls['hidden_contact_details'];
        control.push(this.init_hidden_contact_details());
    }

    remove_hidden_contact_details(i: number) {
        const control = <FormArray> this.myForm.controls['hidden_contact_details'];
        control.removeAt(i);
    }

    public save_update_location_wise_settings(model) {
        var details = (this.myForm.controls['hidden_contact_details'].value);
        var is_contact_hidden = (this.myForm.controls['is_contact_hidden'].value);
        var hidden_contact_details = [];
        for (let item of details) {
            let voyage = {hidden_contact: item.contact, };
            hidden_contact_details.push(voyage);
        }
        let credentials = {user_id: this.user_id, is_contact_hidden: is_contact_hidden, hidden_contact_details: hidden_contact_details}
        this.auth.save_update_location_wise_settings(credentials).subscribe(success => {
            if (success) {
                this.createSuccess = true;
                this.showPopup("Success", "Profile updated.");
                this.viewCtrl.dismiss();
            } else {

            }
        },
            error => {
                this.showPopup("Error", error);
            });


    }
    public fetch_update_location_wise_settings(model) {
        var details = (this.myForm.controls['hidden_contact_details'].value);
        var is_contact_hidden = (this.myForm.controls['is_contact_hidden'].value);
        var hidden_contact_details = [];
        for (let item of details) {
            let voyage = {hidden_contact: item.contact, };
            hidden_contact_details.push(voyage);
        }
        let credentials = {user_id: this.user_id, is_contact_hidden: is_contact_hidden, hidden_contact_details: hidden_contact_details}
        this.auth.fetch_update_location_wise_settings(credentials).subscribe(data => {
            let is_contact_hidden=data.is_contact_hidden;
            let contacts=data.contacts;
            if (data.success=='1') {
                this.myForm.controls['is_contact_hidden'].setValue(is_contact_hidden);
                this.lc.contacts=contacts;
                this.viewCtrl.dismiss();
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
}
