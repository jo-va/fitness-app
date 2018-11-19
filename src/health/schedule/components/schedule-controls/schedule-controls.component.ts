import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-schedule-controls',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['schedule-controls.component.scss'],
    template: `
        <div class="controls">
            <button
                type="button"
                (click)="moveDate(offset - 1)">
                <img src="/assets/chevron-left.svg">
            </button>
            <p>{{ selected | date:'MMMM dd, yyyy' }}</p>
            <button
                type="button"
                (click)="moveDate(offset + 1)">
                <img src="/assets/chevron-right.svg">
            </button>
        </div>
    `
})
export class ScheduleControlsComponent {
    @Input() selected: Date;

    @Output() move = new EventEmitter<number>();

    offset = 0;

    moveDate(offset: number): void {
        this.offset = offset;
        this.move.emit(offset);
    }
}
