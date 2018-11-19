import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, of } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';

import { Store } from 'store';

import { AuthService } from '../../../../auth/shared/services/auth/auth.service';

export interface Meal {
    name: string;
    ingredients: string[];
    timestamp: number;
    $key: string;
}

@Injectable()
export class MealsService {
    meals$: Observable<Meal[]> = this.db.list<Meal>(`meals/${this.uid}`)
        .snapshotChanges()
        .pipe(
            map(next => next.map(c => ({ $key: c.payload.key, ...c.payload.val() }))),
            tap(next => this.store.set('meals', next))
        );

    constructor(
        private store: Store,
        private db: AngularFireDatabase,
        private authService: AuthService
    ) { }

    get uid(): string {
        return this.authService.user.uid;
    }

    getMeal(key: string): Observable<Meal | {}> {
        if (!key) {
            return of({ });
        }
        return this.store.select<Meal[]>('meals').pipe(
            filter(Boolean),
            map(meals => meals.find((meal: Meal) => meal.$key === key))
        );
    }

    addMeal(meal: Meal): firebase.database.ThenableReference {
        return this.db.list<Meal>(`meals/${this.uid}`).push(meal);
    }

    updateMeal(key: string, meal: Meal) {
        return this.db.object<Meal>(`meals/${this.uid}/${key}`).update(meal);
    }

    removeMeal(key: string): Promise<void> {
        return this.db.list<Meal>(`meals/${this.uid}`).remove(key);
    }
}
