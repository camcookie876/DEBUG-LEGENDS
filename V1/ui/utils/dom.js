export function el(tag, attrs={}, children=[]){
  const node = document.createElement(tag);
  for(const [k,v] of Object.entries(attrs)){
    if(k === "class") node.className = v;
    else if(k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else if(k === "html") node.innerHTML = v;
    else node.setAttribute(k, v);
  }
  if(!Array.isArray(children)) children = [children];
  for(const c of children){
    if(c == null) continue;
    node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return node;
}
export const h = el;