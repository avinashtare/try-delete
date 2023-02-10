
let DataLoading = false;
let prevent = {
    text: "",
    start: 0
}

async function requestImage(query) {
    ShowLoader(true)
    let url = "/ai";
    var query = JSON.stringify(query);

    let response = await fetch(
        url,
        {
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            method: "POST",
            body: query
        });

    response = await response.json()
    return response
}


function ShowLoader(load) {
    let loading = document.getElementById("loading")
    if (load) {
        loading.classList.add("gird")
        loading.classList.remove("hide")
        DataLoading = true
    }
    else {
        loading.classList.add("hide")
        loading.classList.remove("gird")
        DataLoading = false
    }
}
// set laoded image
async function setLoadData(data) {
    let realData = data

    data.base64 = []
    for (value of data.result) {
        let loadImage = new Image()
        loadImage.src = value
        loadImage.crossOrigin = "anonymous";

        loadImage.onload = function () {
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            canvas.width = loadImage.width;
            canvas.height = loadImage.height;

            ctx.drawImage(loadImage, 0, 0);

            var dataURL = canvas.toDataURL("image/jpeg");
            data.base64.push(dataURL);

            if (data.base64.length == data.result.length) {
                drawNewGallery(data)
                ShowLoader(false)
            }
        };
    }

    function drawNewGallery(data) {
        let results = document.getElementById("results")

        let newElem = document.createElement("div")
        newElem.className = "grid gap-2 mb-6 md:grid-cols-3"

        let htmlData = ``;
        for (let i =0;i<data.base64.length;i++) {
            if(data.resultNsfwDetected[i]){
                htmlData += `
                <div class="single-img adult">
                <img class="h-auto"
                src="${data.base64[i]}"
                alt="image description">
                </div>
                `
            }
            else{
                htmlData += `
                <div class="single-img">
                <img class="h-auto"
                src="${data.base64[i]}"
                alt="image description">
                </div>
                `
            }
        }
        newElem.innerHTML = htmlData;
        results.insertBefore(newElem, results.firstChild)
    }
};

// click on button
let btn = document.getElementById("btn");
document.getElementById("search_query").focus()
btn.addEventListener("click", async (e) => {
    e.preventDefault()
    if (DataLoading == false) {
        let search = document.getElementById("search_query");
        let searchValue = search.value;

        // search query iamges

        if (search.value.length > 0) {

            let query
            if (search.value == prevent.text) {
                query = { query: searchValue, numberOfImages: 3, start: prevent.start };
            }
            else {
                prevent.start = 0;
                query = { query: searchValue, numberOfImages: 3, start: prevent.start };
            }
            let imagesData = requestImage(query);

            let data = await imagesData;

            console.log(data)

            // set prevent value
            prevent.text = search.value;
            prevent.start = data.next % 9;
            // send data for laod image 
            setLoadData(data)
        }
    }
})