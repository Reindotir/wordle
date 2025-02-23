import { store } from "../libs/PageX"

export default class ProfilePage {
    main: HTMLElement = document.querySelector("main") as HTMLElement
    router: Record<string, any>
    ui: Record<string, any> = store.st.ui
    box!: HTMLElement

    constructor(router: Record<string, any>) {
        this.router = router
        store.st.header.focus(2)
    }

    init() {
        this.initContent()
    }
    
    initContent() {
        this.ui.add(".profile-box", {
            display: 'grid',
            width: "100%",
            height: "100%",
            alignItems: 'center',
            gridTemplateAreas: 
            `"profile logs"
             "gallery average"`,
            gap: "1vw",
            gridTemplateRows: "45vh 45vh",
            gridTemplateColumns: "45vw 45vw",
            justifyContent: "center",
        })
        this.ui.add("@media screen and (max-width: 800px)", {
            "main .profile-box": {
                gridTemplateAreas:
                `"profile"
                 "gallery"
                 "logs"
                 "average"`,
                gap: "2vh",
                gridTemplateRows: "auto",
                gridTemplateColumns: "85vw",
            }
        })
        this.box = document.createElement("div")
        this.box.classList.add("profile-box")
        this.main.appendChild(this.box)
        
        this.initProfile()
        this.initState()
        this.initGallery()
        this.initAverage()
    }
    
    initProfile() {
        this.ui.add(".user-profile", {
            gridArea: "profile",
            display: "flex",
            gap: "5px",
            width: "100%",
            height: "auto",
            padding: "5px",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            backgroundColor: "rgb(var(--bg-nd))",
        })
        const box = document.createElement("div")
        box.classList.add("user-profile")
        
        
        this.ui.add(".avatarBox", {
            gridArea: "avatar",
            width: "40%",
            aspectRatio: "1/1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            
            "img": {
                borderRadius: "8px",
                width: "80%",
                height: "80%",
            }
        }) 
        const avatarBox = document.createElement("div")
        avatarBox.classList.add("avatarBox")
        const avatar = document.createElement("img")
        avatar.src = store.st.user.avatar || "../cats/cat_with_laptop.jpg"
        avatarBox.appendChild(avatar)
        box.appendChild(avatarBox)


        this.ui.add(".data-box", {
            width: "50%",
            display: "flex",
            paddingTop: "7%",
            flexDirection: "column",
            height: "100%",
            gap: "2vh",
        })
        const dataBox = document.createElement("div")
        box.appendChild(dataBox)
        dataBox.classList.add("data-box")


        this.ui.add(".nickname", {
            gridArea: "nick",
            fontSize: "200%",
            fontWeight: "bold",
        }) 
        const nickname = document.createElement("div")
        nickname.classList.add("nickname")
        nickname.textContent = store.st.user.name
        dataBox.appendChild(nickname)



        this.ui.add(".app-option", {
            gridArea: "option",
            width: "100%",
            display: "flex",
            alignItems: "canter",
            gap: "10px",
            flexWrap: "wrap",
            
            ".btn": {
                all: "unset",
                cursor: "pointer",
                borderRadius: "8px",
                backgroundColor: "rgb(var(--component))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "5px",
                width: "auto",
                gap: "5px",
                
                "svg": {
                    height: "100%",
                    aspectRatio: "1 / 1",
                }
            }
        })
        const btnsCont = document.createElement("div")
        btnsCont.classList.add("app-option")
        
        this.ui.add(".option-menu", {
            position: "absolute",
            display: "flex",
            borderRadius: "8px",
            width: "200px",
            height: "auto",
            padding: "5px",
            gap: "5px",
            backgroundColor: "rgb(var(--bg-nd))",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            opacity: "0",
            transform: "translateY(-20px)",
            transition: "opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1), transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
            
            "&.show": {
                opacity: "1",
                transform: "translateY(0px)",
            }
        })
        
        this.ui.add(".option-menu-btn", {
            all: "unset",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "5px",
            padding: "3px",
            cursor: "pointer",
            backgroundColor: "rgb(var(--component))",
            width: "100%",
        })
        
        const newMenu = (e): HTMLElement | void=> { 
            const btn = e.target as HTMLElement
            if (document.querySelector(".option-menu")) return

            const menu = document.createElement("div")
            menu.classList.add('option-menu')
            document.body.appendChild(menu)
            
            const rect = btn.getBoundingClientRect()
            menu.style.left = `${rect.left}px`
            menu.style.top = `${rect.bottom + window.scrollY + 10}px`
            menu.classList.add("show")
            
            setTimeout(() => {
                document.addEventListener("click", () => {
                    menu.classList.remove("show")
                    setTimeout(() => menu.remove(), 300)
                }, { once: true })
            }, 10)
            
            return menu
        }
        
        const langs = document.createElement("button")
        langs.addEventListener("click", (e) => {
            const menu = newMenu(e)
            if (!menu) return
            for (const lang in store.st.langs) {
                const btn = document.createElement("button")
                btn.textContent = lang
                btn.classList.add("option-menu-btn")
                btn.addEventListener("click", () => {
                    store.st.app.changeLang(store.st.langs[lang])
                })
                menu.appendChild(btn)
            }
        })
        langs.classList.add("btn")
        langs.appendChild(store.st.app.createIcon("#langs"))
        langs.innerHTML += "<span>" + store.st.lang.option.langs + "</span>"
        btnsCont.appendChild(langs)
        
        const theme = document.createElement("button")
        theme.addEventListener("click", (e) => {
            const menu = newMenu(e)
            if (!menu) return
            const dark = document.createElement("button")
            dark.classList.add("option-menu-btn")
            dark.textContent = store.st.lang.themes.dark
            dark.addEventListener("click", () => {
                localStorage.setItem("prefer-class", "dark-mode")
                location.reload()
            })
            menu.appendChild(dark)
            
            const light = document.createElement("button")
            light.classList.add("option-menu-btn")
            light.textContent = store.st.lang.themes.light
            light.addEventListener("click", () => {
                localStorage.setItem("prefer-class", "light-mode")
                location.reload()
            })
            menu.appendChild(light)
            
            const auto = document.createElement("button")
            auto.classList.add("option-menu-btn")
            auto.textContent = store.st.lang.themes.auto
            auto.addEventListener("click", () => {
                localStorage.removeItem("prefer-class")
                location.reload()
            })
            menu.appendChild(auto)
        })
        theme.classList.add("btn")
        theme.appendChild(store.st.app.createIcon("#theme"))
        theme.innerHTML += "<span>" + store.st.lang.option.theme + "</span>"
        btnsCont.appendChild(theme)
        
        dataBox.appendChild(btnsCont)
        
        
        this.ui.add("description", {
            gridArea: "description",
            maxWidth: "100%",
            maxHeight: "100px",
            border: "1px solid white",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
        })
        const description = document.createElement("div")
        description.classList.add("description")
        const span = document.createElement("span")
        span.textContent = store.st.user.desc
        description.appendChild(span)
        dataBox.appendChild(description)
        
        this.box.appendChild(box)
    }
    
    initState() {
        this.ui.add('.user-state', {
            gridArea: "logs",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "12px",
            backgroundColor: "rgb(var(--bg-nd))",
            height: "45vh",
            maxHeight: "100%",
            width: "100%",
            padding: "5px",
        })
        const box = document.createElement("div")
        box.classList.add("user-state")
        
        this.ui.add(".info-header", {
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px",
            fontSize: "125%",
            fontWeight: "bold",
        })
        const header = document.createElement("div")
        header.classList.add("info-header")
        header.innerHTML = `<span>${store.state.lang.profile.logsHeaderName}</span>`
        box.appendChild(header)
        
        
        this.ui.add(".user-games-log", {
            backgroundColor: "rgb(var(--bg-st))",
            width: "100%",
            height: "100%",
            maxHeight: "60vh",
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            borderRadius: "8px",
            gap: "3vh",
            padding: "5px",
            
            ".log": {
                width: "100%",
                height: "2vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0px 5px",
                
                ".word": {
                    fontSize: "110%",
                },
                
                ".attempts": {
                    fontSize: "110%",
                },
            },
            
            "> span": {
                fontWeight: "bold",
                fontSize: "130%",
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
        let parsedData
        if (data) {
            parsedData = JSON.parse(data) as { games?: any[] }
            parsedData.games?.forEach((state) => newLog(state))
        }
        
        if (parsedData && !parsedData.games.length) {
            const errorSpan = document.createElement("span")
            errorSpan.textContent = store.st.lang.profile.logsError
            logs.appendChild(errorSpan)
        }
        
        box.appendChild(logs)
        this.box.appendChild(box)
    }
    
    initGallery() {
        this.ui.add(".gallery-box", {
            gridArea: "gallery",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "12px",
            backgroundColor: "rgb(var(--bg-nd))",
            width: "100%",
            height: "100%",
            padding: "5px",
        })
        const box = document.createElement("div")
        box.classList.add("gallery-box")
        
        
        this.ui.add(".gallery-header", {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px",
            fontSize: "120%",
            fontWeight: "bold",
        })
        const header = document.createElement("div")
        header.classList.add("gallery-header")
        header.innerHTML = `<span>${store.st.lang.profile.galleryHeader}</span>`
        box.appendChild(header)
        
        this.ui.add(".gallery", {
            maxWidth: "100%",
            height: "100%",
            padding: "15px",
            overflowX: "auto",
            overflowY: "hidden",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "row",
            backgroundColor: "rgb(var(--bg-st))",
            alignItems: "center",
            gap: "2vw",
        })
        const gallery = document.createElement("div")
        gallery.classList.add("gallery")
        
        // делаем вид что получили фотки пользователя
        const picks = [
            "../cats/action_cat.jpg",
            "../cats/meow.jpg",
            "../cats/omg_cat.jpg",
            "../cats/scary.jpg",
            "../cats/working.gif",
        ]
        
        this.ui.add('.pic-box', {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px",
            
            ".pic": {
                aspectRatio: '1/1',
                width: "25vw",
                maxHeight: "90%",
                borderRadius: "8px",
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
            fontSize: "125%"
        })
        if (!picks.length) {
            const errorSpan = document.createElement("span")
            errorSpan.classList.add("error-pics")
            errorSpan.textContent = store.state.lang.profile.noPicks
            gallery.appendChild(errorSpan)
        }
        
        box.appendChild(gallery)
        this.box.appendChild(box)
    }
    
    initAverage() {
        this.ui.add(".average-box", {
            gridArea: "average",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            padding: "5px",
            borderRadius: "12px",
            backgroundColor: "rgb(var(--bg-nd))"
        })
        const averageBox = document.createElement("div")
        averageBox.classList.add("average-box")
        
        this.ui.add(".average-header", {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px",
            fontSize: "120%",
            fontWeight: "bold",
            width: "100%",
            height: "auto",
        })
        const averageHeader = document.createElement('div')
        averageHeader.classList.add("average-header")
        averageHeader.textContent = store.st.lang.average.header
        
        this.ui.add(".average-content", {
            width: "100%",
            height: "100%",
            display: "flex",
            borderRadius: "8px",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px",
            fontWeight: "bold",
            fontSize: "150%",
            backgroundColor: "rgb(var(--bg-st))",
            
            "span": {
                fontSize: "200%",
                fontWeight: "bolder",
            }
        })
        
        let value = 0
        
        let data = localStorage.getItem('userGameData')
        if (data) {
            data = JSON.parse(data)
            value = data.games.reduce((sum, obj) => sum + obj.attempts, 0) / data.games.length
        }
        
        const averageContent = document.createElement('div')
        averageContent.textContent = value
        averageContent.classList.add("average-content")
        
        averageBox.appendChild(averageHeader)
        averageBox.appendChild(averageContent)
        this.box.appendChild(averageBox)
    }

    exit() {
        this.main.innerHTML = ""
    }
}