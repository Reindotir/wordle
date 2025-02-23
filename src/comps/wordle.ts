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
            justifyContent: "center",
            gap: "10px",
            height: "100%",
            width: "100%",
        })
        this.ui.add(".canvasCont", {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "65%",
        })

        this.canvasCont = document.createElement('div')
        this.canvasCont.classList.add("canvasCont")
        this.box.appendChild(this.canvasCont)

        this.on("win", () => {
            this.state.gameEnd = true
            this.state.win = true
            this.userData.games.push(this.state)
        })

        this.on("loss", () => {
            this.state.gameEnd = true
            this.userData.games.push(this.state)
        })
    }

    initCanvas() {
        this.ui.add(".canvasBox", {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: '2vh',
            width: "10%",
            height: "100%",
        })
        this.ui.add(".inputBox", {
            flex: "1 0",
            width: "100%",
            display: "flex",
            gap: '2vw',
            alignItems: "center",
            justifyContent: 'center',
        })

        this.ui.add(".sym", {
            flex: '1 0 45px',
            aspectRatio: '1 / 1',
            display: "flex",
            fontSize: "120%",
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: '2vh',
            width: "100%",
            maxWidth: "550px",
            height: "35%",
        })
        this.ui.add(".lettersLine", {
            width: "auto",
            display: "flex",
            gap: '1vw',
            alignItems: "center",
            justifyContent: 'center',
        })
        
        this.ui.add(".letter", {
            all: "unset",
            aspectRatio: "1 / 1",
            flex: '1 0 30px',
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "120%",
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
            padding: "0 20px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: 'space-between',
        })
        this.ui.add(".optionBtn", {
            all: "unset",
            flex: "0.1 0",
            cursor: "pointer",
            aspectAsio: "3 / 1",
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
                if (this.activeInp && !this.activeInp.textContent) this.activeInp.textContent = letter
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
                const btn = lettersBox.querySelector(`[data-letter="${letter}"]`)
                if (btn) btn.className = "letter " + type
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

        const newLine = (line: Array<string>) => {
            const lettersLine = document.createElement("div")
            lettersLine.classList.add("lettersLine")
            line.forEach((letter: string) => {
                const btn = newBtn(letter)
                lettersLine.appendChild(btn)
            })
            lettersBox.appendChild(lettersLine)
        }

        this.op.letters.forEach((line: Array<string>) => {
            newLine(line)
        })

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