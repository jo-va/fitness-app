import { Component, ChangeDetectionStrategy, EventEmitter, Output, Input } from '@angular/core';

import { User } from '../../../auth/shared/services/auth/auth.service';

@Component({
    selector: 'app-header',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['app-header.component.scss'],
    template: `
        <div class="app-header">
            <div class="wrapper">
                <img src="/assets/logo.svg">
                <div
                    *ngIf="user?.authenticated"
                    class="app-header__user-info">
                    <span (click)="logoutUser()"></span>
                </div>
            </div>
        </div>
    `
})
export class AppHeaderComponent {
    @Input() user: User;
    @Output() logout = new EventEmitter<any>();

    logoutUser(): void {
        this.logout.emit();
    }
}
