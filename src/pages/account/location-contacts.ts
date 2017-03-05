import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {NavController} from 'ionic-angular';
import {AuthService} from '../../providers/auth-service';

@Component({
    selector: 'voyage-detail',
    templateUrl: 'voyage.detail.html'
})
export class LocationContact implements OnInit {
    contacts: Array<string>;
    @Input('group')
    public locationContactForm: FormGroup;
    constructor(public navCtrl: NavController,  public auth: AuthService) {
        
    }
    ngOnInit() {
        
    }


    public findAll() {

    }

}