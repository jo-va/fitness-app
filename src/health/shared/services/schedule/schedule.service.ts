import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { Store } from 'store';

import { AuthService } from '../../../../auth/shared/services/auth/auth.service';

import { Meal} from '../meals/meals.service';
import { Workout } from '../workouts/workouts.service';

export interface ScheduleItem {
    meals: Meal[];
    workouts: Workout[];
    section: string;
    timestamp: number;
    $key?: string;
}

export interface ScheduleList {
    morning?: ScheduleItem;
    lunch?: ScheduleItem;
    evening?: ScheduleItem;
    snacks?: ScheduleItem;
    [key: string]: any;
}

@Injectable()
export class ScheduleService {
    private date$ = new BehaviorSubject<Date>(new Date());
    private section$ = new Subject();
    private itemList$ = new Subject();

    items$ = this.itemList$.pipe(
        withLatestFrom(this.section$),
        map(([ items, section ]: any[]) => {
            const id = section.data.$key;
            const defaults: ScheduleItem = {
                workouts: null,
                meals: null,
                section: section.section,
                timestamp: new Date(section.day).getTime()
            };

            const payload = {
                ...(id ? section.data : defaults),
                ...items
            };

            if (id) {
                return this.updateSection(id, payload);
            } else {
                return this.createSection(payload);
            }
        })
    );

    selected$ = this.section$.pipe(
        tap((next: any) => this.store.set('selected', next))
    );

    list$ = this.section$.pipe(
        map((value: any) => this.store.value[value.type]),
        tap((next: any) => this.store.set('list', next))
    );

    schedule$: Observable<ScheduleList> = this.date$.pipe(
        tap((next: Date) => this.store.set('date', next)),
        map((day: Date) => {
            const startAt = new Date(
                day.getFullYear(), day.getMonth(), day.getDate()
            ).getTime();

            const endAt = new Date(
                day.getFullYear(), day.getMonth(), day.getDate() + 1
            ).getTime() - 1;

            return { startAt, endAt };
        }),
        switchMap(({ startAt, endAt }) => this.getSchedule(startAt, endAt)),
        map((data: ScheduleItem[]) => {
            const mapped: ScheduleList = {};
            for (const prop of data) {
                if (!mapped[prop.section]) {
                    mapped[prop.section] = prop;
                }
            }
            return mapped;
        }),
        tap((next: ScheduleList) => this.store.set('schedule', next))
    );

    constructor(
        private store: Store,
        private authService: AuthService,
        private db: AngularFireDatabase
    ) { }

    get uid(): string {
        return this.authService.user.uid;
    }

    updateItems(items: string[]): void {
        this.itemList$.next(items);
    }

    updateDate(date: Date): void {
        this.date$.next(date);
    }

    selectSection(event: any): void {
        this.section$.next(event);
    }

    private createSection(payload: ScheduleItem): firebase.database.ThenableReference {
        return this.db.list(`schedule/${this.uid}`).push(payload);
    }

    private updateSection(key: string, payload: ScheduleItem): Promise<void> {
        const { $key, ...data } = payload;
        return this.db.object(`schedule/${this.uid}/${key}`).update(data);
    }

    private getSchedule(startAt: number, endAt: number): Observable<ScheduleItem[]> {
        return this.db.list<ScheduleItem>(
            `schedule/${this.uid}`,
            ref => ref.orderByChild('timestamp').startAt(startAt).endAt(endAt)
        ).snapshotChanges().pipe(
            map(next => next.map(c => ({ $key: c.payload.key, ...c.payload.val() })))
        );
    }
}
