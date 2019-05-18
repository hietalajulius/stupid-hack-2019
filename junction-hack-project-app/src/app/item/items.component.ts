import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Subscription } from 'rxjs';

import { Fact } from "./fact";

import { AppService } from "../shared/app.service";

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html"
})
export class ItemsComponent implements OnInit, OnDestroy {
    facts: Array<Fact> = new Array<Fact>();
    private factsChangedRef: Subscription;

    constructor(
        public appService: AppService,
        private _routerExtensions: RouterExtensions
    ) { }

    ngOnInit(): void {
        this.facts = this.appService.getFacts();
        this.factsChangedRef = this.appService.factsChanged.subscribe( (facts) => {
            this.facts = facts;
            // this.appService.getFacts;
            // console.log("ItemsComponent: this.facts ->", JSON.stringify(this.facts));
            // console.log("ItemsComponent: AppService.getFacts() ->", JSON.stringify(this.appService.getFacts()));
        });
        // console.log("ItemsComponent: this.facts ->", JSON.stringify(this.facts));
    }

    ngOnDestroy(){
        this.factsChangedRef.unsubscribe();
    }

    onSettingsButtonTap() {
        this._routerExtensions.navigate(["settings"],
            {
                clearHistory: true,
                animated: true,
                transition: {
                    name: "slideDown",
                    duration: 200,
                    curve: "ease"
                }
            });
    }
}
