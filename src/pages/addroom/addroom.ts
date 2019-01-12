import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'Firebase';

/**
 * Generated class for the AddroomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addroom',
  templateUrl: 'addroom.html',
})
export class AddroomPage {
  data = { roomname:'' };
  ref = firebase.database().ref('chatrooms/');
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddroomPage');
  }
  addRoom() {
    let newData = this.ref.push();
    newData.set({
      roomname:this.data.roomname
    });
    this.navCtrl.pop();
  }

}
