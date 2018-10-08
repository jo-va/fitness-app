import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Store } from 'store';

import { AuthService } from '../../../../auth/shared/services/auth/auth.service';

export interface Meal {
    name: string;
    ingredients: string[];
    timestamp: number;
    $key: string;
    $exists: () => boolean;
}

@Injectable()
export class MealsService {
    meals$: Observable<Meal[]> = this.db.list<Meal>(`meals/${this.uid}`)
        .valueChanges()
        .pipe(
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
}
