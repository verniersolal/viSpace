class Chart2D extends Chart {

    constructor(title, size, position, xAxe, yAXe) {
        super(title, size, position);
        this.xAxe = xAxe
        this.yAxe = yAXe;
    }

    getXAxe() {
        return this.xAxe;
    }

    getYAxe(){
        return this.yAxe;
    }

    setXAxe(other){
        this.xAxe=other;
    }

    setYAxe(other){
        this.yAxe=other;
    }
}