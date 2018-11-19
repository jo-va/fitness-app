import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-list-item',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['list-item.component.scss'],
    template: `
        <div class="list-item">
            <a [routerLink]="getRoute(item)">
                <p class="list-item__name">{{ item.name }}</p>
                <p class="list-item__ingredients">
                    <span *ngIf="item.ingredients; else showWorkout">
                        {{ item.ingredients | appJoin }}
                    </span>
                </p>
                <ng-template #showWorkout>
                    <span>{{ item | appWorkout }}</span>
                </ng-template>
            </a>

            <div class="list-item__delete" *ngIf="toggled">
                <p>Delete item?</p>
                <button
                    class="confirm"
                    type="button"
                    (click)="removeItem()">
                    Yes
                </button>
                <button
                    class="cancel"
                    type="button"
                    (click)="toggle()">
                    No
                </button>
            </div>

            <button
                class="trash"
                type="button"
                (click)="toggle()">
                <img src="/assets/remove.svg">
            </button>
        </div>
    `
})
export class ListItemComponent {
    @Input() item: any;

    @Output() remove = new EventEmitter<any>();

    toggled = false;

    removeItem(): void {
        this.remove.emit(this.item);
    }

    toggle(): void {
        this.toggled = !this.toggled;
    }

    getRoute(item: any): string[] {
        return [
            `../${item.ingredients ? 'meals' : 'workouts' }`,
            item.$key
        ];
    }
}
