import { store } from "../libs/PageX"
import { Wordle } from "../comps/wordle"

export default class MainPage {
    ui: Record<string, any> = store.state.ui
    main: HTMLElement = document.querySelector("main") as HTMLElement
    router: Record<string, any>
    box!: HTMLElement
    wordle!: HTMLElement
    wordleApi: Record<string, any>
    logPanel!: HTMLElement

    constructor(router: Record<string, any>) {
        this.router = router
        
        window.addEventListener("beforeunload", () => {
            this.saveData()
        })
        document.title = "Wordle"
    }

    init() {
        this.initUI()
        this.initContent()
        this.initLogPanel()
    }

    initUI() {
        const offEnv = this.ui.env("main")

        this.ui.add(".wordleBox", {
            width: '100%',
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        })
        offEnv()
        this.ui.add(".log-panel", {
            position: "absolute",
            zIndex: "5",
            padding: "10px",
            width: "auto",
            height: "auto",
            display: "flex",
            flexDirection: "column",
            borderRadius: "12px",
            alignItems: "center",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: "rgba(var(--bg-nd), 0.8)",
            justifyContent: "center",
            opacity: "0",
            transform: "translate(-10%, -50%)",
            transition: "opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1), transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",

            "&.show": {
                opacity: "1",
                transform: "translate(0%, -50%)",
            },
        })
        this.ui.add(".log-panel-content", {
            display: "flex",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            fontSize: "100%",
            gap: "5px",
        })
        
        this.ui.add(".log-panel-option", {
            width: "100%",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            
            "button": {
                all: "unset",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "5px 10px",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: "rgba(var(--component), 0.7)",
            }
        })
    }

    initContent() {
        this.box = document.createElement("div")
        this.box.classList.add("wordleBox")
        this.main.appendChild(this.box)

        this.wordle = document.createElement("div")
        this.wordle.setAttribute("id", "wordle")
        this.box.appendChild(this.wordle)

        const englishAlphabet = [
            "qwertyuiop".split(""),
            "asdfghjkl".split(""),
            "zxcvbnm".split(""),
        ]
        const russianAlphabet = [
            "йцукенгшщзх".split(""),
            "ъфывапролдж".split(""),
            "эячсмитьбю".split(""),
        ]

        const alphabet = {
            "ru-RU": russianAlphabet,
            "en-US": englishAlphabet,
            "en": englishAlphabet,
            "ru": russianAlphabet,
        }

        // делаем вид, что получаем слова с сервера
        const enWords = ['about', 'alert', 'argue', 'beach', 'above', 'alike', 'arise', 'began', 'abuse', 'alive', 'array', 'begin', 'actor', 'allow', 'aside', 'begun', 'acute', 'alone', 'asset', 'being', 'admit', 'along', 'audio', 'below', 'adopt', 'alter', 'audit', 'bench', 'adult', 'among', 'avoid', 'billy', 'after', 'anger', 'award', 'birth', 'again', 'angle', 'aware', 'black', 'agent', 'angry', 'badly', 'blame', 'agree', 'apart', 'baker', 'blind', 'ahead', 'apple', 'bases', 'block', 'alarm', 'apply', 'basic', 'blood', 'album', 'arena', 'basis', 'board', 'boost', 'buyer', 'china', 'cover', 'booth', 'cable', 'chose', 'craft', 'bound', 'calif', 'civil', 'crash', 'brain', 'carry', 'claim', 'cream', 'brand', 'catch', 'class', 'crime', 'bread', 'cause', 'clean', 'cross', 'break', 'chain', 'clear', 'crowd', 'breed', 'chair', 'click', 'crown', 'brief', 'chart', 'clock', 'curve', 'bring', 'chase', 'close', 'cycle']
        const ruWords = ['время', 'жизнь', 'слово', 'место', 'конец', 'часть', 'город', 'земля', 'право', 'дверь', 'образ', 'закон', 'война', 'голос', 'книга', 'число', 'народ', 'форма', 'связь', 'улица', 'вечер', 'мысль', 'месяц', 'школа', 'театр', 'рубль', 'смысл', 'орган', 'рынок', 'семья', 'центр', 'ответ', 'автор', 'стена', 'совет', 'глава', 'наука', 'плечо', 'точка', 'палец', 'номер', 'метод', 'фильм', 'гость', 'кровь', 'район', 'армия', 'класс', 'герой', 'спина', 'сцена', 'объем', 'берег', 'фирма', 'завод', 'песня', 'роман', 'стихи', 'повод', 'успех', 'выход', 'текст', 'пункт', 'линия', 'среда', 'волос', 'ветер', 'огонь', 'грудь', 'страх', 'сумма', 'сфера', 'мужик', 'немец', 'выбор', 'масса', 'слава', 'кухня', 'отдел', 'товар']
        const words = {
            "ru-RU": ruWords,
            "en-US": enWords,
            "en": enWords,
            "ru": ruWords,
        }
        
        this.wordleApi = new Wordle({
            holder: "#wordle",
            letters: alphabet[store.state.langName] || englishAlphabet,
            words: words[store.state.langName]
        })
        
        const userData = localStorage.getItem('userGameData')
        if (userData) this.wordleApi.userData = JSON.parse(userData)
        
        this.wordleApi.init()

        this.wordleApi.on("win", () => {
            let idx = Math.floor(Math.random() * store.st.lang.logPanel.win.length)
            this.openPanel("<span>" + store.st.lang.logPanel.win[idx] + "</span>")
        })
        this.wordleApi.on("loss", () => {
            let idx = Math.floor(Math.random() * store.st.lang.logPanel.loss.length)
            this.openPanel("<span>" + store.st.lang.logPanel.loss[idx] + "</span>" + `<span>${store.st.lang.logPanel.word_was}: <b>${this.wordleApi.state.word}</b></span>`)
        })
        
    }

    initLogPanel() {
        this.logPanel = document.createElement("div")
        this.logPanel.classList.add("log-panel")
        const content = document.createElement("div")
        content.classList.add("log-panel-content")
        this.logPanel.appendChild(content)
        
        const option = document.createElement("div")
        option.classList.add("log-panel-option")
        const btn = document.createElement("button")
        btn.addEventListener("click", () => {
            this.wordleApi.newGame()
            this.closePanel()
        })
        btn.textContent = store.st.lang.logPanel.btn
        option.appendChild(btn)
        this.logPanel.appendChild(option)
        
        document.body.appendChild(this.logPanel)
    }

    openPanel(content = "") {
        this.logPanel.classList.add("show")
        store.st.app.openOverlay()
        const cont = this.logPanel.querySelector("div")
        if (cont) cont.innerHTML = content

        setTimeout(() => {
            document.addEventListener("click", () => {
                this.closePanel()
                this.wordleApi.newGame()
            }, { once: true })
        }, 10)
    }

    closePanel() {
        store.st.app.closeOverlay()
        this.logPanel.classList.remove("show")
        const cont = this.logPanel.querySelector("div")
        if (cont) cont.innerHTML = ""
    }
    
    saveData() {
        localStorage.setItem("userGameData", JSON.stringify(this.wordleApi.userData))
    }

    exit() {
        this.logPanel.remove()
        this.main.innerHTML = ""
        this.saveData()
    }
}