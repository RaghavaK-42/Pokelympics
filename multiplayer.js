import {initializeApp} from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
import {getDatabase,ref,get,onValue,runTransaction} from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js';
const config={apiKey:'AIzaSyCdcEvvAXrOuDS7y26YdAsn6oAnMJhdfHQ',authDomain:'genstuff-a15ca.firebaseapp.com',databaseURL:'https://genstuff-a15ca-default-rtdb.firebaseio.com',projectId:'genstuff-a15ca',storageBucket:'genstuff-a15ca.firebasestorage.app',messagingSenderId:'996993558234',appId:'1:996993558234:web:d0d116de5d5a98c52467e3',measurementId:'G-F881QY9TB0'};
const db=getDatabase(initializeApp(config));
function identity(){const key='pokelympics-player-id';let uid=localStorage.getItem(key);if(!uid){uid=crypto.randomUUID();localStorage.setItem(key,uid)}return uid}
export async function connect({room,name,adminCode,onState,onError}){
 if(!/^[A-Z0-9-]{3,24}$/.test(room))throw Error('Use a room code of 3–24 letters, numbers, or hyphens.');
 const uid=identity(),roomRef=ref(db,'pokelympics/rooms/'+room),logic=globalThis.RoomLogic;
 // Fetch for an early connection/rules error; transaction callbacks still
 // handle a cold local cache independently of this read.
 await get(roomRef);
 const transact=data=>logic.transactRoom(runTransaction,roomRef,uid,data);
 await transact({action:'join',name,adminCode});
 let connected=false,latest=null;
 const publish=()=>{if(latest)onState(logic.normalizeRoom(latest),connected)};
 const stopClock=onValue(ref(db,'.info/serverTimeOffset'),snapshot=>{globalThis.pokelympicsClockOffset=Number(snapshot.val())||0},onError);
 const stopConnection=onValue(ref(db,'.info/connected'),snapshot=>{connected=snapshot.val()===true;publish()},onError);
 const stopRoom=onValue(roomRef,snapshot=>{if(!snapshot.exists()){connected=false;onError(Error('This room no longer exists.'));return}latest=snapshot.val();publish()},onError);
 return {uid,unsubscribe:()=>{stopRoom();stopConnection();stopClock()},send:payload=>{if(!connected)return Promise.reject(Error('Disconnected. Wait for the room to reconnect.'));return transact(payload)}};
}
