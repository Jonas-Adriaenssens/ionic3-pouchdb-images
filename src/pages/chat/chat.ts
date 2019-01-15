import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, ModalController, NavParams, Content} from 'ionic-angular';
import {HomePage} from "../home/home";
import { EmployeeProvider } from './../../providers/employee/employee';
import {MatchProvider} from "../../providers/matches/matches";
import {AnimalProvider} from "../../providers/animals/animals";
import * as firebase from 'Firebase';
import {AddroomPage} from "../addroom/addroom";
import {ConversationPage} from "../conversation/conversation";
import {OverviewPage} from "../overview/overview";
import {ProfilePage} from "../profile/profile";





@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {
  @ViewChild(Content) content: Content;


  homepage=HomePage;

  matchedAnimals:any = [];

  id:any;
  rooms = [];
  ref = firebase.database().ref('chatrooms/');
  index:any = 0;
  animal;
  nickname:any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public matchProv: MatchProvider,
    public aniProv: AnimalProvider
  ) {
    this.id = navParams.get('id');
    console.log(this.id);
    this.nickname = navParams.get('nickname');
    console.log("wat is de naam die we verkrijgen");
    console.log(this.nickname);


    this.matchProv.createPouchDB();
    this.getMatchedAnimals();
    this.ref.on('value', resp => {
      this.rooms = [];
      this.rooms = snapshotToArray(resp);
    });
  }

  addRoom() {
    this.navCtrl.push(AddroomPage);
  }


  getMatchedAnimals(){
    let findMatchesPromise = this.matchProv.findMatches(this.id);
    let getMatchedAnimalsPromise = this.aniProv.getMatchedAnimals(this.id, findMatchesPromise);

    getMatchedAnimalsPromise.then((result) => {
      if(result.docs.length > 0) {
        for (let animal of result.docs) {
          this.matchedAnimals.push(animal);
        }
      }
    });
  }

  goToHome(){
    this.navCtrl.setRoot(this.homepage, {id: this.id, nickname: this.id});
  }

  // GoToConversation() {
  //   this.navCtrl.setRoot(this.homepage);
  // }

  joinRoom(key) {
    console.log("key :");
    console.log(key);

    this.navCtrl.setRoot(ConversationPage, {
      key:key,
      id:this.id,
      nickname:this.nickname
    });
  }
}
export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
    let item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};
