function qrPayload(siswa){return siswa.token_qr;}
async function drawQR(canvas,token){
  return QRCode.toCanvas(canvas,token,{width:180,margin:2,errorCorrectionLevel:'H'});
}
function downloadCanvas(canvas,name){const a=document.createElement('a');a.download=name;a.href=canvas.toDataURL('image/png');a.click();}
function printQRCards(rows){
  const w=window.open('','_blank');
  const cards=rows.map(s=>`<div class="qr-card"><h4>SMK NEGERI 1 PALOPO</h4><div class="small">SIABSEN QR</div><b>${esc(s.nama)}</b><div>NIS: ${esc(s.nis)} • ${esc(s.kelas)}</div><canvas data-token="${esc(s.token_qr)}"></canvas></div>`).join('');
  w.document.write(`<html><head><title>Cetak QR</title><style>body{font-family:Arial;margin:10mm}.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8mm}.qr-card{border:1px solid #aaa;border-radius:8px;padding:6mm;text-align:center;break-inside:avoid}canvas{display:block;margin:5mm auto}.small{font-size:12px;margin-bottom:4mm}@media print{.grid{grid-template-columns:repeat(2,1fr)}}</style></head><body><div class="grid">${cards}</div><script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.4/build/qrcode.min.js"><\/script><script>document.querySelectorAll('canvas').forEach(c=>QRCode.toCanvas(c,c.dataset.token,{width:180,margin:2,errorCorrectionLevel:'H'}));window.onload=()=>setTimeout(()=>window.print(),700);<\/script></body></html>`);
  w.document.close();
}
