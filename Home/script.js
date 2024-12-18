
document.addEventListener("DOMContentLoaded", () => {
    const dropArea = document.getElementById("drop-area");
    const fileElem = document.getElementById("fileElem");
    const magnetLinkInput = document.getElementById("magnet-link");
    const startDownloadButton = document.getElementById("start-download");
    const progressContainer = document.getElementById("progress-container");
    const progressBar = document.getElementById("progress-bar");
    const client = new WebTorrent();

    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
    });

    ["dragenter", "dragover"].forEach((eventName) => {
    dropArea.addEventListener(eventName, highlight, false);
    });

    ["dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, unhighlight, false);
    });

    dropArea.addEventListener("drop", handleDrop, false);
    dropArea.addEventListener("click", () => fileElem.click(), false);

    startDownloadButton.addEventListener("click", () => {
    const magnetLink = magnetLinkInput.value;
    if (magnetLink) {
        startDownload(magnetLink); 
    }
    });

    function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
    }

    function highlight() {
    dropArea.classList.add("highlight"); 
    }

    function unhighlight() {
    dropArea.classList.remove("highlight"); 
    }

    function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length) {
        handleFiles(files); 
    }
    }

    function handleFiles(files) {
    const file = files[0];
    if (file && file.name.endsWith(".torrent")) {
        startDownload(file); 
    } else {
        alert("Please drop a valid .torrent file."); 
    }
    }

    function startDownload(file) {
    progressContainer.style.display = 'block'; 
    progressBar.style.width = '0%'; 

    client.add(file, { path: "D:\webtorrent download" }, (torrent) => {
        console.log("Downloading:", torrent.infoHash);
        torrent.on("download", (bytes) => {
            console.log("Downloaded:", bytes);
            console.log("Total downloaded:", torrent.downloaded);
            console.log("Download speed:", torrent.downloadSpeed);

            const progress = (torrent.downloaded / torrent.length) * 100;
            progressBar.style.width = progress + "%";
        });

        torrent.on("done", () => {
            console.log("Download finished:", torrent.name);
            alert(`Download finished: ${torrent.name}`);
            torrent.files.forEach((file) => {
                file.getBlobURL((err, url) => {
                    if (err) throw err;

                    const a = document.createElement("a");
                    a.href = url;
                    a.download = file.name; 
                    document.body.appendChild(a);
                    a.click(); 
                    document.body.removeChild(a); 
                });
            });

            progressBar.style.width = "100%";
        });
    });
}

    function startDownload(magnetLink) {
        progressContainer.style.display = 'block'; 
        progressBar.style.width = '0%'; 

        client.add(magnetLink, (torrent) => {
            console.log('Downloading:', torrent.infoHash);
            torrent.on('download', (bytes) => {
                console.log('Downloaded:', bytes);
                console.log('Total downloaded:', torrent.downloaded);
                console.log('Download speed:', torrent.downloadSpeed);


                const progress = (torrent.downloaded / torrent.length) * 100;
                progressBar.style.width = progress + '%'; 
            });

            torrent.on('done', () => {
                console.log('Download finished:', torrent.name);
                alert(`Download finished: ${torrent.name}`);
                torrent.files.forEach((file) => {
                    file.getBlobURL((err, url) => {
                        if (err) throw err;

                        const a = document.createElement("a");
                        a.href = url;
                        a.download = file.name;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        });
                    });

                progressBar.style.width = '100%'; 
            });
        });
    }
});


