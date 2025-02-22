import { store } from "../libs/PageX"

export default class ProfilePage {
    main: HTMLElement = document.querySelector("main") as HTMLElement
    router: Record<string, any>
    ui: Record<string, any> = store.st.ui
    box!: HTMLElement

    constructor(router: Record<string, any>) {
        this.router = router
    }

    init() {
        this.initContent()
    }
    
    initContent() {
        this.ui.add(".profile", {
            
        })
        this.box = document.createElement("div")
        this.box.classList.add("profile")
        this.main.appendChild(this.box)
        
        this.initProfile()
        this.initState()
        this.initGallery()
    }
    
    initProfile() {
        this.ui.add(".user-profile", {
            
        })
        const box = document.createElement("div")
        box.classList.add("user-profile")
        
        
        this.ui.add(".avatarBox", {
            
            
            "img": {
                
            }
        }) 
        const avatarBox = document.createElement("div")
        avatarBox.classList.add("avatarBox")
        const avatar = document.createElement("img")
        avatar.src = store.st.user.avatar || "../cats/avatar.jpg"
        avatarBox.appendChild(avatar)
        box.appendChild(avatarBox)
        
        
        this.ui.add(".rightCont", {
            
        })
        const rightBox = document.createElement("div")
        rightBox.classList.add("rightCont")
        
        this.ui.add(".app-option", {
            
            
            ".btn": {
                
                
                "svg": {
                    
                }
            }
        })
        const btnsCont = document.createElement("div")
        btnsCont.classList.add("app-option")
        
        const langs = document.createElement("button")
        langs.addEventListener("click", () => {
            
        })
        langs.classList.add("btn")
        langs.appendChild(store.st.app.createIcon("#langs"))
        btnsCont.appendChild(langs)
        
        const theme = document.createElement("button")
        theme.addEventListener("click", () => {

        })
        theme.classList.add("btn")
        theme.appendChild(store.st.app.createIcon("#theme"))
        btnsCont.appendChild(theme)
        
        rightBox.appendChild(btnsCont)
        
        
        this.ui.add(".nickname", {
            
        }) 
        const nickname = document.createElement("div")
        nickname.classList.add("nickname")
        nickname.textContent = store.st.user.name
        rightBox.appendChild(nickname)
        
        box.appendChild(rightBox)
        
        
        this.ui.add("description", {
            
            
            "span": {
                
            }
        })
        const description = document.createElement("div")
        description.classList.add("description")
        const span = document.createElement("span")
        span.textContent = store.st.user.desc
        description.appendChild(span)
        box.appendChild(description)
        
        this.box.appendChild(box)
    }
    
    initState() {
        this.ui.add('.user-state', {
            
        })
        const box = document.createElement("div")
        box.classList.add("user-state")
        
        this.ui.add(".info-header", {
            
        })
        const header = document.createElement("div")
        header.classList.add("info-header")
        header.textContent = store.state.lang.profile.logsHeaderName
        box.appendChild(header)
        
        
        this.ui.add("user-games-log", {
            
            
            ".log": {
                
                
                ".word": {
                    
                },
                
                ".attempts": {
                    
                }
            }
        })
        const logs = document.createElement("div")
        logs.classList.add("user-games-log")
        
        const newLog = (state: Record<string, any>) => {
            const { attempts, word } = state
            
            const cont = document.createElement("div")
            cont.classList.add("log")
            
            const wordSpan = document.createElement("span")
            wordSpan.classList.add("word")
            wordSpan.textContent = word
            cont.appendChild(wordSpan)
            
            const attemptsSpan = document.createElement("span")
            attemptsSpan.classList.add("attempts")
            attemptsSpan.textContent = attempts
            cont.appendChild(attemptsSpan)
            
            
            logs.appendChild(cont)
        }
        
        let data = localStorage.getItem("userGameData")
        if (data) {
            let parsedData = JSON.parse(data) as { games?: any[] }
            parsedData.games?.forEach((state) => newLog(state))
        }

        
        box.appendChild(logs)
        this.box.appendChild(box)
    }
    
    initGallery() {
        this.ui.add(".gallery-box", {
            
        })
        const box = document.createElement("div")
        box.classList.add("gallery-box")
        
        
        this.ui.add(".gallery", {
            
        })
        const gallery = document.createElement("div")
        gallery.classList.add("gallery")
        
        // делаем вид что получили фотки пользователя
        const picks = []
        
        this.ui.add('.pic-box', {
            
            
            ".pic": {
                
            }
        })
        picks.forEach((path) => {
            const picBox = document.createElement("div")
            picBox.classList.add("pic-box")
            
            const pic = document.createElement('img')
            pic.classList.add("pic")
            pic.src = path
            picBox.appendChild(pic)
            
            gallery.appendChild(picBox)
        })
        
        this.ui.add(".error-pics", {
            
        })
        if (!picks.length) {
            const errorSpan = document.createElement("span")
            errorSpan.classList.add("error-pics")
            errorSpan.textContent = store.state.lang.profile.noPics
        }
        
        box.appendChild(gallery)
        this.box.appendChild(box)
    }

    exit() {
        this.main.innerHTML = ""
    }
}