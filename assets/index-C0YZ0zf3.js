(function(){const d=document.createElement("link").relList;if(d&&d.supports&&d.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&t(s)}).observe(document,{childList:!0,subtree:!0});function i(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function t(e){if(e.ep)return;e.ep=!0;const r=i(e);fetch(e.href,r)}})();function a(c,d){return(d||document).querySelector(c)}function m(c,d){return Array.from(document.querySelectorAll(c))}function h(c,d,i){const t=new IntersectionObserver(e=>{e.forEach(r=>d(r,t))},i);c.forEach(e=>t.observe(e))}const u=2024,g={titles:["Web Designer","Graphic Designer","Web Application Developer","Full Stack Developer","Senior Software Engineer","Developer Advisor","Senior Front End Engineer","UX Engineer"],navigation:[{id:"welcome",title:"Welcome"},{id:"skills",title:"Skills"},{id:"projects",title:"Projects"},{id:"contact",title:"Contact"},{id:"recruiters",title:"Recruiters"}],svg:{github:`<svg viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg">
    <g fill="currentcolor">
        <path clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
    </g>
</svg>`},skillLevels:[{id:1,title:"Beginner",description:"basic knowledge",range:[0,25]},{id:2,title:"Novice",description:"limited experience",range:[25,50]},{id:3,title:"Intermediate",description:"practical application",range:[50,75]},{id:4,title:"Advanced",description:"applied theory",range:[75,100]}],skills:[{title:"React",progress:80,years:u-2015},{title:"React Relay",progress:50,years:3},{title:"Redux",progress:75,years:5},{title:"VR Paintball",progress:35,years:2},{title:"React Native",progress:50,years:.5},{title:"HyperText",progress:60,years:u-2007},{title:"CSS",progress:85,years:u-2007},{title:"Tailwind",progress:70,years:4},{title:"SASS",progress:65,years:6},{title:"Nunchucks",progress:95,years:u-1998},{title:"JavaScript",progress:85,years:u-2009},{title:"Angular",progress:65,years:3},{title:"Node.js",progress:70,years:u-2015},{title:"GraphQL",progress:85,years:7},{title:"Crane kick",progress:70,years:u-1984},{title:"TypeScript",progress:76,years:u-2015},{title:"Bowstaff",progress:15,years:u-1998},{title:"Sass/SCSS",progress:85,years:u-2013},{title:"C#",progress:55,years:6},{title:"PHP",progress:70,years:7},{title:"SQL",progress:45,years:8},{title:"Java",progress:1,years:.1},{title:"Settlers of Catan",progress:65,years:18},{title:"Next.js",progress:5,years:.1}],projects:[{title:"Sordle",url:"https://sordle.iambrian.com",description:"Enjoy unlimited Wordle games with this Wordle clone. It features a static backend and provides the definition(s) of the word.",skills:["TypeScript","SASS","Vite"],sources:[{title:"Frontend",url:"https://github.com/iambriansreed/sordle"},{title:"Backend (Static)",url:"https://github.com/iambriansreed/sordle-words"}]},{title:"Connect 4",url:"https://connect4.iambrian.com",description:"Challenge yourself to a game of Connect 4 against a basic AI, designed to be competitive enough to keep you entertained while still being beatable.",skills:["TypeScript","SASS","Vite"],sources:[{title:"Frontend",url:"https://github.com/iambriansreed/connect4"}]},{title:"Socket Chat",url:"https://chat.iambrian.com",description:"A chat application that supports multiple private rooms, with data stored exclusively on the clients' devices.",skills:["TypeScript","SASS","Socket.io","Tailwind","Jest","Vite"],sources:[{title:"Frontend",url:"https://github.com/iambriansreed/comm-client"},{title:"Backend",url:"https://github.com/iambriansreed/comm-server"},{title:"Utility",url:"https://github.com/iambriansreed/comm-utils"}]}],questions:[{title:"Is this role 100% remote?",answers:[{title:"Yes"},{title:"No",failReason:"I am only taking roles that are 100% remote."}],id:"remote"},{title:"This role requires:",answers:[{title:"A bachelors or masters degree",failReason:"Even though I love learning, I don't have a college degree."},{title:"A degree OR equivalent experience of at least 10 years"},{title:"A degree OR equivalent experience of at least 5 years"}],id:"education"},{title:"What type of role is this?",answers:[{title:"Junior / Intermediate",failReason:"I am looking for a Senior or higher role."},{title:"Other"},{title:"Senior"},{title:"Team Lead"},{title:"Architect / Advisor"}],id:"role"},{title:"What is the annual base compensation, salary not including bonuses?",answers:[{title:"Unavailable",failReason:"If budgets aren't transparent we can't move forward."},{title:"below $150k"},{title:"$150k - $200k"},{title:"$200k - $250k"},{title:"above $250k"}],id:"compensation"},{title:"Is a sign-on bonus available?",answers:[{title:"Yes"},{title:"No"}],id:"sign-on-bonus"},{title:"This role requires expert knowledge in:",answers:[{title:"Java",failReason:"I am not an expert in Java. Did you mean JavaScript? I do have experience in other OOP languages, like C#."},{title:"React"},{title:"React Native"},{title:"Angular"},{title:"Other"}],id:"expertise"},{title:"What type of role is this?",answers:[{title:"Full Time / Direct Hire"},{title:"Contract to Hire"},{title:"Freelance / 1099"}],id:"employment"},{title:"How many interviews are part of the hiring process?",answers:[{title:"3 or less"},{title:"4 or more"},{title:"5 or more"}],id:"interviews"},{title:"How is the company's PTO benefit structured?",answers:[{title:"Unlimited"},{title:"20 days or more including holidays"},{title:"10 days or more excluding holidays"},{title:"Other"}],id:"vacation"}]};[{weight:200,url:"Metropolis-Light.woff2"}].forEach(async({url:c,weight:d})=>document.fonts.add(await new FontFace("base",`url(/fonts/${c})`,{weight:d.toString()}).load()));async function f(){var d;await document.fonts.ready,a("body > .loading").remove(),a(".sections").removeAttribute("style"),a("body > footer").removeAttribute("style");{let i=function(t,e){t&&(e==null||e.classList.add("hide"),t.classList.add("load"),setTimeout(()=>i(t.previousElementSibling,t),750))};setTimeout(()=>i(a("#welcome ul li:last-child")),500)}{const i=m("#skills li, .progress-bar, h2, h3, h4, article, svg, fieldset");i.forEach(t=>t.classList.add("invisible")),h(i,(t,e)=>{t.isIntersecting&&(t.target.classList.remove("invisible"),t.target.classList.add("visible"),e.unobserve(t.target))},{threshold:.5})}{const i=a("nav"),t=g.navigation.reduce((s,n)=>({...s,[n.id]:a('a[data-section="'+n.id+'"]',i)}),{}),e=a(".active-background",i),r=s=>{window.history.pushState({},"",s!=="welcome"?"/"+s:"/"),Object.entries(t).forEach(([n,l])=>l.classList.toggle("active",n===s)),t[s].classList.add("active"),e.style.top=t[s].offsetTop+"px",e.style.height=t[s].offsetHeight+"px"};Object.entries(t).forEach(([s,n])=>{n.addEventListener("click",l=>{l.preventDefault(),r(s),a("#"+s).scrollIntoView({behavior:"instant"})})}),h(m("[data-anchor-id]"),s=>{const n=i.dataset.section=s.target.dataset.anchorId;s.isIntersecting&&r(n)}),setTimeout(()=>{const s=g.navigation.find(({id:n})=>window.location.pathname.includes(n)||window.location.hash.includes(n));if(s){const n=s==null?void 0:s.id;r(n),a("#"+n).scrollIntoView({behavior:"instant"})}},1)}async function c(i){return Promise.all([new Promise(t=>setTimeout(t,1e3)),fetch("https://api.iambrian.com/"+i.type,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}).then(t=>t.json())]).then(([,t])=>t)}{const i=a("#contact form"),t=a("textarea",i),e=a(".error-description",i),r=a(".found-email span",i),s=a('[type="submit"]',i);e.addEventListener("click",()=>{const l=a(".active",e);l.classList.remove("active"),(l.nextElementSibling||e.firstElementChild).classList.add("active")});const n=()=>{var l;return((l=t.value.match(/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/))==null?void 0:l[0])||""};t.addEventListener("input",function(){const l=t.value.split(`
`).length;t.setAttribute("rows",l.toString());const o=n();i.classList.toggle("has-error",!o),i.classList.toggle("has-email",!!o),r.innerText=o||""}),(d=a("button",i))==null||d.addEventListener("click",function(){i.classList.add("submitted");const l=n();i.classList.toggle("has-error",!l)}),i.addEventListener("submit",async function(){const l=n();if(!l){e.classList.add("horizontal-shake"),e.click(),setTimeout(()=>e.classList.remove("horizontal-shake"),500);return}s.classList.add("busy"),s.disabled=!0,t.disabled=!0;try{await c({email:l,message:t.value,type:"contact"}),i.classList.add("success")}catch(o){console.error(o)}})}{const i=a("#recruiters"),t=a("form",i),e=a("form.send",i),r=o=>{i.dataset.state=o};a("[data-start-quiz]",i).addEventListener("click",function(){r("quiz"),window.location.hash="#recruiters"});const s=()=>g.questions.map(o=>({id:o.id,title:o.title,value:t[o.id].value})),n=()=>s().some(o=>o.value==="fail");t.addEventListener("change",function(){r(n()?"fail":"quiz")});const l=a("button.check-results",t);l.addEventListener("click",async function(){t.classList.add("submitted"),r(n()?"fail":"quiz")}),t.addEventListener("submit",async function(o){if(o.preventDefault(),l.classList.add("busy"),await new Promise(p=>setTimeout(p,1e3)),n()){r("fail");return}r("pass"),l.classList.remove("busy")});{a("button",e).addEventListener("click",function(){e.classList.add("submitted"),e.classList.toggle("error",!o.validity.valid)});const o=a('[type="email"]',e);o.addEventListener("input",function(){e.classList.contains("submitted")&&e.classList.toggle("error",!o.validity.valid)}),o.oninvalid=p=>p.preventDefault(),e.addEventListener("submit",async function(){var p;o.validity.valid&&((p=a("button",e))==null||p.classList.add("busy"),o.disabled=!0,r("sending"),await c({email:o.value,message:JSON.stringify(s()),type:"quiz"}),r("sent"))})}}return Promise.resolve()}window.test={fillQuiz(){a("[data-start-quiz]").click(),m('[type="radio"]:not([value="fail"])').forEach(c=>c.click())}};f();
