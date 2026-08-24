"use strict";

const KEYS = {
  books: "olms_books",
  students: "olms_students",
  issued: "olms_issued",
  fines: "olms_fines",
  admin: "olms_admin",
  support: "olms_support",
  resets: "olms_resets"
};

const seed = {
  books: [
    [1,"Data Structures","Computer Science","#2f6cb2"],
    [2,"Operating Systems","Computer Science","#0b7189"],
    [3,"Database Management System","Database","#7952b3"],
    [4,"Computer Networks","Networking","#c8553d"],
    [5,"Artificial Intelligence","AI","#3a8d65"],
    [6,"Python Programming","Programming","#356fa9"],
    [7,"Java Programming","Programming","#b24b35"],
    [8,"Cyber Security","Security","#26384f"],
    [9,"Cloud Computing","Cloud","#3485a4"],
    [10,"Android Development","Mobile","#5a9c58"],
    [11,"Machine Learning","AI","#7256a8"],
    [12,"Software Engineering","Engineering","#9a6831"]
  ].map(([id,name,category,color]) => ({id,name,category,color})),
  students: [
    {id:"ST100",name:"Amit Kumar",password:"1234",email:"amit@olms.edu",phone:"9876543210",address:"Panvel",className:"SYCS",division:"A",stream:"Computer Science"},
    {id:"ST101",name:"Rahul Sharma",password:"1234",email:"rahul@olms.edu",phone:"9876500101",address:"Mumbai",className:"SYCS",division:"A",stream:"Computer Science"},
    {id:"ST102",name:"Anjali Verma",password:"1234",email:"anjali@olms.edu",phone:"9876500102",address:"Delhi",className:"SYCS",division:"B",stream:"Information Technology"},
    {id:"ST103",name:"Aman Patel",password:"1234",email:"aman@olms.edu",phone:"9876500103",address:"Ahmedabad",className:"FYCS",division:"A",stream:"Computer Science"},
    {id:"ST104",name:"Neha Singh",password:"1234",email:"neha@olms.edu",phone:"9876500104",address:"Lucknow",className:"TYCS",division:"C",stream:"Computer Science"}
  ],
  issued: [
    {id:1,studentId:"ST101",bookId:1,issueDate:"2026-01-10",dueDate:"2026-01-24",returnDate:"2026-01-22",status:"Returned"},
    {id:2,studentId:"ST102",bookId:2,issueDate:"2026-01-05",dueDate:"2026-01-19",returnDate:"2026-01-20",status:"Returned"},
    {id:3,studentId:"ST103",bookId:3,issueDate:"2026-08-15",dueDate:"2026-08-29",returnDate:"",status:"Issued"},
    {id:4,studentId:"ST104",bookId:4,issueDate:"2026-08-10",dueDate:"2026-08-24",returnDate:"",status:"Issued"},
    {id:5,studentId:"ST100",bookId:5,issueDate:"2026-08-18",dueDate:"2026-09-01",returnDate:"",status:"Issued"},
    {id:6,studentId:"ST101",bookId:7,issueDate:"2026-08-01",dueDate:"2026-08-15",returnDate:"",status:"Issued"}
  ],
  fines: [
    {id:1,studentId:"ST101",bookId:1,amount:25,status:"Paid",paymentDate:"2026-01-24"},
    {id:2,studentId:"ST102",bookId:2,amount:15,status:"Paid",paymentDate:"2026-01-20"},
    {id:3,studentId:"ST101",bookId:7,amount:40,status:"Pending",paymentDate:""}
  ],
  admin: {name:"Library Admin",username:"admin",password:"admin123",email:"admin@olms.com",phone:"9876543210",role:"System Administrator"},
  support: [],
  resets: []
};

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function initialise() {
  Object.entries(KEYS).forEach(([name,key]) => {
    if (localStorage.getItem(key) === null) save(key, seed[name]);
  });
}
function esc(value="") {
  return String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
}
function today() { return new Date().toISOString().slice(0,10); }
function plusDays(date, days) { const d = new Date(date+"T00:00:00"); d.setDate(d.getDate()+days); return d.toISOString().slice(0,10); }
function money(n) { return `₹ ${Number(n || 0).toLocaleString("en-IN")}`; }
function nextId(items) { return items.length ? Math.max(...items.map(x => Number(x.id)||0))+1 : 1; }
function notice(message, type="success") { return `<div class="notice ${type}">${esc(message)}</div>`; }
function setFlash(message, type="success") { sessionStorage.setItem("olmsFlash", JSON.stringify({message,type})); }
function takeFlash() { const raw=sessionStorage.getItem("olmsFlash"); sessionStorage.removeItem("olmsFlash"); if(!raw) return ""; const x=JSON.parse(raw); return notice(x.message,x.type); }
function role() { return sessionStorage.getItem("olmsRole"); }
function currentStudentId() { return sessionStorage.getItem("olmsStudentId"); }
function bookById(id) { return load(KEYS.books,[]).find(x => Number(x.id)===Number(id)); }
function studentById(id) { return load(KEYS.students,[]).find(x => x.id===id); }
function dateLabel(value) { if(!value) return "—"; return new Date(value+"T00:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}); }

const adminNav = [
  ["admin-dashboard","Dashboard"],["total-books","Total Books"],["add-books","Add Books"],
  ["issue-books","Issue Books"],["members","Members"],["admin-fines","Fine Management"],
  ["reports","Reports"],["admin-profile","Edit Profile"]
];
const studentNav = [
  ["student-dashboard","Dashboard"],["student-issued-books","My Issued Books"],["student-book-search","Book Search"],
  ["student-fines","Fines & Dues"],["student-profile","My Profile"],["student-change-password","Change Password"],
  ["student-rules","Library Rules"],["student-help","Help / Support"]
];

function logout() { sessionStorage.removeItem("olmsRole"); sessionStorage.removeItem("olmsStudentId"); go("index.html"); }
function currentPage() { return location.hash.replace(/^#/, "") || document.body.dataset.page || "index"; }
function href(page) { return page === "index" ? "index.html" : `index.html#${page}`; }
function go(target) {
  const page = target.replace(/^.*\//, "").replace(/\.html$/, "");
  location.href = href(page);
}
function portalShell(kind, title, subtitle, content) {
  const nav = kind === "admin" ? adminNav : studentNav;
  const page = currentPage();
  const person = kind === "admin" ? load(KEYS.admin,seed.admin).name : (studentById(currentStudentId())?.name || "Student");
  document.getElementById("app").innerHTML = `
    <div class="layout">
      <aside class="sidebar">
        <h2 class="logo"><span>${kind === "admin" ? "📘" : "🎓"}</span><span>${kind === "admin" ? "OLMS" : "Student"}<small>Offline HTML Edition</small></span></h2>
        <nav class="nav">
          ${nav.map(([target,label]) => `<a href="${href(target)}" class="${target === page ? "active" : ""}">${label}</a>`).join("")}
          <a href="#" class="logout" data-action="logout">Logout</a>
        </nav>
      </aside>
      <main class="main">
        <header class="topbar">
          <div style="display:flex;gap:12px;align-items:flex-start"><button class="menu-toggle" data-action="menu">☰</button><div class="title"><h1>${title}</h1><p>${subtitle}</p></div></div>
          <div class="user-pill"><span class="avatar">${esc(person.charAt(0).toUpperCase())}</span><span>${esc(person)}</span></div>
        </header>
        <div id="flash">${takeFlash()}</div>
        ${content}
        <p class="footer-note">OLMS static demonstration • Data is saved in this browser</p>
      </main>
    </div>`;
  document.querySelector('[data-action="logout"]').addEventListener("click", e => {e.preventDefault(); logout();});
  document.querySelector('[data-action="menu"]').addEventListener("click", () => document.body.classList.toggle("menu-open"));
}

function requireRole(kind) {
  if (role() !== kind) { go(kind === "admin" ? "admin-login.html" : "student-login.html"); return false; }
  return true;
}

function renderIndex() {
  document.getElementById("app").innerHTML = `<div class="landing"><div class="hero home-hero">
    <section class="hero-copy home-card">
      <div class="eyebrow">Online Library Management System</div>
      <h1>Your library, simplified.</h1>
      <p>A complete offline college project built using only HTML, CSS and JavaScript. Open the file and start—no PHP, database, XAMPP or internet required.</p>
      <div class="hero-actions"><a class="btn" href="${href("student-login")}">Student Login</a><a class="btn secondary" href="${href("admin-login")}">Admin Login</a></div>
      <div class="feature-list"><span>📚 Search and issue books</span><span>💳 Track fines and returns</span><span>📊 Admin reports and member records</span></div>
      <button class="btn home-reset" id="resetDemo">Reset demo data</button>
    </section></div></div>`;
  document.getElementById("resetDemo").onclick = () => { Object.values(KEYS).forEach(k=>localStorage.removeItem(k)); initialise(); alert("Demo data has been reset."); };
}

function renderLogin(kind) {
  const admin = kind === "admin";
  document.getElementById("app").innerHTML = `<div class="landing"><div class="hero">
    <section class="hero-copy"><div class="eyebrow">${admin ? "Administrator access" : "Student portal"}</div><h1>${admin ? "Manage the library." : "Welcome back."}</h1>
    <p>${admin ? "Manage books, members, returns, fines and reports from one clear dashboard." : "Search the collection, issue books, view due dates and manage your profile."}</p>
    <div class="feature-list"><span>✓ Works without a web server</span><span>✓ Browser-based demo records</span><span>✓ Responsive professional design</span></div><a class="back-link" href="${href("index")}">← Back to Home</a></section>
    <section class="login-card"><h2>${admin ? "Admin Login" : "Student Login"}</h2><div id="loginMessage"></div>
      <form class="form" id="loginForm"><div class="field"><label>${admin ? "Username" : "Student ID"}</label><input id="loginId" required autocomplete="username"></div>
      <div class="field"><label>Password</label><input id="loginPassword" type="password" required autocomplete="current-password"></div><button class="btn">Login</button></form>
      <p class="helper">Demo: <strong>${admin ? "admin / admin123" : "ST100 / 1234"}</strong></p>${admin ? "" : `<a href="${href("forgot-password")}" class="helper" style="color:var(--blue)">Forgot password?</a>`}
    </section></div></div>`;
  document.getElementById("loginForm").onsubmit = e => {
    e.preventDefault(); const id=document.getElementById("loginId").value.trim(); const password=document.getElementById("loginPassword").value;
    let ok=false;
    if(admin) { const a=load(KEYS.admin,seed.admin); ok=id===a.username && password===a.password; }
    else { ok=load(KEYS.students,[]).some(s=>s.id.toUpperCase()===id.toUpperCase() && s.password===password); }
    if(!ok) { document.getElementById("loginMessage").innerHTML=notice("Invalid ID/username or password.","error"); return; }
    sessionStorage.setItem("olmsRole",kind); if(!admin) sessionStorage.setItem("olmsStudentId",id.toUpperCase()); go(admin?"admin-dashboard.html":"student-dashboard.html");
  };
}

function stat(label,value,color) { return `<div class="stat ${color}"><p>${label}</p><h2>${value}</h2></div>`; }
function table(headers,rows,empty="No records found") {
  return `<div class="table-wrap"><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.length ? rows.join("") : `<tr><td colspan="${headers.length}" class="empty">${empty}</td></tr>`}</tbody></table></div>`;
}

function renderAdminDashboard() {
  if(!requireRole("admin")) return;
  const books=load(KEYS.books,[]), students=load(KEYS.students,[]), issued=load(KEYS.issued,[]), fines=load(KEYS.fines,[]);
  const pending=issued.filter(x=>x.status==="Issued").length, paid=fines.filter(x=>x.status==="Paid").reduce((a,x)=>a+x.amount,0);
  portalShell("admin","Admin Dashboard","Overview of the library today",`
    <section class="stats">${stat("Total Books",books.length,"blue")}${stat("Total Members",students.length,"green")}${stat("Pending Returns",pending,"red")}${stat("Fines Collected",money(paid),"orange")}</section>
    <section class="split"><div class="card"><h3>Quick Actions</h3><div class="toolbar"><a class="btn" href="${href("add-books")}">Add Book</a><a class="btn ghost" href="${href("issue-books")}">View Issues</a><a class="btn ghost" href="${href("reports")}">Open Reports</a></div></div>
    <div class="card"><h3>System Information</h3><p class="helper">This converted edition stores records locally in the browser. It needs no PHP server or database.</p></div></section>
    <section class="card"><h3>Recent Activity</h3>${table(["Student","Book","Issue Date","Status"],issued.slice().reverse().slice(0,5).map(x=>`<tr><td>${esc(studentById(x.studentId)?.name||x.studentId)}</td><td>${esc(bookById(x.bookId)?.name||"Deleted book")}</td><td>${dateLabel(x.issueDate)}</td><td><span class="badge ${x.status==="Issued"?"red":"green"}">${x.status}</span></td></tr>`))}</section>`);
}

function cover(book) { return `<div class="cover" style="background:linear-gradient(145deg,${book.color||"#315d9a"},#172f55)">${esc(book.name)}</div>`; }
function renderTotalBooks() {
  if(!requireRole("admin")) return;
  const draw = filter => {
    const books=load(KEYS.books,[]).filter(b=>b.name.toLowerCase().includes(filter.toLowerCase()));
    document.getElementById("bookList").innerHTML=books.length?books.map(b=>`<article class="book-card">${cover(b)}<div class="book-info"><h4>${esc(b.name)}</h4><p>${esc(b.category)}</p><div class="book-actions"><button class="btn small danger" data-delete="${b.id}">Delete</button></div></div></article>`).join(""):`<div class="empty">No matching books found.</div>`;
    document.querySelectorAll("[data-delete]").forEach(btn=>btn.onclick=()=>{if(confirm("Delete this book?")){save(KEYS.books,load(KEYS.books,[]).filter(b=>b.id!=btn.dataset.delete)); draw(document.getElementById("bookSearch").value); document.getElementById("bookCount").textContent=load(KEYS.books,[]).length;}});
  };
  portalShell("admin","Total Books","Browse and manage the library collection",`<section class="stats">${stat("Books Available",`<span id="bookCount">${load(KEYS.books,[]).length}</span>`,"blue")}</section><section class="card"><div class="card-head"><h3>Library Collection</h3><input class="search" id="bookSearch" placeholder="Search books..."></div><div class="book-grid" id="bookList"></div></section>`);
  document.getElementById("bookSearch").oninput=e=>draw(e.target.value); draw("");
}

function renderAddBooks() {
  if(!requireRole("admin")) return;
  const suggestions=[
    ["Web Development","Programming","#226b7b"],["Data Science","Data","#6c50a1"],["Internet of Things","Technology","#227b61"],
    ["Computer Graphics","Computer Science","#a35636"],["Mobile Computing","Mobile","#3d6bb4"],["Blockchain Basics","Technology","#775b38"]
  ];
  portalShell("admin","Add New Books","Choose a suggested title or create your own",`<section class="split"><div class="card"><h3>Add a Custom Book</h3><form class="form" id="customBook"><div class="field"><label>Book Name</label><input id="bookName" required></div><div class="field"><label>Category</label><input id="bookCategory" required></div><div class="field"><label>Cover Colour</label><input id="bookColor" type="color" value="#326bff"></div><button class="btn">Add Book</button></form></div><div class="card"><h3>How it works</h3><p class="helper">Books are saved in this browser and immediately appear on the admin and student book pages.</p></div></section><section class="card"><h3>Suggested Books</h3><div class="book-grid">${suggestions.map((b,i)=>`<article class="book-card">${cover({name:b[0],color:b[2]})}<div class="book-info"><h4>${b[0]}</h4><p>${b[1]}</p><button class="btn small" data-add-suggestion="${i}">Add Book</button></div></article>`).join("")}</div></section>`);
  const add=(name,category,color)=>{const books=load(KEYS.books,[]); if(books.some(b=>b.name.toLowerCase()===name.toLowerCase())){document.getElementById("flash").innerHTML=notice("This book already exists.","error");return;} books.push({id:nextId(books),name,category,color});save(KEYS.books,books);document.getElementById("flash").innerHTML=notice(`${name} added successfully.`);};
  document.getElementById("customBook").onsubmit=e=>{e.preventDefault();add(document.getElementById("bookName").value.trim(),document.getElementById("bookCategory").value.trim(),document.getElementById("bookColor").value);e.target.reset();};
  document.querySelectorAll("[data-add-suggestion]").forEach(btn=>btn.onclick=()=>{const b=suggestions[btn.dataset.addSuggestion];add(...b);});
}

function issueRows(items, actions=true) {
  return items.map(x=>{const s=studentById(x.studentId),b=bookById(x.bookId);return `<tr><td>${esc(s?.name||x.studentId)}</td><td>${esc(x.studentId)}</td><td>${esc(b?.name||"Deleted book")}</td><td>${dateLabel(x.issueDate)}</td><td>${dateLabel(x.status==="Returned"?x.returnDate:x.dueDate)}</td><td><span class="badge ${x.status==="Issued"?"red":"green"}">${x.status}</span></td>${actions?`<td>${x.status==="Issued"?`<button class="btn small success" data-return="${x.id}">Return</button>`:"Completed"}</td>`:""}</tr>`;});
}
function returnIssue(id) { const items=load(KEYS.issued,[]); const x=items.find(i=>i.id==id); if(x){x.status="Returned";x.returnDate=today();save(KEYS.issued,items);setFlash("Book marked as returned.");location.reload();} }
function renderIssueBooks() {
  if(!requireRole("admin")) return; const issued=load(KEYS.issued,[]).slice().reverse();
  portalShell("admin","Issue / Return Books","Manage all student book transactions",`<section class="stats">${stat("Total Transactions",issued.length,"blue")}${stat("Currently Issued",issued.filter(x=>x.status==="Issued").length,"red")}${stat("Returned",issued.filter(x=>x.status==="Returned").length,"green")}</section><section class="card"><h3>Issued and Returned Records</h3>${table(["Student","ID","Book","Issue Date","Due / Return","Status","Action"],issueRows(issued))}</section>`);
  document.querySelectorAll("[data-return]").forEach(b=>b.onclick=()=>{if(confirm("Mark this book as returned?"))returnIssue(b.dataset.return);});
}

function renderMembers() {
  if(!requireRole("admin")) return; const students=load(KEYS.students,[]),issued=load(KEYS.issued,[]);
  portalShell("admin","Library Members","Registered student accounts",`<section class="stats">${stat("Total Members",students.length,"green")}${stat("Active Borrowers",new Set(issued.filter(x=>x.status==="Issued").map(x=>x.studentId)).size,"blue")}</section><section class="card"><div class="card-head"><h3>Member Directory</h3><input class="search" id="memberSearch" placeholder="Search members..."></div><div id="memberTable"></div></section>`);
  const draw=q=>{const list=students.filter(s=>(s.name+s.id+s.email).toLowerCase().includes(q.toLowerCase()));document.getElementById("memberTable").innerHTML=table(["Name","Student ID","Email","Phone","Class","Division"],list.map(s=>`<tr><td>${esc(s.name)}</td><td>${esc(s.id)}</td><td>${esc(s.email)}</td><td>${esc(s.phone)}</td><td>${esc(s.className)}</td><td>${esc(s.division)}</td></tr>`));};
  document.getElementById("memberSearch").oninput=e=>draw(e.target.value);draw("");
}

function renderAdminFines() {
  if(!requireRole("admin")) return; const fines=load(KEYS.fines,[]); const paid=fines.filter(x=>x.status==="Paid").reduce((a,x)=>a+x.amount,0),pending=fines.filter(x=>x.status==="Pending").reduce((a,x)=>a+x.amount,0);
  portalShell("admin","Fine Management","View fine payments and outstanding dues",`<section class="stats">${stat("Fine Collected",money(paid),"green")}${stat("Pending Fine",money(pending),"red")}${stat("Fine Records",fines.length,"blue")}</section><section class="card"><h3>Fine Records</h3>${table(["Student","Student ID","Book","Amount","Status","Payment Date"],fines.map(f=>`<tr><td>${esc(studentById(f.studentId)?.name||f.studentId)}</td><td>${esc(f.studentId)}</td><td>${esc(bookById(f.bookId)?.name||"Deleted book")}</td><td>${money(f.amount)}</td><td><span class="badge ${f.status==="Paid"?"green":"red"}">${f.status}</span></td><td>${dateLabel(f.paymentDate)}</td></tr>`))}</section>`);
}

function renderReports() {
  if(!requireRole("admin")) return; const issued=load(KEYS.issued,[]),students=load(KEYS.students,[]); const max=Math.max(1,...students.map(s=>issued.filter(i=>i.studentId===s.id).length));
  portalShell("admin","Reports & Statistics","Student-wise library usage report",`<section class="card no-print"><div class="card-head"><h3>Report Controls</h3><button class="btn" id="printReport">Print / Save as PDF</button></div><p class="helper">Choose “Save as PDF” in the print window to export this report.</p></section><section class="stats">${stat("Members",students.length,"blue")}${stat("Books Issued",issued.length,"orange")}${stat("Returned",issued.filter(x=>x.status==="Returned").length,"green")}${stat("Pending",issued.filter(x=>x.status==="Issued").length,"red")}</section><section class="card"><h3>Borrowing Activity</h3><div class="report-bars">${students.map(s=>{const count=issued.filter(i=>i.studentId===s.id).length;return `<div class="bar-row"><span>${esc(s.name)}</span><div class="bar-track"><div class="bar" style="width:${count/max*100}%"></div></div><strong>${count}</strong></div>`;}).join("")}</div></section><section class="card"><h3>Student-wise Report</h3>${table(["Student","ID","Total Issued","Returned","Pending"],students.map(s=>{const list=issued.filter(i=>i.studentId===s.id);return `<tr><td>${esc(s.name)}</td><td>${s.id}</td><td>${list.length}</td><td>${list.filter(x=>x.status==="Returned").length}</td><td>${list.filter(x=>x.status==="Issued").length}</td></tr>`;}))}</section>`);
  document.getElementById("printReport").onclick=()=>window.print();
}

function renderAdminProfile() {
  if(!requireRole("admin")) return; const a=load(KEYS.admin,seed.admin);
  portalShell("admin","Edit Admin Profile","Update administrator information",`<section class="card"><form class="form" id="adminForm"><div class="form-row"><div class="field"><label>Full Name</label><input id="aName" value="${esc(a.name)}" required></div><div class="field"><label>Email</label><input id="aEmail" type="email" value="${esc(a.email)}" required></div></div><div class="form-row"><div class="field"><label>Username</label><input id="aUsername" value="${esc(a.username)}" required></div><div class="field"><label>Phone</label><input id="aPhone" value="${esc(a.phone)}" required></div></div><div class="form-row"><div class="field"><label>Role</label><input id="aRole" value="${esc(a.role)}" required></div><div class="field"><label>New Password (optional)</label><input id="aPassword" type="password" placeholder="Leave blank to keep current"></div></div><button class="btn">Save Changes</button></form></section>`);
  document.getElementById("adminForm").onsubmit=e=>{e.preventDefault();const updated={...a,name:document.getElementById("aName").value.trim(),email:document.getElementById("aEmail").value.trim(),username:document.getElementById("aUsername").value.trim(),phone:document.getElementById("aPhone").value.trim(),role:document.getElementById("aRole").value.trim()};const password=document.getElementById("aPassword").value;if(password)updated.password=password;save(KEYS.admin,updated);setFlash("Admin profile updated.");renderRoute();};
}

function studentRecords() { return load(KEYS.issued,[]).filter(x=>x.studentId===currentStudentId()); }
function renderStudentDashboard() {
  if(!requireRole("student")) return; const s=studentById(currentStudentId()),items=studentRecords(),pending=items.filter(x=>x.status==="Issued");const next=pending.map(x=>x.dueDate).sort()[0];
  portalShell("student","Student Dashboard",`Welcome back, ${esc(s?.name||"Student")}`,`<section class="card"><h3>Student Profile</h3><div class="form-row"><p><strong>Name:</strong> ${esc(s?.name||"")}</p><p><strong>ID:</strong> ${esc(s?.id||"")}</p><p><strong>Email:</strong> ${esc(s?.email||"")}</p><p><strong>Stream:</strong> ${esc(s?.stream||"")}</p></div></section><section class="stats">${stat("Total Issued",items.length,"blue")}${stat("Returned",items.filter(x=>x.status==="Returned").length,"green")}${stat("Pending",pending.length,"red")}${stat("Next Due",next?dateLabel(next):"No Pending","orange")}</section><section class="card"><h3>Current Books</h3>${table(["Book","Issue Date","Due Date","Status"],pending.map(x=>`<tr><td>${esc(bookById(x.bookId)?.name||"Deleted book")}</td><td>${dateLabel(x.issueDate)}</td><td>${dateLabel(x.dueDate)}</td><td><span class="badge red">Issued</span></td></tr>`),"You have no books currently issued.")}</section>`);
}

function renderStudentIssued() {
  if(!requireRole("student")) return; const items=studentRecords().slice().reverse();
  portalShell("student","My Issued Books","View and return your library books",`<section class="stats">${stat("Total Records",items.length,"blue")}${stat("Returned",items.filter(x=>x.status==="Returned").length,"green")}${stat("Pending",items.filter(x=>x.status==="Issued").length,"red")}</section><section class="card"><h3>Book History</h3>${table(["Book","Issue Date","Due / Return Date","Status","Action"],items.map(x=>`<tr><td>${esc(bookById(x.bookId)?.name||"Deleted book")}</td><td>${dateLabel(x.issueDate)}</td><td>${dateLabel(x.status==="Returned"?x.returnDate:x.dueDate)}</td><td><span class="badge ${x.status==="Issued"?"red":"green"}">${x.status}</span></td><td>${x.status==="Issued"?`<button class="btn small success" data-return="${x.id}">Return</button>`:"Completed"}</td></tr>`))}</section>`);
  document.querySelectorAll("[data-return]").forEach(b=>b.onclick=()=>{if(confirm("Return this book now?"))returnIssue(b.dataset.return);});
}

function renderStudentSearch() {
  if(!requireRole("student")) return;
  const draw=q=>{const books=load(KEYS.books,[]).filter(b=>b.name.toLowerCase().includes(q.toLowerCase())),current=studentRecords().filter(x=>x.status==="Issued");document.getElementById("searchResults").innerHTML=books.length?books.map(b=>{const active=current.some(x=>x.bookId===b.id);return `<article class="book-card">${cover(b)}<div class="book-info"><h4>${esc(b.name)}</h4><p>${esc(b.category)}</p><button class="btn small ${active?"ghost":""}" data-issue="${b.id}" ${active?"disabled":""}>${active?"Already Issued":"Issue Book"}</button></div></article>`;}).join(""):`<div class="empty">No matching books found.</div>`;document.querySelectorAll("[data-issue]:not(:disabled)").forEach(btn=>btn.onclick=()=>issueBook(Number(btn.dataset.issue)));};
  portalShell("student","Book Search","Browse and issue available books",`<section class="card"><input class="search" id="studentBookSearch" placeholder="Search by book name..."></section><section class="card"><h3>Library Collection</h3><div class="book-grid" id="searchResults"></div></section>`);
  function issueBook(bookId){const items=load(KEYS.issued,[]);items.push({id:nextId(items),studentId:currentStudentId(),bookId,issueDate:today(),dueDate:plusDays(today(),14),returnDate:"",status:"Issued"});save(KEYS.issued,items);setFlash("Book issued successfully. Return it within 14 days.");location.reload();}
  document.getElementById("studentBookSearch").oninput=e=>draw(e.target.value);draw("");
}

function renderStudentFines() {
  if(!requireRole("student")) return; const fines=load(KEYS.fines,[]).filter(x=>x.studentId===currentStudentId());const total=fines.reduce((a,x)=>a+x.amount,0),paid=fines.filter(x=>x.status==="Paid").reduce((a,x)=>a+x.amount,0),pending=total-paid;
  portalShell("student","Fines & Dues","Track and pay overdue-book fines",`<section class="stats">${stat("Total Fine",money(total),"orange")}${stat("Paid",money(paid),"green")}${stat("Pending",money(pending),"red")}</section><section class="card"><h3>Fine Details</h3>${table(["Book","Amount","Status","Payment Date","Action"],fines.map(f=>`<tr><td>${esc(bookById(f.bookId)?.name||"Deleted book")}</td><td>${money(f.amount)}</td><td><span class="badge ${f.status==="Paid"?"green":"red"}">${f.status}</span></td><td>${dateLabel(f.paymentDate)}</td><td>${f.status==="Pending"?`<button class="btn small" data-pay="${f.id}">Pay Demo Fine</button>`:"✓ Paid"}</td></tr>`),"No fine records. You are all clear!")}</section>`);
  document.querySelectorAll("[data-pay]").forEach(btn=>btn.onclick=()=>{if(confirm("Mark this fine as paid in the demo?")){const all=load(KEYS.fines,[]),f=all.find(x=>x.id==btn.dataset.pay);f.status="Paid";f.paymentDate=today();save(KEYS.fines,all);setFlash("Fine marked as paid.");location.reload();}});
}

function renderStudentProfile() {
  if(!requireRole("student")) return; const students=load(KEYS.students,[]),s=students.find(x=>x.id===currentStudentId());
  portalShell("student","My Profile","View and update your personal information",`<section class="card"><form class="form" id="studentProfileForm"><div class="form-row"><div class="field"><label>Full Name</label><input id="sName" value="${esc(s.name)}" required></div><div class="field"><label>Student ID</label><input value="${esc(s.id)}" readonly></div></div><div class="form-row"><div class="field"><label>Email</label><input id="sEmail" type="email" value="${esc(s.email)}" required></div><div class="field"><label>Phone</label><input id="sPhone" value="${esc(s.phone)}" required></div></div><div class="field"><label>Address</label><input id="sAddress" value="${esc(s.address)}" required></div><div class="form-row"><div class="field"><label>Class</label><input id="sClass" value="${esc(s.className)}" required></div><div class="field"><label>Division</label><select id="sDivision">${["A","B","C"].map(x=>`<option ${x===s.division?"selected":""}>${x}</option>`).join("")}</select></div></div><div class="field"><label>Stream</label><select id="sStream">${["Computer Science","Information Technology","Mechanical","Civil","Electronics"].map(x=>`<option ${x===s.stream?"selected":""}>${x}</option>`).join("")}</select></div><button class="btn">Save Changes</button></form></section>`);
  document.getElementById("studentProfileForm").onsubmit=e=>{e.preventDefault();Object.assign(s,{name:document.getElementById("sName").value.trim(),email:document.getElementById("sEmail").value.trim(),phone:document.getElementById("sPhone").value.trim(),address:document.getElementById("sAddress").value.trim(),className:document.getElementById("sClass").value.trim(),division:document.getElementById("sDivision").value,stream:document.getElementById("sStream").value});save(KEYS.students,students);setFlash("Profile updated successfully.");renderRoute();};
}

function renderChangePassword() {
  if(!requireRole("student")) return; const students=load(KEYS.students,[]),s=students.find(x=>x.id===currentStudentId());
  portalShell("student","Change Password","Update your local demo account password",`<section class="card"><div id="passwordMessage"></div><form class="form" id="passwordForm"><div class="field"><label>Current Password</label><input id="currentPassword" type="password" required></div><div class="field"><label>New Password</label><input id="newPassword" type="password" minlength="6" required></div><div class="field"><label>Confirm New Password</label><input id="confirmPassword" type="password" minlength="6" required></div><button class="btn">Update Password</button></form></section>`);
  document.getElementById("passwordForm").onsubmit=e=>{e.preventDefault();const current=document.getElementById("currentPassword").value,newValue=document.getElementById("newPassword").value,confirmValue=document.getElementById("confirmPassword").value;let msg="";if(current!==s.password)msg=notice("Current password is incorrect.","error");else if(newValue.length<6)msg=notice("New password must contain at least 6 characters.","error");else if(newValue!==confirmValue)msg=notice("New passwords do not match.","error");else{s.password=newValue;save(KEYS.students,students);msg=notice("Password updated successfully.");e.target.reset();}document.getElementById("passwordMessage").innerHTML=msg;};
}

function renderRules() {
  if(!requireRole("student")) return; const rules=["Keep library books clean and undamaged.","Return issued books within 14 days.","A late fine may be charged after the due date.","Students may not transfer an issued book to another person.","Maintain silence and discipline inside the library.","Report a lost or damaged book immediately.","Use your own student account for every transaction.","Reference materials must remain inside the library."];
  portalShell("student","Library Rules","Please follow these guidelines",`<section class="card"><ol class="rule-list">${rules.map((r,i)=>`<li><span class="rule-no">${i+1}</span><span>${r}</span></li>`).join("")}</ol></section>`);
}

function renderHelp() {
  if(!requireRole("student")) return;
  portalShell("student","Help & Support","Submit a support request to the library",`<section class="split"><div class="card"><h3>Send Request</h3><form class="form" id="supportForm"><div class="field"><label>Issue Type</label><select id="issueType"><option>Book Issue Problem</option><option>Fine Query</option><option>Login Problem</option><option>Profile Update</option><option>Other</option></select></div><div class="field"><label>Description</label><textarea id="issueDescription" rows="5" required></textarea></div><button class="btn">Submit Request</button></form></div><div class="card"><h3>Contact Information</h3><p class="helper"><strong>Email:</strong> library@olms.edu</p><p class="helper"><strong>Phone:</strong> +91 98765 43210</p><p class="helper"><strong>Hours:</strong> Monday–Saturday, 9:00 AM–5:00 PM</p></div></section>`);
  document.getElementById("supportForm").onsubmit=e=>{e.preventDefault();const items=load(KEYS.support,[]);items.push({id:nextId(items),studentId:currentStudentId(),type:document.getElementById("issueType").value,description:document.getElementById("issueDescription").value.trim(),status:"Open",createdAt:new Date().toISOString()});save(KEYS.support,items);e.target.reset();document.getElementById("flash").innerHTML=notice("Support request submitted successfully.");};
}

function renderForgotPassword() {
  document.getElementById("app").innerHTML=`<div class="landing"><div class="hero"><section class="hero-copy"><div class="eyebrow">Account recovery</div><h1>Forgot your password?</h1><p>Enter a registered Student ID. In this offline demonstration, the request is saved locally for presentation purposes.</p><a class="back-link" href="${href("student-login")}">← Back to Student Login</a></section><section class="login-card"><h2>Reset Request</h2><div id="resetMessage"></div><form class="form" id="resetForm"><div class="field"><label>Student ID</label><input id="resetStudentId" required></div><button class="btn">Submit Request</button></form></section></div></div>`;
  document.getElementById("resetForm").onsubmit=e=>{e.preventDefault();const id=document.getElementById("resetStudentId").value.trim().toUpperCase();if(!studentById(id)){document.getElementById("resetMessage").innerHTML=notice("Student ID was not found.","error");return;}const items=load(KEYS.resets,[]);items.push({id:nextId(items),studentId:id,status:"Pending",createdAt:new Date().toISOString()});save(KEYS.resets,items);document.getElementById("resetMessage").innerHTML=notice("Password reset request submitted.");e.target.reset();};
}

const pages = {
  "index": renderIndex,
  "admin-login": ()=>renderLogin("admin"),
  "student-login": ()=>renderLogin("student"),
  "forgot-password": renderForgotPassword,
  "admin-dashboard": renderAdminDashboard,
  "total-books": renderTotalBooks,
  "add-books": renderAddBooks,
  "issue-books": renderIssueBooks,
  "members": renderMembers,
  "admin-fines": renderAdminFines,
  "reports": renderReports,
  "admin-profile": renderAdminProfile,
  "student-dashboard": renderStudentDashboard,
  "student-issued-books": renderStudentIssued,
  "student-book-search": renderStudentSearch,
  "student-fines": renderStudentFines,
  "student-profile": renderStudentProfile,
  "student-change-password": renderChangePassword,
  "student-rules": renderRules,
  "student-help": renderHelp
};

function renderRoute() {
  document.body.classList.remove("menu-open");
  initialise();
  const page=currentPage();
  if(pages[page]) pages[page]();
  else document.getElementById("app").innerHTML=`<div class="empty">Page not found. <a href="${href("index")}">Go home</a></div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const file = location.pathname.split("/").pop();
  if (location.protocol === "file:" && file && file !== "index.html") {
    location.replace(`index.html#${document.body.dataset.page}`);
    return;
  }
  renderRoute();
});
window.addEventListener("hashchange", renderRoute);
