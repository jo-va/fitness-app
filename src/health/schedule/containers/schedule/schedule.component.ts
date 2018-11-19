import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Store } from 'store';

import { ScheduleService, ScheduleList } from '../../../shared/services/schedule/schedule.service';
import { Meal, MealsService } from '../../../shared/services/meals/meals.service';
import { Workout, WorkoutsService } from '../../../shared/services/workouts/workouts.service';

@Component({
    selector: 'app-schedule',
    styleUrls: ['schedule.component.scss'],
    template: `
        <div class="schedule">
            <app-schedule-calendar
                [date]="date$ | async"
                [items]="schedule$ | async"
                (change)="changeDate($event)"
                (select)="changeSection($event)">
            </app-schedule-calendar>

            <app-schedule-assign
                *ngIf="open"
                [section]="selected$ | async"
                [list]="list$ | async"
                (update)="assignItem($event)"
                (cancel)="closeAssign()">
            </app-schedule-assign>
        </div>
    `
})
export class ScheduleComponent implements OnInit, OnDestroy {
    open = false;

    date$: Observable<Date>;
    selected$: Observable<any>;
    list$: Observable<Meal[] | Workout[]>;
    schedule$: Observable<ScheduleList>;
    subscriptions: Subscription[] = [];

    constructor(
        private store: Store,
        private mealsService: MealsService,
        private workoutService: WorkoutsService,
        private scheduleService: ScheduleService
    ) { }

    ngOnInit(): void {
        this.date$ = this.store.select('date');
        this.schedule$ = this.store.select('schedule');
        this.selected$ = this.store.select('selected');
        this.list$ = this.store.select('list');

        this.subscriptions = [
            this.scheduleService.schedule$.subscribe(),
            this.scheduleService.selected$.subscribe(),
            this.scheduleService.list$.subscribe(),
            this.scheduleService.items$.subscribe(),
            this.mealsService.meals$.subscribe(),
            this.workoutService.workouts$.subscribe()
        ];
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    assignItem(items: string[]): void {
        this.scheduleService.updateItems(items);
        this.closeAssign();
    }

    closeAssign(): void {
        this.open = false;
    }

    changeDate(date: Date): void {
        this.scheduleService.updateDate(date);
    }

    changeSection(event: any): void {
        this.open = true;
        this.scheduleService.selectSection(event);
    }
}
