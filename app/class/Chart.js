class Chart {

    title = "";
    size = 0;
    position = 0;

    constructor(title, size, position) {
        this.title = title;
        this.size = size;
        this.position = position;
    }

    getSize() {
        return this.size
    }

    getPosition() {
        return this.position
    }

    getTitle() {
        return this.title;
    }

    setSize(size) {
        this.size = size
    }

    setPosition(pos) {
        this.position = pos;
    }

    setTitle(title) {
        this.title = title;
    }

}