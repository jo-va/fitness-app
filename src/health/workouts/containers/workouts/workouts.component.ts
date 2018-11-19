import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Store } from 'store';

import { Workout, WorkoutsService } from '../../../shared/services/workouts/workouts.service';

@Component({
    selector: 'app-workouts',
    styleUrls: ['workouts.component.scss'],
    template: `
        <div class="workouts">
            <div class="workouts__title">
                <h1>
                    <img src="/assets/workout.svg">
                    Your workouts
                </h1>
                <a
                    class="btn__add"
                    [routerLink]="['../workouts/new']">
                    <img src="/assets/add-white.svg">
                    New workout
                </a>
            </div>
            <div *ngIf="workouts$ | async as workouts; else loading">
                <div class="message" *ngIf="!workouts.length">
                    <img src="/assets/face.svg">
                    No workouts, add a new workout to start
                </div>
                <app-list-item
                    *ngFor="let workout of workouts"
                    [item]="workout"
                    (remove)="removeWorkout($event)">
                </app-list-item>
            </div>
            <ng-template #loading>
                <div class="message">
                    <img src="/assets/loading.svg">
                    Fetching workouts...
                </div>
            </ng-template>
        </div>
    `
})
export class WorkoutsComponent implements OnInit, OnDestroy {
    workouts$: Observable<Workout[]>;
    subscription: Subscription;

    constructor(
        private store: Store,
        private workoutsService: WorkoutsService
    ) { }

    ngOnInit(): void {
        this.workouts$ = this.store.select<Workout[]>('workouts');
        this.subscription = this.workoutsService.workouts$.subscribe();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    removeWorkout(workout: Workout): void {
        this.workoutsService.removeWorkout(workout.$key);
    }
}
