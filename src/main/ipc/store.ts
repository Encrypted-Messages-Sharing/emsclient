import ElStore from 'electron-store';
import { genString, aesEncrypt, aesDecrypt } from '../util';

export function isAuthExists(store: ElStore) {
  return () => !!store.get('auth');
}
 
export function setUserAuth(store: ElStore) {
  return (e: any, pass: string) => {
    const randomText = `${genString(5, 'letters')}-${genString(5, 'numbers')}-${genString(5, 'letters')}-${genString(5, 'numbers')}`;

    store.set('auth', aesEncrypt(randomText, pass))
  }
}

export function tryAuth(store: ElStore) {
  return (e: any, pass: string) => {
    const encryptedAuth = store.get('auth') as string;
    let decrypted = '';
    try {
      decrypted = aesDecrypt(encryptedAuth || '', pass);
    }
    catch (e) {
      return null;
    }

    const regExpCheck = new RegExp(/[a-zA-Z]{5}-\d{5}-[a-zA-Z]{5}-\d{5}/gm);

    if (regExpCheck.test(decrypted)) {
      const encryptedContent = store.get('saved') as string;
      if (!encryptedContent) return {};

      const decryptedContent = aesDecrypt(encryptedContent || '', pass);

      try {
        const jsoned = JSON.parse(decryptedContent)
        return jsoned;
      } catch (e) {
        store.delete('saved');
        return {};
      }
    }
    return null;
  }
}

export function removeUserData(store: ElStore) {
  return () => {
    store.delete('auth');
    store.delete('saved');
  }
}

export function setSavedContent(store: ElStore) {
  return (e: any, contentType: string, content: string, pass: string) => {
    const encryptedContent = store.get('saved') as string;
    const decryptedContent = encryptedContent ? aesDecrypt(encryptedContent || '', pass) : "{}";

    const decryptedContentJSON = JSON.parse(decryptedContent);

    decryptedContentJSON[contentType] = content;

    const encrypted = aesEncrypt(JSON.stringify(decryptedContentJSON), pass);

    store.set('saved', encrypted);
  }
}
