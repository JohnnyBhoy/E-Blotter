import{r as u,e as o,j as r,W as f,Y as p,a as g}from"./app-be1hn04I.js";import{G as h}from"./GuestLayout-B0Erk4NV.js";import{o as s}from"./Modal-PzupMTPZ.js";import"./Sweetalert-DRg7Vg_x.js";import"./barangays-C98EpkaN.js";import"./regions-CZh2rcfQ.js";var x=["color","size","title","className"];function m(){return m=Object.assign||function(e){for(var a=1;a<arguments.length;a++){var l=arguments[a];for(var t in l)Object.prototype.hasOwnProperty.call(l,t)&&(e[t]=l[t])}return e},m.apply(this,arguments)}function v(e,a){if(e==null)return{};var l=z(e,a),t,i;if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(i=0;i<n.length;i++)t=n[i],!(a.indexOf(t)>=0)&&Object.prototype.propertyIsEnumerable.call(e,t)&&(l[t]=e[t])}return l}function z(e,a){if(e==null)return{};var l={},t=Object.keys(e),i,n;for(n=0;n<t.length;n++)i=t[n],!(a.indexOf(i)>=0)&&(l[i]=e[i]);return l}var c=u.forwardRef(function(e,a){var l=e.color,t=e.size,i=e.title,n=e.className,d=v(e,x);return o.createElement("svg",m({ref:a,xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16",width:t,height:t,fill:l,className:["bi","bi-dash-circle-dotted",n].filter(Boolean).join(" ")},d),i?o.createElement("title",null,i):null,o.createElement("path",{d:"M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z"}))});c.propTypes={color:s.string,size:s.oneOfType([s.string,s.number]),title:s.string,className:s.string};c.defaultProps={color:"currentColor",size:"1em",title:null,className:""};function b({className:e="",disabled:a,children:l,...t}){return r.jsx("button",{...t,className:"text-center bg-blue-600 hover:bg-blue-800 rounded text-white w-full p-3",children:l})}function M({status:e}){const{post:a,processing:l}=f({}),t=i=>{i.preventDefault(),a(route("verification.send"))};return r.jsxs(h,{children:[r.jsx(p,{title:"Email Verification"}),r.jsx("div",{className:"grid place-items-center p-40",children:r.jsxs("div",{className:"p-10 shadow-lg rounded w-1/2",children:[r.jsx("div",{className:"mb-4 text-xl text-gray-600",children:"Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another."}),e==="verification-link-sent"&&r.jsx("div",{className:"mb-4 font-medium text-sm text-green-600",children:"A new verification link has been sent to the email address you provided during registration."}),r.jsx("form",{onSubmit:t,children:r.jsxs("div",{className:"mt-8 flex items-center flex-col",children:[r.jsx(b,{disabled:!1,children:l?r.jsxs("span",{className:"flex gap-2 justify-center",children:["Sending verification email ",r.jsx(c,{size:24,className:"animate-spin"})," "]}):"Resend Verification Email"}),r.jsx(g,{href:route("logout"),method:"post",as:"button",className:"mt-6 w-full bg-slate-500 text-white rounded p-3",children:"Log Out"})]})})]})})]})}export{M as default};