import { Injectable } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Observable, Subject } from 'rxjs';

import { Fact } from "../item/fact";
import { ItemDetailComponent } from "../item/item-detail.component";

const appSettings = require("tns-core-modules/application-settings");
const firebase = require("nativescript-plugin-firebase");

@Injectable({
    providedIn: "root"
})
export class AppService {
    private facts = new Array<Fact>();

    private _factsChanged: Subject<Array<Fact>> = new Subject<Array<Fact>>();
    public factsChanged = this._factsChanged.asObservable();

    constructor(
        // private _routerExtensions: RouterExtensions
    ) { }

    init(): void {
        firebase.init({
            // Optionally pass in properties for database, authentication and cloud messaging,
            // see their respective docs.
            showNotifications: true,
            showNotificationsWhenInForeground: true,
            onPushTokenReceivedCallback: (token: string) => {
                console.log(`Received push token: ${token}`);
                appSettings.setString("token", token);
                this.updateFirebaseUser();
            },
            onNotificationReceivedCallback: (notification: string) => {
                console.log(`Received notification: ${notification}`);
            }
        }).then(
            () => {
                console.log(`firebase.init DONE. Token: ${this.getToken()}`);
            },
            error => {
                console.log(`firebase.init ERROR: ${error}`);
            }
        );

        let onValueEvent = (result) => {
            if (result.key == 'facts') {
                console.log(`AppService: ValueEvent: /facts '${result.type}' -> count: ${Object.keys(result.value).length}`);
                // console.log('/facts result.value ->', JSON.stringify(result.value));
                
                let _facts = new Array<Fact>();
                Object.keys(result.value).forEach(key => {
                    let fact = new Fact(key, result.value[key]);
                    _facts.push(fact);
                });
                this.facts = _facts;

                console.log(`AppService: ValueEvent -> new Facts array length: ${this.facts.length}`);
                this._factsChanged.next(this.facts);
            } else {
                console.log("AppService: ValueEvent result with unknown key:", JSON.stringify(result));
            }
        }

        var onQueryEvent = (result) => {
            if (result.key == 'facts') {
                console.log(`AppService: QueryEvent: /facts '${result.type}' -> count: ${Object.keys(result.value).length}`);
                // console.log('/facts result.value ->', JSON.stringify(result.value));
                
                let _facts = new Array<Fact>();
                Object.keys(result.value).forEach(key => {
                    let fact = new Fact(key, result.value[key]);
                    _facts.push(fact);
                });
                this.facts = _facts;

                console.log(`AppService: QueryEvent -> new Facts array length: ${this.facts.length}`);
                this._factsChanged.next(this.facts);
            } else {
                console.log("AppService: QueryEvent result with unknown key:", JSON.stringify(result));
            }
        }
        
        // listen to changes in the /facts path
        firebase.addValueEventListener(onValueEvent, "/facts").then(
            listenerWrapper => {
                var path = listenerWrapper.path;
                var listeners = listenerWrapper.listeners; // an Array of listeners added
                // you can store the wrapper somewhere to later call 'removeEventListeners'
                console.log("Path", path);
                console.log("Listeners", JSON.stringify(listeners));
            }
        );

        firebase.query(
            onQueryEvent,
            "/facts",
            {
                // set this to true if you want to check if the value exists or just want the event to fire once
                // default false, so it listens continuously.
                // Only when true, this function will return the data in the promise as well!
                singleEvent: true,
                // order by company.country
                // orderBy: {
                //     type: firebase.QueryOrderByType.CHILD,
                //     value: 'since' // mandatory when type is 'child'
                // },
                // but only companies 'since' a certain year (Telerik's value is 2000, which is imaginary btw)
                // use either a 'range'
                //range: {
                //    type: firebase.QueryRangeType.EQUAL_TO,
                //    value: 2000
                ///},
                // .. or 'chain' ranges like this:
                // ranges: [
                //   {
                //       type: firebase.QueryRangeType.START_AT,
                //       value: 1999
                //   },
                //   {
                //       type: firebase.QueryRangeType.END_AT,
                //       value: 2000
                //   }
                // ],
                // only the first 10 matches
                // (note that there's only 1 in this case anyway)
                limit: {
                    type: firebase.QueryLimitType.LAST,
                    value: 10
                }
            }
        );
    }

    setIsSubscribed(checked: boolean): void {
        appSettings.setBoolean("is_subscribed", checked)
    }

    setInterval(interval: number): void {
        appSettings.setNumber("interval", interval);
    }

    getToken(): string {
        if (appSettings.hasKey("token")) {
            return appSettings.getString("token");
        }
        console.warn("AppService:getToken() -> Setting 'token' is not set");
        return null;
    }

    getIsSubscribed(): boolean {
        if (appSettings.hasKey("is_subscribed")) {
            return appSettings.getBoolean("is_subscribed");
        }
        console.warn("AppService:getIsSubscribed() -> Setting 'is_subscribed' is not set");
        return false;
    }

    getInterval(): number {
        if (appSettings.hasKey("interval")) {
            return parseFloat(appSettings.getNumber("interval").toFixed(3));
        }
        console.warn("AppService:getInterval() -> Setting 'interval' is not set");
        return 66;
    }

    updateFirebaseUser(): void {
        let params = {
            'token': this.getToken(),
            'push': this.getIsSubscribed(),
            'interval': this.getInterval()
        }
        console.log("Setting /only_user ...", params);
        firebase.setValue( '/only_user', params );
    }

    updateFacts(): void {

    }

    getFacts(): Array<Fact> {
        return this.facts;
    }

    getFact(id: string): Fact {
        return this.facts.filter((fact) => fact.id === id)[0];
    }
}