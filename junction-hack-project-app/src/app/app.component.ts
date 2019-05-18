import { Component, OnInit } from "@angular/core";

import { AppService } from "./shared/app.service";

@Component({
    selector: "ns-app",
    moduleId: module.id,
    templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit  {

    constructor(
        private appService: AppService
    ) { }

    ngOnInit() {
        this.appService.init();
    }
}