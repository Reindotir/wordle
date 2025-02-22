import { store } from "../libs/PageX"
import { EventEmmiter } from "../libs/EventEmmiter"

export class Wordle extends EventEmmiter {
    op: Record<string, any>
    box: HTMLElement
    canvasCont!: HTMLElement
    state: Record<string, any> 
    userData: Record<string, any> = { games: [], usedWords: [] }
    _activeInp: HTMLElement | null = null
    _activeLine: HTMLElement | null = null
    ui: Record<string, any> = store.state.ui
    words: Array<string>

    constructor(option = {}) {
        super()
        this.op = {
            words: [],
            holder: "#wordle",
            letters: [],
            mode: "easy",
        }
        Object.assign(this.op, option)

        this.words = this.op.words
        this.box = document.querySelector(this.op.holder) as HTMLElement

        if (!this.box) {
            console.error("Holder doesnt exist")
            return
        }
    }

    get activeLine() {
        return this._activeLine
    }

    set activeLine(line) {
        this._activeLine?.querySelectorAll(".sym").forEach((inp) => {
            inp.classList.remove('active')
        })

        line?.querySelectorAll(".sym").forEach((inp) => {
            inp.classList.add("active")
        })

        this._activeLine = line
    }

    get activeInp() {
        return this._activeInp
    }

    set activeInp(inp) {
        this.activeInp?.classList.remove("focus")
        inp?.classList.add("focus")
        this._activeInp = inp
    }

    init() {
        this.initCore()
        this.initKeyboard()
        this.newGame()
    }

    initCore() {
        this.ui.add(this.op.holder, {
            display: 'flex',
            flexDirection: "column",
            alignItems: "center",
            gap: '20px',
        })
        this.ui.add("canvasCont", {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        })

        this.canvasCont = document.createElement('div')
        this.canvasCont.classList.add("canvasCont")
        this.box.appendChild(this.canvasCont)

        this.on("win", () => {
            this.state.gameEnd = true
            this.state.win = true
            console.log(this.userData)
        })

        this.on("loss", () => {
            this.state.gameEnd = true
            console.log(this.userData)
        })
    }

    initCanvas() {
        this.ui.add(".canvasBox", {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "15px",
            width: "100%",
            height: "auto",
            borderRadius: '12px',
            marginRight: "10px",
        })
        this.ui.add(".inputBox", {
            width: "auto",
            display: "flex",
            height: "50px",
            gap: "10px",
            alignItems: "center",
        })

        this.ui.add(".sym", {
            width: "50px",
            height: "50px",
            display: "flex",
            fontSize: "110%",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
            border: "1px solid rgb(var(--color-nd))",
            transition: "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)",

            "&.active": {
                border: "1px solid rgb(var(--color))"
            },

            "&.focus": {
                transform: "scale(1.1)"
            },

            "&.green": {
                backgroundColor: "rgba(var(--success), 0.5)"
            },

            "&.grey": {
                backgroundColor: "rgba(var(--grey), 1)"
            },

            "&.yellow": {
                backgroundColor: "rgba(var(--warning), 0.5)"
            },
        }) 

        const canvasBox = document.createElement("div")
        canvasBox.classList.add("canvasBox")

        const createInput = (id: number) => {
            const createSym = (idx: number) => {
                const sym = document.createElement("div")
                sym.setAttribute("data-idx", `${idx}`)
                sym.classList.add("sym")
                return sym
            }

            const inputBox = document.createElement("div")
            inputBox.setAttribute("data-id", `${id}`)
            inputBox.classList.add("inputBox")

            for (let i = 0; i < 5; i++) {
                inputBox.appendChild(createSym(i))
            }

            return inputBox
        }

        for (let i = 0; i < 6; i++) {
            canvasBox.appendChild(createInput(i))
        }

        this.canvasCont.innerHTML = ""
        this.canvasCont.appendChild(canvasBox)
    }

    initKeyboard() {
        this.ui.add(".lettersBox", {
            width: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "8px",
        })
        this.ui.add(".lettersLine", {
            display: "flex",
            width: "80%",
            height: "auto",
            gap: "10px",
            justifyContent: "center",
            flexWrap: "wrap",
        })
        this.ui.add(".letter", {
            all: "unset",
            cursor: "pointer",
            width: "45px",
            height: "45px",
            display: "flex",
            alignItems: "center",
            fontSize: "125%",
            justifyContent: "center",
            borderRadius: "8px",
            backgroundColor: "rgb(var(--component))",
            transition: "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)",

            "&:active": {
                transform: "scale(0.9)"
            },

            "&.green": {
                backgroundColor: "rgba(var(--success), 0.5)"
            },

            "&.grey": {
                backgroundColor: "rgba(var(--grey), 1)"
            },

            "&.yellow": {
                backgroundColor: "rgba(var(--warning), 0.5)"
            },
        })

        this.ui.add(".opLine", {
            width: "80%",
            height: "auto",
            display: "flex",
            alignItems: "center",
            padding: "0 10px",
            justifyContent: "space-between"
        })
        this.ui.add(".optionBtn", {
            all: "unset",
            cursor: "pointer",
            width: "100px",
            height: "35px",
            display: "flex",
            alignItems: "center",
            fontSize: "125%",
            justifyContent: "center",
            borderRadius: "8px",
            backgroundColor: "rgb(var(--component))",
            padding: "5px",

            transition: "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)",

            "&:active": {
                transform: "scale(0.9)"
            },
        })


        const newBtn = (letter: string) => {
            const btn = document.createElement("button")
            btn.setAttribute("data-letter", letter)
            btn.textContent = letter
            btn.addEventListener("click", () => {
                if (this.state.gameEnd) return
                if (this.activeInp) this.activeInp.textContent = letter
                const nextInp = this.nextInp()
                if (nextInp) this.activeInp = nextInp
            })
            btn.classList.add("letter")
            return btn
        }

        const lettersBox = document.createElement("div")
        lettersBox.classList.add("lettersBox")

        const opLine = document.createElement("div")
        opLine.classList.add("opLine")

        const enterBtn = document.createElement("button")
        enterBtn.addEventListener("click", () => {
            if (!this.activeLine) return
            if (this.state.gameEnd) return
            const inps = this.activeLine.querySelectorAll(".sym")

            const paintKeyboard = (letter, type: string) => {
                const btn = lettersLine.querySelector(`[data-letter="${letter}"]`)
                if (btn) btn.classList.add(type)
            }

            let emptyInp = false
            inps.forEach((inp) => {
                if (inp.textContent === "") emptyInp = true
            })
            if (emptyInp) return

            let win = true
            inps.forEach((inp, idx) => {
                if (inp.textContent !== this.state.word[idx]) {
                    win = false
                    if (this.state.word.indexOf(inp.textContent) !== -1) {
                        inp.classList.add("yellow")
                        paintKeyboard(inp.textContent, "yellow")
                    } else {
                        inp.classList.add("grey")
                        paintKeyboard(inp.textContent, "grey")
                    }
                } else {
                    inp.classList.add("green")
                    paintKeyboard(inp.textContent, "green")
                }
            })

            if (win) {
                this.emit("win")
                return
            } else if (this.activeLine.getAttribute("data-id") === "5") {
                console.log("так")
                this.emit("loss")
                return
            }

            this.nextLine()
        })
        enterBtn.textContent = store.state.lang.keyboard.enter
        enterBtn.classList.add("optionBtn")
        opLine.appendChild(enterBtn)

        const backspaceBtn = document.createElement("button")
        backspaceBtn.addEventListener("click", () => {
            if (this.state.gameEnd) return
            const inp = this.activeInp
            if (!inp) return

            if (inp.textContent !== "") {
                inp.textContent = ""
                return
            }

            const lastInp = this.lastInp()
            if (lastInp) {
                lastInp.textContent = ""
                this.activeInp = lastInp
            }
        })
        backspaceBtn.textContent = store.state.lang.keyboard.backspace
        backspaceBtn.classList.add("optionBtn")
        opLine.appendChild(backspaceBtn)

        lettersBox.appendChild(opLine)

        const lettersLine = document.createElement("div")
        lettersLine.classList.add("lettersLine")
        this.op.letters.forEach((letter: string) => {
            const btn = newBtn(letter)

            lettersLine.appendChild(btn)
        })

        lettersBox.appendChild(lettersLine)

        this.box.appendChild(lettersBox)
    }

    clearKeyboard() {
        const cont = this.box.querySelector(".lettersLine")
        if (!cont) return

        const btns = cont.querySelectorAll(".letter")
        btns.forEach((btn) => {
            btn.className = ""
            btn.classList.add("letter")
        })
    }

    newGame() {
        if (this.state) {
            delete this.state.gameEnd
            this.userData.games.push(this.state)
        }
        this.clearKeyboard()

        this.state = {
            attempts: 0,
            word: this.getWord(),
            win: false,
        }

        console.log(this.state.word)

        this.initCanvas()

        this.activeLine = this.canvasCont.querySelector(".inputBox") as HTMLElement
        this.activeInp = this.activeLine.querySelector(".sym")
    }

    nextLine() {
        if (!this.activeLine) return
        this.state.attempts += 1

        let idx = Number(this.activeLine.getAttribute("data-id")) + 1

        const nextLine = this.canvasCont.querySelector(`[data-id="${idx}"]`) as HTMLElement
        if (nextLine) {
            this.activeLine = nextLine
            this.activeInp = nextLine.querySelector(".sym") as HTMLElement
        }
    }

    nextInp(): HTMLElement | null {
        const inp = this.activeInp
        if (!inp) return null
        if (!this.activeLine) return null

        let idx: number | string | null = inp.getAttribute("data-idx")
        if (!idx || idx === "5") return null
        idx = Number(idx)

        return this.activeLine.querySelector(`[data-idx="${idx += 1}"`)
    }

    lastInp(): HTMLElement | null {
        const inp = this.activeInp
        if (!inp) return null
        if (!this.activeLine) return null

        let idx: number | string | null = inp.getAttribute("data-idx")
        if (!idx || idx === "0") return null
        idx = Number(idx)

        return this.activeLine.querySelector(`[data-idx="${idx -= 1}"`)
    }
    
    getWord() {
        if (this.op.mod === "easy") {
            let idx = Math.floor(Math.random() * this.words.length)
            this.userData.usedWords.push(this.words[idx])
            return this.words[idx]
        }

        let word = ""
        do {
            let idx = Math.floor(Math.random() * this.words.length)
            word = this.words[idx]
        } while (this.userData.usedWords.includes(word))
        
        this.userData.usedWords.push(word)
        return word
    }
}