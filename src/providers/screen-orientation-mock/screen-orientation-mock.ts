import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

export class ScreenOrientationMockProvider extends ScreenOrientation {
  lock(type) {
    return new Promise((resolve, reject) => {
      resolve("locked");
    })
  }
}
