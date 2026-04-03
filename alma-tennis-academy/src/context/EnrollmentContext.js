import { createContext, useContext, useState, useEffect } from 'react';
import {
  collection, addDoc, updateDoc, doc, onSnapshot, query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

const EnrollmentContext = createContext();

export function useEnrollments() {
  return useContext(EnrollmentContext);
}

export function EnrollmentProvider({ children }) {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'enrollments'), orderBy('enrolledAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setEnrollments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const createEnrollment = async (data) => {
    return addDoc(collection(db, 'enrollments'), {
      ...data,
      enrolledAt: serverTimestamp(),
      status: 'active',
    });
  };

  const updateEnrollmentStatus = async (enrollmentId, status) => {
    return updateDoc(doc(db, 'enrollments', enrollmentId), { status });
  };

  return (
    <EnrollmentContext.Provider
      value={{ enrollments, loading, createEnrollment, updateEnrollmentStatus }}
    >
      {children}
    </EnrollmentContext.Provider>
  );
}
