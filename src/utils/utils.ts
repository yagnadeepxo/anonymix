const ethers = require("ethers");

const utils = {
    BN256ToBin: (str: any) => {
        let r = BigInt(str).toString(2);
        let prePadding = "";
        let paddingAmount = 256 - r.length;
        for(var i = 0; i < paddingAmount; i++){
            prePadding += "0";
        }
        return prePadding + r;
    },
    BNToDecimal: (bn: any) => {
        return ethers.BigNumber.from(bn).toString();
    },
    reverseCoordinate: (p: any) => {
        let r = [0, 0];
        r[0] = p[1];
        r[1] = p[0];
        return r;
    },
    BN256ToHex: (n: any) => {
        let nstr = BigInt(n).toString(16);
        while(nstr.length < 64){ nstr = "0" + nstr; }
        nstr = `0x${nstr}`;
        return nstr;
    }
}

export default utils;