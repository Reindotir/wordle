import { store } from "../libs/PageX"

export class Header {
    op: Record<string, any>
    ui: Record<string, any> = store.state.ui
    box: HTMLElement
    indicator!: HTMLElement
    
    constructor(option = {}) {
        this.op = {
            holder: "header",
            btns: [],
            startIdx: 0,
        }
        
        Object.assign(this.op, option)
        
        this.box = document.querySelector(this.op.holder) as HTMLElement

        this.init()
    }

    init() {
        this.initUI()
        this.initContent()
    }
    
    initUI() {
        const offEnv = this.ui.env("header")

        this.ui.add(".btn", {
            all: "unset",
            width: "100px",
            height: "90%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
            cursor: "pointer",
            color: 'rgb(var(--color-nd))',
            zIndex: "1",
            transition: "color 0.3s, font-size 0.3s, font-weight 0.3s",

            "&.active": {
                color: "rgb(var(--color))",
                fontSize: "110%",
                fontWeight: "bold",
            }
        })

        this.ui.add(".indicator", {
            position: "absolute",
            height: "40px",
            backgroundColor: "rgba(var(--component), 0.7)",
            zIndex: "0",
            borderRadius: "8px",
            transition: "width 0.3s, left 0.3s",
        })

        offEnv()
    }
    
    initContent() {
        // инициализация индикатора
        this.indicator = document.createElement("div")
        this.indicator.classList.add("indicator")
        this.box.appendChild(this.indicator)

        // инициализация кнопок

        let btnToFocus: HTMLElement | null = null
        this.op.btns.forEach((btnConf: Record<string, any>, idx: number) => {
            const btn = document.createElement("a")
            btn.setAttribute("data-link", "")
            btn.href = btnConf.href

            if (this.op.startIdx === idx) btnToFocus = btn

            btn.classList.add("btn")
            btn.innerHTML = btnConf.content
            btn.addEventListener("click", () => {
                this.focus(btn)
            })
            this.box.appendChild(btn)
        })

        if (btnToFocus) this.focus(btnToFocus)
    }

    focus(btn: HTMLElement | number) {
        const btns = Array.from(this.box.querySelectorAll(".btn")) as Array<HTMLElement>
        if (typeof btn === "number") {
            btn = btns[btn]
        }

        btns.forEach((btn) => {
            btn.classList.remove("active")
        })
        btn.classList.add("active")

        this.indicator.style.width = `${btn.offsetWidth}px`
        this.indicator.style.left = `${btn.offsetLeft}px`
        
    }
}