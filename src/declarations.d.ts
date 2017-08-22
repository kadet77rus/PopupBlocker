declare function popupBlocker(window, KEY?:string, option?):any;
declare const KEY:string;
declare const _BRIDGE_KEY:string;

declare function InstallTrigger();

declare function exporter();

interface Bridge {
    domain:string,
    domainOption:DomainOption,
    whitelistedDestinations:string[],
    showAlert(orig_domain:string, popup_domain:string, isGeneric:boolean):void,
    getMessage(messageId:string):string
}

interface DomainOption {
    whitelisted:boolean,
    use_strict:boolean
}

interface PopupNotificationMsgIntf {
    orig_domain:string,
    popup_domain:string,
    isGeneric:boolean
}

// Non-standard DOM apis that are not understood by either Typescript or Closure Compiler are included here.
interface Document {
    documentMode?: number,
    elementsFromPoint(x:number, y:number):Element[],
    msElementsFromPoint(x:number, y:number):NodeListOf<Element>
}

interface Event {
    path?: EventTarget[],
    composedPath?():EventTarget[]
}