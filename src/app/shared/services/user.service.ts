import { Injectable } from '@angular/core';
import * as firebaseAuth from 'firebase/auth';
import {
  CollectionReference,
  DocumentData,
  collection,
  setDoc,
  doc,
  getDoc,
} from '@firebase/firestore';

import { Firestore } from '@angular/fire/firestore';
import { IUser } from 'shared/models/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  users: CollectionReference<DocumentData>;

  constructor(private db: Firestore) {
    this.users = collection(db, 'users');
  }

  async save(user: firebaseAuth.User) {
    const data: IUser = {
      name: user.displayName,
      email: user.email,
      lastLogin: new Date(),
      isAdmin: false,
    };
    const userDocRef = doc(this.db, `/users/${user.uid}`);
    const targetDoc = await getDoc(userDocRef);
    if (targetDoc.exists()) {
      data.isAdmin = targetDoc.get('isAdmin');
    }

    await setDoc(userDocRef, data);
  }

  async get(uid?: string) {
    if (!uid) return null;
    const targetDoc = await getDoc(doc(this.db, `/users/${uid}`));
    return targetDoc.data() as IUser;
  }
}
