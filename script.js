// script.js

document.addEventListener("DOMContentLoaded", () => {
    const dropArea = document.getElementById("drop-area");
    const fileElem = document.getElementById("fileElem");
    const magnetLinkInput = document.getElementById("magnet-link");
    const startDownloadButton = document.getElementById("start-download");
    const client = new WebTorrent();

  // Prevent default drag behaviors
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
    });

  // Highlight drop area when item is dragged over it
    ["dragenter", "dragover"].forEach((eventName) => {
    dropArea.addEventListener(eventName, highlight, false);
    });

    ["dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, unhighlight, false);
    });

  // Handle dropped files
    dropArea.addEventListener("drop", handleDrop, false);
    dropArea.addEventListener("click", () => fileElem.click(), false);

  // Start download when the button is clicked
    startDownloadButton.addEventListener("click", () => {
    const magnetLink = magnetLinkInput.value;
    if (magnetLink) {
      startDownload(magnetLink); // Start download from the magnet link
    }
    });

    function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
    }

    function highlight() {
    dropArea.classList.add("highlight"); // Add highlight class
    }

    function unhighlight() {
    dropArea.classList.remove("highlight"); // Remove highlight class
    }

    function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length) {
      handleFiles(files); // Process dropped files
    }
    }

    function handleFiles(files) {
    const file = files[0];
    if (file && file.name.endsWith(".torrent")) {
      startDownload(file); // Start download for .torrent files
    } else {
      alert("Please drop a valid .torrent file."); // Alert for invalid files
    }
    }

    function startDownload(file) {
    client.add(file, { path: file.name }, (torrent) => {
        console.log("Downloading:", torrent.infoHash);
        torrent.on("download", (bytes) => {
        console.log("Downloaded:", bytes);
        console.log("Total downloaded:", torrent.downloaded);
        console.log("Download speed:", torrent.downloadSpeed);
        });
        torrent.on("done", () => {
        console.log("Download finished:", torrent.name);
        alert(`Download finished: ${torrent.name}`);
        });
    });
    }

    function startDownload(magnetLink) {
    client.add(magnetLink, (torrent) => {
        console.log("Downloading:", torrent.infoHash);
        torrent.on("download", (bytes) => {
        console.log("Downloaded:", bytes);
        console.log("Total downloaded:", torrent.downloaded);
        console.log("Download speed:", torrent.downloadSpeed);
        });
        torrent.on("done", () => {
        console.log("Download finished:", torrent.name);
        alert(`Download finished: ${torrent.name}`);
        });
    });
    }
});
