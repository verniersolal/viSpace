class Chart2D extends Chart {
    xAxe = new Axe();
    yAxe = new Axe();

    constructor(title, size, position, xAxe, yAxe) {
        super(title, size, position);
        this.xAxe = xAxe;
        this.yAxe = yAxe;
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