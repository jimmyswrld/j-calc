document.addEventListener("DOMContentLoaded",(function(){document.querySelectorAll('form[j-calc-element="form"]').forEach((e=>{const t=e.querySelectorAll("[j-calc-field]"),c=e.closest(':has([j-calc-output="result"])').querySelector('[j-calc-output="result"]'),r=e.querySelector('[j-calc-action="submit"]'),a=e.getAttribute("j-calc-format"),l=()=>{let e=0;t.forEach((t=>{const c=t.getAttribute("j-calc-field"),r=parseFloat(t.getAttribute("j-calc-amount")||1),a=t.getAttribute("type");let l;if("checkbox"===a){if(!t.checked)return;l=t.getAttribute("j-calc-checkbox-value")}else if("radio"===a){if(!t.checked)return;l=t.value}else if(l=t.value,""===l)return;const u=parseFloat(l)*r;switch(c){case"add":e+=u;break;case"subtract":e-=u;break;case"multiply":e*=u;break;case"divide":e/=u}})),c.textContent="currency"===a?e.toFixed(2):e};r?r.addEventListener("click",(function(e){e.preventDefault(),l()})):t.forEach((e=>{e.addEventListener("input",l)}))}))}));
