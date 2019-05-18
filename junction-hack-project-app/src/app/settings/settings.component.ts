import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Switch } from "tns-core-modules/ui/switch";
import { EventData } from "tns-core-modules/data/observable";

import { AppService } from "../shared/app.service";

@Component({
    selector: "Settings",
    moduleId: module.id,
    templateUrl: "./settings.component.html",
    styleUrls: ["./settings.component.css"]
})
export class SettingsComponent implements OnInit {
    settingsAreValid: boolean = true;
    isAnswerSelected: boolean = true;

    pushIsChecked: boolean = false;
    pushAdditionalText: string;

    sliderValue: number = 10;
    interval: number;
    intervalAdditionalText: string;

    constructor(
        public appService: AppService,
        private _routerExtensions: RouterExtensions
    ) { }

    ngOnInit(): void {
        this.pushIsChecked = this.appService.getIsSubscribed();
        this.interval = this.appService.getInterval();
        this.setPushAdditionalText();
        this.setIntervalAdditionalText();
    }

    onPushIsCheckedChange(args: EventData): void {
        let mySwitch = args.object as Switch;
        this.pushIsChecked = mySwitch.checked;
        this.appService.setIsSubscribed(this.pushIsChecked);
        this.setPushAdditionalText();
    }

    onSliderChange(args: EventData): void {
        this.interval = 100-this.sliderValue;
        this.appService.setInterval(this.interval);
        this.setIntervalAdditionalText();
    }

    setPushAdditionalText(): void {
        if (!this.pushIsChecked) {
            this.pushAdditionalText = "Come on, you really want them";
        } else {
            this.pushAdditionalText = "Aww yis, let the facts roll";
        }
    }

    setIntervalAdditionalText(): void {
        if (!this.interval) {
            this.intervalAdditionalText = "Not set";
        } else {
            this.intervalAdditionalText = this.interval.toFixed(3);
        }
    }

    onSaveButtonTap() {        
        this.appService.updateFirebaseUser();

        this._routerExtensions.navigate(["/items"],
            {
                clearHistory: true,
                animated: true,
                transition: {
                    name: "slideUp",
                    duration: 200,
                    curve: "ease"
                }
            });
    }
}