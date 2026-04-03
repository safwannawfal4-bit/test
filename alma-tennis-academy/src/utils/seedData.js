import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import defaultProducts from '../data/products';
import defaultPrograms from '../data/programs';

export async function seedIfEmpty() {
  try {
    const productsSnap = await getDocs(collection(db, 'products'));
    if (productsSnap.empty) {
      for (const p of defaultProducts) {
        const { id, image, ...data } = p;
        await addDoc(collection(db, 'products'), {
          ...data,
          imageUrl: '',
          createdAt: serverTimestamp(),
        });
      }
    }
    const programsSnap = await getDocs(collection(db, 'programs'));
    if (programsSnap.empty) {
      for (const p of defaultPrograms) {
        const { id, ...data } = p;
        await addDoc(collection(db, 'programs'), {
          ...data,
          imageUrl: '',
          spotsTotal: data.spotsAvailable,
          createdAt: serverTimestamp(),
        });
      }
    }
  } catch (err) {
    console.error('Seed error:', err);
  }
}
