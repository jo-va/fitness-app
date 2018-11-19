import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Workout, WorkoutsService } from '../../../shared/services/workouts/workouts.service';

@Component({
    selector: 'app-workout',
    styleUrls: ['workout.component.scss'],
    template: `
        <div class="workout">
            <div class="workout__title">
                <h1>
                    <img src="/assets/workout.svg">
                    <span *ngIf="workout$ | async as workout; else title">
                        {{ workout.name ? 'Edit' : 'Create' }} workout
                    </span>
                    <ng-template #title>
                        Loading...
                    </ng-template>
                </h1>
            </div>
            <div *ngIf="workout$ | async as workout; else loading">
                <app-workout-form
                    [workout]="workout"
                    (create)="addWorkout($event)"
                    (update)="updateWorkout($event)"
                    (remove)="removeWorkout()">
                </app-workout-form>
            </div>
            <ng-template #loading>
                <div class="message">
                    <img src="/assets/loading.svg">
                    Fetching workout...
                </div>
            </ng-template>
        </div>
    `
})
export class WorkoutComponent implements OnInit, OnDestroy {
    workout$: Observable<Workout | {}>;
    subscription: Subscription;

    constructor(
        private workoutsService: WorkoutsService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.subscription = this.workoutsService.workouts$.subscribe();

        this.workout$ = this.route.params.pipe(
            switchMap(param => this.workoutsService.getWorkout(param.id))
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    async addWorkout(workout: Workout): Promise<void> {
        await this.workoutsService.addWorkout(workout);
        this.backToWorkouts();
    }

    async updateWorkout(workout: Workout): Promise<void> {
        const key = this.route.snapshot.params.id;
        await this.workoutsService.updateWorkout(key, workout);
        this.backToWorkouts();
    }

    async removeWorkout(): Promise<void> {
        const key = this.route.snapshot.params.id;
        await this.workoutsService.removeWorkout(key);
        this.backToWorkouts();
    }

    backToWorkouts(): void {
        this.router.navigate(['workouts']);
    }
}
