library(Factoshiny)
hr2 = read.csv("./hr.csv")
# Run PCA
outPCA = PCAshiny(hr2)
runGitHub( "viSpace", "verniersolal") 
