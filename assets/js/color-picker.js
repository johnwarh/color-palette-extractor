// form
const form = document.getElementById('form'),
    loadBtn = document.getElementById('btnLoad'),
    resetBtn = document.getElementById('btnReset'),
// image canvas
    sIcanvas = document.getElementById('sIcanvas'),
    ctx0 = sIcanvas.getContext('2d'),
// hovered color canvas
    hoveredColor = document.getElementById("hovered-color"),
    hovered_p = document.getElementById('hovered-p');
// selected color canvas
    selectedColor = document.getElementById("selected-color"),
    selected_p = document.getElementById('selected-p');

const main = () => {
    const imgFile = document.getElementById('imgfile'), // the uploaded image file
        image = new Image(), // the uploaded image
        file = imgFile.files[0],
        reader = new FileReader();

    reader.onload = () => {
        image.onload = () => {
            sIcanvas.width = image.width;
            sIcanvas.height = image.height;
            ctx0.drawImage(image, 0, 0);
        };
        image.src = reader.result;
    };
    reader.readAsDataURL(file);

};

/** when hovering over or clicking image this func is called  */
const pick = (event, destination, esource) => {
    const bounding = sIcanvas.getBoundingClientRect(),
        x = event.clientX - bounding.left,
        y = event.clientY - bounding.top,
        pixel = ctx0.getImageData(x, y, 1, 1),
        data = pixel.data,
        rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`,
        rgbObj = { r: data[0], g: data[1], b: data[2] },
        hex = rgbToHex(rgbObj);

    //console.log('rgb = ' + JSON.stringify(rgb) + 'hex = ' + hex);
    destination.style.background = rgb;
    if (esource == 'hover') {
        hovered_p.innerHTML = rgb +'<br/>';
        hovered_p.innerHTML += hex;
    }
    else {
        selected_p.innerHTML = rgb+'<br/>'
        selected_p.innerHTML += hex;
    }
    return rgb;
};

/**  Convert each pixel value ( numbers ) to hexadecimal ( string ) */
const rgbToHex = (pixel) => {
    const componentToHex = (c) => {
        const hex = c.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    };
    return ('#' + componentToHex(pixel.r) + componentToHex(pixel.g) +
        componentToHex(pixel.b)).toUpperCase();
};


/** resets upload form and clears the image canvases and palettes */
const reset = () => {
    form.reset();
    clean_canvas_and_palette();
}

/** resets image canvases and palettes */
const clean_canvas_and_palette = () => {
    sIcanvas.width = 0;
    sIcanvas.height = 0;
    ctx0.clearRect(0, 0, sIcanvas.width, sIcanvas.height);
    hoveredColor.style.background = selectedColor.style.background = '#000';
    hovered_p.innerHTML = selected_p.innerHTML = '';
    //fileName.innerHTML = '';
    //num_colors.innerHTML = 'n';
};

sIcanvas.addEventListener("mousemove", (event) => pick(event, hoveredColor, 'hover'));
sIcanvas.addEventListener("click", (event) => pick(event, selectedColor, 'select'));
loadBtn.addEventListener('click', main);
resetBtn.addEventListener('click', reset);

reset();