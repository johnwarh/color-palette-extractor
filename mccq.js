
const rset = () => { // resets the form and clears the canvas and palettes
	form = document.getElementById( "form" ),
	form.reset();
	paletteContainer.innerHTML = "";
	compContainer.innerHTML = "";
	canvas.width = 0;
	canvas.height = 0;
}
const resetBtn = document.getElementById('btnReset');
resetBtn.addEventListener('click', rset);

//rset(); // clears page on load or reload

const buildPalette = (colorsList) => { // colorsList = quantized color rgbArray
	const paletteContainer = document.getElementById("palette"), // the palette color swatches
		compContainer = document.getElementById("complementary"); // complementary palette color swatches
	let hslColors = '',
		hslColorsComp = '';
	paletteContainer.innerHTML = "";
	compContainer.innerHTML = "";

	hslColors = convertRGBtoHSL(colorsList);// Get colors in HSL from RGB

	orderByL(colorsList, hslColors);// Sort colorsList and hslColors by hsl lightness

	/* Get complementary colors in HSL from clone of hslColors*/
	hslColorsComp = structuredClone( hslColors );
	for ( let i = 0; i < hslColorsComp.length; i++ ){ // modify hue by +/- 180 deg to get comp
		hslColorsComp[i].h = ( hslColorsComp[i].h > 180 ) 
			? hslColorsComp[i].h -= 180 : hslColorsComp[i].h += 180;
	}
	/* Calculate hex colors and write colors to document */
	for (let i = 0; i < colorsList.length; i++) {
		const hexColor = rgbToHex( colorsList[i] );
		const hexColorComp = hslToHex( hslColorsComp[i] );

		/* create color palette div and text elements & append to the document */
		var colorElement = document.createElement( 'div' ); // create color swatch element
		colorElement.classList.add('col');

		var colorCanvas = document.createElement( 'div' );
		var cCanvas = document.createElement( 'canvas' );
		cCanvas.style.backgroundColor = hexColor;
		colorCanvas.appendChild(cCanvas);

		var textElement = document.createElement( 'div' );
		//textElement.classList.add('cap_color');
		var para = document.createElement('p');
		para.classList.add('cap_color');
		var para1 = document.createElement('p');
		para1.classList.add('cap_color');
		textElement.appendChild( para );
		textElement.appendChild(para1);
		para.innerHTML = hexColor;
		para1.innerHTML = "hsl(" + hslColors[i].h + "," + hslColors[i].s
			+ "," + hslColors[i].l + ")";

		colorElement.appendChild(colorCanvas);
		colorElement.appendChild(textElement);

		paletteContainer.appendChild(colorElement); // add colorElement to page
	
		/* create complementary color palette div and text elements & append to the document */	
		var compElement = document.createElement( 'div' ); // create comp color swatch element
		compElement.classList.add('col');

		var compCanvas = document.createElement( 'div' );
		var ccCanvas = document.createElement( 'canvas' );
		ccCanvas.style.backgroundColor = hexColorComp;
		compCanvas.appendChild(ccCanvas);

		var textCElement = document.createElement( 'div' );
		var para2 = document.createElement('p');
		para2.classList.add('cap_color');
		var para3 = document.createElement('p');
		para3.classList.add('cap_color');
		textCElement.appendChild(para2);
		textCElement.appendChild( para3 );
		compElement.appendChild(compCanvas);
		para2.innerHTML = hexColorComp;
		compElement.appendChild(textCElement);
		para3.innerHTML = "hsl(" + hslColorsComp[i].h + "," + hslColorsComp[i].s

			+ "," + hslColorsComp[i].l + ")";;
		compContainer.appendChild(compElement); // add colorElement to page
	}
};

/** Sort colors by lightness (l from hsl) */
const orderByL = (colorsList, hslColors) => {
	let colorsListSort = [];
	// combine rgb and hsl values into array for sorting
	for (var i = 0; i < colorsList.length; i++) {
		colorsListSort.push({ 'rgb': colorsList[i], 'hsl': hslColors[i] });
	}
	//sort colorsListSort
	const getL = (p) => { return p.hsl.l; }
	colorsListSort.sort((p1, p2) => { return getL(p2) - getL(p1); })
	// put sorted rgb and hsl values into colorsList and hslColors
	for (var i = 0; i < colorsListSort.length; i++) { 
		colorsList[i] = colorsListSort[i].rgb;
		hslColors[i] = colorsListSort[i].hsl;
	}
	return colorsList, hslColors
};

/** Convert RGB values to HSL.  This formula can be found here
  https://www.rapidtables.com/convert/color/rgb-to-hsl.html */
const convertRGBtoHSL = ( rgbValues ) => {
	return rgbValues.map((pixel) => {
		let hue, saturation, lightness = 0;
		let RPrime = pixel.r / 255;
		let GPrime = pixel.g / 255;
		let BPrime = pixel.b / 255;
		const Cmax = Math.max( RPrime, GPrime, BPrime );
		const Cmin = Math.min( RPrime, GPrime, BPrime );
		const delta = Cmax - Cmin;
		const range = Cmax + Cmin;
		lightness = range / 2.0;
		if (delta == 0) {
			return {
				h: 0,
				s: 0,
				l: Math.round(lightness * 100),
			}
		}
		else { 
			saturation = ( lightness <= 0.5 ) ? delta / range : delta / ( 2.0 - range );
			const maxColorValue = Math.max( pixel.r, pixel.g, pixel.b );
			if ( maxColorValue === pixel.r ) { 
				hue = (( GPrime - BPrime ) / delta ) + ( GPrime < BPrime ? 6 : 0 ); }
			else if ( maxColorValue === pixel.g ) { hue = 2.0 + ( BPrime - RPrime ) / delta; }
			else { hue = 4.0 + (RPrime - GPrime) / delta; }
			hue = hue * 60; // scale hue value to degrees 
			if (hue < 0) hue = hue + 360; //  0 <= hue <= 360
			else if(hue > 360) hue = hue - 360;
			return {
				h: Math.round (hue),
				s: Math.round (saturation * 100),
				l: Math.round (lightness * 100),
			};
		}
	});
};

/**  Convert each pixel value ( number ) to hexadecimal ( string ) */
const rgbToHex = ( pixel ) => {
	const componentToHex = (c) => {
		const hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	};
	return ( "#" + componentToHex(pixel.r) + componentToHex(pixel.g) + 
		componentToHex(pixel.b) ).toUpperCase();
};

/** Convert HSL to Hex. ref:  https://stackoverflow.com/a/44134328/17150245 */
const hslToHex = ( hslColor ) => {
	const hslColorCopy = { ...hslColor };
	hslColorCopy.l /= 100; 
	const a = ( hslColorCopy.s * Math.min( hslColorCopy.l, 1 - hslColorCopy.l )) / 100;
	const f = ( n ) => {
		const k = ( n + hslColorCopy.h / 30 ) % 12;
		const color = hslColorCopy.l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color)
		  .toString(16)
		  .padStart(2, "0");
	};
	return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
};

/** Convert HSL to RGB */
const hslToRGB = ( hslColor ) => {
	const hslColorCopy = { ...hslColor };
	hslColorCopy.l /= 100;
	const a = hslColorCopy.s * Math.min( hslColorCopy.l, 1 - hslColorCopy.l )/100;
	const k = (n) => ( n + hslColorCopy.h / 30 ) % 12;
	const f = (n) => hslColorCopy.l - a * Math.max( -1, Math.min(k(n) - 3, Math.min(9 - k(n), 1) ));
	return { 
		r: Math.round(255 * f(0)), 
		g: Math.round(255 * f(8)), 
		b: Math.round(255 * f(4)),
	};
};

/** Returns color channel with the largest range of values, where range is colorMax-colorMin */
const findLargestColorRange = ( rgbValues ) => {
	let rMin = gMin =  bMin = Number.MAX_VALUE;
	let rMax = gMax = bMax = Number.MIN_VALUE;
	rgbValues.forEach((pixel) => {
		rMin = Math.min( rMin, pixel.r );
		gMin = Math.min( gMin, pixel.g );
		bMin = Math.min( bMin, pixel.b );
		rMax = Math.max( rMax, pixel.r );
		gMax = Math.max( gMax, pixel.g );
		bMax = Math.max( bMax, pixel.b );
	});
	const rRange = rMax - rMin;
	const gRange = gMax - gMin;
	const bRange = bMax - bMin;
	/* find color with biggest range */
	const biggestRange = Math.max( rRange, gRange, bRange );
	if ( biggestRange === rRange ) { return "r"; }
	else if ( biggestRange === gRange ) { return "g"; }
	else { return "b"; }
};

/**  Description of Median cut quantization can be found here:  https://en.wikipedia.org/wiki/Median_cut  */
const quantization = ( rgbValues, depth ) => {
	const colors = document.getElementById('colors'); // number of colors in palette, max from form
	const MAX_DEPTH = Number(colors.value); // number of color values returned is 2^MAX_DEPTH
	/**  Average colors in rgbValues over all rgbValues in bucket for quantized color */
	if (depth === MAX_DEPTH || rgbValues.length === 0) { // depth is incremented in recursion below
		const color = rgbValues.reduce(
			(prev, curr) => {
				prev.r += curr.r;
				prev.g += curr.g;
				prev.b += curr.b;
				return prev;
			} ,
			{ r: 0, g: 0, b: 0, }
		);
		color.r = Math.round( color.r / rgbValues.length );
		color.g = Math.round( color.g / rgbValues.length );
		color.b = Math.round( color.b / rgbValues.length );
			//console.log("rgb =[" + color.r  + ", " + color.g + ", " + color.b + "]");
		return [ color ];
	}
	/*   Recursively do the following: */
	/*  1. Find the color channel (red,green or blue) with biggest range */
	const componentToSortBy = findLargestColorRange( rgbValues );
	/*  2. Order this channel (from lowest to highest values) */
	rgbValues.sort(( p1, p2 ) => { return p1[ componentToSortBy ] - p2[ componentToSortBy ]; });
	/*  3. Divide the sorted channel at mid-point of the array the rgb colors list */
	const mid = rgbValues.length / 2;
	return [
	/*  4. Repeat process again, recursively, for each slice, until depth = MAX_DEPTH */
		...quantization( rgbValues.slice( 0, mid), depth + 1 ),
		...quantization( rgbValues.slice( mid + 1 ), depth + 1 ),
	];
};

/** Sample imageData: 4 values at a time (r, g, b, and alpha) for each pixel 
Alpha assumed to be 255, i.e. fully opaque, and is ignored. */
const buildRgb = ( imageData ) => {
	const rgbValues = [];
	for (let i = 0; i < imageData.length; i += 4) {
		const rgb = {
			r: imageData[i],
			g: imageData[i + 1],
			b: imageData[i + 2],
		};
		rgbValues.push(rgb);
	}
	return rgbValues;
};

const main = () => {
	const canvas = document.getElementById("canvas");
	const imgFile = document.getElementById( "imgfile" );
	const image = new Image();
	const file = imgFile.files[0];
	const reader = new FileReader();

	reader.onload = () => {
		image.onload = () => {
			canvas.width = image.width;
			canvas.height = image.height;
			const ctx = canvas.getContext( "2d" );
			ctx.drawImage( image, 0, 0 ); // draw image in browser
			const imageData = ctx.getImageData( 0, 0, canvas.width, canvas.height ); // array of RGBA values of all pixel
			const rgbArray = buildRgb( imageData.data );
			const quantColors = quantization( rgbArray, 0 ); // quantize colors
			buildPalette( quantColors );// Create the HTML structure to show the color palette
		};
		image.src = reader.result;
	};
	reader.readAsDataURL( file );
};
const loadBtn = document.getElementById('btnLoad');
loadBtn.addEventListener('click', main);

//main();
