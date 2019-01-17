import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AnimalProvider} from "../../providers/animals/animals";
import {OverviewPage} from "../overview/overview";


@IonicPage()
@Component({
  selector: 'page-editinfo',
  templateUrl: 'editinfo.html'
})
export class EditinfoPage {

  overviewpage=OverviewPage;
  editinfopage=EditinfoPage;

  id:any;
  animal:any;
  img1: any;
  imgName;
  imgData;
  type;

  image = new Map();

  imageUrl;

  attachmentsURLS: any = [];

  description;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public aniProv: AnimalProvider
  ) {
    this.id = this.navParams.get('id');
    this.imageUrl = this.aniProv.remote + "/" + this.id + "/";

    this.aniProv.findAnimalById(this.id).then((result) => {
      this.animal = result.docs[0];
      this.getAttachmentURLS();
      this.description = this.animal.description;
    });
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
      };
      reader.readAsDataURL(event.target.files[0]);
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

  deletePicture(url){
    let key = url.slice(url.lastIndexOf('/')+1);
    console.log(url);
    console.log(key);
    console.log(this.animal._attachments);
    delete this.animal._attachments[key];
    this.aniProv.update(this.animal);
    this.refreshPage();
  }

  addPicture() {
    this.animal._attachments[this.imgName] = {"content_type": this.type, "data": this.imgData};
    this.aniProv.update(this.animal).then(() => {
      let p = new Promise(resolve => setTimeout(resolve, 3000));
      p.then(() => {
        this.refreshPage();
      });
    });
  }

  saveDescription(){
    if(this.description == null){
      this.description = "";
    }
    this.animal.description = this.description;
    this.aniProv.update(this.animal).then(() => {
      this.refreshPage();
    });
  }

  refreshPage(){
    this.navCtrl.setRoot(this.editinfopage, {id: this.id});
  }

  returnToOverview(){
    this.navCtrl.setRoot(this.overviewpage, {id: this.id});
  }

}
