import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {NavController} from 'ionic-angular';
import {AuthService} from '../../providers/auth-service';

@Component({
    selector: 'contact-detail',
    templateUrl: 'location-contacts.html'
})
export class LocationContactPage{
    contacts: Array<string>;
    @Input('group')
    public locationContactForm: FormGroup;
    constructor(public navCtrl: NavController,  public auth: AuthService) {
        
    }

}