var loadCount = 0;

function createField(content, id) {
    if (!content) return;
    var searchContent = "";
    if (location.search) {
        searchContent = decodeURI(getSearchValue("content"));
        if (searchContent)
            if (content.search(searchContent) < 0)
                content = "";
            else
                content = content.replace(new RegExp(searchContent, "g"), `<span class="search-content">${searchContent}</span>`);
    }
    if (!content) return;
    var field = document.createElement("div"),
        contentContainer = document.createElement("div"),
        buttonContainer = document.createElement("div"),
        commentButton = document.createElement("input");
    field.className = "field";
    contentContainer.innerHTML = content.replace(/\n/g, "<br>");
    commentButton.type = "button";
    commentButton.value = "評論";
    commentButton.onclick = function() {
        window.open("https://www.facebook.com/" + id);
    }
    buttonContainer.className = "button-container";
    buttonContainer.appendChild(commentButton);
    field.appendChild(contentContainer);
    field.appendChild(buttonContainer);
    document.querySelector(".container").insertBefore(
        field,
        document.querySelector(".loading").parentNode
    );
}

function getData(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url);
    xhr.onload = function() {
        var data = JSON.parse(this.response);
        callback(data);
    };
    xhr.send();
}

function getFbData() {
    var url = "https://graph.facebook.com/1961795094104661/feed?fields=from,message&limit=10",
        token = "&access_token=EAAEAhFsvEQIBAFrTHXMYfZBleKjrTUZBZAmyUFyoeraXQxpc7NDZA1fna0ZAHV3PLh1ugec8OLPzgeiAL0FH7vZCoRWfZC1SZCUT9PVX9c10Ldl7PZBECIha4yS3uo9woQAhcVGUQPrn9GRihwp4Urkmmzj9v4CTxIZCbSXx2mDpoO4wZDZD",
        fetcher = function (data) {
            for (var i = 0; i < data.data.length; i++) {
                var d = data.data[i],
                    id = d.id,
                    message = d.message;
                createField(message, id);
                loadCount++;
            }
            document.querySelector(".loading").innerHTML = `正在載入...(已讀取${loadCount}篇)`;
            if (data.paging && data.paging.next)
                return getData(data.paging.next, fetcher);
            else
                document.querySelector(".loading").parentNode.style.display = "none";
        };
    getData(url + token, fetcher);
}

function contentFilter() {
    var showFieldRule = `[data-search~=${location.hash.replace("#", "")}]`,
        showField = document.querySelectorAll(showFieldRule),
        hideField = document.querySelectorAll(`.field:not(${showFieldRule})`);
    for (var i = 1; i < hideField.length; i++)
        hideField[i].style.display = "none";
    for (var i = 0; i < showField.length; i++)
        showField[i].style.display = "";
}

function headerSwitch(open) {
    if (open == undefined)
        open = document.querySelector("header").style.height != "100px";
    document.querySelector("header").style.height = open ? "100px" : "";
}
window.addEventListener("hashchange", contentFilter);
document.querySelector(".searchButton").addEventListener("click", function() {
    headerSwitch();
});
window.addEventListener("resize", function() {
    if (document.body.clientWidth > 540)
        headerSwitch(false);
});
getFbData();