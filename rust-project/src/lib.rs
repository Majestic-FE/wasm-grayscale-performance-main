mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("ふざけんなよ");
}


#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    pub fn time(s: &str);

    #[wasm_bindgen(js_namespace = console)]
    pub fn timeEnd(s: &str);
}

use wasm_bindgen::prelude::*;
use image::*;

enum ConvertMode {
    Grayscale,
}

fn convert(mode: ConvertMode, width: u32, height: u32, raw_data: Vec<u8>) -> Vec<u8> {
    let rgba = RgbaImage::from_raw(width, height, raw_data).expect("error");
    let di = DynamicImage::ImageRgba8(rgba);

    let converted = match mode {
        ConvertMode::Grayscale => {
            let gray = di.into_luma8();
            // 再度rgbaに戻す
            DynamicImage::ImageLuma8(gray)
        }
    };

    converted.into_rgba8().to_vec()
}

#[wasm_bindgen]
pub fn grayscale(width: u32, height: u32, raw_data: Vec<u8>) -> Vec<u8> {
    convert(ConvertMode::Grayscale, width, height, raw_data)
}