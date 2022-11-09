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

gameJs.newGame = () => {
    let game = {}

    // Properties
    game.domElement = document.createElement("canvas")
    game.timer = 0
    game.helper = {}
    game.mouse = {
        position: {}
    }
    game.vars = {}
    game.sprites = {}
    game.sprites.sprites = []
    game.settings = {
        autoResize: true,
        dimensions: "2d"
    }
    game.vector2 = {} // Second dimension
    game.vector3 = {} // Third dimension

    // Service properties
    game.__events = {}
    game.__ctx = game.domElement.getContext("2d")
    game.__keyBinds = {}

    // Starters
    game.domElement.width = window.innerWidth
    game.domElement.height = window.innerHeight

    // Methods
    game.wait = (ms) => {
        let start = new Date().getTime()
        while (true) {
            if ((new Date().getTime() - start) >= ms) {
                break;
            }
        }
    }
    game.sepThread = (fn) => {
        setTimeout(() => fn(), 0)
    }
    game.vector2.new = (x, y) => {
        let table = {
            x,
            y
        }
        return table
    }
    game.vector3.new = (x, y, z) => {
        let table = {
            x,
            y,
            z
        }
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
    game.helper.degToRad = (deg) => {
        let rad = (deg * Math.PI) / 180
        return rad
    }
    game.helper.radToDeg = (rad) => {
        let deg = rad * 180 / Math.PI
        return deg
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
    game.sprites.new = () => {
        let sprite = {}
        sprite.costumes = []
        sprite.costumes.push("https://seeklogo.com/images/S/scratchcat-logo-8C25C25983-seeklogo.com.png")

        sprite.motion = {
            position: game.vector2.new(0, 0),
            direction: 0
        }
        sprite.looks = {
            layer: game.sprites.sprites.length,
            costume: 1,
            size: 100,
            show: true
        }
        sprite.sound = {}
        sprite.events = {}
        sprite.control = {}
        sprite.sensing = {}
        sprite.operators = {}
        sprite.var = {}

        //----------------------------------------//
        sprite.__getTargetXY = (targetName) => {
            let targetX = 0;
            let targetY = 0;
            if (targetName === 'mouse') {
                targetX = game.mouse.position.x
                targetY = game.mouse.position.y
            } else if (targetName === 'random') {
                const stageWidth = game.domElement.width;
                const stageHeight = game.domElement.height;
                targetX = Math.round(stageWidth * (Math.random() - 0.5));
                targetY = Math.round(stageHeight * (Math.random() - 0.5));
            } else {
                // targetName = Cast.toString(targetName);
                // const goToTarget = this.runtime.getSpriteTargetByName(targetName);
                // if (!goToTarget) return;
                // targetX = goToTarget.x;
                // targetY = goToTarget.y;
            }
            return {
                x: targetX,
                y: targetY
            };
        }
        sprite.__glide = (secs, x, y) => {

        }
        //----------------------------------------//

        sprite.motion.moveSteps = (x) => {
            const radians = game.helper.degToRad(0 - sprite.motion.direction)
            const dx = x * Math.cos(radians)
            const dy = x * Math.sin(radians)
            // util.target.setXY(sprite.motion.position.x + dx, sprite.motion.position.y + dy)
            sprite.motion.position.x = sprite.motion.position.x + dx
            sprite.motion.position.y = sprite.motion.position.y + dy
        }
        sprite.motion.goto = (target) => {
            target = sprite.__getTargetXY(target)
            sprite.motion.position = game.vector2.new(target.x, target.y)
        }
        sprite.motion.gotoXY = (x, y) => {
            sprite.motion.position = game.vector2.new(x, y)
        }
        sprite.motion.pointTowards = (target) => {
            let targetX = 0
            let targetY = 0
            if (target === "mouse") {
                targetX = game.mouse.position.x
                targetY = game.mouse.position.y
            } else if (target === "random") {
                sprite.motion.direction = Math.round(Math.random() * 360) - 180
                return;
            } else {}
            targetX = targetX - sprite.motion.position.x
            targetY = targetY - sprite.motion.position.y
            const direction = Math.atan2(targetY, targetX)/Math.PI*180
            sprite.motion.direction = (360+Math.round(direction))%360
        }

        game.sprites.sprites.push(sprite)

        return sprite
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
        if (game.settings.autoResize) {
            game.domElement.width = window.innerWidth
            game.domElement.height = window.innerHeight
        }

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

    // Handler
    game.on("__renderFrame", () => {
        for (let sprite of game.sprites.sprites) {
            if (sprite.looks.show) {
                let img = document.createElement("img")
                // img.crossOrigin="anonymous"
                img.src = sprite.costumes[sprite.looks.costume - 1]
                game.__ctx.translate(sprite.motion.position.x, sprite.motion.position.y)
                game.__ctx.rotate(game.helper.degToRad(sprite.motion.direction))
                game.__ctx.drawImage(img, sprite.looks.size * -0.5, sprite.looks.size * -0.5, sprite.looks.size, sprite.looks.size)
                game.__ctx.resetTransform()
            }
        }
    })
    game.on("heartbeat", () => {
        game.__ctx.fillStyle = "#ffffff"
        game.__ctx.translate(0.5, 0.5)
        game.__ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
        game.emit("__renderFrame")
    })


    return game
}