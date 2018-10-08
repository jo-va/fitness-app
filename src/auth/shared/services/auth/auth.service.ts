import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Store } from 'store';

export interface User {
    email: string;
    uid: string;
    authenticated: boolean;
}

@Injectable()
export class AuthService {
    auth$ = this.af.authState.pipe(
        tap(next => {
            if (!next) {
                this.store.set('user', null);
                return;
            }
            const user: User = {
                email: next.email,
                uid: next.uid,
                authenticated: true
            };
            this.store.set('user', user);
        })
    );

    constructor(private store: Store, private af: AngularFireAuth) { }

    get user(): firebase.User {
        return this.af.auth.currentUser;
    }

    get authState(): Observable<firebase.User> {
        return this.af.authState;
    }

    createUser(email: string, password: string): Promise<firebase.auth.UserCredential> {
        return this.af.auth.createUserWithEmailAndPassword(email, password);
    }

    loginUser(email: string, password: string): Promise<firebase.auth.UserCredential> {
        return this.af.auth.signInWithEmailAndPassword(email, password);
    }

    logoutUser(): Promise<void> {
        return this.af.auth.signOut();
    }
}
