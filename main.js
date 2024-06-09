let output;
document.getElementById('fileInput').addEventListener('change', async (event) => {
    //clear all div content
    const exifDataElement = document.getElementById('exif-data');
    exifDataElement.innerHTML = '';

    const exifTocElement = document.getElementById('exif-toc-navigation');
    exifTocElement.innerHTML = '';

    const promptElement = document.getElementById('ai-prompt');
    promptElement.innerHTML = '';


    const file = event.target.files[0];
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

        //add to toc
        const exifTocElement = document.getElementById('exif-toc-navigation');
        exifTocElement.innerHTML += `
            <span class="exif-key"><a href="#${key}">${key}</a></span> 
        `;

        //if key is prompt
        if (key === 'prompt') {
            const promptElement = document.getElementById('ai-prompt');
            output = value;

            let found = `<div id="prompt-metadata"><strong>AI Image prompt found:</strong> <hr>
                <table>
                    <tr><td><strong>Positive prompt</strong> </td><td>${JSON.parse(output.description)[3]["inputs"]["positive"]} </td></tr>
            
                    <tr><td><strong>Negative prompt</strong></td><td> ${JSON.parse(output.description)[3]["inputs"]["negative"]}</td></tr>
                    <tr><td><strong>Seed</strong></td><td>  ${JSON.parse(output.description)[2]["inputs"]["seed"]} </td></tr>
                    <tr><td><strong>Step Count</strong></td><td>  ${JSON.parse(output.description)[2]["inputs"]["steps"]}</td></tr>
                    <tr><td><strong>CFG Scale</strong></td><td>  ${JSON.parse(output.description)[2]["inputs"]["cfg"]} </td></tr>
            
                    <tr><td><strong>Sampler</strong></td><td>  ${JSON.parse(output.description)[2]["inputs"]["sampler_name"]}</td></tr>
                    <tr><td><strong>Scheduler</strong></td><td> ${JSON.parse(output.description)[2]["inputs"]["scheduler"]} </td></tr>
            
                    <tr><td><strong>Model</strong></td><td> ${JSON.parse(output.description)[3]["inputs"]["ckpt_name"]}</td></tr>
                    <tr><td><strong>Clip Skip</strong></td><td> ${JSON.parse(output.description)[3]["inputs"]["clip_skip"]}<td></tr>
                    <tr><td><strong>LoRA</strong></td><td> ${JSON.parse(output.description)[3]["inputs"]["lora_name"]}</td></tr>
                </table>
            </div>
            `;



            promptElement.innerHTML = found;


        }



        console.log(key, value);
        let str = JSON.stringify(value.description, null, 2);
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