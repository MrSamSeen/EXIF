let output;
document.getElementById('fileInput').addEventListener('change', async (event) => {

    const exifDataElement = document.getElementById('exif-data');
    exifDataElement.innerHTML = '';

    const exifTocElement = document.getElementById('exif-toc-navigation');
    exifTocElement.innerHTML = '';

    const promptElement = document.getElementById('ai-prompt');
    promptElement.innerHTML = '';
    const promptElementTitle = document.getElementById('prompt-title');
    promptElementTitle.innerHTML = '';
    promptElementTitle.style.display = 'none';


    const imgElement = document.getElementById('exif-img');
    imgElement.innerHTML = '';

    const file = event.target.files[0];
    imgElement.innerHTML = `<img src="${URL.createObjectURL(file)}" />`;
    imgElement.style.display = 'block';
    if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const exifData = ExifReader.load(arrayBuffer);


        //show exif data
        displayExifData(exifData);
    }


});
function formatJSON(json) {
    // Convert the JSON object to a string with 2-space indentation
    return JSON.stringify(json, null, 2);
}

function displayExifData(exifData) {
    const exifDataElement = document.getElementById('exif-data');
    exifDataElement.innerHTML = '';
    for (const [key, value] of Object.entries(exifData)) {

        const exifTocElement = document.getElementById('exif-toc-navigation');
        exifTocElement.innerHTML += `
            <span class="exif-key"><a href="#${key}">${key}</a></span> 
        `;

        if (key === 'prompt') {
            const promptElement = document.getElementById('ai-prompt');
            output = value;
            let jdata = JSON.parse(output.description);

            json2array(jdata);

        }

        function json2array(value, key = '') {
            const promptElement = document.getElementById('ai-prompt');
            const promptElementTitle = document.getElementById('prompt-title');


            if (Array.isArray(value)) {
                value.forEach(json2array, key);
            } else if (typeof value === 'object') {
                Object.keys(value).forEach(function (key) {
                    json2array(value[key], key);
                });

            } else {
                if (value != 'None' && typeof key === 'string' && value !== 'unknown' && value != '0' && value != '1' && value != '') {
                    promptElementTitle.innerHTML = '<h2>AI Prompt Data Found</h2>';
                    promptElementTitle.style.display = 'block';
                    // console.log(key + ': ' + value);
                    key = key.toUpperCase();
                    promptElement.innerHTML += `<div class="json-block" id="${key}-${value}"><strong>${key} \t:</strong> ${value}</div>`
                }
            }

        }

        let str = JSON.stringify(value.description, null, 2);

        if (str !== undefined) {
            str = str.replace(/\\n/g, '\n');

            str = str.replaceAll('\\', '');
            // replace { with {\n
            str = str.replaceAll('{', '<div class="json-block">{\n');
            // replace } with \n}
            str = str.replaceAll('}', '\n}</div>');

            str = str.replaceAll(',', ',\n');

            exifDataElement.innerHTML += `
             <div  id="${key}" class="exif-entry">
                
                <!--<div class="toggle-btn" onclick="toggleEntry(this)">-</div>-->
                <span class="exif-key">${key}:</span>
                <span class="exif-value json">${str}</span>
            </div>
            `;
        }
    }
}

function formatExifValue(value) {

    if (Array.isArray(value)) {
        return value.join(', ');
    } else if (typeof value === 'object') {
        return value.description || JSON.stringify(value);
    } else {
        return value;
    }
}

window.onscroll = function () {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        document.getElementById("to-top").classList.add("highlight");
    } else {
        document.getElementById("to-top").classList.remove("highlight");
    }
};