// https://camcookie876.github.io/DEBUG-LEGENDS/V1/ui/save.js
import { h } from "https://camcookie876.github.io/DEBUG-LEGENDS/V1/ui/utils/dom.js";
import { modal } from "https://camcookie876.github.io/DEBUG-LEGENDS/V1/ui/components/modal.js";

export function mountSave(container, ctx){
  container.appendChild(h("h2", {}, "Manage Saves"));

  container.appendChild(h("div", {class:"cta"}, [
    h("button", {class:"button success", onclick: ()=> exportSave(ctx)}, "Export Save"),
    h("button", {class:"button primary", onclick: ()=> importSave(ctx)}, "Import Save"),
    h("button", {class:"button warn", onclick: ()=> resetSave(ctx)}, "Reset Save"),
  ]));
}

async function exportSave(ctx){
  const json = await ctx.store.exportJSON();
  modal({
    title:"Exported Save",
    body: h("textarea", {style:"width:100%;height:200px"}, json),
    actions:[{label:"Close", kind:"primary"}]
  });
}

async function importSave(ctx){
  modal({
    title:"Import Save",
    body: h("textarea", {id:"importArea", placeholder:"Paste save JSON here..."}),
    actions:[
      {label:"Import", kind:"success", async onClick(){
        const raw = document.getElementById("importArea").value;
        try{
          await ctx.store.importJSON(raw);
          ctx.notify("Save imported!", "success");
        }catch(e){
          ctx.notify("Invalid save data.", "error");
        }
      }},
      {label:"Cancel"}
    ]
  });
}

async function resetSave(ctx){
  await ctx.store.reset();
  ctx.notify("Save reset.", "warn");
}