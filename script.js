const $=s=>document.querySelector(s);
const PAY={easypaisa:"Easypaisa",jazzcash:"JazzCash",cash:"Cash at the academy"};
const NUM={easypaisa:"0332-3556402",jazzcash:"0315-9262470"};
const WA="923009260391";
const money=n=>"PKR "+Number(n).toLocaleString("en-US");
let db=null,fee=0;
if(window.FIREBASE_CONFIG&&window.firebase){firebase.initializeApp(FIREBASE_CONFIG);db=firebase.firestore()}
const stamp=()=>firebase.firestore.FieldValue.serverTimestamp();
const save=async(col,o)=>{if(db){await db.collection(col).doc(o.id).set({...o,createdAt:stamp()});return true}return false};
const note=(el,html,err)=>{el.className="form-note"+(err?" err":"");el.innerHTML=html};

/* theme */
function setTheme(t){document.documentElement.dataset.theme=t;try{localStorage.setItem("ts_theme",t)}catch(e){}}
$("#themeBtn").addEventListener("click",()=>setTheme(document.documentElement.dataset.theme==="dark"?"light":"dark"));

/* modal */
const modal=$("#enrollModal"),selectedCourse=$("#selectedCourse"),courseField=$("#courseField"),enrollMessage=$("#enrollMessage");
function wallet(){
  const p=document.querySelector('input[name="pay"]:checked').value,w=p!=="cash";
  $("#wallet").hidden=!w;$("#cashNote").hidden=w;$("#trx").required=w;
  if(w){const q=$("#walletQr");q.style.display="";q.src="images/payment/"+p+"-qr.png";q.onerror=()=>{q.style.display="none"};$("#walletNum").textContent=NUM[p];$("#walletAmt").textContent=money(fee)}
}
document.querySelectorAll('input[name="pay"]').forEach(r=>r.addEventListener("change",wallet));
document.querySelectorAll(".enroll-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const card=btn.closest(".course-card"),course=card.dataset.course;
    fee=parseInt(card.querySelector(".course-meta strong").textContent.replace(/\D/g,""),10)||0;
    selectedCourse.textContent=course;courseField.value=course;$("#feeText").textContent=money(fee);
    note(enrollMessage,"");wallet();
    modal.classList.add("show");modal.setAttribute("aria-hidden","false");document.body.classList.add("no-scroll");
  });
});
function closeModal(){modal.classList.remove("show");modal.setAttribute("aria-hidden","true");document.body.classList.remove("no-scroll")}
document.querySelector(".close-modal").addEventListener("click",closeModal);
modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});

/* enrollment */
$("#enrollForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const f=e.target,d=Object.fromEntries(new FormData(f)),btn=f.querySelector('button[type="submit"]');
  const o={id:"E"+Date.now().toString(36).toUpperCase(),course:courseField.value,fee,
    student:{name:d.name.trim(),mobile:d.mobile.trim(),email:d.email.trim(),cnic:d.cnic.trim(),dob:d.dob,city:d.city.trim(),education:d.education.trim(),reason:(d.reason||"").trim()},
    payment:d.pay,trx:d.pay==="cash"?"":(d.trx||"").trim(),status:"Pending"};
  btn.disabled=true;
  try{
    const ok=await save("courseEnrollments",o);
    const t=encodeURIComponent("Hello TechSphere Academy, I applied for "+o.course+" (application "+o.id+").");
    note(enrollMessage,ok?`Application <b>${o.id}</b> received for ${o.course}. We will contact you on ${o.student.mobile}. <a href="https://wa.me/${WA}?text=${t}" target="_blank" rel="noopener">Confirm on WhatsApp</a>`:"Demo mode: Firebase is not connected yet, so the academy cannot see this application.",!ok);
    if(ok)f.reset();
    wallet();
  }catch(x){console.error(x);note(enrollMessage,"We could not submit your application. Please try again.",true)}
  btn.disabled=false;
});

/* inquiry */
$("#contactForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const f=e.target,d=Object.fromEntries(new FormData(f)),msg=$("#contactMessage");
  const o={id:"Q"+Date.now().toString(36).toUpperCase(),name:d.name.trim(),email:d.email.trim(),phone:d.phone.trim(),course:d.course,message:d.message.trim(),status:"New"};
  try{const ok=await save("courseInquiries",o);note(msg,ok?"Thanks! Your inquiry has been sent. We will get back to you soon.":"Demo mode: Firebase is not connected yet.",!ok);if(ok)f.reset()}
  catch(x){console.error(x);note(msg,"We could not send your inquiry. Please try again.",true)}
});

/* menu */
document.querySelector(".menu-btn").addEventListener("click",()=>document.querySelector(".nav-links").classList.toggle("open"));
document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".nav-links").classList.remove("open")));
