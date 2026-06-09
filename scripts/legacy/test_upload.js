import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { readFileSync } from "fs";

const firebaseConfig = JSON.parse(readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(firebaseConfig);
const storage = getStorage(app, firebaseConfig.storageBucket);

async function testUpload() {
  try {
    const storageRef = ref(storage, "test_file.txt");
    const fileData = new Uint8Array(Buffer.from("Hello World"));
    await uploadBytes(storageRef, fileData);
    console.log("Upload successful!");
  } catch (error) {
    console.error("Upload failed:", error.message);
  }
}

testUpload();
