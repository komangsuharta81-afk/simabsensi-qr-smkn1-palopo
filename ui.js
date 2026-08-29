function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function toast(message,type='success'){
  const el=document.createElement('div'); el.className='toast align-items-center text-bg-'+(type==='error'?'danger':type)+' border-0'; el.role='alert';
  el.innerHTML='<div class="d-flex"><div class="toast-body">'+esc(message)+'</div><button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>';
  document.getElementById('toastContainer').appendChild(el); new bootstrap.Toast(el,{delay:2800}).show(); el.addEventListener('hidden.bs.toast',()=>el.remove());
}
function fmt(n){return Number(n||0).toLocaleString('id-ID')}
function statusBadge(s){
  const map={HADIR:'success',TERLAMBAT:'warning',IZIN:'danger',SAKIT:'info',ALPA:'dark',DISPENSASI:'primary'};
  return `<span class="badge text-bg-${map[s]||'secondary'}">${esc(s)}</span>`;
}
function confirmDelete(text='Data akan dinonaktifkan.'){
  return Swal.fire({title:'Konfirmasi',text,icon:'warning',showCancelButton:true,confirmButtonText:'Ya',cancelButtonText:'Batal'});
}
