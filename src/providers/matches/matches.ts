import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import {HttpClient} from "@angular/common/http";
import {selector} from "rxjs/operator/publish";
import {AnimalProvider} from "../animals/animals";


@Injectable()
export class MatchProvider {

  public pdb;
  public remote;
  public matches;

  constructor(
    public http: HttpClient) {
    PouchDB.plugin(PouchDBFind);
  }

  createPouchDB() {
    this.pdb = new PouchDB('matches');
    this.remote = 'http://localhost:5984/matches';

    let options = {
      live: true,
      retry: true,
      continuous: true
    };

    this.pdb.sync(this.remote, options);
  }

  create(match) {
    return this.pdb.post(match);
  }

  update(match) {
    return this.pdb.put(match);
  }

  delete(match) {
    return this.pdb.remove(match);
  }

  getSeenIds(id){
    let pdb = this.pdb;

    return pdb.find({
      selector: {
        $or : [
          {animalId1: id},
          {animalId2: id}
        ]
      }
    });
  }

  insertAnswer(id, otherId, answer){

    this.pdb.find({
      selector: {animalId1: otherId, animalId2: id}
    }).then((result) => {
      if(result.docs.length != 0){
        let match = result.docs[0];
        match.match2 = answer;
        this.update(match);
      } else{
        let match: any = {};
        match.animalId1 = id;
        match.animalId2 = otherId;
        match.match1 = answer;
        this.create(match);
      }
    })
  }

  findMatches(id){
    let pdb = this.pdb;

    return pdb.find({
      selector:{
        $and: [
          {match1: true},
          {match2: true},
          {$or:[
            {animalId1: id},
            {animalId2: id}
          ]}
        ]
      }
    })
  }

}
