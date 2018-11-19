import { Component, EventEmitter, Input, ChangeDetectionStrategy, Output } from '@angular/core';

@Component({
    selector: 'app-schedule-days',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['schedule-days.component.scss'],
    template: `
        <div class="days">
            <button
                type="button"
                class="day"
                *ngFor="let day of days; index as i">
                <span [class.active]="i === selected"
                (click)="selectDay(i)">
                    {{ day }}
                </span>
            </button>
        </div>
    `
})
export class ScheduleDaysComponent {
    @Input() selected: number;

    @Output() select = new EventEmitter<number>();

    days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    selectDay(index: number): void {
        this.select.emit(index);
    }
}
