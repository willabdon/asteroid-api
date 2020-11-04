import { firestore } from 'firebase-admin';


export default class Asteroid {

    public static collectionRef(): firestore.CollectionReference {
        return firestore().collection('asteroids');
    }

    private _id: string;
    private _data: { [field: string]: any };
    private _ref: firestore.DocumentReference;


    public static fetchOrAdd(data: any): Promise<Asteroid> {
        return new Promise(async (resolve, reject) => {
            try {
                let asteroid: Asteroid = await this.getByAsteroidId(data.asteroid_id)
                if (!asteroid) {
                    asteroid = new Asteroid();
                    asteroid.name = data.name;
                    asteroid.asteroid_id = data.asteroid_id;
                    asteroid.diameter = data.diameter;
                    asteroid.distance = data.distance;
                    asteroid.pha = data.pha;
                    asteroid.velocity = data.velocity;
                    asteroid.close_approach = data.close_approach;
                    await asteroid.save();
                } 
                return resolve(asteroid)
            } catch (ex) {
                reject(ex);
            }
        });
    }


    public static getById(id: string): Promise<Asteroid> {
        return new Promise(async (resolve, reject) => {
            try {
                await Asteroid.collectionRef().doc(id).get().then((snapshot) => {
                    resolve(new Asteroid(snapshot));
                }).catch((err) => {
                    reject(err);
                });
            } catch (ex) {
                reject(ex);
            }
        });
    }

    public static getByIds(asteroidIds: string[]): Promise<Asteroid[]> {
        return new Promise(async (resolve, reject) => {
            if (!asteroidIds.length) resolve([])
            try {
                await Asteroid.collectionRef()
                    .where(firestore.FieldPath.documentId(), "in", asteroidIds)
                    .get()
                    .then(snapshot => {
                        if (snapshot.empty) {
                            return resolve(null);
                        }
                        const asteroids = [];
                        snapshot.docs.forEach(asteroid => {
                            asteroids.push(new Asteroid(asteroid));
                        });
                        return resolve(asteroids);
                    })
                    .catch(err => {
                        reject(err);
                    });
            } catch (ex) {
                reject(ex);
            }
        });
    }

    public static getByAsteroidId(asteroidId: string): Promise<Asteroid> {
        return new Promise(async (resolve, reject) => {
            try {
                await Asteroid.collectionRef()
                    .where('asteroid_id', "==", asteroidId)
                    .get()
                    .then(snapshot => {
                        if (snapshot.empty) {
                            return resolve(null);
                        }
                        return resolve(new Asteroid(snapshot.docs[0]));
                    })
                    .catch(err => {
                        reject(err);
                    });
            } catch (ex) {
                reject(ex);
            }
        });
    }

    constructor(snapshot?: firestore.DocumentSnapshot) {
        if (snapshot) {
            this._id = snapshot.id;
            this._ref = snapshot.ref;
            this._data = snapshot.data() || {};
        } else {
            this._ref = Asteroid.collectionRef().doc();
            this._id = this._ref.id;
            this._data = {};
        }
    }

    public save() {
        const _self = this;
        return new Promise(async (resolve, reject) => {
            try {
                await _self._ref.set(_self._data, { merge: true }).then((_) => {
                    resolve(_self);
                }).catch((err) => {
                    reject(err)
                });
            } catch (ex) {
                reject(ex);
            }
        });
    }

    get id(): string {
        return this._id;
    }

    get data() {
        return this._data;
    }

    get name(): string {
        return this._data.name;
    }

    set name(name: string) {
        this._data.name = name;
    }

    get asteroid_id() {
        return this._data.asteroid_id
    }

    set asteroid_id(id: string) {
        this._data.asteroid_id = id
    }

    get diameter(): string {
        return this._data.diameter;
    }

    set diameter(diameter: string) {
        this._data.diameter = diameter;
    }

    get velocity(): string {
        return this._data.velocity;
    }

    set velocity(velocity: string) {
        this._data.velocity = velocity;
    }

    get distance(): string {
        return this._data.distance;
    }

    set distance(distance: string) {
        this._data.distance = distance;
    }

    get pha(): boolean {
        return this._data.pha;
    }

    set pha(pha: boolean) {
        this._data.pha = pha;
    }

    get close_approach(): string {
        return this._data.close_approach;
    }

    set close_approach(close_approach: string) {
        this._data.close_approach = close_approach;
    }

}