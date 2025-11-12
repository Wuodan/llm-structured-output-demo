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