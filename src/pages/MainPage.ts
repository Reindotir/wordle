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
    }

    init() {
        this.initUI()
        this.initContent()
        this.initLogPanel()
    }

    initUI() {
        const offEnv = this.ui.env("main")

        this.ui.add(".wordleBox", {
            width: 'auto',
            height: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        })

        this.ui.add(".log-panel", {
            position: "absolute",
            width: "40%",
            height: "30%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: "0",
            transform: "translateY(-20px)",
            transition: "opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1), transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",

            "&.show": {
                opacity: "1",
                transform: "translateY(0px)",
            }
        })

        offEnv()
    }

    initContent() {
        this.box = document.createElement("div")
        this.box.classList.add("wordleBox")
        this.main.appendChild(this.box)

        this.wordle = document.createElement("div")
        this.wordle.setAttribute("id", "wordle")
        this.box.appendChild(this.wordle)

        const englishAlphabet = "qwertyuiopasdfghjklzxcvbnm".split("")
        const russianAlphabet = "йцукенгшщзфывапролдячсмить".split("")

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
        
        const winTxts = [
            "Ухухуэ я бы не угадал, молодец!!", 
            "хорошо, теперь еще одна игра.",
            "Как ты это делаешь?",
            "КРУТА ТОП НУ ТЫ ВАШЕ КАК ПРОСТО",
        ]
        
        const lossTxts = [
            "Ну и ладно, зато ты красивый",
            "Представь как было бы скусно без проигрышей",
            "Может посмотришь в консоль? ТОЛЬКО ТССС",
            "Ладно, хорошо, круто, весело, прикольно."
        ]

        this.wordleApi.on("win", () => {
            let idx = Math.floor(Math.random() * winTxts.length)
            this.opnePanel(winTxts[idx])
        })
        this.wordleApi.on("loss", () => {
            let idx = Math.floor(Math.random() * lossTxts.length)
            this.opnePanel(lossTxts[idx])
        })
    }

    initLogPanel() {
        this.logPanel = document.createElement("div")
        this.logPanel.classList.add("log-panel")
        document.body.appendChild(this.logPanel)
    }

    openPanel(content = "") {
        this.logPanel.classList.add("show")
        this.logPanel.innerHTML = content
    }

    closePanel() {
        this.logPanel.classList.remove("show")
    }

    exit() {
        this.logPanel.remove()
        this.main.innerHTML = ""

        localStorage.setItem("userGameData", JSON.stringify(this.wordleApi.userData))
    }
}