import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// third-party modules
import { AngularFireModule, FirebaseAppConfig } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';

// shared modules
import { SharedModule } from './shared/shared.module';

export const ROUTES: Routes = [
    {
        path: 'auth',
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'login' },
            { path: 'login', loadChildren: './login/login.module#LoginModule' },
            { path: 'register', loadChildren: './register/register.module#RegisterModule' }
        ]
    }
];

export const firebaseConfig: FirebaseAppConfig = {
    apiKey: 'AIzaSyAtAKvzyYPKQJ3QP-bcklJo1u3qVUQIIB4',
    authDomain: 'jv-fitness.firebaseapp.com',
    databaseURL: 'https://jv-fitness.firebaseio.com',
    projectId: 'jv-fitness',
    storageBucket: 'jv-fitness.appspot.com',
    messagingSenderId: '187738982041'
};

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES),
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        SharedModule.forRoot()
    ]
})
export class AuthModule { }
