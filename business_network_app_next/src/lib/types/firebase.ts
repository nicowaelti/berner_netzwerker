import { FirebaseError } from 'firebase/app';

export interface ExtendedFirebaseError extends FirebaseError {
  code: string;
  message: string;
  customData?: {
    email?: string;
  };
}
