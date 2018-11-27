class CloudPoint extends Chart2D {
    xAxe = new Axe();
    yAxe = new Axe();

    constructor(title, size, position, xAxe, yAxe) {
        super(title, size, position, xAxe, yAxe);
    }

    drawCloudPoint() {
        super.getXAxe();
        super.getYAxe();
    }
}