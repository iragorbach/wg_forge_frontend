export default (async function () {
func1();
func2();
func3();
}());

function func1() {
    console.log(1);
}

async function func2() {
    await setTimeout(() => {
        console.log(2);
    }, 1000);

    console.log(4);
}

function func3() {
    console.log(3);
}
