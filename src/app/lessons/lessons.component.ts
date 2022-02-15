import {Component, OnInit} from '@angular/core';
import {LessonsService} from "../services/lessons.service";
import {Observable, of} from 'rxjs';
import {Lesson} from "../model/lesson";
import {SwPush} from "@angular/service-worker";
import {NewsletterService} from "../services/newsletter.service";
import {catchError} from 'rxjs/operators';

@Component({
    selector: 'lessons',
    templateUrl: './lessons.component.html',
    styleUrls: ['./lessons.component.css']
})
export class LessonsComponent implements OnInit {

    lessons$: Observable<Lesson[]>;
    isLoggedIn$: Observable<boolean>;
    sub: PushSubscription;

    readonly VAPID_PUBLIC_KEY = "BNBTLvvBHfjCLZYuRMVruYzOYmNw-wZBNVjxck58msyB-W5qVPCVqb9Z0ixqaxrcRW_rHNA-RSDdE95RmZ7vacQ";

    constructor(
        private lessonsService: LessonsService,
        private swPush: SwPush,
        private newsletterService: NewsletterService) {

    }

    ngOnInit() {
        this.loadLessons();
    }


    loadLessons() {
        this.lessons$ = this.lessonsService.loadAllLessons().pipe(catchError(err => of([])));
    }

    subscribeToNotifications() {

      this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
      })
        .then(sub => {

          this.sub = sub;

          console.log("Notification Subscription: ", sub);

          this.newsletterService.addPushSubscriber(sub).subscribe(() =>
            console.log("Sent push subscription object to server")
          ,
            err => console.error("Could not subscribe to notifications", err))
        })
        .catch(err => console.error("Could not subscribe to notifications", err));

    }


    sendNewsletter() {

      console.log("Sending Newsletter to all Subscribers");

      this.newsletterService.send().subscribe();
    }





}
