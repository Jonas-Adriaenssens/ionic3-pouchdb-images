import { Component } from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';
import {AnimalProvider} from "../../providers/animals/animals";
import {LoginPage} from "../login/login";
import {File} from "@ionic-native/file";
import {Transfer} from "@ionic-native/transfer";
import {HttpClient} from "@angular/common/http";

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  private loginpage = LoginPage;

  // private fileTransfer: FileTransferObject = this.transfer.create();

  //input values
  name: string;
  password: string;
  repeatPassword: string;
  age: any;
  gender: string;
  lookingfor: any = [];

  nameTaken = false;
  passNotMatched = false;
  img1: any;
  imgData: any;
  type: string;
  imgName: string;

  constructor(public navCtrl: NavController,
              public aniProv: AnimalProvider,
              public transfer: Transfer,
              public file: File,
              public http: HttpClient
  ) {
    this.aniProv.createPouchDB();
  }

  onFileSelected(event) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      this.imgName = event.target.files[0].name;

      reader.onload = (event: any) => {
        this.img1 = event.target.result;

        let data = this.img1.split(",");
        this.imgData = data[1];
        data[0] = data[0].split(':')[1];
        this.type = data[0].split(';')[0];
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onNameChange(){
    this.nameTaken = false;

    this.aniProv.findAnimalByName(this.name).then((result:any) => {
      if(result.docs.length > 0){
        console.log(result.docs.length);
        console.log(result.docs[0]);
        this.nameTaken = true;
      }
    });
  }

  onPasswordChange() {
    this.passNotMatched = false;

    if(this.password != null && this.repeatPassword != null){
      if (this.password != this.repeatPassword) {
        this.passNotMatched = true;
      }
    }
    if(this.password == null || this.repeatPassword == null){
      this.passNotMatched = true;
    }
    if(this.password == ""){
      this.passNotMatched = true;
    }
    if(this.repeatPassword == ""){
      this.passNotMatched = true;
    }
  }

  register(){
    this.passNotMatched = false;
    this.nameTaken = false;

    if(! this.passNotMatched && ! this.nameTaken){
      let newAnimal =
        {
          "name": this.name,
          "password": this.password,
          "age": this.age,
          "gender": this.gender,
          "lookingfor": this.lookingfor,
          "minAge": 1,
          "maxAge": 20,
          "description": "",
          "random": Math.random(),
          "_attachments": {
            "image" : {
              "content_type": this.type,
              "data": this.imgData
            }
          }
        };
      this.aniProv.create(newAnimal);
      this.navCtrl.setRoot(this.loginpage);
      }
    }
}
