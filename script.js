
document.addEventListener("DOMContentLoaded", () => {
    const dropArea = document.getElementById("drop-area");
    const fileElem = document.getElementById("fileElem");
    const magnetLinkInput = document.getElementById("magnet-link");
    const startDownloadButton = document.getElementById("start-download");
    const progressContainer = document.getElementById("progress-container");
    const progressBar = document.getElementById("progress-bar");
    const video = document.getElementById("video");
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
            playVideo(torrent);
            torrent.files.forEach((file) => {
                if (file.name.endsWith(".mp4")) {				
                    file.renderTo(video); 
                }
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
                playVideo(torrent);
                torrent.files.forEach((file) => {
                    if (file.name.endsWith(".mp4")) {
                        file.renderTo(video);
					}
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

    function playVideo(torrent) {
        video.style.display = 'block';
        video.src = "";

		
		const videoFile = torrent.files.find((file) =>
			file.name.endsWith(".mp4")
		);

		if (videoFile) {
			
			videoFile.getBlobURL((err, url) => {
				if (err) {
					console.error("Error getting Blob URL:", err);
					return;
				}

				
				video.src = url;

				
				video.play().catch((error) => {
					console.error("Error playing video:", error);
				});
			});
		} else {
			console.error("No video file found in the torrent.");
		}
    }
});

