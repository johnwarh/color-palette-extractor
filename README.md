# Create a color palette from an image

![Header image](/headerPhoto.jpg)

Using median cut algorithm & color quantization to obtain a color palette with 
complementary colors in plain Javascript and html.  Runs in a browser.

Changes from master (@ https://github.com/zygisS22/color-palette-extraction): 

	Added a new controls to permit changing the number of colors in the palette 
	output and a reset button to reset the form and html content.
 
	Changed sorting of output colors to use the lightness from the hsl color 
	system instead of the CIE luminance equation.  
	
	Removed code that excluded black, white and gray colors and rejected colors 
	using a color distance criteria.

	Modified palette color swatch layout, moving the swatch hex code text 
	below the swatch and adding the hsl color space values. Modified palette 
	swatch dimensions to w=120px by h=80px.
	
	Added ui control for the palette background color and show / hide switch for the 
	palette text content.
	
	Added customized CSS file (based on Bootstrap 5.3.2).
	
	Added code to do reconstruction and display of image with calculated color palette. 11/29/23
	
	Modified CSS: added Bootstrap 5.3.2, with cdn delivery, with a small custom.css file. 11/29/23

	Modified palette swatch dimensions to w=100px by h=60px. 12/01/23

	Optimized code in buildPalette() function:  created one function to build palette HTML
	framework for both color and complimentary color palettes. 12/02/23

## How to run

Clone the repository and open the index.html file in a browser.

Internet access is required to download Bootstrap css and js files.
