import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, NavController, NavParams} from 'ionic-angular';
import {HomePage} from "../home/home";
import {EmployeePage} from "../employee/employee";
import {ChatPage} from '../chat/chat';
import * as firebase from 'Firebase';


@IonicPage()
@Component({
  selector: 'page-conversation',
  templateUrl: 'conversation.html'
})
export class ConversationPage {
  @ViewChild(Content) content: Content;


  data = { type:'', nickname:'', message:'' };
  chats = [];
  roomkey:string;
  nickname:string;
  offStatus:boolean = false;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.roomkey = this.navParams.get("key") as string;
    this.nickname = this.navParams.get("nickname") as string;
    this.data.type = 'message';
    this.data.nickname = this.nickname;

    let joinData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push();
    joinData.set({
      type:'join',
      user:this.nickname,
      message:this.nickname+' has joined this room.',
      sendDate:Date()
    });
    this.data.message = '';

    firebase.database().ref('chatrooms/'+this.roomkey+'/chats').on('value', resp => {
      this.chats = [];
      this.chats = snapshotToArray(resp);
      setTimeout(() => {
        if(this.offStatus === false) {
          this.content.scrollToBottom(300);
        }
      }, 1000);
    });
  }
  sendMessage() {
    let newData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push();
    newData.set({
      type:this.data.type,
      user:this.data.nickname,
      message:this.data.message,
      sendDate:Date()
    });
    this.data.message = '';
  }
  exitChat() {
    let exitData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push();
    exitData.set({
      type:'exit',
      user:this.nickname,
      message:this.nickname+' has exited this room.',
      sendDate:Date()
    });

    this.offStatus = true;

    this.navCtrl.setRoot(ChatPage, {
      nickname:this.nickname
    });
  }



  // chatpage=ChatPage;
  //
  // data = { roomname:'' };
  // ref = firebase.database().ref('chatrooms/');
  //
  //
  // constructor(
  //   public navCtrl: NavController,
  // ) {}
  //
  // returnToChat(){
  //   this.navCtrl.setRoot(ChatPage);
  // }
  //
  //
  // addRoom() {
  //   let newData = this.ref.push();
  //   newData.set({
  //     roomname:this.data.roomname
  //   });
  //   this.navCtrl.pop();
  // }





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
