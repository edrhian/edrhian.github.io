class PlayArea {
    constructor(height, width, friction) {
        this.height = height;
        this.width = width;
        this.element = this.build();
        this.ctx = this.element.getContext("2d");
        this.friction = friction;
    };

    build() {
        const canvas = document.createElement("canvas");
        canvas.height = this.height;
        canvas.width = this.width;
        return canvas;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
}


export default PlayArea;
