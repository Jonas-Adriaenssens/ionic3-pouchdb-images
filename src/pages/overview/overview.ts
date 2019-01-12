import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HomePage} from "../home/home";
import {SettingsPage} from "../settings/settings";
import {EditinfoPage} from "../editinfo/editinfo";
import {ProfilePage} from "../profile/profile";
import {normalizeURL} from "ionic-angular";
import {AnimalProvider} from "../../providers/animals/animals";
import {Camera, CameraOptions} from "@ionic-native/camera";


@IonicPage()
@Component({
  selector: 'page-overview',
  templateUrl: 'overview.html'
})
export class OverviewPage {


  id:any;
  animal:any;
  imgName;
  imgData;
  type;

  homepage=HomePage;
  settingspage=SettingsPage;
  editinfopage=EditinfoPage;
  overviewpage=OverviewPage;

  imageUrl;
  attachmentsURLS: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public aniProv: AnimalProvider,
    private camera: Camera
  ) {
    this.aniProv.createPouchDB();
    this.id = this.navParams.get('id');
    this.imageUrl = this.aniProv.remote + "/" + this.id + "/";
    this.aniProv.findAnimalById(this.id).then((result) => {
      this.animal = result.docs[0];
      this.getAttachmentURLS();
    });
  }

  getNameAndAge(){
    if(typeof this.animal != "undefined") {
      return this.animal.name + ", [" + this.animal.age + "]";
    }
  }

  getDescription(){
    if(typeof this.animal != "undefined") {
      return this.animal.description;
    }
  }

  getAttachmentURLS(){
    if(typeof this.id != "undefined" && typeof this.animal != "undefined") {
      console.log(this.animal._attachments);
      console.log(Object.keys(this.animal._attachments));
      for(let picture of Object.keys(this.animal._attachments)){
        // console.log(i);
        console.log(picture);
        this.attachmentsURLS.push(this.imageUrl + picture) ;
      }
    }
  }

  goToHome(){
    this.navCtrl.setRoot(this.homepage, {id: this.id});
  }

  GoToSettings(){
    this.navCtrl.setRoot(this.settingspage, {id: this.id});
  }

  GoToEditProfile(){
    this.navCtrl.setRoot(this.editinfopage, {id: this.id});
  }



  OpenCamera(){

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;


      //TODO: geef image door naar database

      // this.animal._attachments[this.imgName] = {"content_type": this.type, "data": this.imgData};
      // this.aniProv.update(this.animal).then(() => {
      //   let p = new Promise( resolve => setTimeout(resolve, 2000) );
      //   p.then(() => {
      //     this.navCtrl.setRoot(this.overviewpage, {id: this.id});
      //   });
      // });
      //




        // this.animal._attachments[this.imgName] = {"content_type": this.type, "data": this.imgData};
        // this.aniProv.update(this.animal).then(() => {
        //   let p = new Promise(resolve => setTimeout(resolve, 2000));
        //   p.then(() => {
        //     this.refreshPage();
        //   });
        // });










    }, (err) => {
      // Handle error
    });


  }

}
