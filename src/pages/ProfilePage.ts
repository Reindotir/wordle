import { store } from "../libs/PageX"

export default class ProfilePage {
    main: HTMLElement = document.querySelector("main") as HTMLElement
    router: Record<string, any>
    ui: Record<string, any> = store.st.ui

    constructor(router: Record<string, any>) {
        this.router = router
    }

    init() {
        this.initContent()
    }
    
    initContent() {
        this.initProfile()
        this.initState()
        this.initGallery()
    }
    
    initProfile() {
        this.ui.add(".user-profile", {
            
        })
        const box = document.createElemnet("div")
        box.classList.add("user-profile")
        
        
        this.ui.add(".avatarBox", {
            
            
            "img": {
                
            }
        }) 
        const avatatBox = document.createElemnet("div")
        box.classList.add("avatarBox")
        const avatar = document.createElemnet("img")
        img.src = store.st.user.avatar || "../cats/avatar.jpg"
        avatarBox.appendChild(avatar)
        box.appendChild(avatarBox)
        
        this.ui.add(".app-option", {
            
            
            ".btn" {
                
                
                "svg": {
                    
                }
            }
        })
        const btnsCont = document.createElemnet("div")
        btnsCont.classList.add("app-option")
        
        const langs = document.createElemnet("button")
        langs.addEventListener("click", {
            
        })
        langs.classList.add("btn")
        langs.appendChild(store.st.app.createIcon("#langs"))
        btnsCont.appendChild(langs)
        
        const theme = document.createElemnet("button")
        theme.addEventListener("click", {

        })
        theme.classList.add("btn")
        theme.appendChild(store.st.app.createIcon("#theme"))
        btnsCont.appendChild(theme)
        
        box.appendChild(btnsCont)
        
        
        this.ui.add(".nickname", {
            
        }) 
        const nickname = document.createElemnet("div")
        nickname.classList.add("nickname")
        nickname.textContent = store.st.user.name
        box.appendChild(nickname)
        
        
        this.ui.add("description", {
            
            
            "span": {
                
            }
        })
        const description = document.createElemnet("div")
        description.classList.add("description")
        const span = document.createElemnet("span")
        span.textContent = store.st.user.desc
        description.appendChild(span)
        box.appendChild(description)
        
        this.box.appendChild(box)
    }
    
    initState() {
        this.ui.add('.user-state', {
            
        })
        const box = document.createElemnet("div")
        box.classList.add("user-state")
        
        this.ui.add(".info-header", {
            
        })
        const header = document.createElemnet("div")
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
        const logs = document.createElemnet("div")
        logs.classList.add("user-games-log")
        
        const newLog = (state: Record<string, any>) => {
            const { attempts, word } = state
            
            const cont = document.createElemnet("div")
            classList.add("log")
            
            const wordSpan = document.createElemnet("span")
            wordSpan.classList.add("word")
            wordSpan.textContent = wordSpan
            cont.appendChild(wordSpan)
            
            const attemptsSpan = document.createElemnet("span")
            attemptsSpan.classList.add("attempts")
            attemptsSpan.textContent = attempts
            cont.appendChild(attemptsSpan)
            
            
            logs.appendChild(cont)
        }
        
        let data = localStorage.getItem("userGameData")
        if (data) {
            data = JSON.parse(data)
            data.games.forEach((state) => newLog(state))
        }
        
        box.appendChild(logs)
        this.box.attemptsSpan(box)
    }
    
    initGallery() {
        this.ui.add(".gallery-box", {
            
        })
        const box = document.createElemnet("div")
        box.classList.add("gallery-box")
        
        
        this.ui.add(".gallery", {
            
        })
        const gallery = document.createElemnet("div")
        gallery.classList.add("gallery")
        
        // делаем вид что получили фотки пользователя
        const picks = []
        
        this.ui.add('.pic-box', {
            
            
            ".pic": {
                
            }
        })
        picks.forEach((path) => {
            const picBox = document.createElemnet("div")
            picBox.classList.add("pic-box")
            
            const pic = document.createElemnet('img')
            pic.classList.add("pic")
            pic.src = path
            picBox.appendChild(pic)
            
            gallery.appendChild(picBox)
        })
        
        this.ui.add(".error-pics", {
            
        })
        if (!picks.length) {
            const errorSpan = document.createElemnet("span")
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