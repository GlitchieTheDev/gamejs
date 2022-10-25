// class Game {
//     constructor (dimensions) {
//         this.dimensions = dimensions
//         this.domElement = document.createElement("canvas")
//         this.__events = {}
//         this.__ctx = this.domElement.getContext(dimensions)
//     }

//     on(event, callback) {
//         /*
//         __events = {
//             heartbeat: [callbacks]
//         }
//         */
//         if (this.__events[event]) {
//             this.__events[event].push(callback)
//         } else {
//             this.__events[event] = [callback]
//         }
//     }

//     start(callback) {
//         if (callback) callback()
//         function frame() {
//             console.log(this.__events["heartbeat"])
//             if (this.__events["heartbeat"]) {
//                 for (let i = 0; i < this.__events["heartbeat"].length; i++) {
//                     console.log(i)
//                     this.__events["heartbeat"][i]()
//                 }
//             }

//             requestAnimationFrame(frame)
//         }

//         frame()
//         // return frame
//     }
// }

let gameJs = {}

gameJs.newGame = (dimensions) => {
    let game = {}

    // Properties
    game.dimensions = dimensions
    game.domElement = document.createElement("canvas")
    game.elements = {}
    game.timer = 0
    game.mouse = {
        position: {}
    }
    game.vars = {}
    game.vector2 = {} // Second dimension
    game.vector3 = {} // Third dimension

    // Service properties
    game.__events = {}
    game.__ctx = game.domElement.getContext("2d")
    game.__keyBinds = {}

    game.__ctx.translate(0.5, 0.5)

    // Starters
    game.domElement.width = window.innerWidth
    game.domElement.height = window.innerHeight

    // Methods
    game.vector2.new = (x,y) => {
        let table = {x,y}
        return table
    }
    game.vector3.new = (x,y,z) => {
        let table = {x,y,z}
        return table
    }
    game.on = (event, callback) => {
        if (game.__events[event]) {
            game.__events[event].push(callback)
        } else {
            game.__events[event] = [callback]
        }
    }
    game.emit = (event, ...args) => {
        if (game.__events[event]) {
            for (let i = 0; i < game.__events[event].length; i++) {
                // console.log(i)
                game.__events[event][i](...args)
            }
        }
    }
    game.start = () => {
        game.emit("start")

        function frame() {
            // console.log(game.__events["heartbeat"])
            game.emit("heartbeat")
            game.timer += 1

            requestAnimationFrame(frame)
        }

        frame()
    }
    game.keyBind = (key, callback) => {
        if (game.__keyBinds[key]) {
            game.__keyBinds[key].push(callback)
        } else {
            game.__keyBinds[key] = [callback]
        }
    }
    game.elements.new = (id) => {
        let elem = "newGameJs" + id + "Element"

        return elem
    }
    game.mouse.hide = () => {
        game.domElement.style.cursor = "none"
    }
    game.mouse.show = () => {
        game.domElement.style.cursor = "default"
    }
    game.mouse.lock = () => {
        game.domElement.requestPointerLock()
    }
    game.mouse.unlock = () => {
        game.domElement.exitPointerLock()
    }

    // Listeners
    document.addEventListener("keydown", (e) => {
        console.log(e.key.toUpperCase())
        if (game.__keyBinds[e.key.toUpperCase()]) {
            for (let i = 0; i < game.__keyBinds[e.key.toUpperCase()].length; i++) {
                game.__keyBinds[e.key.toUpperCase()][i]()
            }
        }
    })
    window.addEventListener("resize", () => {
        // renderer.setSize(window.innerWidth, window.innerHeight)
        // camera.aspect = window.innerWidth / window.innerHeight
        // camera.updateProjectionMatrix()
        game.domElement.width = window.innerWidth
        game.domElement.height = window.innerHeight

    })
    document.addEventListener("mousemove", (e) => {
        game.mouse.position.x = e.pageX
        game.mouse.position.y = e.pageY
    })
    game.domElement.addEventListener("click", (e) => {
        game.emit("focus", e)
    })
    document.addEventListener('focus', (event) => {
        event.target.style.background = 'pink';
      });
    return game
}
