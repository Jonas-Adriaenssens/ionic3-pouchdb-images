import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from 'firebase';


const config = {
  apiKey: 'AIzaSyAFsUb0pyRmbR9TC4JjkJ8qv57mHEvMCZA',
  authDomain: 'ionic-t.firebaseapp.com',
  databaseURL: 'https://ionic-t.firebaseio.com/',
  projectId: 'ionic-t',
  storageBucket: 'gs://ionic-t.appspot.com',
};


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = 'LoginPage';
  pages: Array<{title: string, component: any}>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    firebase.initializeApp(config);

    this.pages = [
      { title: 'LoginPage', component: 'LoginPage' },
      { title: 'HomePage', component: 'HomePage' },

      { title: 'Employees', component: 'EmployeePage' }
    ];

  }
}
