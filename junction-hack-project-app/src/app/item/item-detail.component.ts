import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { Fact } from "./fact";
import { AppService } from "../shared/app.service";

const utilityModule = require("utils/utils");

@Component({
    selector: "ns-details",
    moduleId: module.id,
    templateUrl: "./item-detail.component.html"
})
export class ItemDetailComponent implements OnInit {
    fact: Fact;

    constructor(
        private appService: AppService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        console.log("ItemDetailComponent: Route params:", JSON.stringify(this.route.snapshot.params));
        const id = this.route.snapshot.params.id;
        this.fact = this.appService.getFact(id);
    }

    launch(): void {
        console.log("Trying to open in browser...")
        utilityModule.openUrl(this.fact.url);
    }
}
