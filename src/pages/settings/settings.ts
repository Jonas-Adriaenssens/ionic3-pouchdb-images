import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {OverviewPage} from "../overview/overview";
import {AnimalProvider} from "../../providers/animals/animals";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  overviewpage=OverviewPage;
  settingspage=SettingsPage;

  id:any;
  animal:any;

  passwordsNotEqual=false;
  ageRangeNotPossible=false;
  oldPassNotMatched = false;

  //input values
  newPassword:string;
  repeatNewPassword:string;
  oldPassword:string;
  lookingfor:any=[];
  minAge:any;
  maxAge:any;

  //current values
  // currentPassword:any;
  currentLookingfor:any=[];
  currentMinAge:any;
  currentMaxAge:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public aniProv: AnimalProvider
  ) {
    this.aniProv.createPouchDB();
    this.id = this.navParams.get('id');
    this.aniProv.findAnimalById(this.id).then((result:any) => {
      this.animal = result.docs[0];
      this.minAge = this.animal.minAge;
      this.maxAge = this.animal.maxAge;
      this.lookingfor = this.animal.lookingfor;
    });
  }

  onPrefChange(){
    if(this.minAge < 1 || this.minAge > 20){
      this.minAge = 1;
    }
    if(this.maxAge < 1 || this.maxAge > 20){
      this.maxAge = 20;
    }
    if(this.lookingfor.length == 0){
      this.lookingfor = this.animal.lookingfor;
    }
  }

  onPasswordChange(){
    this.passwordsNotEqual = false;
    if(this.newPassword != null && this.repeatNewPassword != null){
      if(this.newPassword != this.repeatNewPassword){
        this.passwordsNotEqual = true;
      }
    }
    if(this.newPassword == ""){
      this.passwordsNotEqual = true;
    }
    if(this.repeatNewPassword == ""){
      this.passwordsNotEqual = true;
    }
  }

  changePassword(){
    this.oldPassNotMatched = false;

    if(this.animal.password == this.oldPassword){
      if(! this.passwordsNotEqual){
        this.animal.password = this.newPassword;
        this.aniProv.update(this.animal);
        this.refreshPage();
      }
    } else{
      this.oldPassNotMatched = true;
    }
  }

  changePreferences(){
    this.onPrefChange();
    if(!this.ageRangeNotPossible){
      this.animal.lookingfor = this.lookingfor;
      this.animal.minAge = Number(this.minAge);
      this.animal.maxAge = Number(this.maxAge);
      this.aniProv.update(this.animal).then(() => {
        let p = new Promise(resolve => setTimeout(resolve, 2000));
        p.then(() => {
          this.refreshPage();
        });
    // }
    // this.refreshPage();
      })
    }
  }

  refreshPage(){
    this.navCtrl.setRoot(this.settingspage, {id: this.id});
  }

  returnToOverview(){
    this.navCtrl.setRoot(this.overviewpage, {id: this.id});

  }
}
