(() => {
  const header = document.querySelector('.nav-wrap');
  if (!header) return;
  let preferred = 'en';
  try { preferred = localStorage.getItem('skin-haven-language') === 'hi' ? 'hi' : 'en'; } catch {}
  const switcher = document.createElement('div');
  switcher.className = 'language-switch notranslate';
  switcher.setAttribute('translate', 'no');
  switcher.setAttribute('role', 'group');
  switcher.setAttribute('aria-label', 'Website language');
  switcher.innerHTML = '<button type="button" data-language="en" lang="en">English</button><button type="button" data-language="hi" lang="hi">हिंदी</button>';
  header.insertBefore(switcher, header.querySelector('.menu-toggle'));
  const status = document.createElement('p');
  status.className = 'language-status notranslate';
  status.setAttribute('role','status');
  status.setAttribute('translate','no');
  header.after(status);
  const host = document.createElement('div');
  host.id = 'google_translate_element';
  host.className = 'translation-provider';
  document.body.append(host);
  const paint = lang => switcher.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === lang)));
  paint(preferred);
  const cookie = lang => { document.cookie = `googtrans=/en/${lang};path=/;SameSite=Lax`; };
  const choose = lang => {
    preferred = lang;
    try { localStorage.setItem('skin-haven-language',lang); } catch {}
    cookie(lang);
    paint(lang);
    const select = host.querySelector('select');
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change', {bubbles:true}));
      status.textContent = lang === 'hi' ? 'हिंदी अनुवाद Google द्वारा। चिकित्सा जानकारी के लिए डॉक्टर से पुष्टि करें।' : '';
    } else if (lang === 'hi') {
      status.textContent = 'हिंदी अनुवाद लोड हो रहा है…';
      loadTranslation();
    } else {
      status.textContent = '';
      // Reload restores the original English text if translation has already run.
      if(document.documentElement.classList.contains('translated-ltr')) location.reload();
    }
  };
  let requested = false;
  function loadTranslation() {
    if (requested) return;
    requested = true;
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=skinHavenTranslateReady';
    script.async = true;
    script.onerror = () => { requested=false;status.textContent='हिंदी अनुवाद उपलब्ध नहीं है। इंटरनेट कनेक्शन जाँचकर फिर कोशिश करें।'; };
    document.head.append(script);
  }
  window.skinHavenTranslateReady = () => {
    new google.translate.TranslateElement({pageLanguage:'en', includedLanguages:'en,hi', autoDisplay:false},host.id);
    const observer = new MutationObserver(() => {
      if(host.querySelector('select')) {observer.disconnect();choose(preferred);}
    });
    observer.observe(host,{childList:true,subtree:true});
    if(host.querySelector('select')) {observer.disconnect();choose(preferred);}
  };
  switcher.addEventListener('click',event=>{const button=event.target.closest('[data-language]');if(button)choose(button.dataset.language);});
  // Do not load the external translation provider for English visitors.
  if(preferred==='hi')choose('hi');
})();
