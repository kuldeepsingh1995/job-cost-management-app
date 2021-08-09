function download_csv(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV FILE
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // We have to create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Make sure that the link is not displayed
    downloadLink.style.display = "none";

    // Add the link to your DOM
    document.body.appendChild(downloadLink);

    // Lanzamos
    downloadLink.click();
}

export  function export_table_to_csv(html, filename) {
	var csv = [];
	var rows = document.querySelectorAll("table tr");
	
    for (var i = 0; i < rows.length; i++) {
        var row = [], 
        cols = rows[i].querySelectorAll("td"), cols_th = rows[i].querySelectorAll("th");
        
        for (var ch = 0; ch < cols_th.length; ch++) {
            row.push(cols_th[ch].innerText);
        }

        for (var j = 0; j < cols.length; j++) {
            var span = cols[j].querySelectorAll('span');
            var span_text = '';
            for (var s_i = 0; s_i < span.length; s_i++) {
                var separater = ' - ';
                if(s_i == (span.length-1)){
                    separater = '';
                }
                span_text += span[s_i].innerText+separater;
            }
            row.push(span_text);
        }
        
		csv.push(row.join(","));		
	}

    // Download CSV
    download_csv(csv.join("\n"), filename);
}

 
