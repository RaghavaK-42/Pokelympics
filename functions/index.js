const {onCall,HttpsError}=require('firebase-functions/v2/https');
const {initializeApp}=require('firebase-admin/app');
const {getFirestore}=require('firebase-admin/firestore');
const {applyAction,joinRoom}=require('./room-logic');
initializeApp();
exports.roomAction=onCall({region:'us-central1'},async request=>{
 if(!request.auth)throw new HttpsError('unauthenticated','Sign in first.');
 const data=request.data||{},code=String(data.room||'').trim().toUpperCase();
 if(!/^[A-Z0-9-]{3,24}$/.test(code))throw new HttpsError('invalid-argument','Use a room code of 3–24 letters, numbers, or hyphens.');
 const ref=getFirestore().collection('rooms').doc(code);
 try {await getFirestore().runTransaction(async tx=>{
  const snapshot=await tx.get(ref);let room=snapshot.exists?snapshot.data():null;
  if(data.action==='join')room=joinRoom(room,request.auth.uid,data);
  else {if(!room)throw Error('Room not found. Ask an admin to create it.');applyAction(room,request.auth.uid,data)}
  tx.set(ref,room);
 });return {room:code};}catch(error){if(error instanceof HttpsError)throw error;throw new HttpsError('failed-precondition',error.message||'Room update failed.');}
});
