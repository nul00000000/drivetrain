var Robot = (function () {
    function Robot(divID) {
        this.gas = 0;
        this.turning = 0;
        this.keyAxisX = 0;
        this.keyAxisY = 0;
        this.gamepad = null;
        this.x = 0;
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
        this.a = 3.1415926 / 2;
        this.da = 0;
        this.wheelAngle = 0;
        this.div = document.getElementById(divID);
    }
    Robot.prototype.claimGamePad = function (event) {
        if (this.gamepad == null) {
            this.gamepad = event.gamepad;
        }
    };
    Robot.prototype.removeGamePad = function (event) {
        this.gamepad = null;
    };
    Robot.prototype.keyDown = function (event) {
        if (!event.repeat) {
            if (event.code == "KeyW") {
                this.keyAxisY += 1;
            }
            if (event.code == "KeyA") {
                this.keyAxisX -= 1;
            }
            if (event.code == "KeyS") {
                this.keyAxisY -= 1;
            }
            if (event.code == "KeyD") {
                this.keyAxisX += 1;
            }
            if (event.code == "ArrowLeft") {
                this.turning += 1;
            }
            if (event.code == "ArrowRight") {
                this.turning -= 1;
            }
        }
    };
    Robot.prototype.keyUp = function (event) {
        if (!event.repeat) {
            if (event.code == "KeyW") {
                this.keyAxisY -= 1;
            }
            if (event.code == "KeyA") {
                this.keyAxisX += 1;
            }
            if (event.code == "KeyS") {
                this.keyAxisY += 1;
            }
            if (event.code == "KeyD") {
                this.keyAxisX -= 1;
            }
            if (event.code == "ArrowLeft") {
                this.turning -= 1;
            }
            if (event.code == "ArrowRight") {
                this.turning += 1;
            }
        }
    };
    Robot.prototype.update = function (delta) {
        this.gas = 0;
        if (this.gamepad == null) {
            if (this.keyAxisX != 0 || this.keyAxisY != 0) {
                this.gas = 0.1;
                if (this.keyAxisY == 0) {
                    this.wheelAngle = -this.keyAxisX * 3.1415926 / 2;
                }
                else if (this.keyAxisX == 0) {
                    this.wheelAngle = (1 - this.keyAxisY) / 2 * 3.1415926;
                }
                else {
                    this.wheelAngle = -this.keyAxisX * 3.1415926 / 2;
                    if (this.keyAxisY == 1) {
                        this.wheelAngle *= 0.5;
                    }
                    else {
                        this.wheelAngle *= 1.5;
                    }
                }
            }
        }
        else {
            var sx = this.gamepad.axes[1];
            var sy = this.gamepad.axes[0];
            this.wheelAngle = Math.atan2(-sy, -sx);
            this.gas = (sx * sx + sy * sy) * 0.3;
            this.turning = this.gamepad.axes[2];
        }
        this.da += this.turning * 0.4 * delta;
        this.dx += 0.3 * this.gas * delta * Math.cos(this.a + this.wheelAngle);
        this.dy += 0.3 * this.gas * delta * Math.sin(this.a + this.wheelAngle);
        this.dx *= 0.9;
        this.dy *= 0.9;
        this.da *= 0.9;
        this.x += this.dx;
        this.y += this.dy;
        this.a += this.da;
        this.div.style.left = ((this.x + 1) * 50) + "vw";
        this.div.style.bottom = ((this.y + 1) * 50 - 35) + "vw";
        this.div.style.transform = "translate(-50%, -50%) rotate(" + (-this.a * 180 / 3.1415926) + "deg)";
    };
    return Robot;
}());
var robot;
var lastTime = 0;
function onLoad() {
    robot = new Robot("robot");
    document.addEventListener("keydown", function (event) { return robot.keyDown(event); });
    document.addEventListener("keyup", function (event) { return robot.keyUp(event); });
    window.addEventListener("gamepadconnected", function (event) { return robot.claimGamePad(event); });
    window.addEventListener("gamepaddisconnected", function (event) { return robot.removeGamePad(event); });
    window.requestAnimationFrame(loop);
}
function loop(time) {
    robot.update((time - lastTime) / 1000);
    lastTime = time;
    window.requestAnimationFrame(loop);
}
