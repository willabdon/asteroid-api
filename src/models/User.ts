import { firestore } from 'firebase-admin';


export default class User {

    public static collectionRef(): firestore.CollectionReference {
        return firestore().collection('users');
    }

    private _id: string;
    private _data: { [field: string]: any };
    private _ref: firestore.DocumentReference;

    public static getById(id: string): Promise<User> {
        return new Promise(async (resolve, reject) => {
            try {
                await User.collectionRef().doc(id).get().then((snapshot) => {
                    resolve(new User(snapshot));
                }).catch((err) => {
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
            this._ref = User.collectionRef().doc();
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

    get favourites(): string[] {
        if (!this._data.favourites || !(this._data.favourites instanceof Array)) {
            this._data.favourites = [];
        }
        return this._data.favourites;
    }

    set favourites(favourites: string[]) {
        this._data.favourites = favourites;
    }

    public addFavourite(favourite: string) {
        if (this.favourites.indexOf(favourite) === -1) {
            this.favourites.push(favourite);
        }
    }

    public removeFavourite(favourite: string) {
        if (this.favourites.indexOf(favourite) !== -1) {
            this.favourites.splice(this.favourites.indexOf(favourite), 1);
        }
    }
}