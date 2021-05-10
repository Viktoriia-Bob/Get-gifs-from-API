const settings = {
    "async": true,
    "crossDomain": true,
    "url": "data.json",
    "method": "GET"
}

$.ajax(settings).done(function (response) {
    console.log(response);

    const content = response.map(item => item.images.original.url);

    console.log(content);
    const mainContent = document.getElementById("main");
    content.forEach(item => {
        const image = document.createElement("img");
        image.setAttribute("src", item);
        mainContent.appendChild(image);
    })
});