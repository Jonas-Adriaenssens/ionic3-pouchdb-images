import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { EmployeeProvider } from './../../providers/employee/employee';
import { ImageProvider } from './../../providers/image/image';
import {AnimalProvider} from "../../providers/animals/animals"

@IonicPage()
@Component({
  selector: 'page-employee',
  templateUrl: 'employee.html',
})

export class EmployeePage {

  private animal: any = {};
  private canDelete = false;
  private canUpdate = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private aniProv: AnimalProvider,
    public viewCtrl: ViewController,
    public imgProv: ImageProvider
  ) {}

  ionViewDidEnter() {
    var animal = this.navParams.get('animal');
    if (animal) {
      this.animal = animal.doc;
      this.canDelete = true;
      this.canUpdate = true;
    }
  }

  addOrUpdate() {
    if (this.animal.firstName != undefined && this.animal.lastName != undefined) {
      if (this.canUpdate) {
        this.aniProv.update(this.animal);
      }
      else {
        this.aniProv.create(this.animal);
      }
    }
    this.viewCtrl.dismiss(this.animal);
  }

  delete() {
    this.aniProv.delete(this.animal);
    this.viewCtrl.dismiss(this.animal);
  }

  takePhotograph() {
    this.imgProv.takePhotograph()
      .then((image) => {
         this.animal._attachments = { 'pic.png': {
             content_type: 'image/png',
             data: image.toString()
          }
         }
      })
      .catch((err) => {
         console.log(err);
      });
   }
}
