/* Secret Jersey — UI-слой: попапы и анимации. Не затрагивает логику корзины и оплаты. */
(function(){
  var d=document, b=d.body; b.classList.add('js');

  function toast(msg){
    var t=d.createElement('div');t.className='sj-toast';t.textContent=msg;b.appendChild(t);
    requestAnimationFrame(function(){t.classList.add('show')});
    setTimeout(function(){t.classList.remove('show');setTimeout(function(){t.remove()},300)},2200);
  }
  function modal(html,cls){
    var m=d.createElement('div');m.className='sj-modal '+(cls||'');
    m.innerHTML='<div class="sj-dialog" role="dialog" aria-modal="true">'+html+'<button class="sj-close" aria-label="Закрыть">✕</button></div>';
    function close(){m.classList.remove('open');b.classList.remove('sj-lock');d.removeEventListener('keydown',esc);setTimeout(function(){m.remove()},300)}
    function esc(e){if(e.key==='Escape')close()}
    m.addEventListener('click',function(e){if(e.target===m||e.target.closest('.sj-close')||e.target.hasAttribute('data-close'))close()});
    d.addEventListener('keydown',esc);b.appendChild(m);b.classList.add('sj-lock');
    requestAnimationFrame(function(){m.classList.add('open')});
    return m;
  }

  // шапка: тень при прокрутке
  var hd=d.querySelectorAll('.header,.mini-header');
  function sc(){hd.forEach(function(h){h.classList.toggle('scrolled',scrollY>8)})}
  addEventListener('scroll',sc,{passive:true});sc();

  // появление блоков
  var io='IntersectionObserver' in window?new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})
  },{threshold:.12}):null;
  d.querySelectorAll('.product-card,.bottom-inner,.contact-cta p,.about,.payment-card').forEach(function(el,i){
    el.classList.add('reveal');el.style.transitionDelay=(i%3)*70+'ms';
    io?io.observe(el):el.classList.add('in');
  });

  // «Как это работает»
  d.querySelectorAll('[data-modal="how"]').forEach(function(btn){
    btn.addEventListener('click',function(){
      modal('<h2>Как работает Secret Jersey</h2><ol class="sj-steps">'+
        '<li><b>1</b><span>Выбери бокс и размер. Можно указать до 5 клубов, которые не нужны.</span></li>'+
        '<li><b>2</b><span>Оформи заказ и оплати. Доставка — ПВЗ СДЭК.</span></li>'+
        '<li><b>3</b><span>Получи посылку и открой её. Какая форма внутри — узнаешь только там.</span></li></ol>'+
        '<a class="buy" href="#products" data-close>Выбрать бокс</a>');
    });
  });

  // размерная сетка — в попап
  var w=d.querySelector('.size-table-wrapper');
  if(w){
    var btn=d.createElement('button');btn.type='button';btn.className='sj-sizebtn';btn.textContent='📏 Размерная сетка';
    w.parentNode.insertBefore(btn,w);w.classList.add('hidden');
    btn.addEventListener('click',function(){
      var c=w.cloneNode(true);c.classList.remove('hidden');modal('<h2>Размерная сетка</h2>'+c.outerHTML);
    });
  }

  // фото товара — на весь экран
  var img=d.querySelector('.product-img');
  if(img)img.addEventListener('click',function(){modal('<img src="'+img.src+'" alt="'+(img.alt||'')+'">','sj-lightbox')});

  // реквизиты — копирование по клику
  d.querySelectorAll('.payment-card p').forEach(function(p){
    var m=p.textContent.match(/Номер телефона:\s*(.+)$/);
    if(m){var v=m[1].trim();p.innerHTML='<b>Номер телефона:</b> <span class="copyable" title="Нажмите, чтобы скопировать">'+v+'</span>';
      p.querySelector('.copyable').addEventListener('click',function(){
        (navigator.clipboard?navigator.clipboard.writeText(v):Promise.reject()).then(function(){toast('Номер скопирован')},function(){toast('Выделите номер и скопируйте вручную')});
      });}
  });
})();
