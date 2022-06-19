export class Draggable {
    // make an element draggable, and set its initial position
    constructor (elem, x, y) {
        this.elem = elem;
        this.isMouseDown = false;
        this.mousedownHandler = e => {
            if (e.button == 0) {
                e.preventDefault();
                this.isMouseDown = true;
            }
        };

        this.mouseupHandler = e => {
            this.isMouseDown = false;
        }

        this.mousemoveHandler = e => {
            if (this.isMouseDown) 
                this.setPos(this.x + e.movementX, this.y + e.movementY);
        }

        this.elem.addEventListener("mousedown", this.mousedownHandler);
        document.addEventListener("mousemove", this.mousemoveHandler);
        document.addEventListener("mouseup", this.mouseupHandler);

        this.setPos(x, y);
    }

    // set draggable element position
    setPos(x, y) {
        this.x = x;
        this.y = y;
        this.syncPos();
    }

    // internal function (make element position match set position)
    syncPos() {
        this.elem.style.left = `${this.x}px`;
        this.elem.style.top = `${this.y}px`;
    }

    // remove element draggability
    remove() {
        this.elem.removeEventListener("mousedown", this.mousedownHandler);
        document.removeEventListener("mousemove", this.mousemoveHandler);
        document.removeEventListener("mouseup", this.mouseupHandler);
    }
}