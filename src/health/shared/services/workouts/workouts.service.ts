import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, of } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';

import { Store } from 'store';

import { AuthService } from '../../../../auth/shared/services/auth/auth.service';

export interface Workout {
    name: string;
    type: string; // endurance | strength
    strength: any;
    endurance: any;
    timestamp: number;
    $key: string;
}

@Injectable()
export class WorkoutsService {
    workouts$: Observable<Workout[]> = this.db.list<Workout>(`workouts/${this.uid}`)
        .snapshotChanges()
        .pipe(
            map(next => next.map(c => ({ $key: c.payload.key, ...c.payload.val() }))),
            tap(next => this.store.set('workouts', next))
        );

    constructor(
        private store: Store,
        private db: AngularFireDatabase,
        private authService: AuthService
    ) { }

    get uid(): string {
        return this.authService.user.uid;
    }

    getWorkout(key: string): Observable<Workout | {}> {
        if (!key) {
            return of({ });
        }
        return this.store.select<Workout[]>('workouts').pipe(
            filter(Boolean),
            map(workouts => workouts.find((workout: Workout) => workout.$key === key))
        );
    }

    addWorkout(workout: Workout): firebase.database.ThenableReference {
        return this.db.list<Workout>(`workouts/${this.uid}`).push(workout);
    }

    updateWorkout(key: string, workout: Workout) {
        return this.db.object<Workout>(`workouts/${this.uid}/${key}`).update(workout);
    }

    removeWorkout(key: string): Promise<void> {
        return this.db.list<Workout>(`workouts/${this.uid}`).remove(key);
    }
}
