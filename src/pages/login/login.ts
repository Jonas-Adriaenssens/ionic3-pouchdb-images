import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import {AnimalProvider} from "../../providers/animals/animals";
import {HomePage} from "../home/home";
import {RegisterPage} from "../register/register";
import {ChatPage} from "../chat/chat";
import {ConversationPage} from "../conversation/conversation";


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  private homepage = HomePage;
  private registerpage = RegisterPage;

  //input values
  name: string;
  password: string;

  animal:any;

  constructor(
    public navCtrl: NavController,
    public aniProv: AnimalProvider
  ) {
    this.aniProv.createPouchDB();
  }



  login(){
    this.aniProv.findAnimalByName(this.name).then((result) => {
      if(result.docs.length == 1){
        this.animal = result.docs[0];
        this.goToHomepage(this.animal._id);
              }
    });
  }

  goToHomepage(id){
    return this.navCtrl.setRoot(this.homepage, {id: id});
  }

  register(){
    return this.navCtrl.setRoot(this.registerpage);
  }



}
