import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { SocialSharing } from "@ionic-native/social-sharing";
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SavedDisplayPage } from '../saved-display/saved-display';


@Component({
  selector: 'page-save-for-later',
  templateUrl: 'save-for-later.html',
})
export class SaveForLaterPage {
  savedArr: any = [];
  msg:string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public socialSharing: SocialSharing,
    private alertCtrl:AlertController,
    private sqlite:SQLite) {
  }

  ionViewDidLoad(){
    this.getData();
  }
  
  ionViewWillEnter(){
    this.getData();
  }

  // not like this , get all current data and put them in array like expense array , then push them to other page to view it indivually by rowid
  getData() {
    this.sqlite.create({
      name:'ionicdb.db',
      location:'default'
    }).then((db:SQLiteObject) => {
      db.executeSql('SELECT * FROM Data ORDER BY rowid DESC',{})
      .then(res => {
        console.log(res);
        this.savedArr = [];
        for(var i=0; i<res.rows.length; i++) {

          this.savedArr.push({
            rowid:res.rows.item(i).rowid, 
            name:res.rows.item(i).name,
            moisture:res.rows.item(i).moisture,
            temperature:res.rows.item(i).temperature,
            nameOne:res.rows.item(i).nameOne,
            nameTwo:res.rows.item(i).nameTwo,
            time:res.rows.item(i).time,
            TW:res.rows.item(i).TW})
        }
      })
      .catch(e => {
        console.log(e);
        //  console.log("Here's the saved data" + this.savedArr)
      });
    }).catch(e => {
      console.log(e);
    });
  }

  deleteData(rowid){
    this.sqlite.create({
      name:'ionicdb.db',
      location:'default'
    }).then((db:SQLiteObject) => {
      db.executeSql('DELETE FROM Data WHERE rowid=?',[rowid])
      .then(res => {
        console.log(res);
        this.getData();
      })
      .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }


  compilemsg(index):string{
    this.msg = "Moisture: " + this.savedArr[index].moisture + "% "+  "\n" + "Temperature: " +  this.savedArr[index].temperature + "°C " +  "\n" +  "Name: " + this.savedArr[index].name
    +  "\n"+ "Id 01: " + this.savedArr[index].nameOne +  "\n" + "Id 02: " + this.savedArr[index].nameTwo +  "\n" + "Test Weight: " + this.savedArr[index].TW + "g/0.5L";
    return this.msg.concat(" \n \nThank you for choosing PGA Moisture Analyzers!");
  }


  ShareResults(index) {
    this.msg = this.compilemsg(index);

    let alert = this.alertCtrl.create({
      title: 'Results',
    message: 'Would you like to share your results?',
      buttons: [
        {
          text: 'No, Thanks'
        },
        {
          text: 'Share',
          handler: _=> {
            this.socialSharing.share(this.msg, null, null, null);
          }
        }
      ]
    });
    alert.present();
  }

  PushToHomePage(){
    this.navCtrl.popToRoot();
  }

  pushDispalySavedPage(rowid){
    this.navCtrl.push(SavedDisplayPage ,{
      rowid:rowid
    });
  }
}
