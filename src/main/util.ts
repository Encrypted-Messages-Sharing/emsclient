/* eslint import/prefer-default-export: off */
import { URL } from "url";
import path from "path";
import aes from "aes-js";

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === "development") {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, "../renderer/", htmlFileName)}`;
}

export function genString(length: number, type: 'numbers' | 'letters' | 'all') {
  let result = '';
  const data = {
    all: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
  }
  const characters = data[type];
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function aesEncrypt(textString: string, keyString: string) {
  const textBytes = aes.utils.utf8.toBytes(textString);
  
  const key = aes.utils.utf8.toBytes(keyString);
  const ivString = genString(16, 'all');
  const iv = aes.utils.utf8.toBytes(ivString);
  
  const aesCbc = new aes.ModeOfOperation.cbc(aes.padding.pkcs7.pad(key), iv);
  const encryptedBytes = aesCbc.encrypt(aes.padding.pkcs7.pad(textBytes));
  const encryptedHex = aes.utils.hex.fromBytes(encryptedBytes);

  return ivString + encryptedHex;
}

export function aesDecrypt(textString: string, keyString: string) {
  const text = aes.utils.hex.toBytes(textString.slice(16));
  const iv = aes.utils.utf8.toBytes(textString.slice(0, 16));
  const key = aes.utils.utf8.toBytes(keyString);

  const aesCbc = new aes.ModeOfOperation.cbc(aes.padding.pkcs7.pad(key), iv);
  const decryptedBytes = aesCbc.decrypt(text);

  return aes.utils.utf8.fromBytes(aes.padding.pkcs7.strip(decryptedBytes));
}