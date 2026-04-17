/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const images = [
  { name: 'bleu-de-chanel.jpg', url: 'https://www.chanel.com/images//t_one///q_auto:good,f_auto,fl_lossy,dpr_1.2/w_620/bleu-de-chanel-parfum-spray-3-4fl-oz--packshot-default-107180-8822557409310.jpg' },
  { name: 'sauvage.jpg', url: 'https://images.dior.com/3d/swatch/Y0785220_F078522009.jpg?imwidth=460' },
  { name: 'aventus.jpg', url: 'https://fr.creedfragrances.com/cdn/shop/files/Aventus100ml.jpg' },
  { name: 'baccarat-rouge-540.jpg', url: 'https://www.franciskurkdjian.com/dw/image/v2/BGCL_PRD/on/demandware.static/-/Sites-fkm-master-catalog/default/dw7699e1d8/products/10245/10245_1.jpg' },
  { name: 'lost-cherry.jpg', url: 'https://www.sephora.com/productimages/sku/s2133007-main-zoom.jpg' },
  { name: 'tobacco-vanille.jpg', url: 'https://www.sephora.com/productimages/product/p393151-main-zoom.jpg' },
  { name: 'afternoon-swim.jpg', url: 'https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton--LP0128_PM2_Front%20view.jpg' },
  { name: 'jadore.jpg', url: 'https://images.dior.com/3d/swatch/Y0715201_F071524009.jpg' },
  { name: 'oud-de-minuit.jpg', url: 'https://image.harrods.com/16/22/79/11/16227911_30452331_2048.jpg' },
  { name: 'santal-royal.jpg', url: 'https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwdb89e7c3/2020/BOTTLE/G013146.jpg' }
];

const destDir = path.join(__dirname, 'public', 'images', 'products');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };
    (url.startsWith('https') ? https : http).get(url, options, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        fs.unlink(dest, () => reject(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err.message));
    });
  });
}

async function run() {
  for (const img of images) {
    const dest = path.join(destDir, img.name);
    try {
      await download(img.url, dest);
      console.log(`Downloaded ${img.name}`);
    } catch (e) {
      console.error(`Error downloading ${img.name}: ${e}`);
    }
  }
}

run();
