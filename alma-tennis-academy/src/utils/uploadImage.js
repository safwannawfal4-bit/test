import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export async function uploadImage(file, folder) {
  const filename = `${Date.now()}-${file.name}`;
  const storageRef = ref(storage, `${folder}/${filename}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}
