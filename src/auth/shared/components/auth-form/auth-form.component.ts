import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-auth-form',
    styleUrls: ['./auth-form.component.scss'],
    template: `
        <div class="auth-form">
            <form [formGroup]="form" (ngSubmit)="onSubmit()">

                <ng-content select="h1"></ng-content>

                <label>
                    <input
                        type="email"
                        placeholder="Email address"
                        formControlName="email"
                    />
                </label>
                <label>
                    <input
                        type="password"
                        placeholder="Enter password"
                        formControlName="password"
                    />
                </label>

                <div class="error" *ngIf="emailIsInvalid">
                    Invalid email format
                </div>

                <div class="error" *ngIf="passwordIsInvalid">
                    Password is required
                </div>

                <ng-content select=".error"></ng-content>

                <div class="auth-form__action">
                    <ng-content select="button"></ng-content>
                </div>

                <div class="auth-form__toggle">
                    <ng-content select="a"></ng-content>
                </div>

            </form>
        </div>
    `
})
export class AuthFormComponent {
    @Output() submitted = new EventEmitter<FormGroup>();

    form = this.fb.group({
        email: ['', Validators.email],
        password: ['', Validators.required]
    });

    constructor(private fb: FormBuilder) { }

    onSubmit(): void {
        if (this.form.valid) {
            this.submitted.emit(this.form);
        }
    }

    get passwordIsInvalid(): boolean {
        const control = this.form.get('password');
        return control.hasError('required') && control.touched;
    }

    get emailIsInvalid(): boolean {
        const control = this.form.get('email');
        return control.hasError('email') && control.touched;
    }
}
