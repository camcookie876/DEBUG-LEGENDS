export class DeviceGate{
  assess(){
    const ua = navigator.userAgent || "";
    const isIPadOS = /\b(iPad)\b/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isTabletUA = /Tablet|iPad/.test(ua) || isIPadOS;
    const isMobileUA = /Mobi|Android(?!.*Tablet)/i.test(ua);

    const w = window.innerWidth;
    const h = window.innerHeight;
    const minLarge = 900;       // minimum “computer-like” width
    const minTablet = 800;      // acceptable tablet width for landscape
    const landscape = w >= h;

    // Classify
    let type = "unknown";
    if(isMobileUA) type = "phone";
    else if(isTabletUA) type = "tablet";
    else if(w >= minLarge) type = "desktop";

    // Rules:
    // - Phones/watches/small screens: blocked
    // - Tablets: must be landscape and width >= minTablet
    // - Desktops: allowed
    // - Unknown: allowed with notice
    let allowed = false;
    let reasons = [];
    let requiresAction = null; // "rotate" | "resize" | null

    if(type === "phone" || Math.min(w,h) < 500){
      allowed = false;
      reasons.push("A larger screen is required.");
    }else if(type === "tablet"){
      if(!landscape){
        allowed = false;
        reasons.push("Rotate your tablet to landscape.");
        requiresAction = "rotate";
      }else if(w < minTablet){
        allowed = false;
        reasons.push("Increase window width for a computer-like layout.");
        requiresAction = "resize";
      }else{
        allowed = true;
      }
    }else if(type === "desktop"){
      allowed = true;
    }else{
      // unknown
      allowed = true;
      reasons.push("Device type could not be determined.");
    }

    return {
      type,
      landscape,
      width:w, height:h,
      allowed,
      reasons,
      requiresAction,
      unknown: type === "unknown"
    };
  }
}