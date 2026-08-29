let chart1,chart2,chart3;
const state={page:'dashboard',cache:{guru:[],siswa:[],kelas:[],piket:[],wali:[],abs:[],settings:{}}};

document.addEventListener('DOMContentLoaded',()=>boot());

function boot(){
  const session=Auth.session();
  if(!session){renderLogin();return;}
  renderShell(session.user);
  loadPage('dashboard');
}

function renderLogin(){
 document.getElementById('app').innerHTML=`<div class="login-wrap"><div class="login-card card shadow-lg"><div class="card-body p-4 p-md-5">
 <div class="text-center mb-4"><img src="assets/logo.svg" class="brand-mark mb-3"><h3 class="fw-bold">${APP_CONFIG.name}</h3><p class="text-muted">${APP_CONFIG.school}</p></div>
 <form id="loginForm"><label class="form-label">Username / NIP</label><input id="username" class="form-control form-control-lg mb-3" required autocomplete="username">
 <label class="form-label">Password</label><div class="input-group mb-3"><input id="password" type="password" class="form-control form-control-lg" required autocomplete="current-password"><button type="button" class="btn btn-outline-secondary" id="showPass"><i class="bi bi-eye"></i></button></div>
 <label class="form-label">Role</label><select id="role" class="form-select form-select-lg mb-3"><option value="ADMIN">Admin</option><option value="GURU_PIKET">Guru Piket</option><option value="WALI_KELAS">Wali Kelas</option></select>
 <div class="form-check mb-4"><input id="remember" class="form-check-input" type="checkbox"><label class="form-check-label">Remember me</label></div>
 <button class="btn btn-primary btn-lg w-100" id="loginBtn"><i class="bi bi-box-arrow-in-right"></i> Masuk</button></form>
 <div class="alert alert-light small mt-4 mb-0"><b>Demo:</b> admin / Admin@123 • piket01 / Piket@123 • walikelas01 / Wali@123</div>
 </div></div></div>`;
 document.getElementById('showPass').onclick=()=>{const x=document.getElementById('password');x.type=x.type==='password'?'text':'password'};
 document.getElementById('loginForm').onsubmit=async e=>{e.preventDefault();const btn=document.getElementById('loginBtn');btn.disabled=true;
 try{await Auth.login(username.value,password.value,role.value,remember.checked);location.reload()}catch(err){Swal.fire('Login gagal',err.message,'error')}finally{btn.disabled=false}};
}

function renderShell(user){
 const canAdmin=user.role==='ADMIN', canPiket=user.role==='ADMIN'||user.role==='GURU_PIKET', canWali=user.role==='ADMIN'||user.role==='WALI_KELAS';
 const nav=[
 ['dashboard','speedometer2','Dashboard',true],
 ...(canAdmin?[['guru','people','Data Guru'],['piket','calendar2-week','Guru Piket'],['siswa','mortarboard','Data Siswa'],['kelas','collection','Data Kelas'],['wali','person-badge','Wali Kelas'],['qr','qr-code','Generate QR'],['settings','gear','Pengaturan'],['import','cloud-upload','Import Data'],['backup','database-down','Backup Data']]:[]),
 ...(canPiket?[['scanner','qr-scan','Scan QR'],['manual','person-check','Absensi Manual'],['today','calendar-check','Absensi Hari Ini']]:[]),
 ...(canWali?[['rekap','bar-chart','Rekap Absensi'],['detail','person-lines-fill','Detail Siswa']]:[]),
 ['profile','person-circle','Profil']
 ];
 document.getElementById('app').innerHTML=`<div class="app-shell"><aside class="sidebar" id="sidebar">
 <div class="sidebar-brand"><div class="d-flex align-items-center gap-2"><img src="assets/logo.svg" width="44" height="44"><div><b>${APP_CONFIG.name}</b><small class="d-block text-white-50">SMK Negeri 1 Palopo</small></div></div></div>
 <div class="py-3">${nav.map((n,i)=>`<a href="#" class="nav-link" data-page="${n[0]}"><i class="bi bi-${n[1]} me-2"></i>${n[2]}</a>`).join('')}</div>
 <div class="p-3 mt-auto"><button class="btn btn-outline-light w-100" id="logoutBtn"><i class="bi bi-box-arrow-right"></i> Logout</button></div>
 </aside><main class="main"><header class="topbar"><div class="d-flex align-items-center gap-2"><button class="btn btn-light mobile-menu" id="menuBtn"><i class="bi bi-list fs-4"></i></button><span class="fw-bold" id="topTitle">Dashboard</span></div><div class="d-flex align-items-center gap-2"><button class="btn btn-light" id="darkBtn"><i class="bi bi-moon"></i></button><div class="text-end hide-mobile"><b>${esc(user.nama)}</b><small class="d-block text-muted">${esc(user.role)}</small></div></div></header><section class="content" id="content"></section></main></div>`;
 document.querySelectorAll('.nav-link').forEach(a=>a.onclick=e=>{e.preventDefault();loadPage(a.dataset.page);document.getElementById('sidebar').classList.remove('show')});
 document.getElementById('logoutBtn').onclick=()=>Auth.logout();
 document.getElementById('menuBtn').onclick=()=>document.getElementById('sidebar').classList.toggle('show');
 document.getElementById('darkBtn').onclick=()=>document.body.classList.toggle('dark-mode');
}

async function loadPage(page){
 state.page=page; document.querySelectorAll('.nav-link').forEach(a=>a.classList.toggle('active',a.dataset.page===page));
 document.getElementById('topTitle').textContent=({dashboard:'Dashboard',guru:'Data Guru',piket:'Data Guru Piket',siswa:'Data Siswa',kelas:'Data Kelas',wali:'Wali Kelas',qr:'Generate QR',settings:'Pengaturan',import:'Import Data',backup:'Backup Data',scanner:'Scan QR',manual:'Absensi Manual',today:'Absensi Hari Ini',rekap:'Rekap Absensi',detail:'Detail Siswa',profile:'Profil'})[page]||page;
 const c=document.getElementById('content'); c.innerHTML='<div class="text-center py-5"><div class="spinner-border text-primary"></div></div>';
 try{
  if(page==='dashboard') return dashboardPage();
  if(page==='guru') return guruPage();
  if(page==='piket') return piketPage();
  if(page==='siswa') return siswaPage();
  if(page==='kelas') return kelasPage();
  if(page==='wali') return waliPage();
  if(page==='qr') return qrPage();
  if(page==='settings') return settingsPage();
  if(page==='import') return importPage();
  if(page==='backup') return backupPage();
  if(page==='scanner') return scannerPage();
  if(page==='manual') return manualPage();
  if(page==='today') return todayPage();
  if(page==='rekap') return rekapPage();
  if(page==='detail') return detailPage();
  if(page==='profile') return profilePage();
 }catch(e){c.innerHTML=`<div class="alert alert-danger">${esc(e.message)}</div>`}
}

async function dashboardPage(){
 const r=await API.get('dashboard',{token:Auth.token()}); const d=r.data;
 document.getElementById('content').innerHTML=`<div class="d-flex justify-content-between align-items-center mb-4"><div><h3 class="page-title mb-1">Dashboard</h3><p class="text-muted mb-0">${esc(d.date)} • Waktu server ${esc(d.server.time)}</p></div><button class="btn btn-primary" onclick="loadPage('dashboard')"><i class="bi bi-arrow-clockwise"></i> Refresh</button></div>
 <div class="row g-3">${stat('Total Siswa',d.totalSiswa,'mortarboard','primary')}${stat('Total Guru',d.totalGuru,'people','info')}${stat('Total Kelas',d.totalKelas,'collection','secondary')}${stat('Hadir',d.hadir,'check-circle','success')}${stat('Terlambat',d.terlambat,'clock','warning')}${stat('Izin',d.izin,'envelope','danger')}${stat('Sakit',d.sakit,'heart-pulse','info')}${stat('Alpa',d.alpa,'x-circle','dark')}</div>
 <div class="row g-3 mt-1"><div class="col-lg-5"><div class="card h-100"><div class="card-body"><h5>Grafik Absensi Hari Ini</h5><canvas id="chartToday" height="180"></canvas></div></div></div><div class="col-lg-7"><div class="card h-100"><div class="card-body"><h5>Grafik Absensi Mingguan</h5><canvas id="chartWeek" height="180"></canvas></div></div></div><div class="col-lg-5"><div class="card h-100"><div class="card-body"><h5>Grafik Absensi Bulanan</h5><canvas id="chartMonth" height="180"></canvas></div></div></div><div class="col-lg-7"><div class="card h-100"><div class="card-body"><h5>Guru Piket Hari Ini</h5>${d.guruPiketHariIni.length?d.guruPiketHariIni.map(x=>`<div class="d-flex justify-content-between border-bottom py-2"><span>${esc(x.nama_guru)}</span><small>${esc(x.jam_mulai)}–${esc(x.jam_selesai)}</small></div>`).join(''):'<div class="empty">Belum ada jadwal piket.</div>'}</div></div></div>
 <div class="col-12"><div class="card"><div class="card-body"><h5>Aktivitas Absensi Terbaru</h5>${tableAbs(d.recent)}</div></div></div></div>`;
 chart1=new Chart(document.getElementById('chartToday'),{type:'doughnut',data:{labels:['Hadir','Terlambat','Izin','Sakit','Alpa'],datasets:[{data:[d.hadir,d.terlambat,d.izin,d.sakit,d.alpa]}]},options:{plugins:{legend:{position:'bottom'}}}});
const w=d.charts.weekly;
chart2=new Chart(document.getElementById('chartWeek'),{type:'line',data:{labels:w.labels,datasets:['HADIR','TERLAMBAT','IZIN','SAKIT','ALPA'].map(k=>({label:k,data:w.data.map(x=>x[k]),tension:.25}))},options:{responsive:true}});
const m=d.charts.monthly;
chart3=new Chart(document.getElementById('chartMonth'),{type:'bar',data:{labels:['HADIR','TERLAMBAT','IZIN','SAKIT','ALPA'],datasets:[{label:'Jumlah',data:[m.HADIR,m.TERLAMBAT,m.IZIN,m.SAKIT,m.ALPA]}]},options:{plugins:{legend:{display:false}}}});
}
function stat(label,val,icon,type){return `<div class="col-6 col-md-3"><div class="card stat-card"><div class="card-body d-flex align-items-center gap-3"><div class="stat-icon bg-${type}-subtle text-${type}"><i class="bi bi-${icon}"></i></div><div><div class="text-muted small">${label}</div><h3 class="mb-0">${fmt(val)}</h3></div></div></div></div>`}
function tableAbs(rows){return `<div class="table-responsive"><table class="table align-middle"><thead><tr><th>Waktu</th><th>Siswa</th><th>Kelas</th><th>Status</th><th>Metode</th></tr></thead><tbody>${rows.length?rows.map(a=>`<tr><td>${esc(a.jam)}</td><td>${esc(a.nama)}</td><td>${esc(a.kelas)}</td><td>${statusBadge(a.status)}</td><td>${esc(a.metode)}</td></tr>`).join(''):'<tr><td colspan="5" class="empty">Belum ada absensi.</td></tr>'}</tbody></table></div>`}

async function guruPage(){
 state.cache.guru=(await API.get('getGuru',{token:Auth.token()})).data;
 document.getElementById('content').innerHTML=`<div class="d-flex justify-content-between mb-3"><div><h3 class="page-title">Data Guru</h3><p class="text-muted">Kelola akun guru dan role.</p></div><button class="btn btn-primary" onclick="guruModal()"><i class="bi bi-plus-lg"></i> Tambah Guru</button></div>
 <div class="card"><div class="card-body"><input class="form-control mb-3" id="searchGuru" placeholder="Cari nama, NIP, username..." oninput="filterTable('guruTable',this.value)">${tableGuru(state.cache.guru)}</div></div>`;
}
function tableGuru(rows){return `<div class="table-responsive"><table id="guruTable" class="table align-middle"><thead><tr><th>Nama</th><th>NIP</th><th>Username</th><th>Role</th><th>Status</th><th></th></tr></thead><tbody>${rows.map(g=>`<tr><td>${esc(g.nama)}</td><td>${esc(g.nip)}</td><td>${esc(g.username)}</td><td>${esc(g.role)}</td><td>${statusBadge(g.status)}</td><td class="text-end"><button class="btn btn-sm btn-outline-primary" onclick='guruModal(${JSON.stringify(g)})'><i class="bi bi-pencil"></i></button> <button class="btn btn-sm btn-outline-danger" onclick="delGuru('${esc(g.id_guru)}')"><i class="bi bi-trash"></i></button></td></tr>`).join('')}</tbody></table></div>`}
function guruModal(g={}){
 const html=`<form id="guruForm" class="row g-3">${hidden('id_guru',g.id_guru)}${input('nip','NIP',g.nip,'col-md-6')}${input('nama','Nama Guru',g.nama,'col-md-6',true)}${input('jk','Jenis Kelamin',g.jk,'col-md-4')}${input('no_hp','No HP',g.no_hp,'col-md-4')}${input('email','Email',g.email,'col-md-4','', 'email')}${input('username','Username',g.username,'col-md-6',true)}${input('password','Password (kosongkan jika tidak diubah)','', 'col-md-6',false,'password')}${select('role','Role',g.role,['ADMIN','GURU_PIKET','WALI_KELAS','GURU'],'col-md-6')}${select('status','Status',g.status||'AKTIF',['AKTIF','NONAKTIF'],'col-md-6')}</form>`;
 modal('Data Guru',html,async()=>{const o=formObj('guruForm');const r=await API.post('saveGuru',{token:Auth.token(),...o});toast(r.message);bootstrap.Modal.getInstance(document.getElementById('appModal')).hide();guruPage()});
}
async function delGuru(id){if((await confirmDelete()).isConfirmed){await API.post('deleteGuru',{token:Auth.token(),id_guru:id});toast('Guru dinonaktifkan');guruPage()}}

async function piketPage(){
 state.cache.piket=(await API.get('getGuruPiket',{token:Auth.token()})).data;
 const gs=state.cache.guru.length?state.cache.guru:(await API.get('getGuru',{token:Auth.token()})).data;
 document.getElementById('content').innerHTML=`<div class="d-flex justify-content-between mb-3"><div><h3 class="page-title">Data Guru Piket</h3><p class="text-muted">Jadwal dapat berdasarkan hari mingguan atau tanggal khusus.</p></div><button class="btn btn-primary" onclick='piketModal(${JSON.stringify(gs)})'><i class="bi bi-plus-lg"></i> Tambah Jadwal</button></div><div class="card"><div class="card-body">${tablePiket(state.cache.piket)}</div></div>`;
}
function tablePiket(rows){return `<div class="table-responsive"><table class="table"><thead><tr><th>Tanggal</th><th>Hari</th><th>Guru</th><th>Jam</th><th>Status</th><th></th></tr></thead><tbody>${rows.map(x=>`<tr><td>${esc(x.tanggal||'-')}</td><td>${esc(x.hari)}</td><td>${esc(x.nama_guru)}</td><td>${esc(x.jam_mulai)}–${esc(x.jam_selesai)}</td><td>${statusBadge(x.status)}</td><td><button class="btn btn-sm btn-outline-danger" onclick="delPiket('${esc(x.id)}')"><i class="bi bi-trash"></i></button></td></tr>`).join('')}</tbody></table></div>`}
function piketModal(gs,x={}){
 const html=`<form id="piketForm" class="row g-3">${hidden('id',x.id)}${input('tanggal','Tanggal khusus (opsional)',x.tanggal,'col-md-6',false,'date')}${select('hari','Hari',x.hari||'Senin',['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'],'col-md-6')}${select('id_guru','Guru',x.id_guru,gs.filter(g=>g.status==='AKTIF').map(g=>g.id_guru+'|'+g.nama),'col-md-6')}${input('jam_mulai','Jam Mulai',x.jam_mulai||'06:30','col-md-3',true,'time')}${input('jam_selesai','Jam Selesai',x.jam_selesai||'08:00','col-md-3',true,'time')}${select('status','Status',x.status||'AKTIF',['AKTIF','NONAKTIF'],'col-md-6')}</form>`;
 modal('Jadwal Guru Piket',html,async()=>{const o=formObj('piketForm');const g=gs.find(a=>a.id_guru===o.id_guru);o.nama_guru=g?.nama||'';o.nip=g?.nip||'';const r=await API.post('saveGuruPiket',{token:Auth.token(),...o});toast(r.message);bootstrap.Modal.getInstance(document.getElementById('appModal')).hide();piketPage()});
}
async function delPiket(id){if((await confirmDelete()).isConfirmed){await API.post('deleteGuruPiket',{token:Auth.token(),id});toast('Jadwal dihapus');piketPage()}}

async function siswaPage(){
 state.cache.siswa=(await API.get('getSiswa',{token:Auth.token()})).data; state.cache.kelas=(await API.get('getKelas',{token:Auth.token()})).data;
 document.getElementById('content').innerHTML=`<div class="d-flex justify-content-between mb-3"><div><h3 class="page-title">Data Siswa</h3><p class="text-muted">Kelola identitas siswa dan token QR.</p></div><button class="btn btn-primary" onclick='siswaModal()'><i class="bi bi-plus-lg"></i> Tambah Siswa</button></div><div class="card"><div class="card-body"><input class="form-control mb-3" placeholder="Cari nama/NIS/NISN/kelas..." oninput="filterTable('siswaTable',this.value)">${tableSiswa(state.cache.siswa)}</div></div>`;
}
function tableSiswa(rows){return `<div class="table-responsive"><table id="siswaTable" class="table align-middle"><thead><tr><th>NIS</th><th>Nama</th><th>Kelas</th><th>Jurusan</th><th>Status</th><th></th></tr></thead><tbody>${rows.map(s=>`<tr><td>${esc(s.nis)}</td><td>${esc(s.nama)}</td><td>${esc(s.kelas)}</td><td>${esc(s.jurusan)}</td><td>${statusBadge(s.status)}</td><td class="text-end"><button class="btn btn-sm btn-outline-primary" onclick='siswaModal(${JSON.stringify(s)})'><i class="bi bi-pencil"></i></button> <button class="btn btn-sm btn-outline-danger" onclick="delSiswa('${esc(s.id_siswa)}')"><i class="bi bi-trash"></i></button></td></tr>`).join('')}</tbody></table></div>`}
function siswaModal(s={}){
 const ks=state.cache.kelas.map(k=>k.nama_kelas); const html=`<form id="siswaForm" class="row g-3">${hidden('id_siswa',s.id_siswa)}${input('nis','NIS',s.nis,'col-md-4',true)}${input('nisn','NISN',s.nisn,'col-md-4')}${input('nama','Nama Siswa',s.nama,'col-md-4',true)}${select('jk','JK',s.jk,['L','P'],'col-md-4')}${input('tempat_lahir','Tempat Lahir',s.tempat_lahir,'col-md-4')}${input('tanggal_lahir','Tanggal Lahir',s.tanggal_lahir,'col-md-4',false,'date')}${select('kelas','Kelas',s.kelas,ks,'col-md-6')}${input('jurusan','Jurusan',s.jurusan||'TJKT','col-md-6')}${input('tahun_pelajaran','Tahun Pelajaran',s.tahun_pelajaran||'2026/2027','col-md-4')}${input('no_hp','No HP',s.no_hp,'col-md-4')}${input('nama_orang_tua','Nama Orang Tua',s.nama_orang_tua,'col-md-4')}${select('status','Status',s.status||'AKTIF',['AKTIF','NONAKTIF'],'col-md-6')}</form>`;
 modal('Data Siswa',html,async()=>{const r=await API.post('saveSiswa',{token:Auth.token(),...formObj('siswaForm')});toast(r.message);bootstrap.Modal.getInstance(document.getElementById('appModal')).hide();siswaPage()});
}
async function delSiswa(id){if((await confirmDelete()).isConfirmed){await API.post('deleteSiswa',{token:Auth.token(),id_siswa:id});toast('Siswa dinonaktifkan');siswaPage()}}

async function kelasPage(){
 state.cache.kelas=(await API.get('getKelas',{token:Auth.token()})).data;
 document.getElementById('content').innerHTML=`<div class="d-flex justify-content-between mb-3"><div><h3 class="page-title">Data Kelas</h3></div><button class="btn btn-primary" onclick="kelasModal()"><i class="bi bi-plus-lg"></i> Tambah Kelas</button></div><div class="card"><div class="card-body">${tableKelas(state.cache.kelas)}</div></div>`;
}
function tableKelas(rows){return `<div class="table-responsive"><table class="table"><thead><tr><th>Kelas</th><th>Tingkat</th><th>Jurusan</th><th>Wali</th><th></th></tr></thead><tbody>${rows.map(k=>`<tr><td>${esc(k.nama_kelas)}</td><td>${esc(k.tingkat)}</td><td>${esc(k.jurusan)}</td><td>${esc(k.wali_kelas)}</td><td><button class="btn btn-sm btn-outline-primary" onclick='kelasModal(${JSON.stringify(k)})'><i class="bi bi-pencil"></i></button> <button class="btn btn-sm btn-outline-danger" onclick="delKelas('${esc(k.id_kelas)}')"><i class="bi bi-trash"></i></button></td></tr>`).join('')}</tbody></table></div>`}
function kelasModal(k={}){
 const html=`<form id="kelasForm" class="row g-3">${hidden('id_kelas',k.id_kelas)}${input('nama_kelas','Nama Kelas',k.nama_kelas,'col-md-6',true)}${input('tingkat','Tingkat',k.tingkat,'col-md-3')}${input('jurusan','Jurusan',k.jurusan,'col-md-3')}${input('wali_kelas','Wali Kelas',k.wali_kelas,'col-md-6')}${input('tahun_pelajaran','Tahun Pelajaran',k.tahun_pelajaran||'2026/2027','col-md-6')}${select('status','Status',k.status||'AKTIF',['AKTIF','NONAKTIF'],'col-md-6')}</form>`;
 modal('Data Kelas',html,async()=>{const r=await API.post('saveKelas',{token:Auth.token(),...formObj('kelasForm')});toast(r.message);bootstrap.Modal.getInstance(document.getElementById('appModal')).hide();kelasPage()});
}
async function delKelas(id){if((await confirmDelete()).isConfirmed){await API.post('deleteKelas',{token:Auth.token(),id_kelas:id});toast('Kelas dinonaktifkan');kelasPage()}}

async function waliPage(){
 const [w,g,k]=await Promise.all([API.get('getWaliKelas',{token:Auth.token()}),API.get('getGuru',{token:Auth.token()}),API.get('getKelas',{token:Auth.token()})]);state.cache.wali=w.data;state.cache.guru=g.data;state.cache.kelas=k.data;
 document.getElementById('content').innerHTML=`<div class="d-flex justify-content-between mb-3"><div><h3 class="page-title">Wali Kelas</h3></div><button class="btn btn-primary" onclick="waliModal()"><i class="bi bi-plus-lg"></i> Tetapkan Wali Kelas</button></div><div class="card"><div class="card-body"><div class="table-responsive"><table class="table"><thead><tr><th>Tahun</th><th>Kelas</th><th>NIP</th><th>Wali Kelas</th><th></th></tr></thead><tbody>${state.cache.wali.map(x=>`<tr><td>${esc(x.tahun_pelajaran)}</td><td>${esc(x.kelas)}</td><td>${esc(x.nip)}</td><td>${esc(x.nama_wali_kelas)}</td><td><button class="btn btn-sm btn-outline-danger" onclick="delWali('${esc(x.id)}')"><i class="bi bi-trash"></i></button></td></tr>`).join('')}</tbody></table></div></div></div>`;
}
function waliModal(x={}){
 const html=`<form id="waliForm" class="row g-3">${hidden('id',x.id)}${input('tahun_pelajaran','Tahun Pelajaran',x.tahun_pelajaran||'2026/2027','col-md-6',true)}${select('kelas','Kelas',x.kelas,state.cache.kelas.map(k=>k.nama_kelas),'col-md-6')}${select('id_guru','Guru',x.id_guru,state.cache.guru.filter(g=>g.status==='AKTIF').map(g=>g.id_guru+'|'+g.nama),'col-md-6')}${select('status','Status',x.status||'AKTIF',['AKTIF','NONAKTIF'],'col-md-6')}</form>`;
 modal('Wali Kelas',html,async()=>{const r=await API.post('saveWaliKelas',{token:Auth.token(),...formObj('waliForm')});toast(r.message);bootstrap.Modal.getInstance(document.getElementById('appModal')).hide();waliPage()});
}
async function delWali(id){if((await confirmDelete()).isConfirmed){await API.post('deleteWaliKelas',{token:Auth.token(),id});toast('Wali kelas dinonaktifkan');waliPage()}}

async function qrPage(){
 state.cache.siswa=(await API.get('getSiswa',{token:Auth.token()})).data;
 document.getElementById('content').innerHTML=`<div class="d-flex justify-content-between mb-3"><div><h3 class="page-title">Generate & Cetak QR</h3><p class="text-muted">QR hanya menyimpan token unik, bukan data pribadi lengkap.</p></div><div><button class="btn btn-outline-primary me-1" onclick="printQRCards(state.cache.siswa)"><i class="bi bi-printer"></i> Cetak Semua</button><button class="btn btn-primary" onclick="downloadQRSelected()"><i class="bi bi-download"></i> PNG</button></div></div><div class="card"><div class="card-body"><input class="form-control mb-3" placeholder="Cari siswa..." oninput="filterTable('qrTable',this.value)"><div class="table-responsive"><table id="qrTable" class="table"><thead><tr><th><input type="checkbox" id="allQR" onchange="document.querySelectorAll('.qrPick').forEach(x=>x.checked=this.checked)"></th><th>NIS</th><th>Nama</th><th>Kelas</th><th></th></tr></thead><tbody>${state.cache.siswa.map(s=>`<tr><td><input class="qrPick" type="checkbox" value="${esc(s.id_siswa)}"></td><td>${esc(s.nis)}</td><td>${esc(s.nama)}</td><td>${esc(s.kelas)}</td><td><button class="btn btn-sm btn-outline-primary" onclick='previewQR(${JSON.stringify(s)})'>QR</button><button class="btn btn-sm btn-outline-warning ms-1" onclick="regenQR('${esc(s.id_siswa)}')">Regenerate</button></td></tr>`).join('')}</tbody></table></div></div></div>`;
}
function previewQR(s){
 const html=`<div class="text-center"><h5>${esc(APP_CONFIG.school)}</h5><b>${esc(s.nama)}</b><div>${esc(s.nis)} • ${esc(s.kelas)}</div><canvas id="qrCanvas" class="my-3"></canvas><div class="small text-muted">Token unik</div></div>`;
 modal('QR Siswa',html,()=>bootstrap.Modal.getInstance(document.getElementById('appModal')).hide(),'Tutup');
 setTimeout(()=>drawQR(document.getElementById('qrCanvas'),s.token_qr),150);
}
function downloadQRSelected(){
 const ids=[...document.querySelectorAll('.qrPick:checked')].map(x=>x.value);const rows=state.cache.siswa.filter(s=>ids.includes(s.id_siswa));
 if(!rows.length){toast('Pilih siswa terlebih dahulu','warning');return}
 rows.forEach(s=>{const c=document.createElement('canvas');drawQR(c,s.token_qr).then(()=>downloadCanvas(c,s.nis+'_QR.png'))});
}
async function regenQR(id){if(!(await confirmDelete('QR lama akan dinonaktifkan dan token baru dibuat.')).isConfirmed)return;const r=await API.post('regenerateQR',{token:Auth.token(),id_siswa:id});toast('QR berhasil dibuat ulang');qrPage()}

async function settingsPage(){
 const r=await API.get('getPengaturan',{token:Auth.token()});state.cache.settings=r.data;
 const s=state.cache.settings;
 document.getElementById('content').innerHTML=`<div class="card"><div class="card-body"><h4>Pengaturan Sistem</h4><form id="settingsForm" class="row g-3 mt-1">${input('nama_sekolah','Nama Sekolah',s.nama_sekolah,'col-md-6')}${input('alamat_sekolah','Alamat',s.alamat_sekolah,'col-md-6')}${input('tahun_pelajaran','Tahun Pelajaran',s.tahun_pelajaran,'col-md-4')}${select('semester','Semester',s.semester,['Ganjil','Genap'],'col-md-4')}${input('qr_prefix','Prefix QR',s.qr_prefix,'col-md-4')}${input('jam_mulai','Jam Mulai Absensi',s.jam_mulai,'col-md-3',false,'time')}${input('jam_normal','Batas Normal',s.jam_normal,'col-md-3',false,'time')}${input('jam_terlambat','Batas Terlambat',s.jam_terlambat,'col-md-3',false,'time')}${input('jam_tutup','Jam Tutup',s.jam_tutup,'col-md-3',false,'time')}${input('hari_aktif','Hari Aktif (pisahkan koma)',s.hari_aktif,'col-md-8')}${select('suara_scanner','Suara Scanner',s.suara_scanner,['ON','OFF'],'col-md-4')}<div class="col-12"><button class="btn btn-primary">Simpan Pengaturan</button></div></form></div></div>`;
 document.getElementById('settingsForm').onsubmit=async e=>{e.preventDefault();const r=await API.post('savePengaturan',{token:Auth.token(),...formObj('settingsForm')});toast(r.message)}
}

function importPage(){
 document.getElementById('content').innerHTML=`<div class="card"><div class="card-body"><h4>Import Data</h4><p class="text-muted">Pilih tabel dan file CSV/XLSX. Data akan dipreview sebelum dikirim.</p><div class="row g-3"><div class="col-md-4"><select id="importTable" class="form-select"><option value="siswa">Siswa</option><option value="guru">Guru</option><option value="kelas">Kelas</option><option value="guru_piket">Guru Piket</option></select></div><div class="col-md-8"><input id="importFile" type="file" class="form-control" accept=".csv,.xlsx,.xls"></div></div><div id="importPreview" class="mt-4"></div></div></div>`;
 document.getElementById('importFile').onchange=async e=>{const f=e.target.files[0];if(!f)return;const data=await f.arrayBuffer();const wb=XLSX.read(data,{type:'array'});const rows=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{defval:''});window.importRows=rows;document.getElementById('importPreview').innerHTML=`<div class="alert alert-info">${rows.length} data ditemukan.</div><div class="table-responsive"><table class="table table-sm"><tbody>${rows.slice(0,8).map(r=>`<tr>${Object.values(r).slice(0,8).map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><button class="btn btn-primary" onclick="doImport()">Import Data</button>`}
}
async function doImport(){const table=document.getElementById('importTable').value;const r=await API.post('importData',{token:Auth.token(),table,rows:JSON.stringify(window.importRows||[])});Swal.fire('Import selesai',`Berhasil: ${r.data.success}<br>Gagal: ${r.data.errors.length}`,'info')}

async function backupPage(){
 const tables=['guru','siswa','kelas','guru_piket','absensi','wali_kelas','log_aktivitas'];
 document.getElementById('content').innerHTML=`<div class="card"><div class="card-body"><h4>Backup / Export</h4><p class="text-muted">Unduh tabel dari backend dalam CSV/XLSX/PDF melalui browser.</p><div class="row g-3">${tables.map(t=>`<div class="col-md-4"><div class="border rounded p-3"><b>${t}</b><div class="mt-2"><button class="btn btn-sm btn-outline-primary" onclick="exportTable('${t}','csv')">CSV</button> <button class="btn btn-sm btn-outline-success" onclick="exportTable('${t}','xlsx')">Excel</button></div></div></div>`).join('')}</div></div></div>`;
}
async function exportTable(table,type){
 const r=await API.get(table==='guru'?'getGuru':table==='siswa'?'getSiswa':table==='kelas'?'getKelas':table==='guru_piket'?'getGuruPiket':table==='wali_kelas'?'getWaliKelas':'getAbsensiHariIni',{token:Auth.token()});
 const rows=r.data||[]; if(!rows.length){toast('Tidak ada data','warning');return}
 const ws=XLSX.utils.json_to_sheet(rows.map(x=>{const y={...x};delete y._row;return y})); const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,table);
 if(type==='xlsx') XLSX.writeFile(wb,table+'.xlsx'); else XLSX.writeFile(wb,table+'.csv',{bookType:'csv'});
}

async function scannerPage(){
 document.getElementById('content').innerHTML=`<div class="card"><div class="card-body text-center p-4"><h3>Scan QR</h3><p class="text-muted">Scanner menggunakan kamera. Untuk mode penuh, gunakan halaman scanner.</p><a class="btn btn-primary btn-lg" href="scanner.html"><i class="bi bi-camera"></i> Buka Scanner Fullscreen</a></div></div>`;
}
async function manualPage(){
 state.cache.siswa=(await API.get('getSiswa',{token:Auth.token()})).data;
 document.getElementById('content').innerHTML=`<div class="card"><div class="card-body"><h4>Absensi Manual</h4><form id="manualForm" class="row g-3"><div class="col-md-6"><label class="form-label">Siswa</label><select name="id_siswa" class="form-select">${state.cache.siswa.map(s=>`<option value="${esc(s.id_siswa)}">${esc(s.nis)} — ${esc(s.nama)} — ${esc(s.kelas)}</option>`).join('')}</select></div>${selectHtml('status','Status','HADIR',['HADIR','TERLAMBAT','IZIN','SAKIT','ALPA','DISPENSASI'],'col-md-3')}${input('keterangan','Keterangan','','col-md-3')}<div class="col-12"><button class="btn btn-primary">Simpan</button></div></form></div></div>`;
 document.getElementById('manualForm').onsubmit=async e=>{e.preventDefault();const r=await API.post('manualAttendance',{token:Auth.token(),...formObj('manualForm')});toast(r.data.message||r.message);todayPage()};
}
async function todayPage(){
 const r=await API.get('getAbsensiHariIni',{token:Auth.token()});state.cache.abs=r.data;
 document.getElementById('content').innerHTML=`<div class="d-flex justify-content-between mb-3"><h3 class="page-title">Absensi Hari Ini</h3><button class="btn btn-primary" onclick="todayPage()">Refresh</button></div><div class="card"><div class="card-body">${tableAbsEdit(state.cache.abs)}</div></div>`;
}
function tableAbsEdit(rows){return `<div class="table-responsive"><table class="table"><thead><tr><th>Jam</th><th>NIS</th><th>Nama</th><th>Kelas</th><th>Status</th><th>Metode</th><th></th></tr></thead><tbody>${rows.map(a=>`<tr><td>${esc(a.jam)}</td><td>${esc(a.nis)}</td><td>${esc(a.nama)}</td><td>${esc(a.kelas)}</td><td>${statusBadge(a.status)}</td><td>${esc(a.metode)}</td><td><button class="btn btn-sm btn-outline-primary" onclick='editAbs(${JSON.stringify(a)})'><i class="bi bi-pencil"></i></button></td></tr>`).join('')}</tbody></table></div>`}
function editAbs(a){const html=`<form id="absForm">${hidden('id_absensi',a.id_absensi)}${select('status','Status',a.status,['HADIR','TERLAMBAT','IZIN','SAKIT','ALPA','DISPENSASI'])}${input('keterangan','Keterangan',a.keterangan)}</form>`;modal('Koreksi Absensi',html,async()=>{const r=await API.post('updateAttendance',{token:Auth.token(),...formObj('absForm')});toast(r.message);bootstrap.Modal.getInstance(document.getElementById('appModal')).hide();todayPage()})}

async function rekapPage(){
 const r=await API.get('getKelas',{token:Auth.token()});state.cache.kelas=r.data;
 document.getElementById('content').innerHTML=`<div class="card"><div class="card-body"><h4>Rekap Absensi</h4><form id="rekapForm" class="row g-3"><div class="col-md-3"><label class="form-label">Mulai</label><input type="date" name="start" class="form-control" required value="${new Date().toISOString().slice(0,10)}"></div><div class="col-md-3"><label class="form-label">Sampai</label><input type="date" name="end" class="form-control" required value="${new Date().toISOString().slice(0,10)}"></div>${selectHtml('kelas','Kelas','','', 'col-md-4',true)}<div class="col-md-2 d-flex align-items-end"><button class="btn btn-primary w-100">Tampilkan</button></div></form><div id="rekapOut" class="mt-4"></div></div></div>`;
 document.querySelector('#rekapForm select[name=kelas]').innerHTML='<option value="">Semua kelas</option>'+state.cache.kelas.map(k=>`<option>${esc(k.nama_kelas)}</option>`).join('');
 document.getElementById('rekapForm').onsubmit=async e=>{e.preventDefault();const r=await API.get('getRekap',{token:Auth.token(),...formObj('rekapForm')});renderRekap(r.data)}
}
function renderRekap(d){
 const rows=d.rows;document.getElementById('rekapOut').innerHTML=`<div class="d-flex justify-content-between mb-2"><div><b>Periode:</b> ${esc(d.start)} s/d ${esc(d.end)}</div><div><button class="btn btn-sm btn-success" onclick="exportRekap('xlsx')">Excel</button> <button class="btn btn-sm btn-danger" onclick="exportRekap('pdf')">PDF</button></div></div><div class="table-responsive"><table id="rekapTable" class="table"><thead><tr><th>NIS</th><th>Nama</th><th>Kelas</th><th>H</th><th>T</th><th>I</th><th>S</th><th>A</th><th>D</th><th>%</th></tr></thead><tbody>${rows.map(x=>`<tr><td>${esc(x.nis)}</td><td>${esc(x.nama)}</td><td>${esc(x.kelas)}</td><td>${x.H}</td><td>${x.T}</td><td>${x.I}</td><td>${x.S}</td><td>${x.A}</td><td>${x.D}</td><td><b>${x.persentase}%</b></td></tr>`).join('')}</tbody></table></div>`;
 window.currentRekap=rows;
}
function exportRekap(type){
 const rows=window.currentRekap||[];if(!rows.length){toast('Tampilkan rekap terlebih dahulu','warning');return}
 if(type==='xlsx'){const ws=XLSX.utils.json_to_sheet(rows);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Rekap');XLSX.writeFile(wb,'rekap_absensi.xlsx')}
 else{const {jsPDF}=window.jspdf;const doc=new jsPDF('l','mm','a4');doc.text(APP_CONFIG.school,14,14);doc.text('REKAP ABSENSI SISWA',14,21);doc.autoTable({startY:26,head:[['NIS','Nama','Kelas','H','T','I','S','A','D','%']],body:rows.map(x=>[x.nis,x.nama,x.kelas,x.H,x.T,x.I,x.S,x.A,x.D,x.persentase+'%'])});doc.save('rekap_absensi.pdf')}
}

async function detailPage(){
 state.cache.siswa=(await API.get('getSiswa',{token:Auth.token()})).data;
 document.getElementById('content').innerHTML=`<div class="card"><div class="card-body"><h4>Detail Siswa</h4><select id="detailSiswa" class="form-select" onchange="showStudentDetail(this.value)"><option value="">Pilih siswa</option>${state.cache.siswa.map(s=>`<option value="${esc(s.id_siswa)}">${esc(s.nis)} — ${esc(s.nama)} — ${esc(s.kelas)}</option>`).join('')}</select><div id="studentDetail" class="mt-4"></div></div></div>`;
}
async function showStudentDetail(id){
 if(!id)return;const s=state.cache.siswa.find(x=>x.id_siswa===id);const r=await API.get('getRekap',{token:Auth.token(),start:'2020-01-01',end:'2099-12-31',kelas:s.kelas});const x=r.data.rows.find(y=>y.nis===s.nis);
 document.getElementById('studentDetail').innerHTML=`<div class="row g-3"><div class="col-md-4"><div class="card bg-primary text-white"><div class="card-body"><h5>${esc(s.nama)}</h5><div>${esc(s.nis)} • ${esc(s.kelas)}</div><h2 class="mt-3">${x?.persentase||0}%</h2><small>Persentase kehadiran</small></div></div></div><div class="col-md-8"><div class="card"><div class="card-body"><h5>Ringkasan</h5><div class="row text-center"><div class="col">${statMini('Hadir',x?.H)}</div><div class="col">${statMini('Terlambat',x?.T)}</div><div class="col">${statMini('Izin',x?.I)}</div><div class="col">${statMini('Sakit',x?.S)}</div><div class="col">${statMini('Alpa',x?.A)}</div></div></div></div></div></div>`;
}
function statMini(a,b){return `<div class="border rounded p-2"><div class="small text-muted">${a}</div><b>${fmt(b)}</b></div>`}

function profilePage(){
 const u=Auth.current();document.getElementById('content').innerHTML=`<div class="row g-3"><div class="col-md-5"><div class="card"><div class="card-body"><h4>Profil</h4><p><b>Nama</b><br>${esc(u.nama)}</p><p><b>Username</b><br>${esc(u.username)}</p><p><b>Role</b><br>${esc(u.role)}</p></div></div></div><div class="col-md-7"><div class="card"><div class="card-body"><h4>Ganti Password</h4><form id="passForm">${input('old_password','Password Lama','', '',true,'password')}${input('new_password','Password Baru','', '',true,'password')}<button class="btn btn-primary">Simpan</button></form></div></div></div></div>`;
 document.getElementById('passForm').onsubmit=async e=>{e.preventDefault();const r=await API.post('changePassword',{token:Auth.token(),...formObj('passForm')});toast(r.message);e.target.reset()}
}

function input(name,label,value='',cls='col-12',required=false,type='text'){return `<div class="${cls}"><label class="form-label">${label}</label><input name="${name}" type="${type}" class="form-control" value="${esc(value)}" ${required?'required':''}></div>`}
function hidden(name,value=''){return `<input type="hidden" name="${name}" value="${esc(value)}">`}
function select(name,label,value,opts,cls='col-12'){return selectHtml(name,label,value,opts,cls)}
function selectHtml(name,label,value,opts,cls='col-12',blank=false){let arr=Array.isArray(opts)?opts:[];let vals=arr.map(x=>String(x).includes('|')?String(x).split('|')[0]:x);return `<div class="${cls}"><label class="form-label">${label}</label><select name="${name}" class="form-select">${blank?'<option value="">Semua</option>':''}${arr.map((x,i)=>{const v=String(x).includes('|')?String(x).split('|')[0]:x;const t=String(x).includes('|')?String(x).split('|').slice(1).join('|'):x;return `<option value="${esc(v)}" ${String(v)===String(value)?'selected':''}>${esc(t)}</option>`}).join('')}</select></div>`}
function formObj(id){const f=document.getElementById(id);const o={};new FormData(f).forEach((v,k)=>o[k]=v);return o}
function modal(title,body,onSave,saveText='Simpan'){
 document.getElementById('appModal')?.remove();
 document.body.insertAdjacentHTML('beforeend',`<div class="modal fade" id="appModal"><div class="modal-dialog modal-lg modal-dialog-scrollable"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">${title}</h5><button class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body">${body}</div><div class="modal-footer"><button class="btn btn-light" data-bs-dismiss="modal">Batal</button><button class="btn btn-primary" id="modalSave">${saveText}</button></div></div></div></div>`);
 const m=new bootstrap.Modal(document.getElementById('appModal'));m.show();document.getElementById('modalSave').onclick=onSave;
}
function filterTable(id,q){q=q.toLowerCase();document.querySelectorAll('#'+id+' tbody tr').forEach(tr=>tr.style.display=tr.textContent.toLowerCase().includes(q)?'':'none')}
