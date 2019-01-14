import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import {HttpClient} from "@angular/common/http";

@Injectable()
export class AnimalProvider {

  public pdb;
  public remote;
  public animals;
  public seen;

  createPouchDB() {
    this.pdb = new PouchDB('animals');
    this.remote = 'http://192.168.0.209:5984/animals';

    let options = {
      live: true,
      retry: true,
      continuous: true
    };

    this.pdb.sync(this.remote, options);
  }

  constructor(public http: HttpClient) {
    PouchDB.plugin(PouchDBFind);
  }

  create(animal) {
    return this.pdb.post(animal);
  }

  update(animal) {
    return this.pdb.put(animal);
  }

  delete(animal) {
    return this.pdb.remove(animal);
  }

  read() {
    let pdb = this.pdb;

    function allDocs() {

      let _animals = pdb.allDocs({include_docs: true})
        .then(docs => {
          return docs.rows;
        });


      return Promise.resolve(_animals);
    }

    return allDocs();
  }

  getMatchedAnimals(id, findMatchesPromise) {
    let pdb = this.pdb;

    return findMatchesPromise.then(function (result) {
      let matchedId: any = [];

      for (let match of result.docs) {
        if (match.animalId1 == id) {
          matchedId.push(match.animalId2);
        } else {
          matchedId.push(match.animalId1);
        }
      }
      return pdb.find({
        selector: {
          _id: {$in: matchedId}
        }
      });
    });
  }

  getAnimalRandomBatch(id, seenIdsPromise, seenIds, range, animal) {

    let randomBatchPromise: any;
    let pdb = this.pdb;

    randomBatchPromise = seenIdsPromise.then(function (result) {
      let answeredIds: any = [];
      for (let seen of result.docs) {
        if (seen.animalId1 == id && typeof seen.match1 != 'undefined') {
          answeredIds.push(seen.animalId2);
        } else if (seen.animalId2 == id && typeof seen.match2 != 'undefined') {
          answeredIds.push(seen.animalId1);
        }
      }
      answeredIds = Array.from(new Set(answeredIds.concat(seenIds)));

      let rand = Math.random();

      let upper = rand + range;
      let lower = rand - range;
      let _randomBatchPromise;

      if (upper > 1) {
        _randomBatchPromise = pdb.find({
          selector: {
            $and: [
              {_id: {$ne: id}},
              {_id: {$nin: answeredIds}},
              {
                $or: [
                  {random: {$gte: lower}},
                  {random: {$lte: upper - 1}}
                ]
              },
              {random: {$gt: 0}}, //hack to select it
              // lookingfor: {$elemMatch: animal.gender},
              {gender: {$in: animal.lookingfor}},
              {age: {$gte: animal.minAge}},
              {age: {$lte: animal.maxAge}},
              {minAge: {$lte: animal.age}},
              {maxAge: {$gte: animal.age}}
            ],

          },
          limit: 5,
          // sort: ['random']
        });
      } else if (lower < 0) {
        _randomBatchPromise = pdb.find({
          selector: {
            $and: [
              {_id: {$ne: id}},
              {_id: {$nin: answeredIds}},
              {
                $or: [
                  {random: {$gte: lower + 1}},
                  {random: {$lte: upper}}
                ]
              },
              {random: {$gt: 0}}, //hack to select it
              // lookingfor: {$elemMatch: animal.gender},
              {gender: {$in: animal.lookingfor}},
              {age: {$gte: animal.minAge}},
              {age: {$lte: animal.maxAge}},
              {minAge: {$lte: animal.age}},
              {maxAge: {$gte: animal.age}}
            ],
          },
          limit: 5,
          // sort: ['random']
        });
      } else {
        _randomBatchPromise = pdb.find({
          selector: {
            $and: [
              {_id: {$ne: id}},
              {_id: {$nin: answeredIds}},
              {random: {$gte: lower}},
              {random: {$lte: upper}},
              // lookingfor: {$elemMatch: animal.gender},
              {gender: {$in: animal.lookingfor}},
              {age: {$gte: animal.minAge}},
              {age: {$lte: animal.maxAge}},
              {minAge: {$lte: animal.age}},
              {maxAge: {$gte: animal.age}}
            ],
          },
          limit: 5,
          // sort: ['random']
        });
      }
      return _randomBatchPromise;
    });

    return randomBatchPromise;
  }

  findAnimalById(id) {
    return this.pdb.find({
      selector: {_id: id}
    });
  }

  findAnimalByName(name) {
    return this.pdb.find({
      selector: {name: name}
    });
  }

}
