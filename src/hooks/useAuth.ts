import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for local guest mode first
    const isGuest = localStorage.getItem('eco_guest_mode') === 'true';
    
    if (isGuest) {
      setUser({ uid: 'guest-user', isAnonymous: true } as any);
      setProfile({
        uid: 'guest-user',
        email: 'guest@ecosphere.local',
        displayName: 'Guest Explorer',
        xp: 0,
        level: 1,
        streak: 0,
        totalSavedCO2: 0,
        createdAt: new Date(),
      });
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        setLoading(false);
        (async () => {
          try {
            const profilePromise = getDoc(doc(db, 'users', firebaseUser.uid));
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), 5000)
            );

            const userDoc = await Promise.race([profilePromise, timeoutPromise]) as any;

            if (userDoc.exists()) {
              setProfile(userDoc.data() as UserProfile);
            } else {
              const initialProfile: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || 'Eco Explorer',
                xp: 0,
                level: 1,
                streak: 0,
                totalSavedCO2: 0,
                createdAt: new Date(),
              };
              try {
                await setDoc(doc(db, 'users', firebaseUser.uid), initialProfile);
              } catch (e) {
                console.warn("Failed to create profile document:", e);
              }
              setProfile(initialProfile);
            }
          } catch (error) {
            console.error("Error managing user profile:", error);
            setProfile({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: 'Eco Explorer',
              xp: 0,
              level: 1,
              streak: 0,
              totalSavedCO2: 0,
              createdAt: new Date(),
            });
          }
        })();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, profile, loading };
}
