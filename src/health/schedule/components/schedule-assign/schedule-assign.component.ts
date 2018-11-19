import { Component, ChangeDetectionStrategy, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { Meal } from '../../../shared/services/meals/meals.service';
import { Workout } from '../../../shared/services/workouts/workouts.service';

@Component({
    selector: 'app-schedule-assign',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['schedule-assign.component.scss'],
    template: `
        <div class="schedule-assign">
            <div class="schedule-assign__modal">
                <div class="schedule-assign__title">
                    <h1>
                        <img src="/assets/{{ section.type === 'workouts' ? 'workout' : 'food' }}.svg">
                        Assign {{ section.type }}
                    </h1>
                    <a
                        class="btn__add"
                        [routerLink]="getRoute(section.type)">
                        <img src="/assets/add-white.svg">
                        New {{ section.type }}
                    </a>
                </div>

                <div class="schedule-assign__list">
                    <span
                        class="schedule-assign__empty"
                        *ngIf="!list?.length">
                        <img src="/assets/face.svg">
                        Nothing here to assign
                    </span>
                    <div
                        *ngFor="let item of list"
                        [class.active]="exists(item.name)"
                        (click)="toggleItem(item.name)">
                        {{ item.name }}
                    </div>
                </div>

                <div class="schedule-assign__submit">
                    <div>
                        <button
                            type="button"
                            class="button"
                            (click)="updateAssign()">
                            Update
                        </button>
                        <button
                            type="button"
                            class="button button--cancel"
                            (click)="cancelAssign()">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ScheduleAssignComponent implements OnInit {
    @Input() section: any;
    @Input() list: Meal[] | Workout[];

    @Output() update = new EventEmitter<any>();
    @Output() cancel = new EventEmitter();

    private selected: string[] = [];

    ngOnInit(): void {
        this.selected = [...this.section.assigned];
    }

    toggleItem(name: string): void {
        if (this.exists(name)) {
            this.selected = this.selected.filter(item => item !== name);
        } else {
            this.selected = [...this.selected, name];
        }
    }

    getRoute(name: string): string[] {
        return [`../${name}/new`];
    }

    exists(name: string): boolean {
        return this.selected.includes(name);
    }

    updateAssign(): void {
        this.update.emit({
            [this.section.type]: this.selected
        });
    }

    cancelAssign(): void {
        this.cancel.emit();
    }
}
