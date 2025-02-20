import { store } from "../libs/PageX"

export class Header {
    op: Record<string, any>
    ui: Record<string, any> = store.state.ui
    box: HTMLElement
    
    constructor(option = {}) {
        this.op = {
            holder: "header",
        }
        
        Object.assign(this.op, option)
        
        this.box = document.querySelector(this.op.holder) as HTMLElement
    }
    
    initUI() {
        
    }
    
    init() {
        
    }
}