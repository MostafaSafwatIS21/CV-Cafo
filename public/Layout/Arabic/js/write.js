
function toggleDivs() {
    var firstDiv = document.getElementById('firstDiv');
    var secondDiv = document.getElementById('secondDiv');
    var basebtn = document.getElementById('basebtn');

    if (firstDiv.style.display !== 'none') {
        firstDiv.style.display = 'none';
        basebtn.style.display = 'none';
        secondDiv.style.display = 'block';
    } else {
        firstDiv.style.display = 'block';
        basebtn.style.display = 'block';
        secondDiv.style.display = 'none';
    }
}


function toggleDivs1() {
    var firstDiv = document.getElementById('firstDiv');
    var thirdDiv = document.getElementById('thirdDiv');
    var basebtn = document.getElementById('basebtn');

    if (firstDiv.style.display !== 'none') {
        firstDiv.style.display = 'none';
        basebtn.style.display = 'none';
        thirdDiv.style.display = 'block';
    } else {
        firstDiv.style.display = 'block';
        basebtn.style.display = 'block';
        thirdDiv.style.display = 'none';
    }
}
























  