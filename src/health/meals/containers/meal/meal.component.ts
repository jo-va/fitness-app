import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Meal, MealsService } from '../../../shared/services/meals/meals.service';

@Component({
    selector: 'app-meal',
    styleUrls: ['meal.component.scss'],
    template: `
        <div class="meal">
            <div class="meal__title">
                <h1>
                    <img src="/assets/food.svg">
                    <span *ngIf="meal$ | async as meal; else title">
                        {{ meal.name ? 'Edit' : 'Create' }} meal
                    </span>
                    <ng-template #title>
                        Loading...
                    </ng-template>
                </h1>
            </div>
            <div *ngIf="meal$ | async as meal; else loading">
                <app-meal-form
                    [meal]="meal"
                    (create)="addMeal($event)"
                    (update)="updateMeal($event)"
                    (remove)="removeMeal()">
                </app-meal-form>
            </div>
            <ng-template #loading>
                <div class="message">
                    <img src="/assets/loading.svg">
                    Fetching meal...
                </div>
            </ng-template>
        </div>
    `
})
export class MealComponent implements OnInit, OnDestroy {
    meal$: Observable<Meal | {}>;
    subscription: Subscription;

    constructor(
        private mealsService: MealsService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.subscription = this.mealsService.meals$.subscribe();

        this.meal$ = this.route.params.pipe(
            switchMap(param => this.mealsService.getMeal(param.id))
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    async addMeal(meal: Meal): Promise<void> {
        await this.mealsService.addMeal(meal);
        this.backToMeals();
    }

    async updateMeal(meal: Meal): Promise<void> {
        const key = this.route.snapshot.params.id;
        await this.mealsService.updateMeal(key, meal);
        this.backToMeals();
    }

    async removeMeal(): Promise<void> {
        const key = this.route.snapshot.params.id;
        await this.mealsService.removeMeal(key);
        this.backToMeals();
    }

    backToMeals(): void {
        this.router.navigate(['meals']);
    }
}
