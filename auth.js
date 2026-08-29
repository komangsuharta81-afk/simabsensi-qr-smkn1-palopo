const Auth={
  save(result,remember){
    const payload=JSON.stringify(result);
    (remember?localStorage:sessionStorage).setItem('siabsen_session',payload);
    if(remember) sessionStorage.removeItem('siabsen_session'); else localStorage.removeItem('siabsen_session');
  },
  current(){
    for(const s of [localStorage,sessionStorage]){
      const raw=s.getItem('siabsen_session'); if(raw){try{return JSON.parse(raw).user}catch(_){s.removeItem('siabsen_session')}}
    } return null;
  },
  token(){
    for(const s of [localStorage,sessionStorage]){
      const raw=s.getItem('siabsen_session'); if(raw){try{return JSON.parse(raw).token}catch(_){return ''}}
    } return '';
  },
  session(){
    for(const s of [localStorage,sessionStorage]){
      const raw=s.getItem('siabsen_session'); if(raw){try{return JSON.parse(raw)}catch(_){return null}}
    } return null;
  },
  clear(){localStorage.removeItem('siabsen_session');sessionStorage.removeItem('siabsen_session')},
  async login(username,password,role,remember){
    const r=await API.post('login',{username,password,role});
    Auth.save(r.data,remember); return r.data;
  },
  async logout(){try{await API.post('logout',{token:Auth.token()})}finally{Auth.clear();location.reload()}}
};
