import { shader, Theme, Pack } from "../libs/Shader"
import { Router, store } from "../libs/PageX"

import { Header } from "../comps/header"

export class App {
    async init() {
        this.initState()
        this.initRoutes()
        this.initDesign()
        this.initOverlay()
        await this.initLocales()
        this.initComps()
        
        store.state.router.navigate(location.pathname)
    }

    initOverlay() {
        const ui = store.state.ui
        ui.add("#overlay", {
            zIndex: "3",
            position: "absolute",
            height: '100vh',
            width: '100vw',
            backdropFilter: "blur(10px)",
            display: "none",
            opacity: "0",
            transition: "opacity 0.3s",

            "&.show": {
                opacity: "1",
            }
        })

        const div = document.createElement("div")
        div.classList.add("overlay")
        store.setState({
            overlay: div
        })
        document.body.appendChild(div)
    }

    openOverlay() {
        document.body.appendChild(store.state.overlay)
        setTimeout(() => {
            store.state.overlay.classList.add(".show")
        }, 10)
    }

    closeOverlay() {
        const overlay = document.querySelector("#overlay")
        if (overlay) {
            overlay.classList.remove("show")
            setTimeout(() => overlay.remove, 300)
        }
    }
    
    initState() {
        store.setState({
            app: this,
            router: new Router(),
            shader: shader,
            Theme: Theme,
            Pack: Pack,
            user: {
                avatar: "",
                name: "cat lover ;>"
            }
        })
    }
    
    initRoutes() {
        const router = store.state.router
        
        router.add("/", () => import("../pages/MainPage"))
        router.add("/profile", () => import("../pages/ProfilePage"))
        router.add("/leaders", () => import("../pages/LeadersPage"))
        router.add("/*", () => import("../pages/NotFoundPage"))
    }

    initDesign() {
        this.loadSprite('/html/sprite.html')
        
        store.setState({
            ui: new Theme({
                name: "mainUI",
            })
        })
        store.state.ui.init()
        
        if (!shader.packs.rootPack) this.initColors()

        
        const packs = shader.packs
        
        // выбираю пак стилей с наибольшим приоритетом
        let pack!: Record<string, any>
        for (let name in packs) {
            if (!pack) pack = packs[name]

            if (packs[name].config.priority > pack.config.priority) {
                pack = packs[name]
            }
        }

        pack = new Pack({ pack: pack })
        pack.init()

        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            document.documentElement.classList.add('dark-mode')
        } else {
            document.documentElement.classList.add('light-mode')
        }
        
        const prefer = localStorage.getItem("prefer-class")
        if (prefer) {
            document.documentElement.classList.add(prefer)
        }
    }
    
    initColors() {
        const root = new Theme("root")

        root.add(":root", {
            accent: "0, 122, 255",
            accentHover: "0, 95, 204",

            error: "255, 59, 48",
            success: "52, 199, 89",
            warning: "255, 149, 0",
            grey: "128, 128, 128",
            info: "0, 122, 255",

            white: "255, 255, 255",
            black: "0, 0, 0",

            transition: "cubic-bezier(0.25, 1, 0.5, 1)",
            transitionRe: "cubic-bezier(0.4, 0, 1, 1)",
        }, { toVar: true })

        root.add(".light-mode", {
            color: '0, 0, 0',  
            colorNd: '141, 141, 147',
            colorRd: '141, 141, 147',
            placeholder: '174, 174, 178', 

            bgSite: "242, 242, 247",
            bgSt: '229, 229, 234',
            bgNd: '209, 209, 214',
            bgRd: '199, 199, 204',

            component: '174, 174, 178',  
            componentd: '199, 199, 204',

            border: '216, 216, 220',
            borderNd: "199, 199, 204",
            borderRd: "174, 174, 178",

            opacity: "0.8",
        }, { toVar: true })

        root.add(".dark-mode", {
            color: '255, 255, 255',
            colorNd: '138, 138, 142',
            colorRd: '109, 109, 114',
            placeholder: '142, 142, 147',

            bgSite: '10, 10, 11',
            bgSt: '22, 22, 23',
            bgNd: '44, 44, 46',
            bgRd: '58, 58, 60',  

            component: '72, 72, 74',   
            componentNd: '99, 99, 102',

            border: '58, 58, 60',
            borderNd: '72, 72, 74',
            borderRd: '99, 99, 102',

            opacity: "0.5",
        }, { toVar: true })

        const rootPack = new Pack({
            name: "rootPack",
            themes: [root],
        })

        rootPack.config.priority = 0
        
        shader.savePack(rootPack)
    }
    
    async initLocales() {
        let response = await fetch("langs/en.json")
        let lang = await response.json()
        
        let langName = "ru-RU"
        
        let userChoice = localStorage.getItem("lang")
        if (userChoice) langName = userChoice

        if (langName === "ru-RU") {
            const res = await fetch("langs/ru.json")
            let newLang = await res.json()
            this.deepAssign(lang, newLang)
        }

        store.setState({
            lang: lang,
            langName: langName,
            langs: {
                russian: "ru",
                english: "en",
            },
        })
    }
    
    changeLang(lang: string) {
        if (lang === "auto") {
            localStorage.removeItem("lang")
            return
        }
        
        localStorage.setItem("lang", lang)
        
        location.reload()
    }
    
    initComps() {
        store.setState({
            header: new Header({
                btns: [
                    {
                        content: store.st.lang.leadersPageBtn,
                        href: "/leaders",
                    },
                    {
                        content: store.st.lang.mainPageBtn,
                        href: "/",
                    },
                    {
                        content: store.st.lang.profilePageBtn,
                        href: "/profile"
                    }
                ],
                startIdx: 1,
            })
        })
    }
    
    // просто для глубокого оьновления объектоа
    deepAssign(target: Record<string, any>, source: Record<string, any>) {
        for (let key in source) {
            if (source[key] instanceof Object && !Array.isArray(source[key])) {
                if (!target[key]) {
                    target[key] = {}
                }
                this.deepAssign(target[key], source[key])
            } else {
                target[key] = source[key]
            }
        }
    }

    createIcon(id: string):SVGSVGElement {
        if (id.slice(0, 1) !== "#") id = "#" + id

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        const use = document.createElementNS("http://www.w3.org/2000/svg", "use")

        use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `${id}`)
        svg.classList.add("icon")

        svg.appendChild(use)
        return svg
    }

    loadSprite(path: string) {
        fetch(path)
        .then((response) => response.text())
        .then((data) => {
            const sprite = document.createElement('div')
            sprite.innerHTML = data
            document.body.insertBefore(sprite, document.body.firstChild)
        })
    }
}