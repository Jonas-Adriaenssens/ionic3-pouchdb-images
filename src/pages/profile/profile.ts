import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AnimalProvider} from "../../providers/animals/animals";
import {MatchProvider} from "../../providers/matches/matches";
import {HomePage} from "../home/home";

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  homepage=HomePage;

  id:any;
  animalId: any;

  animal;
  matchAnimal;

  imageUrl;
  attachmentsURLS:any=[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public aniProv: AnimalProvider,
    public matchProv: MatchProvider
  ) {
    this.id = navParams.get('id');
    this.animalId = navParams.get('animalId');
    this.imageUrl = this.aniProv.remote + "/" + this.animalId + "/";

    this.aniProv.findAnimalById(this.animalId).then(result => {
      this.matchAnimal = result.docs[0];
      this.getAttachmentURLS();
    });
    this.aniProv.findAnimalById(this.id).then(result => {
      this.animal = result.docs[0];
    });
  }

  getAnimalNameAndAge(){
    if(typeof this.matchAnimal != "undefined"){
      return this.matchAnimal.name + ", [" + this.matchAnimal.age + "]";
    }
  }

  getAnimalDescription(){
    if(typeof this.matchAnimal != "undefined"){
      return this.matchAnimal.description;
    }
  }

  answered(answer){
    this.matchProv.insertAnswer(this.id, this.animalId, answer);
    this.navCtrl.setRoot(this.homepage, {id: this.id});
  }

  getAttachmentURLS(){
    if(typeof this.animalId != "undefined" && typeof this.matchAnimal != "undefined") {
      console.log(this.matchAnimal._attachments);
      console.log(Object.keys(this.matchAnimal._attachments));
      for(let picture of Object.keys(this.matchAnimal._attachments)){
        this.attachmentsURLS.push(this.imageUrl + picture) ;
      }
    }
  }

}
