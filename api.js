const API = {
  async request(action, data={}, method='GET'){
    if(!API_BASE_URL || API_BASE_URL.includes('PASTE_')) throw new Error('API_BASE_URL belum dikonfigurasi.');
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),APP_CONFIG.apiTimeout);
    try{
      let url=API_BASE_URL, options={method,signal:controller.signal,headers:{}};
      if(method==='GET'){
        const p=new URLSearchParams({action,...data}); url+='?'+p.toString();
      }else{
        options.headers['Content-Type']='application/x-www-form-urlencoded;charset=UTF-8';
        const payload={action,...data}; options.body=Object.entries(payload).map(([k,v])=>encodeURIComponent(k)+'='+encodeURIComponent(typeof v==='object'?JSON.stringify(v):v??'')).join('&');
      }
      const res=await fetch(url,options);
      const text=await res.text();
      let json; try{json=JSON.parse(text)}catch(_){throw new Error('Respons API tidak valid.');}
      if(!json.ok) throw new Error(json.message||'API error');
      return json;
    }catch(e){
      if(e.name==='AbortError') throw new Error('Koneksi API timeout.');
      throw e;
    }finally{clearTimeout(timer)}
  },
  get(action,data={}){return this.request(action,data,'GET')},
  post(action,data={}){return this.request(action,data,'POST')}
};
