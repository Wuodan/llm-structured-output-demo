const OBFUSCATE_MASK=[0x5A,0xC3,0x17,0x9F,0x4D,0x22,0xB7,0x01];

function deobfuscate(obfHex){
    if(typeof obfHex!=='string') throw new TypeError('obfHex must be a hex string');
    const len=obfHex.length/2;
    const masked=new Uint8Array(len);
    for(let i=0;i<len;i++) masked[i]=parseInt(obfHex.substr(i*2,2),16);
    const orig=new Uint8Array(len);
    for(let i=0;i<len;i++) orig[i]=masked[i]^OBFUSCATE_MASK[i%OBFUSCATE_MASK.length];
    return (typeof Buffer!=='undefined'&&Buffer.from)?Buffer.from(orig).toString('utf8'):new TextDecoder().decode(orig);
}

function obfuscate(keyString){
    if(typeof keyString!=='string') throw new TypeError('keyString must be a string');
    const bytes=(typeof Buffer!=='undefined'&&Buffer.from)?Uint8Array.from(Buffer.from(keyString,'utf8')):new TextEncoder().encode(keyString);
    const out=new Uint8Array(bytes.length);
    for(let i=0;i<bytes.length;i++) out[i]=bytes[i]^OBFUSCATE_MASK[i%OBFUSCATE_MASK.length];
    return Array.from(out).map(b=>b.toString(16).padStart(2,'0')).join('');
}

/*
# obfuscate "1234:
OBFUSCATED="$(node -e 'const fs=require("fs"); eval(fs.readFileSync("obfuscate.js","utf8")); console.log(obfuscate("1234"));')"
echo "OBFUSCATED='$OBFUSCATED'"
# reveal "1234":
node -e "const fs=require('fs'); eval(fs.readFileSync('obfuscate.js','utf8')); console.log(deobfuscate('$OBFUSCATED'));"
*/

